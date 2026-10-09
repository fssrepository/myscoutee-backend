package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns events to a different owner. */
@Configuration(proxyBeanMethods = false)
public class MingleEncountersClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteMingleEncounters remoteMingleEncounters(
            @Value("${myscoutee.remote.mingle-encounters.url}") URI origin,
            @Value("${myscoutee.remote.mingle-encounters.command-token}") String token,
            @Value("${myscoutee.remote.mingle-encounters.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.mingle-encounters.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.mingle-encounters.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteMingleEncounters(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
