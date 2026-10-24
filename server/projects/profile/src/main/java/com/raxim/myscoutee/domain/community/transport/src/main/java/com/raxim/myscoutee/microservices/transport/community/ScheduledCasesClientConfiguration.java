package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns community to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class ScheduledCasesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteScheduledCases remoteScheduledCases(
            @Value("${myscoutee.remote.scheduled-cases.url}") URI origin,
            @Value("${myscoutee.remote.scheduled-cases.command-token}") String token,
            @Value("${myscoutee.remote.scheduled-cases.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.scheduled-cases.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.scheduled-cases.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteScheduledCases(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
