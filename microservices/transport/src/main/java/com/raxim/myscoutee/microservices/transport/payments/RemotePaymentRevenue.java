package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentRevenue;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePaymentRevenue extends RemoteReadTransport implements PaymentRevenue {
    private final ObjectMapper mapper;
    public RemotePaymentRevenue(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.payments.dto.RevenuePaymentDto> findRevenueCandidates() {
        var command = new PaymentRevenueProtocol.Query(PaymentRevenueProtocol.Scope.current());
        if (!PaymentRevenueProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-revenue request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentRevenueProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-revenue request exceeds byte limit");
        var result = ownerExchange(PaymentRevenueProtocol.CANDIDATES, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.payments.dto.RevenuePaymentDto>>() {},
                "payment-revenue.candidates", PaymentRevenueProtocol.MAX_RESPONSE_BYTES, v -> true);
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
