package com.raxim.myscoutee.microservices.transport.media;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns media to a different owner. */
@Configuration(proxyBeanMethods = false)
public class ImageUploadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteImageUploads remoteImageUploads(
            @Value("${myscoutee.remote.image-uploads.url}") URI origin,
            @Value("${myscoutee.remote.image-uploads.command-token}") String token,
            @Value("${myscoutee.remote.image-uploads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.image-uploads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.image-uploads.request-timeout:PT60S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteImageUploads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
