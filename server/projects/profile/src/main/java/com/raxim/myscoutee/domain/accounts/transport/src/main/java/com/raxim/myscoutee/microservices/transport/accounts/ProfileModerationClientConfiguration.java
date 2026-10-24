package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class ProfileModerationClientConfiguration {
    @Bean(destroyMethod="close") RemoteProfileModeration remoteProfileModeration(
            @Value("${myscoutee.remote.profile-moderation.url}") URI origin,
            @Value("${myscoutee.remote.profile-moderation.command-token}") String token,
            @Value("${myscoutee.remote.profile-moderation.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.profile-moderation.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.profile-moderation.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteProfileModeration(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
