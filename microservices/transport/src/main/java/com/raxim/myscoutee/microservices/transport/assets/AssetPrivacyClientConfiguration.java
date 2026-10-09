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
public class AssetPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetPrivacy remoteAssetPrivacy(
            @Value("${myscoutee.remote.asset-privacy.url}") URI origin,
            @Value("${myscoutee.remote.asset-privacy.command-token}") String token,
            @Value("${myscoutee.remote.asset-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
