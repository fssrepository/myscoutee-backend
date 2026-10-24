package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.UserAffinityScores;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityScoresProtocol.*;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityScoresProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;

/** Read-only calculation; the canonical owner resolves configuration and experience data. */
@RestController
public final class UserAffinityScoresEndpoint {
    private final UserAffinityScores owner;
    private final ObjectMapper mapper;
    public UserAffinityScoresEndpoint(UserAffinityScores owner, ObjectMapper mapper) {
        this.owner = owner;
        this.mapper = mapper;
    }
    @PostMapping(value = UserAffinityScoresProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> calculate(HttpServletRequest request) throws IOException {
        final Query query;
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, UserAffinityScoresProtocol.MAX_REQUEST_BYTES);
            query = mapper.readerFor(Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            if (query == null || tooLong(query.workspaceGroupId())
                    || query.user() != null && tooLong(query.user().id()))
                return response(400, new Error("INVALID_REQUEST"));
        } catch (ReadQueryBodies.RejectedQuery invalid) {
            return response(invalid.status(), new Error(invalid.code()));
        } catch (RuntimeException invalid) {
            return response(400, new Error("INVALID_REQUEST"));
        }
        try {
            double score = owner.calculateUserAffinity(query.user(), query.workspaceGroupId());
            if (!Double.isFinite(score) || score < 0) throw new IllegalStateException("Invalid affinity result");
            return response(200, new Score(score));
        } catch (RuntimeException unavailable) {
            return response(503, new Error("USER_AFFINITY_UNAVAILABLE"));
        }
    }
    private boolean tooLong(String value) { return value != null && value.length() > 512; }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
