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
public class PaymentProvidersClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePaymentProviders remotePaymentProviders(
            @Value("${myscoutee.remote.payment-providers.url}") URI origin,
            @Value("${myscoutee.remote.payment-providers.read-token}") String token,
            @Value("${myscoutee.remote.payment-providers.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.payment-providers.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.payment-providers.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemotePaymentProviders(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
