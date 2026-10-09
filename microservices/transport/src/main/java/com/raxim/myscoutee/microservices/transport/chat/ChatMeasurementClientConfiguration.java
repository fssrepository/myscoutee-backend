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
public class ChatMeasurementClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteChatMeasurement remoteChatMeasurement(
            @Value("${myscoutee.remote.chat-measurement.url}") URI origin,
            @Value("${myscoutee.remote.chat-measurement.read-token}") String token,
            @Value("${myscoutee.remote.chat-measurement.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.chat-measurement.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.chat-measurement.request-timeout:PT10M}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteChatMeasurement(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
