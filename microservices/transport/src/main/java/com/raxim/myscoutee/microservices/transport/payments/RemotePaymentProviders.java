package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.payments.api.PaymentProviders;
import com.raxim.myscoutee.domain.platform.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemotePaymentProviders extends RemoteReadTransport implements PaymentProviders {
    private final ObjectMapper mapper;
    public RemotePaymentProviders(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public List<PaymentProviderDto> availableProviders() {
        return exchange(PaymentProvidersProtocol.CATALOG, new TypeReference<List<PaymentProviderDto>>() {},
                "payments.providers", 1048576, values -> values.stream().allMatch(PaymentProvidersProtocol::provider));
    }
    @Override public String requireAvailable(String providerId, List<PaymentProviderDto> availableProviders) {
        var query = new PaymentProvidersProtocol.Query(providerId, availableProviders);
        if (!PaymentProvidersProtocol.valid(query)) throw new IllegalArgumentException("Invalid provider validation query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > PaymentProvidersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Provider query exceeds limit");
        try {
            return exchange(PaymentProvidersProtocol.VALIDATE, bytes, new TypeReference<PaymentProvidersProtocol.Result>() {},
                    "payments.provider-validation", 16384, value -> Boolean.TRUE.equals(value.resolved())).providerId();
        } catch (RemoteReadException failed) {
            if (failed.status() == 400 && "OWNER_REJECTED".equals(failed.remoteCode()))
                throw new IllegalArgumentException("Payment provider is not available.");
            throw failed;
        }
    }
}
