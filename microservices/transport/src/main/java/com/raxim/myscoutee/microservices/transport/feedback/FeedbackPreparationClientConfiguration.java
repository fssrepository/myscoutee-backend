package com.raxim.myscoutee.microservices.transport.feedback;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns community to a different owner. */
@Configuration(proxyBeanMethods = false)
public class FeedbackPreparationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFeedbackPreparation remoteFeedbackPreparation(
            @Value("${myscoutee.remote.feedback-preparation.url}") URI origin,
            @Value("${myscoutee.remote.feedback-preparation.command-token}") String token,
            @Value("${myscoutee.remote.feedback-preparation.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.feedback-preparation.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.feedback-preparation.request-timeout:PT30S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFeedbackPreparation(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
