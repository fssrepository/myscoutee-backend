package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns content to a different owner. */
@Configuration(proxyBeanMethods = false)
public class ContentMediaVisibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteContentMediaVisibility remoteContentMediaVisibility(
            @Value("${myscoutee.remote.content-media.url}") URI origin,
            @Value("${myscoutee.remote.content-media.read-token}") String token,
            @Value("${myscoutee.remote.content-media.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.content-media.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.content-media.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteContentMediaVisibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
