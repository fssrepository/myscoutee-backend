package com.raxim.myscoutee.microservices.transport.administration;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns administration to a different owner. */
@Configuration(proxyBeanMethods = false)
public class AdminAudienceClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAdminAudience remoteAdminAudience(
            @Value("${myscoutee.remote.admin-audience.url}") URI origin,
            @Value("${myscoutee.remote.admin-audience.read-token}") String token,
            @Value("${myscoutee.remote.admin-audience.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.admin-audience.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.admin-audience.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAdminAudience(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
