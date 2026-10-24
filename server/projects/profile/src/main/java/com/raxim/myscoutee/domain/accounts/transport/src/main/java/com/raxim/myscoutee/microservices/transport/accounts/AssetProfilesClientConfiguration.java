package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns accounts to a different owner. */
@Configuration(proxyBeanMethods = false)
public class AssetProfilesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssetProfiles remoteAssetProfiles(
            @Value("${myscoutee.remote.asset-profiles.url}") URI origin,
            @Value("${myscoutee.remote.asset-profiles.read-token}") String token,
            @Value("${myscoutee.remote.asset-profiles.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.asset-profiles.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.asset-profiles.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAssetProfiles(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
