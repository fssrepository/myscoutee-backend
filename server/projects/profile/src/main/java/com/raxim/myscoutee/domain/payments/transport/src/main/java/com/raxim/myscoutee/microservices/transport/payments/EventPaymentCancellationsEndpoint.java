package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.EventPaymentCancellations;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventPaymentCancellationsEndpoint {
    private final EventPaymentCancellations owner;
    private final ObjectMapper mapper;
    public EventPaymentCancellationsEndpoint(EventPaymentCancellations owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventPaymentCancellationsProtocol.ELIGIBLE, produces = "application/json")
    public ResponseEntity<?> eligible(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Query.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.eligibleParticipantPayments(command.sourceId(), command.userId()).stream().map(com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto::from).toList()));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.PENDING, produces = "application/json")
    public ResponseEntity<?> pending(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Empty.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.pendingRequestedCancellations().stream().map(com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto::from).toList()));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.EVENT_PENDING, produces = "application/json")
    public ResponseEntity<?> event_pending(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Query.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.pendingForCancelledEvent(command.sourceId()).stream().map(com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto::from).toList()));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.QUEUE, produces = "application/json")
    public ResponseEntity<?> queue(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Queue.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.queueAdminRemovals(command.sourceId(), command.userIds(), command.actorUserId()))));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.ACKNOWLEDGE, produces = "application/json")
    public ResponseEntity<?> acknowledge(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Acknowledge.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.acknowledgeCancelledRequest(command.paymentId()))));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.GRANT, produces = "application/json")
    public ResponseEntity<?> grant(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Grant.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.grantChangedTerms(command.sourceId(), command.stamp()))));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.HAS_PENDING, produces = "application/json")
    public ResponseEntity<?> has_pending(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Query.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventPaymentCancellationsProtocol.Decision(owner.hasPendingForCancelledEvent(command.sourceId()))));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.PARTICIPANTS, produces = "application/json")
    public ResponseEntity<?> participants(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Query.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.participantIds(command.sourceId())));
    }
    @PostMapping(value = EventPaymentCancellationsProtocol.ELIGIBLE_USERS, produces = "application/json")
    public ResponseEntity<?> eligible_users(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPaymentCancellationsProtocol.Query.class, EventPaymentCancellationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.eligibleUserIds(command.sourceId())));
    }
    private EventPaymentCancellationsProtocol.Receipt receipt(Runnable action) { action.run(); return new EventPaymentCancellationsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventPaymentCancellationsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new EventPaymentCancellationsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new EventPaymentCancellationsProtocol.Error("EVENT_PAYMENT_CANCELLATIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
