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
public class CheckoutBasketsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCheckoutBaskets remoteCheckoutBaskets(
            @Value("${myscoutee.remote.checkout-baskets.url}") URI origin,
            @Value("${myscoutee.remote.checkout-baskets.command-token}") String token,
            @Value("${myscoutee.remote.checkout-baskets.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.checkout-baskets.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.checkout-baskets.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCheckoutBaskets(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
