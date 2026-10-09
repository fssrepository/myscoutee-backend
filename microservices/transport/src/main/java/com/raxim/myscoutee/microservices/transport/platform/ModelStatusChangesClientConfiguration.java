package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns platform to a different owner. */
@Configuration(proxyBeanMethods = false)
public class ModelStatusChangesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteModelStatusChanges remoteModelStatusChanges(
            @Value("${myscoutee.remote.model-status-changes.url}") URI origin,
            @Value("${myscoutee.remote.model-status-changes.command-token}") String token,
            @Value("${myscoutee.remote.model-status-changes.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.model-status-changes.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.model-status-changes.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteModelStatusChanges(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
