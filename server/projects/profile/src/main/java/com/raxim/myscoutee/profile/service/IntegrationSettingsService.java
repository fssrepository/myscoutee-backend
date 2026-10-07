package com.raxim.myscoutee.profile.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.IntegrationAccess;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.*;
import com.raxim.myscoutee.profile.repository.UsersRepository;

/** Coordinates the existing API and MCP settings into one load/save boundary. */
@Service
public class IntegrationSettingsService {
    private final IntegrationTokenService tokens;
    private final McpAuthorizationService mcp;
    private final UsersRepository users;
    private final AffiliateService affiliates;
    private final IntegrationPublicEndpointResolver endpoint;

    public IntegrationSettingsService(IntegrationTokenService tokens, McpAuthorizationService mcp,
            UsersRepository users, AffiliateService affiliates, IntegrationPublicEndpointResolver endpoint) {
        this.tokens = tokens; this.mcp = mcp; this.users = users;
        this.affiliates = affiliates; this.endpoint = endpoint;
    }

    public IntegrationSettingsDto load(String owner) {
        var user = users.findByUserId(owner).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var access = user.getIntegrationAccess() == null ? IntegrationAccess.initial() : user.getIntegrationAccess();
        var active = tokens.activeTokens(owner);
        var api = tokens.settings(owner, endpoint.resolve(), IntegrationTokenService.INTEGRATION_SCOPE, active);
        return new IntegrationSettingsDto(api.baseUrl(), api.maxActiveTokens(), api.maxBatchSize(),
                api.tokens().stream().map(token -> token.withAccess(access.clientMode(token.id()))).toList(),
                affiliates.summary(owner), affiliates.participantSummary(owner), mcp.settings(active, access), access.revision());
    }

    public IntegrationSettingsDto save(String owner, IntegrationSettingsUpdateDto request) {
        if (request == null || request.mcpAccess() == null || request.accessRevision() < 0
                || request.clients() == null || request.clients().size() > 2 * IntegrationTokenService.MAX_ACTIVE_TOKENS)
            throw error(HttpStatus.BAD_REQUEST);
        var user = users.findByUserId(owner).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var previous = user.getIntegrationAccess() == null ? IntegrationAccess.initial() : user.getIntegrationAccess();
        if (previous.revision() != request.accessRevision()) throw error(HttpStatus.CONFLICT);
        var active = tokens.activeTokens(owner).stream()
                .filter(token -> List.of(IntegrationTokenService.INTEGRATION_SCOPE, IntegrationTokenService.MCP_SCOPE)
                        .contains(token.getScope() == null || token.getScope().isBlank()
                                ? IntegrationTokenService.INTEGRATION_SCOPE : token.getScope()))
                .map(token -> token.getId()).collect(java.util.stream.Collectors.toSet());
        Map<String, IntegrationAccess.Mode> next = new LinkedHashMap<>();
        active.forEach(id -> next.put(id, previous.clientMode(id)));
        var changed = new java.util.HashSet<String>();
        for (var client : request.clients()) {
            if (client == null || client.id() == null || client.accessMode() == null || !changed.add(client.id()))
                throw error(HttpStatus.BAD_REQUEST);
            if (!active.contains(client.id())) throw error(HttpStatus.CONFLICT);
            next.put(client.id(), client.accessMode());
        }
        var saved = new IntegrationAccess(previous.revision() + 1, request.mcpAccess(), Map.copyOf(next));
        if (users.updateIntegrationAccess(owner, previous.revision(), saved) != 1) throw error(HttpStatus.CONFLICT);
        return load(owner);
    }

    private static ResponseStatusException error(HttpStatus status) {
        return new ResponseStatusException(status, "Integration settings are invalid or have changed; reload the settings.");
    }
}
