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
public class EventDerivedUpdatesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventDerivedUpdates remoteEventDerivedUpdates(
            @Value("${myscoutee.remote.event-derived-updates.url}") URI origin,
            @Value("${myscoutee.remote.event-derived-updates.command-token}") String token,
            @Value("${myscoutee.remote.event-derived-updates.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-derived-updates.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-derived-updates.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventDerivedUpdates(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
