package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.EventPaymentCancellations;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventPaymentCancellations extends RemoteReadTransport implements EventPaymentCancellations {
    private final ObjectMapper mapper;
    public RemoteEventPaymentCancellations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto> eligibleParticipantPayments(String sourceId, String userId) {
        var command = new EventPaymentCancellationsProtocol.Query(EventPaymentCancellationsProtocol.Scope.current(), sourceId, userId);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.ELIGIBLE, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto>>() {},
                "event-payment-cancellations.eligible", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> v.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto> pendingRequestedCancellations() {
        var command = new EventPaymentCancellationsProtocol.Empty(EventPaymentCancellationsProtocol.Scope.current());
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.PENDING, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto>>() {},
                "event-payment-cancellations.pending", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> v.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto> pendingForCancelledEvent(String sourceId) {
        var command = new EventPaymentCancellationsProtocol.Query(EventPaymentCancellationsProtocol.Scope.current(), sourceId, null);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.EVENT_PENDING, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.payments.dto.CancellationPaymentDto>>() {},
                "event-payment-cancellations.event-pending", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> v.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public void queueAdminRemovals(String sourceId, java.util.Collection<String> userIds, String actorUserId) {
        var command = new EventPaymentCancellationsProtocol.Queue(EventPaymentCancellationsProtocol.Scope.current(), sourceId, userIds, actorUserId);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.QUEUE, bytes, new TypeReference<EventPaymentCancellationsProtocol.Receipt>() {},
                "event-payment-cancellations.queue", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void acknowledgeCancelledRequest(String paymentId) {
        var command = new EventPaymentCancellationsProtocol.Acknowledge(EventPaymentCancellationsProtocol.Scope.current(), paymentId);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.ACKNOWLEDGE, bytes, new TypeReference<EventPaymentCancellationsProtocol.Receipt>() {},
                "event-payment-cancellations.acknowledge", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void grantChangedTerms(String sourceId, String stamp) {
        var command = new EventPaymentCancellationsProtocol.Grant(EventPaymentCancellationsProtocol.Scope.current(), sourceId, stamp);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.GRANT, bytes, new TypeReference<EventPaymentCancellationsProtocol.Receipt>() {},
                "event-payment-cancellations.grant", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public boolean hasPendingForCancelledEvent(String sourceId) {
        var command = new EventPaymentCancellationsProtocol.Query(EventPaymentCancellationsProtocol.Scope.current(), sourceId, null);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.HAS_PENDING, bytes, new TypeReference<EventPaymentCancellationsProtocol.Decision>() {},
                "event-payment-cancellations.has-pending", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null);
        return result.value();
    }
    @Override public java.util.List<String> participantIds(String sourceId) {
        var command = new EventPaymentCancellationsProtocol.Query(EventPaymentCancellationsProtocol.Scope.current(), sourceId, null);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.PARTICIPANTS, bytes, new TypeReference<java.util.List<String>>() {},
                "event-payment-cancellations.participants", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.List<String> eligibleUserIds(String sourceId) {
        var command = new EventPaymentCancellationsProtocol.Query(EventPaymentCancellationsProtocol.Scope.current(), sourceId, null);
        if (!EventPaymentCancellationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payment-cancellations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentCancellationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payment-cancellations request exceeds byte limit");
        var result = ownerExchange(EventPaymentCancellationsProtocol.ELIGIBLE_USERS, bytes, new TypeReference<java.util.List<String>>() {},
                "event-payment-cancellations.eligible-users", EventPaymentCancellationsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
