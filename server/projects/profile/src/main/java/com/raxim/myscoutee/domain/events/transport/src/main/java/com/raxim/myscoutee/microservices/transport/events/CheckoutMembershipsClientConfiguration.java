package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns events to a different owner. */
@Configuration(proxyBeanMethods = false)
public class CheckoutMembershipsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCheckoutMemberships remoteCheckoutMemberships(
            @Value("${myscoutee.remote.checkout-memberships.url}") URI origin,
            @Value("${myscoutee.remote.checkout-memberships.command-token}") String token,
            @Value("${myscoutee.remote.checkout-memberships.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.checkout-memberships.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.checkout-memberships.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCheckoutMemberships(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
