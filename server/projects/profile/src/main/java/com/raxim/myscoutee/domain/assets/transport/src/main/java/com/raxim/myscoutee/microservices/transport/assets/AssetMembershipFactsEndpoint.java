package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetMembershipFacts;
import com.raxim.myscoutee.domain.assets.dto.AssetMembershipFactsDto;
import com.raxim.myscoutee.microservices.transport.assets.AssetMembershipFactsProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class AssetMembershipFactsEndpoint {
    private final AssetMembershipFacts owner;
    public AssetMembershipFactsEndpoint(AssetMembershipFacts owner) { this.owner = owner; }
    @GetMapping(value = AssetMembershipFactsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(@RequestParam(required = false) String id) {
        if (id != null && id.length() > 512) return response(400, new Error("INVALID_REQUEST"));
        try {
            var result = owner.findByAssetId(id).map(AssetMembershipFactsDto::from).orElse(null);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("ASSET_MEMBERSHIP_FACTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
