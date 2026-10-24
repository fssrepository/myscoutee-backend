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
public class MeasurementEligibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteMeasurementEligibility remoteMeasurementEligibility(
            @Value("${myscoutee.remote.measurement-eligibility.url}") URI origin,
            @Value("${myscoutee.remote.measurement-eligibility.read-token}") String token,
            @Value("${myscoutee.remote.measurement-eligibility.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.measurement-eligibility.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.measurement-eligibility.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteMeasurementEligibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
