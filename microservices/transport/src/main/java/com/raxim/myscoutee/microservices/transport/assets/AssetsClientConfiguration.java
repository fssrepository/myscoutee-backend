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
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class AssetsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAssets remoteAssets(
            @Value("${myscoutee.remote.assets.url}") URI origin,
            @Value("${myscoutee.remote.assets.command-token}") String token,
            @Value("${myscoutee.remote.assets.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.assets.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.assets.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteAssets(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
