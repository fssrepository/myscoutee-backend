package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns events to a different owner. */
@Configuration(proxyBeanMethods = false)
public class CommunityMembershipReadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCommunityMembershipReads remoteCommunityMembershipReads(
            @Value("${myscoutee.remote.community-memberships.url}") URI origin,
            @Value("${myscoutee.remote.community-memberships.read-token}") String token,
            @Value("${myscoutee.remote.community-memberships.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.community-memberships.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.community-memberships.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCommunityMembershipReads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
