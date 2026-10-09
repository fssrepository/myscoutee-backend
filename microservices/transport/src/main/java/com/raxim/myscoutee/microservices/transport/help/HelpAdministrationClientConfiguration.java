package com.raxim.myscoutee.microservices.transport.help;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns help to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class HelpAdministrationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteHelpAdministration remoteHelpAdministration(
            @Value("${myscoutee.remote.help-administration.url}") URI origin,
            @Value("${myscoutee.remote.help-administration.command-token}") String token,
            @Value("${myscoutee.remote.help-administration.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.help-administration.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.help-administration.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteHelpAdministration(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
