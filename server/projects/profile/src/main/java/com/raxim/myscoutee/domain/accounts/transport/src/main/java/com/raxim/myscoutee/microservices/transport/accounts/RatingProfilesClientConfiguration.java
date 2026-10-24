package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns accounts to a different owner. */
@Configuration(proxyBeanMethods = false)
public class RatingProfilesClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteRatingProfiles remoteRatingProfiles(
            @Value("${myscoutee.remote.rating-profiles.url}") URI origin,
            @Value("${myscoutee.remote.rating-profiles.read-token}") String token,
            @Value("${myscoutee.remote.rating-profiles.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.rating-profiles.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.rating-profiles.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteRatingProfiles(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
