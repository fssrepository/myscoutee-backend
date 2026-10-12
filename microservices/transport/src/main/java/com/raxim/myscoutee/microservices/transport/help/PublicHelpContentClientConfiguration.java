package com.raxim.myscoutee.microservices.transport.help;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns help to a different owner. */
@Configuration(proxyBeanMethods = false)
public class PublicHelpContentClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePublicHelpContent remotePublicHelpContent(
            @Value("${myscoutee.remote.public-help-content.url}") URI origin,
            @Value("${myscoutee.remote.public-help-content.read-token}") String token,
            @Value("${myscoutee.remote.public-help-content.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.public-help-content.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.public-help-content.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemotePublicHelpContent(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
