package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.CheckoutMemberships;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCheckoutMemberships extends RemoteReadTransport implements CheckoutMemberships {
    private final ObjectMapper mapper;
    public RemoteCheckoutMemberships(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void expirePendingCheckoutMembership(String userId, String eventId, String nowIso) {
        var command = new CheckoutMembershipsProtocol.Expire(CheckoutMembershipsProtocol.Scope.current(), userId, eventId, nowIso);
        if (!CheckoutMembershipsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-memberships request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutMembershipsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-memberships request exceeds byte limit");
        var result = ownerExchange(CheckoutMembershipsProtocol.EXPIRE, bytes, new TypeReference<CheckoutMembershipsProtocol.Receipt>() {},
                "checkout-memberships.expire", CheckoutMembershipsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
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

    @Override public void finishPendingCancellations() {
        var command = new CheckoutMembershipsProtocol.CancellationWakeup(CheckoutMembershipsProtocol.Scope.current());
        if (!CheckoutMembershipsProtocol.valid(command)) throw new IllegalArgumentException("Cancellation wakeup requires a job scope");
        exchange(CheckoutMembershipsProtocol.CANCELLATIONS, mapper.writeValueAsBytes(command),
                new TypeReference<CheckoutMembershipsProtocol.Receipt>() {}, "checkout-memberships.cancellations",
                CheckoutMembershipsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
