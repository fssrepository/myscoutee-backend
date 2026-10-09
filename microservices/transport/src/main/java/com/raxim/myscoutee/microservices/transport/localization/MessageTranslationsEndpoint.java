package com.raxim.myscoutee.microservices.transport.localization;

import com.raxim.myscoutee.domain.localization.api.MessageTranslations;
import org.springframework.context.NoSuchMessageException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public final class MessageTranslationsEndpoint {
    private final MessageTranslations owner;
    public MessageTranslationsEndpoint(MessageTranslations owner) { this.owner = owner; }
    @GetMapping(value = MessageTranslationsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> translate(@RequestParam(required = false) String key) {
        if (key == null || key.length() > 512) return response(400, new MessageTranslationsProtocol.Error("INVALID_REQUEST"));
        try { return response(200, new MessageTranslationsProtocol.Result(owner.t(key))); }
        catch (NoSuchMessageException absent) { return response(404, new MessageTranslationsProtocol.Error("NOT_FOUND")); }
        catch (RuntimeException unavailable) { return response(503, new MessageTranslationsProtocol.Error("TRANSLATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
