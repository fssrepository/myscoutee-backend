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
public class UserFeedbackClientConfiguration {
    @Bean(destroyMethod="close") RemoteUserFeedback remoteUserFeedback(
            @Value("${myscoutee.remote.user-feedback.url}") URI origin,
            @Value("${myscoutee.remote.user-feedback.command-token}") String token,
            @Value("${myscoutee.remote.user-feedback.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.user-feedback.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.user-feedback.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteUserFeedback(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
