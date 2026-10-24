package com.raxim.myscoutee.microservices.transport.localization;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns localization to a different owner. */
@Configuration(proxyBeanMethods = false)
public class MessageTranslationsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteMessageTranslations remoteMessageTranslations(
            @Value("${myscoutee.remote.message-translations.url}") URI origin,
            @Value("${myscoutee.remote.message-translations.read-token}") String token,
            @Value("${myscoutee.remote.message-translations.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.message-translations.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.message-translations.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteMessageTranslations(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
