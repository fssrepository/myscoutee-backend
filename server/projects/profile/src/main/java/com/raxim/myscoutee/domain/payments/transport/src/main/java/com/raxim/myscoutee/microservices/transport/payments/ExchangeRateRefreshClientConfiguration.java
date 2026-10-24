package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns payments to a different owner. */
@Configuration(proxyBeanMethods = false)
public class ExchangeRateRefreshClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteExchangeRateRefresh remoteExchangeRateRefresh(
            @Value("${myscoutee.remote.exchange-rate-refresh.url}") URI origin,
            @Value("${myscoutee.remote.exchange-rate-refresh.command-token}") String token,
            @Value("${myscoutee.remote.exchange-rate-refresh.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.exchange-rate-refresh.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.exchange-rate-refresh.request-timeout:PT10M}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteExchangeRateRefresh(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
