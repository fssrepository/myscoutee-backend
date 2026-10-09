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
public class CaseConversationsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCaseConversations remoteCaseConversations(
            @Value("${myscoutee.remote.case-conversations.url}") URI origin,
            @Value("${myscoutee.remote.case-conversations.command-token}") String token,
            @Value("${myscoutee.remote.case-conversations.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.case-conversations.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.case-conversations.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCaseConversations(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
