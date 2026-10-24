package com.raxim.myscoutee.microservices.transport.feedback;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns events to a different owner. */
@Configuration(proxyBeanMethods = false)
public class FeedbackEligibilityClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFeedbackEligibility remoteFeedbackEligibility(
            @Value("${myscoutee.remote.feedback-eligibility.url}") URI origin,
            @Value("${myscoutee.remote.feedback-eligibility.command-token}") String token,
            @Value("${myscoutee.remote.feedback-eligibility.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.feedback-eligibility.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.feedback-eligibility.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFeedbackEligibility(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
