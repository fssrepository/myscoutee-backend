package com.raxim.myscoutee.microservices.transport.integrations;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns integrations to a different owner. */
@Configuration(proxyBeanMethods = false)
public class EventChangesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventChanges remoteEventChanges(
            @Value("${myscoutee.remote.event-changes.url}") URI origin,
            @Value("${myscoutee.remote.event-changes.command-token}") String token,
            @Value("${myscoutee.remote.event-changes.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-changes.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-changes.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventChanges(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
