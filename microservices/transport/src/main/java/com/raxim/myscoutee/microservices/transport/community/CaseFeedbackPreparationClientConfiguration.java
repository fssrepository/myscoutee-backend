package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns community to a different owner. */
@Configuration(proxyBeanMethods = false)
public class CaseFeedbackPreparationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCaseFeedbackPreparation remoteCaseFeedbackPreparation(
            @Value("${myscoutee.remote.case-feedback-preparation.url}") URI origin,
            @Value("${myscoutee.remote.case-feedback-preparation.command-token}") String token,
            @Value("${myscoutee.remote.case-feedback-preparation.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.case-feedback-preparation.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.case-feedback-preparation.request-timeout:PT30S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCaseFeedbackPreparation(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
