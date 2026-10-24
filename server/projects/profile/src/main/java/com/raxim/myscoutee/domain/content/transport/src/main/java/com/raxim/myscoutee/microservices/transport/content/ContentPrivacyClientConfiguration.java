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
public class ContentPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteContentPrivacy remoteContentPrivacy(
            @Value("${myscoutee.remote.content-privacy.url}") URI origin,
            @Value("${myscoutee.remote.content-privacy.command-token}") String token,
            @Value("${myscoutee.remote.content-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.content-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.content-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteContentPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
