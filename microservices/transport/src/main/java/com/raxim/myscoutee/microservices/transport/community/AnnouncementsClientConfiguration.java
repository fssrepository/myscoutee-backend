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
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class AnnouncementsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAnnouncements remoteAnnouncements(
            @Value("${myscoutee.remote.announcements.url}") URI origin,
            @Value("${myscoutee.remote.announcements.command-token}") String token,
            @Value("${myscoutee.remote.announcements.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.announcements.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.announcements.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteAnnouncements(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
