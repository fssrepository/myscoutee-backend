package com.raxim.myscoutee.microservices.transport.integrations;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.integrations.api.EventChanges;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventChangesEndpoint {
    private final EventChanges owner;
    private final ObjectMapper mapper;
    public EventChangesEndpoint(EventChanges owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventChangesProtocol.EVENT, produces = "application/json")
    public ResponseEntity<?> event(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventChangesProtocol.EventChange.class, EventChangesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.enqueue(command.event()))));
    }
    @PostMapping(value = EventChangesProtocol.MEMBER, produces = "application/json")
    public ResponseEntity<?> member(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventChangesProtocol.MemberChange.class, EventChangesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.enqueue(command.member()))));
    }
    @PostMapping(value = EventChangesProtocol.ENCOUNTERS, produces = "application/json")
    public ResponseEntity<?> encounters(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventChangesProtocol.EncounterWakeup.class, EventChangesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(true, command.scope().groupId(),
                        () -> receipt(owner::publishPendingEncounters)));
    }
    private EventChangesProtocol.Receipt receipt(Runnable action) { action.run(); return new EventChangesProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventChangesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventChangesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventChangesProtocol.Error("EVENT_CHANGES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
