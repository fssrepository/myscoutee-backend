package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventJobScopes;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class EventJobScopesEndpoint {
    private final EventJobScopes owner;
    public EventJobScopesEndpoint(EventJobScopes owner) { this.owner = owner; }
    @GetMapping(value = EventJobScopesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> find(@RequestParam(required = false) String id) {
        if (id != null && id.length() > 512) return response(400, new EventJobScopesProtocol.Error("INVALID_REQUEST"));
        try {
            var result = owner.findJobScope(id);
            return result == null ? response(404, new EventJobScopesProtocol.Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new EventJobScopesProtocol.Error("SCOPE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
