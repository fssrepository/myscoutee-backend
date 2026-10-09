package com.raxim.myscoutee.microservices.transport.email;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns email to a different owner. */
@Configuration(proxyBeanMethods = false)
public class EmailPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEmailPrivacy remoteEmailPrivacy(
            @Value("${myscoutee.remote.email-privacy.url}") URI origin,
            @Value("${myscoutee.remote.email-privacy.command-token}") String token,
            @Value("${myscoutee.remote.email-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.email-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.email-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEmailPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
