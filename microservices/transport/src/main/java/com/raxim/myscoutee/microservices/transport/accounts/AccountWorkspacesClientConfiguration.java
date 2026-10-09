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
public class AccountWorkspacesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAccountWorkspaces remoteAccountWorkspaces(
            @Value("${myscoutee.remote.account-workspaces.url}") URI origin,
            @Value("${myscoutee.remote.account-workspaces.command-token}") String token,
            @Value("${myscoutee.remote.account-workspaces.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.account-workspaces.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.account-workspaces.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAccountWorkspaces(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
