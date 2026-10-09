package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentSimulatorConfiguration;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePaymentSimulatorConfiguration extends RemoteReadTransport implements PaymentSimulatorConfiguration {
    private final ObjectMapper mapper;
    public RemotePaymentSimulatorConfiguration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public boolean isEnabled() {
        var command = new PaymentSimulatorConfigurationProtocol.Query(PaymentSimulatorConfigurationProtocol.Scope.current());
        if (!PaymentSimulatorConfigurationProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-simulator-configuration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentSimulatorConfigurationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-simulator-configuration request exceeds byte limit");
        var result = ownerExchange(PaymentSimulatorConfigurationProtocol.ENABLED, bytes, new TypeReference<PaymentSimulatorConfigurationProtocol.Decision>() {},
                "payment-simulator-configuration.enabled", PaymentSimulatorConfigurationProtocol.MAX_RESPONSE_BYTES, v -> v.value()!=null);
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.payments.api.PaymentSimulatorConfiguration.GatewayConfiguration configuration() {
        var command = new PaymentSimulatorConfigurationProtocol.Query(PaymentSimulatorConfigurationProtocol.Scope.current());
        if (!PaymentSimulatorConfigurationProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-simulator-configuration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentSimulatorConfigurationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-simulator-configuration request exceeds byte limit");
        var result = ownerExchange(PaymentSimulatorConfigurationProtocol.CONFIGURATION, bytes, new TypeReference<PaymentSimulatorConfigurationProtocol.Result>() {},
                "payment-simulator-configuration.configuration", PaymentSimulatorConfigurationProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
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
