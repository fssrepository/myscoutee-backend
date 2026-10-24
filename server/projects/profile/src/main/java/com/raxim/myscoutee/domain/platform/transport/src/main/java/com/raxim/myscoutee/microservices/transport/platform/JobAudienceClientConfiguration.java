package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns affinity to a different owner. */
@Configuration(proxyBeanMethods = false)
public class JobAudienceClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteJobAudience remoteJobAudience(
            @Value("${myscoutee.remote.job-audience.url}") URI origin,
            @Value("${myscoutee.remote.job-audience.read-token}") String token,
            @Value("${myscoutee.remote.job-audience.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.job-audience.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.job-audience.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteJobAudience(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
