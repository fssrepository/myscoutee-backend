package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CheckoutBaskets;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCheckoutBaskets extends RemoteReadTransport implements CheckoutBaskets {
    private final ObjectMapper mapper;
    public RemoteCheckoutBaskets(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketDto loadBasketByEvent(String userId, String sourceId) {
        var command = new CheckoutBasketsProtocol.UserEvent(CheckoutBasketsProtocol.Scope.current(), userId, sourceId);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.BASKET, bytes, new TypeReference<CheckoutBasketsProtocol.Result>() {},
                "checkout-baskets.basket", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.payments.api.CheckoutBaskets.CheckoutCardStates loadCardStatesByEvent(String userId, java.util.Collection<String> sourceIds) {
        var command = new CheckoutBasketsProtocol.UserEvents(CheckoutBasketsProtocol.Scope.current(), userId, sourceIds);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.CARDS, bytes, new TypeReference<com.raxim.myscoutee.domain.payments.api.CheckoutBaskets.CheckoutCardStates>() {},
                "checkout-baskets.cards", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> v.resultStates() != null && v.pendingReasons() != null);
        return result;
    }
    @Override public java.util.Map<String, Integer> activeSlotReservationCountsByEvent(String sourceId) {
        var command = new CheckoutBasketsProtocol.Source(CheckoutBasketsProtocol.Scope.current(), sourceId);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.SLOTS, bytes, new TypeReference<java.util.Map<String, Integer>>() {},
                "checkout-baskets.slots", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.Map<String, Integer> activeOptionalReservationCountsByEvent(String sourceId) {
        var command = new CheckoutBasketsProtocol.Source(CheckoutBasketsProtocol.Scope.current(), sourceId);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.OPTIONAL, bytes, new TypeReference<java.util.Map<String, Integer>>() {},
                "checkout-baskets.optional", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketDto saveBasket(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request) {
        var command = new CheckoutBasketsProtocol.Save(CheckoutBasketsProtocol.Scope.current(), request);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.SAVE, bytes, new TypeReference<CheckoutBasketsProtocol.Result>() {},
                "checkout-baskets.save", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketDto updateBasketState(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutStateChangeRequestDto request) {
        var command = new CheckoutBasketsProtocol.Update(CheckoutBasketsProtocol.Scope.current(), request);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.UPDATE, bytes, new TypeReference<CheckoutBasketsProtocol.Result>() {},
                "checkout-baskets.update", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public void retireCancelledEventReservations(String sourceId, java.util.Collection<String> participantIds) {
        var command = new CheckoutBasketsProtocol.Retire(CheckoutBasketsProtocol.Scope.current(), sourceId, participantIds);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.RETIRE, bytes, new TypeReference<CheckoutBasketsProtocol.Receipt>() {},
                "checkout-baskets.retire", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void finalizeAcceptedReservation(String userId, String sourceId) {
        var command = new CheckoutBasketsProtocol.UserEvent(CheckoutBasketsProtocol.Scope.current(), userId, sourceId);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.FINALIZE, bytes, new TypeReference<CheckoutBasketsProtocol.Receipt>() {},
                "checkout-baskets.finalize", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public boolean wasCheckoutExpired(String userId, String sourceId, String requestAtIso) {
        var command = new CheckoutBasketsProtocol.Expired(CheckoutBasketsProtocol.Scope.current(), userId, sourceId, requestAtIso);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.EXPIRED, bytes, new TypeReference<CheckoutBasketsProtocol.Decision>() {},
                "checkout-baskets.expired", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null);
        return result.value();
    }
    @Override public int purgeExpiredDraftBasketsScheduled(java.time.Instant now) {
        var command = new CheckoutBasketsProtocol.Purge(CheckoutBasketsProtocol.Scope.current(), now);
        if (!CheckoutBasketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-baskets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutBasketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-baskets request exceeds byte limit");
        var result = ownerExchange(CheckoutBasketsProtocol.PURGE, bytes, new TypeReference<CheckoutBasketsProtocol.Count>() {},
                "checkout-baskets.purge", CheckoutBasketsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null && v.value() >= 0);
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            if (java.util.Set.of(CheckoutBasketsProtocol.SAVE, CheckoutBasketsProtocol.UPDATE, CheckoutBasketsProtocol.RETIRE, CheckoutBasketsProtocol.FINALIZE, CheckoutBasketsProtocol.PURGE).contains(path))
                throw new com.raxim.myscoutee.domain.payments.api.CheckoutOutcomeUnknown(failure);
            throw failure;
        }
    }

}
