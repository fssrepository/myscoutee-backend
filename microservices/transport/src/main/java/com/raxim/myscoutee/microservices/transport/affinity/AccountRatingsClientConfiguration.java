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
public class AccountRatingsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAccountRatings remoteAccountRatings(
            @Value("${myscoutee.remote.account-ratings.url}") URI origin,
            @Value("${myscoutee.remote.account-ratings.read-token}") String token,
            @Value("${myscoutee.remote.account-ratings.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.account-ratings.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.account-ratings.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAccountRatings(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
