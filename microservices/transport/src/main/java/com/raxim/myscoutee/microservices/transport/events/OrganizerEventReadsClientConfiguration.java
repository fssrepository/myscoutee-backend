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
public class OrganizerEventReadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteOrganizerEventReads remoteOrganizerEventReads(
            @Value("${myscoutee.remote.organizer-event-reads.url}") URI origin,
            @Value("${myscoutee.remote.organizer-event-reads.read-token}") String token,
            @Value("${myscoutee.remote.organizer-event-reads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.organizer-event-reads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.organizer-event-reads.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteOrganizerEventReads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
