package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns affinity to a different owner. */
@Configuration(proxyBeanMethods = false)
public class AffiliateRegistrationsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAffiliateRegistrations remoteAffiliateRegistrations(
            @Value("${myscoutee.remote.affiliate-registrations.url}") URI origin,
            @Value("${myscoutee.remote.affiliate-registrations.command-token}") String token,
            @Value("${myscoutee.remote.affiliate-registrations.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.affiliate-registrations.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.affiliate-registrations.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAffiliateRegistrations(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
