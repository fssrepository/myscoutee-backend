package com.raxim.myscoutee.microservices.transport.feedback;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns feedback to a different owner. */
@Configuration(proxyBeanMethods = false)
public class FeedbackPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFeedbackPrivacy remoteFeedbackPrivacy(
            @Value("${myscoutee.remote.feedback-privacy.url}") URI origin,
            @Value("${myscoutee.remote.feedback-privacy.command-token}") String token,
            @Value("${myscoutee.remote.feedback-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.feedback-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.feedback-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFeedbackPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
