package com.raxim.myscoutee.microservices.transport.operator;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns operator to a different owner. */
@Configuration(proxyBeanMethods = false)
public class GlobalIdentityPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteGlobalIdentityPrivacy remoteGlobalIdentityPrivacy(
            @Value("${myscoutee.remote.global-identity-privacy.url}") URI origin,
            @Value("${myscoutee.remote.global-identity-privacy.command-token}") String token,
            @Value("${myscoutee.remote.global-identity-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.global-identity-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.global-identity-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteGlobalIdentityPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
