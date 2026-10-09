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
public class AnnouncementDirectoryClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteAnnouncementDirectory remoteAnnouncementDirectory(
            @Value("${myscoutee.remote.announcement-directory.url}") URI origin,
            @Value("${myscoutee.remote.announcement-directory.read-token}") String token,
            @Value("${myscoutee.remote.announcement-directory.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.announcement-directory.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.announcement-directory.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteAnnouncementDirectory(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
