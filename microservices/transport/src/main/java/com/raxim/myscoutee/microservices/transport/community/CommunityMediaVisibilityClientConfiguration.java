package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns community to a different owner. */
@Configuration(proxyBeanMethods = false)
public class CommunityMediaVisibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCommunityMediaVisibility remoteCommunityMediaVisibility(
            @Value("${myscoutee.remote.community-media.url}") URI origin,
            @Value("${myscoutee.remote.community-media.read-token}") String token,
            @Value("${myscoutee.remote.community-media.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.community-media.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.community-media.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCommunityMediaVisibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
