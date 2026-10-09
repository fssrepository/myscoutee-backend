package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns affinity to a different owner. */
@Configuration(proxyBeanMethods = false)
public class RatingMeasurementClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteRatingMeasurement remoteRatingMeasurement(
            @Value("${myscoutee.remote.rating-measurement.url}") URI origin,
            @Value("${myscoutee.remote.rating-measurement.read-token}") String token,
            @Value("${myscoutee.remote.rating-measurement.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.rating-measurement.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.rating-measurement.request-timeout:PT10M}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteRatingMeasurement(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
