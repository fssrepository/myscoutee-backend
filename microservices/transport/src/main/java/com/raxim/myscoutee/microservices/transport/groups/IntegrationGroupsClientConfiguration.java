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
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class IntegrationGroupsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteIntegrationGroups remoteIntegrationGroups(
            @Value("${myscoutee.remote.integration-groups.url}") URI origin,
            @Value("${myscoutee.remote.integration-groups.command-token}") String token,
            @Value("${myscoutee.remote.integration-groups.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.integration-groups.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.integration-groups.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteIntegrationGroups(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
