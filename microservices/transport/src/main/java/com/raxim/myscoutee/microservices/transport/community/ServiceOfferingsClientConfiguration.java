package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns community to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class ServiceOfferingsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteServiceOfferings remoteServiceOfferings(
            @Value("${myscoutee.remote.service-offerings.url}") URI origin,
            @Value("${myscoutee.remote.service-offerings.command-token}") String token,
            @Value("${myscoutee.remote.service-offerings.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.service-offerings.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.service-offerings.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteServiceOfferings(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
