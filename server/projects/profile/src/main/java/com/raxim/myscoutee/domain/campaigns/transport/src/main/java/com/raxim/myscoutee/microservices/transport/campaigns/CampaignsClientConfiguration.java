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
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class CampaignsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCampaigns remoteCampaigns(
            @Value("${myscoutee.remote.campaigns.url}") URI origin,
            @Value("${myscoutee.remote.campaigns.command-token}") String token,
            @Value("${myscoutee.remote.campaigns.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.campaigns.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.campaigns.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteCampaigns(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
