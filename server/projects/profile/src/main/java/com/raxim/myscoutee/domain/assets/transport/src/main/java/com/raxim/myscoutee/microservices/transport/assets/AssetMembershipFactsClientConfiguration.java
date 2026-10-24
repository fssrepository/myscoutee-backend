package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns assets to a different owner. */
@Configuration(proxyBeanMethods = false)
public class AssetMembershipFactsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetMembershipFacts remoteAssetMembershipFacts(
            @Value("${myscoutee.remote.asset-membership-facts.url}") URI origin,
            @Value("${myscoutee.remote.asset-membership-facts.read-token}") String token,
            @Value("${myscoutee.remote.asset-membership-facts.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-membership-facts.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-membership-facts.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetMembershipFacts(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
