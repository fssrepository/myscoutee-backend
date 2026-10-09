package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.EventPayments;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventPaymentsEndpoint {
    private final EventPayments owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public EventPaymentsEndpoint(EventPayments owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = EventPaymentsProtocol.PAY, produces = "application/json")
    public ResponseEntity<?> pay(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request, mapper, verifier, EventPaymentsProtocol.AUDIENCE, EventPaymentsProtocol.PAY,
                    EventPaymentsProtocol.Pay.class, EventPaymentsProtocol.MAX_REQUEST_BYTES);
            var command = verified.value();
            if (!EventPaymentsProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!command.request().userId().equals(verified.principal().getUserId())) throw new org.springframework.security.access.AccessDeniedException("Actor mismatch");
            return verified.call(() -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(
                    command.scope().active(), command.scope().groupId(), () -> response(200,
                    new EventPaymentsProtocol.Result(true, owner.payCheckout(command.request(), command.provider(), command.startedSession())))));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new EventPaymentsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventPaymentsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) { return response(rejected.getStatusCode().value(), new EventPaymentsProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unknown) { return response(503, new EventPaymentsProtocol.Error("EVENT_PAYMENTS_UNAVAILABLE")); }
    }
    @PostMapping(value = EventPaymentsProtocol.JOIN, produces = "application/json")
    public ResponseEntity<?> join(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.Join.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.recordEventJoin(command.session(), command.userId(), command.sourceId(), command.slot(), command.start(), command.end(), command.policy()))));
    }
    @PostMapping(value = EventPaymentsProtocol.COMPLETE, produces = "application/json")
    public ResponseEntity<?> complete(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.Complete.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.completeEventCancellation(command.paymentId(), command.reason()))));
    }
    @PostMapping(value = EventPaymentsProtocol.CANCEL, produces = "application/json")
    public ResponseEntity<?> cancel(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.Cancel.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.cancelEventBooking(command.userId(), command.sourceId(), command.start(), command.policy()))));
    }
    @PostMapping(value = EventPaymentsProtocol.PENDING, produces = "application/json")
    public ResponseEntity<?> pending(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.UserEvent.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventPaymentsProtocol.Decision(owner.hasPendingEventJoin(command.userId(), command.sourceId()))));
    }
    @PostMapping(value = EventPaymentsProtocol.FINALIZE, produces = "application/json")
    public ResponseEntity<?> finalize(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.UserEvent.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventPaymentsProtocol.Decision(owner.finalizePendingEventJoin(command.userId(), command.sourceId()))));
    }
    @PostMapping(value = EventPaymentsProtocol.JOINED, produces = "application/json")
    public ResponseEntity<?> joined(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.UserEvent.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventPaymentsProtocol.Decision(owner.hasJoinedEventJoin(command.userId(), command.sourceId()))));
    }
    @PostMapping(value = EventPaymentsProtocol.PENDING_SOURCES, produces = "application/json")
    public ResponseEntity<?> pending_sources(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentsProtocol.UserEvents.class, EventPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.findPendingEventJoinSourceIds(command.userId(), command.sourceIds())));
    }
    private EventPaymentsProtocol.Receipt receipt(Runnable action) { action.run(); return new EventPaymentsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventPaymentsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventPaymentsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new EventPaymentsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new EventPaymentsProtocol.Error("EVENT_PAYMENTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
