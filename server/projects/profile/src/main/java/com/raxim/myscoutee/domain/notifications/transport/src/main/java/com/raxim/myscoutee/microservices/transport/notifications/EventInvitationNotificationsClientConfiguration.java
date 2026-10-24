package com.raxim.myscoutee.microservices.transport.notifications;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns notifications to a different owner. */
@Configuration(proxyBeanMethods = false)
public class EventInvitationNotificationsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventInvitationNotifications remoteEventInvitationNotifications(
            @Value("${myscoutee.remote.event-invitation-notifications.url}") URI origin,
            @Value("${myscoutee.remote.event-invitation-notifications.command-token}") String token,
            @Value("${myscoutee.remote.event-invitation-notifications.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-invitation-notifications.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-invitation-notifications.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventInvitationNotifications(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
