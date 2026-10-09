package com.raxim.myscoutee.microservices.transport.campaigns;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns campaigns to a different owner. */
@Configuration(proxyBeanMethods = false)
public class CampaignCatalogClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCampaignCatalog remoteCampaignCatalog(
            @Value("${myscoutee.remote.campaign-catalog.url}") URI origin,
            @Value("${myscoutee.remote.campaign-catalog.read-token}") String token,
            @Value("${myscoutee.remote.campaign-catalog.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.campaign-catalog.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.campaign-catalog.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCampaignCatalog(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
