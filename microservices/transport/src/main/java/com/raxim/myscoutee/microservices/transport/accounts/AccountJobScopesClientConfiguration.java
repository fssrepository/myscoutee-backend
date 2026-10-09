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
public class AccountJobScopesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAccountJobScopes remoteAccountJobScopes(
            @Value("${myscoutee.remote.account-job-scopes.url}") URI origin,
            @Value("${myscoutee.remote.account-job-scopes.read-token}") String token,
            @Value("${myscoutee.remote.account-job-scopes.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.account-job-scopes.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.account-job-scopes.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAccountJobScopes(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
