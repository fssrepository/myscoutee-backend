package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class ProfileWorkspaceLoadsClientConfiguration {
    @Bean(destroyMethod="close") RemoteProfileWorkspaceLoads remoteProfileWorkspaceLoads(
            @Value("${myscoutee.remote.profile-workspace.url}") URI origin,
            @Value("${myscoutee.remote.profile-workspace.command-token}") String token,
            @Value("${myscoutee.remote.profile-workspace.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.profile-workspace.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.profile-workspace.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteProfileWorkspaceLoads(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
