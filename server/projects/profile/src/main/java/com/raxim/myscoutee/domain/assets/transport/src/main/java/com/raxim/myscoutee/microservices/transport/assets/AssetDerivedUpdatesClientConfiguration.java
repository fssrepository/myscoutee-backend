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
public class AssetDerivedUpdatesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetDerivedUpdates remoteAssetDerivedUpdates(
            @Value("${myscoutee.remote.asset-derived-updates.url}") URI origin,
            @Value("${myscoutee.remote.asset-derived-updates.command-token}") String token,
            @Value("${myscoutee.remote.asset-derived-updates.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-derived-updates.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-derived-updates.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetDerivedUpdates(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
