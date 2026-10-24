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
public class CampaignGraphsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCampaignGraphs remoteCampaignGraphs(
            @Value("${myscoutee.remote.campaign-graphs.url}") URI origin,
            @Value("${myscoutee.remote.campaign-graphs.read-token}") String token,
            @Value("${myscoutee.remote.campaign-graphs.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.campaign-graphs.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.campaign-graphs.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCampaignGraphs(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
