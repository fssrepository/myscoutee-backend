package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns groups to a different owner. */
@Configuration(proxyBeanMethods = false)
public class GroupAdministrationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteGroupAdministration remoteGroupAdministration(
            @Value("${myscoutee.remote.group-administration.url}") URI origin,
            @Value("${myscoutee.remote.group-administration.read-token}") String token,
            @Value("${myscoutee.remote.group-administration.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.group-administration.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.group-administration.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteGroupAdministration(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
