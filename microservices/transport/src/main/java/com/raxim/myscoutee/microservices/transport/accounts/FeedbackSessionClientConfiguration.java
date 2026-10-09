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
public class FeedbackSessionClientConfiguration {
    @Bean(destroyMethod="close") RemoteFeedbackSession remoteFeedbackSession(
            @Value("${myscoutee.remote.feedback-session.url}") URI origin,
            @Value("${myscoutee.remote.feedback-session.read-token}") String token,
            @Value("${myscoutee.remote.feedback-session.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.feedback-session.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.feedback-session.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteFeedbackSession(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
