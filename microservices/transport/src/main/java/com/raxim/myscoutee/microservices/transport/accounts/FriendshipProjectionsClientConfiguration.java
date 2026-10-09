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
public class FriendshipProjectionsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFriendshipProjections remoteFriendshipProjections(
            @Value("${myscoutee.remote.friendship-projections.url}") URI origin,
            @Value("${myscoutee.remote.friendship-projections.command-token}") String token,
            @Value("${myscoutee.remote.friendship-projections.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.friendship-projections.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.friendship-projections.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFriendshipProjections(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
