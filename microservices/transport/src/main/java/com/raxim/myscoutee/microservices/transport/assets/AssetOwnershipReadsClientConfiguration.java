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
public class AssetOwnershipReadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetOwnershipReads remoteAssetOwnershipReads(
            @Value("${myscoutee.remote.asset-ownership-reads.url}") URI origin,
            @Value("${myscoutee.remote.asset-ownership-reads.read-token}") String token,
            @Value("${myscoutee.remote.asset-ownership-reads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-ownership-reads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-ownership-reads.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetOwnershipReads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
