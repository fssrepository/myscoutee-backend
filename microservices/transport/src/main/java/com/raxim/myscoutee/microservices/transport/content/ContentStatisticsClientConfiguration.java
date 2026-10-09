package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns content to a different owner. */
@Configuration(proxyBeanMethods = false)
public class ContentStatisticsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteContentStatistics remoteContentStatistics(
            @Value("${myscoutee.remote.content-statistics.url}") URI origin,
            @Value("${myscoutee.remote.content-statistics.read-token}") String token,
            @Value("${myscoutee.remote.content-statistics.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.content-statistics.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.content-statistics.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteContentStatistics(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
