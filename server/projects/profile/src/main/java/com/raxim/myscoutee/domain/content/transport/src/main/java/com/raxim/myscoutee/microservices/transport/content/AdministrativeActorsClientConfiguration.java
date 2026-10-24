package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class AdministrativeActorsClientConfiguration {
    @Bean(destroyMethod="close") RemoteAdministrativeActors remoteAdministrativeActors(
            @Value("${myscoutee.remote.administrative-actors.url}") URI origin,
            @Value("${myscoutee.remote.administrative-actors.read-token}") String token,
            @Value("${myscoutee.remote.administrative-actors.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.administrative-actors.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.administrative-actors.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteAdministrativeActors(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
