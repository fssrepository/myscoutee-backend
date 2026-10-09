package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfiles;
import com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ScoringProfilesEndpoint {
    private final ScoringProfiles owner;
    private final ObjectMapper mapper;
    public ScoringProfilesEndpoint(ScoringProfiles owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ScoringProfilesProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScoringProfilesProtocol.SingleQuery.class, ScoringProfilesProtocol::valid,
                query -> new ScoringProfilesProtocol.SingleResult(true, owner.findByUserId(query.userId()).map(ScoringProfileDto::from).orElse(null)));
    }
    @PostMapping(value = ScoringProfilesProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScoringProfilesProtocol.BatchQuery.class, ScoringProfilesProtocol::valid,
                query -> owner.findByUserIdIn(query.userIds()).stream().map(ScoringProfileDto::from).toList());
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ScoringProfilesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ScoringProfilesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ScoringProfilesProtocol.Error("SCORING_PROFILES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
