package com.raxim.myscoutee.microservices.transport.assets;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.domain.assets.api.AssetMediaVisibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.assets.AssetMediaVisibilityProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class AssetMediaVisibilityEndpoint {
    private final AssetMediaVisibility assets;
    private final ObjectMapper mapper;
    public AssetMediaVisibilityEndpoint(AssetMediaVisibility assets, ObjectMapper mapper) { this.assets = assets; this.mapper = mapper; }
    @PostMapping(value = AssetMediaVisibilityProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> asset(HttpServletRequest request) throws IOException {
        List<String> urls;
        try { urls = MediaReferenceQueries.read(request, mapper); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        try {
            var result = assets.asset(urls);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("ASSET_VISIBILITY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
