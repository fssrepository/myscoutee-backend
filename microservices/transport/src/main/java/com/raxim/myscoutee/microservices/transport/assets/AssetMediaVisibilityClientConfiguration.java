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
public class AssetMediaVisibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetMediaVisibility remoteAssetMediaVisibility(
            @Value("${myscoutee.remote.assets-media.url}") URI origin,
            @Value("${myscoutee.remote.assets-media.read-token}") String token,
            @Value("${myscoutee.remote.assets-media.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.assets-media.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.assets-media.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetMediaVisibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
