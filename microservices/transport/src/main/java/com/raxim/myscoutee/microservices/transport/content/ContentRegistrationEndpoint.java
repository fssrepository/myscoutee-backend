package com.raxim.myscoutee.microservices.transport.content;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.content.api.ContentRegistration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ContentRegistrationEndpoint {
    private final ContentRegistration owner;
    private final ObjectMapper mapper;
    public ContentRegistrationEndpoint(ContentRegistration owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ContentRegistrationProtocol.SNAPSHOT, produces = "application/json")
    public ResponseEntity<?> snapshot(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentRegistrationProtocol.Query.class, ContentRegistrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.snapshot()));
    }
    @PostMapping(value = ContentRegistrationProtocol.REGISTER, produces = "application/json")
    public ResponseEntity<?> register(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentRegistrationProtocol.Register.class, ContentRegistrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.register(command.category(), command.sourceId(), command.ownerId(), command.title(), command.imageUrl())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ContentRegistrationProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ContentRegistrationProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new ContentRegistrationProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ContentRegistrationProtocol.Error("CONTENT_REGISTRATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
