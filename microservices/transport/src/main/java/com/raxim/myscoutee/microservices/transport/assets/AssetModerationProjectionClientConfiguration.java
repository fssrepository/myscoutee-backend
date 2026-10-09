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
public class AssetModerationProjectionClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetModerationProjection remoteAssetModerationProjection(
            @Value("${myscoutee.remote.asset-moderation-projection.url}") URI origin,
            @Value("${myscoutee.remote.asset-moderation-projection.command-token}") String token,
            @Value("${myscoutee.remote.asset-moderation-projection.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-moderation-projection.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-moderation-projection.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetModerationProjection(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
