package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.EventPayments;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventPayments extends RemoteReadTransport implements EventPayments {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteEventPayments(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutSessionDto payCheckout(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request, String provider, String startedSession) {
        var command = new EventPaymentsProtocol.Pay(EventPaymentsProtocol.Scope.current(), request, provider, startedSession);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.PAY, bytes, new TypeReference<EventPaymentsProtocol.Result>() {},
                "event-payments.pay", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public void recordEventJoin(String session, String userId, String sourceId, String slot, String start, String end, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {
        var command = new EventPaymentsProtocol.Join(EventPaymentsProtocol.Scope.current(), session, userId, sourceId, slot, start, end, policy);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.JOIN, bytes, new TypeReference<EventPaymentsProtocol.Receipt>() {},
                "event-payments.join", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void completeEventCancellation(String paymentId, String reason) {
        var command = new EventPaymentsProtocol.Complete(EventPaymentsProtocol.Scope.current(), paymentId, reason);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.COMPLETE, bytes, new TypeReference<EventPaymentsProtocol.Receipt>() {},
                "event-payments.complete", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void cancelEventBooking(String userId, String sourceId, String start, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {
        var command = new EventPaymentsProtocol.Cancel(EventPaymentsProtocol.Scope.current(), userId, sourceId, start, policy);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.CANCEL, bytes, new TypeReference<EventPaymentsProtocol.Receipt>() {},
                "event-payments.cancel", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public boolean hasPendingEventJoin(String userId, String sourceId) {
        var command = new EventPaymentsProtocol.UserEvent(EventPaymentsProtocol.Scope.current(), userId, sourceId);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.PENDING, bytes, new TypeReference<EventPaymentsProtocol.Decision>() {},
                "event-payments.pending", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null);
        return result.value();
    }
    @Override public boolean finalizePendingEventJoin(String userId, String sourceId) {
        var command = new EventPaymentsProtocol.UserEvent(EventPaymentsProtocol.Scope.current(), userId, sourceId);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.FINALIZE, bytes, new TypeReference<EventPaymentsProtocol.Decision>() {},
                "event-payments.finalize", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null);
        return result.value();
    }
    @Override public boolean hasJoinedEventJoin(String userId, String sourceId) {
        var command = new EventPaymentsProtocol.UserEvent(EventPaymentsProtocol.Scope.current(), userId, sourceId);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.JOINED, bytes, new TypeReference<EventPaymentsProtocol.Decision>() {},
                "event-payments.joined", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null);
        return result.value();
    }
    @Override public java.util.Set<String> findPendingEventJoinSourceIds(String userId, java.util.Collection<String> sourceIds) {
        var command = new EventPaymentsProtocol.UserEvents(EventPaymentsProtocol.Scope.current(), userId, sourceIds);
        if (!EventPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-payments request exceeds byte limit");
        var result = ownerExchange(EventPaymentsProtocol.PENDING_SOURCES, bytes, new TypeReference<java.util.Set<String>>() {},
                "event-payments.pending-sources", EventPaymentsProtocol.MAX_RESPONSE_BYTES, v -> sourceIds.containsAll(v));
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (EventPaymentsProtocol.PAY.equals(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(EventPaymentsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            if (java.util.Set.of(EventPaymentsProtocol.PAY, EventPaymentsProtocol.JOIN, EventPaymentsProtocol.COMPLETE, EventPaymentsProtocol.CANCEL, EventPaymentsProtocol.FINALIZE).contains(path))
                throw new com.raxim.myscoutee.domain.payments.api.CheckoutOutcomeUnknown(failure);
            throw failure;
        }
    }

    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutSessionDto payCheckout(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request, String provider) {
        return payCheckout(request, provider, null);
    }
    @Override public void recordEventJoin(String session, String userId, String sourceId, String slot,
            String start, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {
        recordEventJoin(session, userId, sourceId, slot, start, null, policy);
    }
}
