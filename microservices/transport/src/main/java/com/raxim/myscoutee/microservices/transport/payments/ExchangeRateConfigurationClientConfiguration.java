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
public class ExchangeRateConfigurationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteExchangeRateConfiguration remoteExchangeRateConfiguration(
            @Value("${myscoutee.remote.exchange-rate-configuration.url}") URI origin,
            @Value("${myscoutee.remote.exchange-rate-configuration.read-token}") String token,
            @Value("${myscoutee.remote.exchange-rate-configuration.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.exchange-rate-configuration.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.exchange-rate-configuration.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteExchangeRateConfiguration(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
