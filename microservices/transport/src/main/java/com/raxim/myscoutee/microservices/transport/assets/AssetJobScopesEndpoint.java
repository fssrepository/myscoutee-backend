package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetJobScopes;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class AssetJobScopesEndpoint {
    private final AssetJobScopes owner;
    public AssetJobScopesEndpoint(AssetJobScopes owner) { this.owner = owner; }
    @GetMapping(value = AssetJobScopesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> find(@RequestParam(required = false) String id) {
        if (id != null && id.length() > 512) return response(400, new AssetJobScopesProtocol.Error("INVALID_REQUEST"));
        try {
            var result = owner.findJobScope(id);
            return result == null ? response(404, new AssetJobScopesProtocol.Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new AssetJobScopesProtocol.Error("SCOPE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
