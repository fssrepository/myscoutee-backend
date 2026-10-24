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
public class EventJobScopesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventJobScopes remoteEventJobScopes(
            @Value("${myscoutee.remote.events-job-scopes.url}") URI origin,
            @Value("${myscoutee.remote.events-job-scopes.read-token}") String token,
            @Value("${myscoutee.remote.events-job-scopes.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.events-job-scopes.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.events-job-scopes.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventJobScopes(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
