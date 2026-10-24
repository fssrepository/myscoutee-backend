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
public class FeedbackMeasurementClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFeedbackMeasurement remoteFeedbackMeasurement(
            @Value("${myscoutee.remote.feedback-measurement.url}") URI origin,
            @Value("${myscoutee.remote.feedback-measurement.read-token}") String token,
            @Value("${myscoutee.remote.feedback-measurement.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.feedback-measurement.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.feedback-measurement.request-timeout:PT10M}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFeedbackMeasurement(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
