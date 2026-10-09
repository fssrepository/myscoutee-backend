package com.raxim.myscoutee.microservices.transport.email;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class UserActivitySchedulingClientConfiguration {
    @Bean(destroyMethod="close") RemoteUserActivityScheduling remoteUserActivityScheduling(
            @Value("${myscoutee.remote.user-activity.url}") URI origin,
            @Value("${myscoutee.remote.user-activity.command-token}") String token,
            @Value("${myscoutee.remote.user-activity.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.user-activity.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.user-activity.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteUserActivityScheduling(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
