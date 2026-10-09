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
public class ExperiencesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteExperiences remoteExperiences(
            @Value("${myscoutee.remote.experiences.url}") URI origin,
            @Value("${myscoutee.remote.experiences.read-token}") String token,
            @Value("${myscoutee.remote.experiences.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.experiences.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.experiences.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteExperiences(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
