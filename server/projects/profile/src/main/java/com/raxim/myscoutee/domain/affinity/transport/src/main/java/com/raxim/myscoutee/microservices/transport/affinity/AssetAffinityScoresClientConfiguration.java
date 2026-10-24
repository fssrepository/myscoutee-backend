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
public class AssetAffinityScoresClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetAffinityScores remoteAssetAffinityScores(
            @Value("${myscoutee.remote.asset-affinity-scores.url}") URI origin,
            @Value("${myscoutee.remote.asset-affinity-scores.read-token}") String token,
            @Value("${myscoutee.remote.asset-affinity-scores.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-affinity-scores.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-affinity-scores.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetAffinityScores(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
