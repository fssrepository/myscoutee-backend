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
public class IdeaAdministrationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteIdeaAdministration remoteIdeaAdministration(
            @Value("${myscoutee.remote.idea-administration.url}") URI origin,
            @Value("${myscoutee.remote.idea-administration.command-token}") String token,
            @Value("${myscoutee.remote.idea-administration.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.idea-administration.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.idea-administration.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteIdeaAdministration(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
