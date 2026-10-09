package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.TicketAudit;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class TicketAuditEndpoint {
    private final TicketAudit owner;
    private final ObjectMapper mapper;
    public TicketAuditEndpoint(TicketAudit owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = TicketAuditProtocol.REPLAY, produces = "application/json")
    public ResponseEntity<?> replay(HttpServletRequest request) throws java.io.IOException {
        return read(request, TicketAuditProtocol.Replay.class, TicketAuditProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.recordReplay(command.ticket(), command.eventSourceId(), command.actor(), command.at()))));
    }
    private TicketAuditProtocol.Receipt receipt(Runnable action) { action.run(); return new TicketAuditProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, TicketAuditProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new TicketAuditProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new TicketAuditProtocol.Error("TICKET_AUDIT_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
