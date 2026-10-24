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
public class ContactDirectoryClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteContactDirectory remoteContactDirectory(
            @Value("${myscoutee.remote.contact-directory.url}") URI origin,
            @Value("${myscoutee.remote.contact-directory.read-token}") String token,
            @Value("${myscoutee.remote.contact-directory.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.contact-directory.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.contact-directory.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteContactDirectory(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
