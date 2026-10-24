package com.raxim.myscoutee.microservices.transport.chat;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns chat to a different owner. */
@Configuration(proxyBeanMethods = false)
public class EventConversationsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteEventConversations remoteEventConversations(
            @Value("${myscoutee.remote.event-conversations.url}") URI origin,
            @Value("${myscoutee.remote.event-conversations.command-token}") String token,
            @Value("${myscoutee.remote.event-conversations.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.event-conversations.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.event-conversations.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteEventConversations(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
