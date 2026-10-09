package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns affinity to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class RatingPageReadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteRatingPageReads remoteRatingPageReads(
            @Value("${myscoutee.remote.rating-page-reads.url}") URI origin,
            @Value("${myscoutee.remote.rating-page-reads.read-token}") String token,
            @Value("${myscoutee.remote.rating-page-reads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.rating-page-reads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.rating-page-reads.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteRatingPageReads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
