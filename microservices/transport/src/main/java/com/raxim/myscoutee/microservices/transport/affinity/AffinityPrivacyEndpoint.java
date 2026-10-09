package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.AffinityPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AffinityPrivacyEndpoint {
    private final AffinityPrivacy owner;
    private final ObjectMapper mapper;
    public AffinityPrivacyEndpoint(AffinityPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AffinityPrivacyProtocol.PURGE_RATINGS, produces = "application/json")
    public ResponseEntity<?> purgeRatings(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityPrivacyProtocol.UserCommand.class, AffinityPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeRatings(command.userId()); return new AffinityPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = AffinityPrivacyProtocol.PURGE_EDGES, produces = "application/json")
    public ResponseEntity<?> purgeEdges(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityPrivacyProtocol.UserCommand.class, AffinityPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeEdges(command.userId()); return new AffinityPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = AffinityPrivacyProtocol.PURGE_TASKS, produces = "application/json")
    public ResponseEntity<?> purgeTasks(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityPrivacyProtocol.UserCommand.class, AffinityPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeTasks(command.userId()); return new AffinityPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = AffinityPrivacyProtocol.ANONYMIZE_AUTHORS, produces = "application/json")
    public ResponseEntity<?> anonymizeAuthors(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityPrivacyProtocol.UserCommand.class, AffinityPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeAuthors(command.userId()); return new AffinityPrivacyProtocol.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AffinityPrivacyProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AffinityPrivacyProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AffinityPrivacyProtocol.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
