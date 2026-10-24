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
public class RandomGroupAssignmentClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteRandomGroupAssignment remoteRandomGroupAssignment(
            @Value("${myscoutee.remote.random-group-assignment.url}") URI origin,
            @Value("${myscoutee.remote.random-group-assignment.command-token}") String token,
            @Value("${myscoutee.remote.random-group-assignment.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.random-group-assignment.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.random-group-assignment.request-timeout:PT10M}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteRandomGroupAssignment(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
