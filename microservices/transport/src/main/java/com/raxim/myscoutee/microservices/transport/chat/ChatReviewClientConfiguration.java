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
public class ChatReviewClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteChatReview remoteChatReview(
            @Value("${myscoutee.remote.chat-review.url}") URI origin,
            @Value("${myscoutee.remote.chat-review.read-token}") String token,
            @Value("${myscoutee.remote.chat-review.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.chat-review.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.chat-review.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteChatReview(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
