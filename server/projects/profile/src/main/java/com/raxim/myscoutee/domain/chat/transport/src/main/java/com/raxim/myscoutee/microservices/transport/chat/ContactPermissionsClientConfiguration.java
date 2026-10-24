package com.raxim.myscoutee.microservices.transport.chat;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class ContactPermissionsClientConfiguration {
    @Bean(destroyMethod="close") RemoteContactPermissions remoteContactPermissions(
            @Value("${myscoutee.remote.contact-permissions.url}") URI origin,
            @Value("${myscoutee.remote.contact-permissions.command-token}") String token,
            @Value("${myscoutee.remote.contact-permissions.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.contact-permissions.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.contact-permissions.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteContactPermissions(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
