package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns payments to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class EventPaymentsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventPayments remoteEventPayments(
            @Value("${myscoutee.remote.event-payments.url}") URI origin,
            @Value("${myscoutee.remote.event-payments.command-token}") String token,
            @Value("${myscoutee.remote.event-payments.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-payments.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-payments.request-timeout:PT30S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteEventPayments(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
