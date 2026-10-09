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
public class EventCounterUpdatesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventCounterUpdates remoteEventCounterUpdates(
            @Value("${myscoutee.remote.event-counter-updates.url}") URI origin,
            @Value("${myscoutee.remote.event-counter-updates.read-token}") String token,
            @Value("${myscoutee.remote.event-counter-updates.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-counter-updates.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-counter-updates.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventCounterUpdates(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
