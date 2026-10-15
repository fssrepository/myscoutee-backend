package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentMethods;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePaymentMethods extends RemoteReadTransport implements PaymentMethods {
    private final ObjectMapper mapper;
    public RemotePaymentMethods(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Options options() {
        var command = new PaymentMethodsProtocol.Query(PaymentMethodsProtocol.Scope.current());
        if (!PaymentMethodsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-methods request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentMethodsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-methods request exceeds byte limit");
        var result = ownerExchange(PaymentMethodsProtocol.AVAILABLE, bytes, new TypeReference<PaymentMethodsProtocol.Decision>() {},
                "payment-methods.available", PaymentMethodsProtocol.MAX_RESPONSE_BYTES, v -> v.value()!=null && v.currencies()!=null && v.eurRates()!=null);
        return new Options(result.value(), result.currencies(), result.eurRates());
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
