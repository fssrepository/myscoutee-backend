package com.raxim.myscoutee.microservices.transport.operator;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.operator.api.GlobalIdentityPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class GlobalIdentityPrivacyEndpoint {
    private final GlobalIdentityPrivacy owner;
    private final ObjectMapper mapper;
    public GlobalIdentityPrivacyEndpoint(GlobalIdentityPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = GlobalIdentityPrivacyProtocol.PREPARE_PURGE_UNLINK, produces = "application/json")
    public ResponseEntity<?> preparePurgeUnlink(HttpServletRequest request) throws java.io.IOException {
        return read(request, GlobalIdentityPrivacyProtocol.UserCommand.class, GlobalIdentityPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.preparePurgeUnlink(command.userId()); return new GlobalIdentityPrivacyProtocol.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, GlobalIdentityPrivacyProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new GlobalIdentityPrivacyProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new GlobalIdentityPrivacyProtocol.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
