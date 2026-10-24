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
public class ParticipationTicketsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteParticipationTickets remoteParticipationTickets(
            @Value("${myscoutee.remote.participation-tickets.url}") URI origin,
            @Value("${myscoutee.remote.participation-tickets.command-token}") String token,
            @Value("${myscoutee.remote.participation-tickets.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.participation-tickets.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.participation-tickets.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteParticipationTickets(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
