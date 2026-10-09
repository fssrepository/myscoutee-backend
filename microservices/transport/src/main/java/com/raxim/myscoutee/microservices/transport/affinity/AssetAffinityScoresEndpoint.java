package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.AssetAffinityScores;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetAffinityScoresEndpoint {
    private final AssetAffinityScores owner;
    private final ObjectMapper mapper;
    public AssetAffinityScoresEndpoint(AssetAffinityScores owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetAffinityScoresProtocol.AFFINITY, produces = "application/json")
    public ResponseEntity<?> affinity(HttpServletRequest request) throws java.io.IOException { return score(request, false); }
    @PostMapping(value = AssetAffinityScoresProtocol.BOOST, produces = "application/json")
    public ResponseEntity<?> boost(HttpServletRequest request) throws java.io.IOException { return score(request, true); }
    private ResponseEntity<?> score(HttpServletRequest request, boolean boost) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetAffinityScoresProtocol.MAX_REQUEST_BYTES);
            AssetAffinityScoresProtocol.Query query;
            try {
                query = mapper.readerFor(AssetAffinityScoresProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (query == null) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            double value = boost ? owner.resolveAssetBoost(query.asset(), query.owner()) : owner.resolveAssetAffinity(query.asset(), query.owner());
            if (!Double.isFinite(value)) throw new IllegalStateException("Non-finite asset score");
            return response(200, new AssetAffinityScoresProtocol.Result(value));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetAffinityScoresProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AssetAffinityScoresProtocol.Error("ASSET_SCORING_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
