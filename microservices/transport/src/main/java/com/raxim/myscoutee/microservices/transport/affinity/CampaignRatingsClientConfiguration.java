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
public class CampaignRatingsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCampaignRatings remoteCampaignRatings(
            @Value("${myscoutee.remote.campaign-ratings.url}") URI origin,
            @Value("${myscoutee.remote.campaign-ratings.read-token}") String token,
            @Value("${myscoutee.remote.campaign-ratings.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.campaign-ratings.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.campaign-ratings.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCampaignRatings(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
