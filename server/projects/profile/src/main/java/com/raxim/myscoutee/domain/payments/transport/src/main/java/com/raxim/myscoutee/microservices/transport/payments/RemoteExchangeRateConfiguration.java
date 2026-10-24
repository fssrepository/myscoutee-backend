package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.payments.api.ExchangeRateConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteExchangeRateConfiguration extends RemoteReadTransport implements ExchangeRateConfiguration {
    private final ObjectMapper mapper;
    public RemoteExchangeRateConfiguration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public String validate(String value) {
        try {
            var query = new ExchangeRateConfigurationProtocol.Query(value);
            if (!ExchangeRateConfigurationProtocol.valid(query)) throw new IllegalArgumentException("Invalid exchange-rate-configuration request");
            byte[] body = mapper.writeValueAsBytes(query);
            if (body.length > ExchangeRateConfigurationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
            return exchange(ExchangeRateConfigurationProtocol.PATH, body, new TypeReference<ExchangeRateConfigurationProtocol.Result>() {},
                    "exchange-rate-configuration.read", 16384, result -> Boolean.TRUE.equals(result.resolved()) && result.source() != null).source();
        } catch (RemoteReadException failed) {
            if (failed.status() == 400 && "OWNER_REJECTED".equals(failed.remoteCode()))
                throw new IllegalArgumentException("Invalid exchange-rate source.");
            throw failed;
        }
    }
}
