package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class EventCheckoutClientConfiguration {
    @Bean(destroyMethod="close") RemoteEventCheckout remoteEventCheckout(
            @Value("${myscoutee.remote.event-checkout.url}") URI origin,
            @Value("${myscoutee.remote.event-checkout.command-token}") String token,
            @Value("${myscoutee.remote.event-checkout.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-checkout.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-checkout.request-timeout:PT30S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteEventCheckout(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
