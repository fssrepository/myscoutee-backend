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
public class AccountInactivityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAccountInactivity remoteAccountInactivity(
            @Value("${myscoutee.remote.account-inactivity.url}") URI origin,
            @Value("${myscoutee.remote.account-inactivity.command-token}") String token,
            @Value("${myscoutee.remote.account-inactivity.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.account-inactivity.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.account-inactivity.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAccountInactivity(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
