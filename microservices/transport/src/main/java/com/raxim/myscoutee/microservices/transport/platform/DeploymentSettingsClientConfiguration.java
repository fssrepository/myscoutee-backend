package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns platform to a different owner. */
@Configuration(proxyBeanMethods = false)
public class DeploymentSettingsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteDeploymentSettings remoteDeploymentSettings(
            @Value("${myscoutee.remote.deployment-settings.url}") URI origin,
            @Value("${myscoutee.remote.deployment-settings.read-token}") String token,
            @Value("${myscoutee.remote.deployment-settings.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.deployment-settings.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.deployment-settings.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteDeploymentSettings(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
