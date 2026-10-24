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
public class CheckoutResultsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCheckoutResults remoteCheckoutResults(
            @Value("${myscoutee.remote.checkout-results.url}") URI origin,
            @Value("${myscoutee.remote.checkout-results.read-token}") String token,
            @Value("${myscoutee.remote.checkout-results.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.checkout-results.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.checkout-results.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCheckoutResults(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
