package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns content to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class AdministrativeAccessClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAdministrativeAccess remoteAdministrativeAccess(
            @Value("${myscoutee.remote.administrative-access.url}") URI origin,
            @Value("${myscoutee.remote.administrative-access.command-token}") String token,
            @Value("${myscoutee.remote.administrative-access.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.administrative-access.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.administrative-access.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteAdministrativeAccess(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
