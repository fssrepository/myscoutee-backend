package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns accounts to a different owner. */
@Configuration(proxyBeanMethods = false)
public class LocationEligibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteLocationEligibility remoteLocationEligibility(
            @Value("${myscoutee.remote.location-eligibility.url}") URI origin,
            @Value("${myscoutee.remote.location-eligibility.read-token}") String token,
            @Value("${myscoutee.remote.location-eligibility.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.location-eligibility.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.location-eligibility.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteLocationEligibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
