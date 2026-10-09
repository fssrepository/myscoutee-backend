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
public class AffinityGraphClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAffinityGraph remoteAffinityGraph(
            @Value("${myscoutee.remote.affinity-graph.url}") URI origin,
            @Value("${myscoutee.remote.affinity-graph.command-token}") String token,
            @Value("${myscoutee.remote.affinity-graph.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.affinity-graph.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.affinity-graph.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteAffinityGraph(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
