package com.raxim.myscoutee.profile.controller.integration;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.service.McpAuthorizationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/mcp/oauth")
public class McpOAuthController {
    private final McpAuthorizationService service;
    public McpOAuthController(McpAuthorizationService service) { this.service = service; }
    @GetMapping("/metadata") public Map<String, Object> metadata() { return service.metadata(); }
    @GetMapping("/resource") public Map<String, Object> resource() { return service.resourceMetadata(); }
    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public Map<String, Object> exchange(@RequestParam MultiValueMap<String, String> values,
            HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store"); response.setHeader("Pragma", "no-cache");
        if (values.size() > 12 || values.values().stream().anyMatch(v -> v.size() != 1 || v.getFirst().length() > 2048))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid_request");
        String client = values.getFirst("client_id"), secret = values.getFirst("client_secret");
        String header = request.getHeader("Authorization");
        if (header != null) {
            if (!header.startsWith("Basic ") || header.length() > 4096 || secret != null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid_client");
            try {
                String[] parts = new String(Base64.getDecoder().decode(header.substring(6)), StandardCharsets.UTF_8).split(":", 2);
                String basicClient = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
                if (parts.length != 2 || (client != null && !client.equals(basicClient))) throw new IllegalArgumentException();
                client = basicClient; secret = URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
            } catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid_client"); }
        }
        if (secret == null || secret.length() > 256 || client == null || client.length() > 80)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid_client");
        return service.exchange(values.toSingleValueMap(), client, secret, request.getRemoteAddr());
    }
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, String>> failure(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).cacheControl(CacheControl.noStore())
                .body(Map.of("error", error.getReason() != null && error.getReason().matches("[a-z_]+") ? error.getReason() : "server_error"));
    }
}
