package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.payments.api.CurrentPaymentProvider;
import com.raxim.myscoutee.domain.payments.api.PaymentProviderChangedException;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCurrentPaymentProvider extends RemoteReadTransport implements CurrentPaymentProvider {
    public RemoteCurrentPaymentProvider(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public void requireCashOnly() {
        CurrentPaymentProviderProtocol.Result result;
        try {
            result = exchange(CurrentPaymentProviderProtocol.PATH, new TypeReference<CurrentPaymentProviderProtocol.Result>() {},
                    "payments.require-cash-only", 16384, value -> Boolean.TRUE.equals(value.resolved()) && value.cashOnly() != null
                            && (value.cashOnly() ? value.currentProvider() == null
                            : value.currentProvider() != null && !value.currentProvider().isBlank() && value.currentProvider().length() <= 512));
        } catch (RemoteReadException failed) {
            if (failed.status() == 503 && "CURRENT_PAYMENT_PROVIDER_UNAVAILABLE".equals(failed.remoteCode()))
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Deployment payment configuration is unavailable.");
            throw failed;
        }
        if (!result.cashOnly()) throw new PaymentProviderChangedException(HttpStatus.CONFLICT, result.currentProvider());
    }
}
