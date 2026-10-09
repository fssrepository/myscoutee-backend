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
public class ResourceAssignmentsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteResourceAssignments remoteResourceAssignments(
            @Value("${myscoutee.remote.resource-assignments.url}") URI origin,
            @Value("${myscoutee.remote.resource-assignments.command-token}") String token,
            @Value("${myscoutee.remote.resource-assignments.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.resource-assignments.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.resource-assignments.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteResourceAssignments(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
