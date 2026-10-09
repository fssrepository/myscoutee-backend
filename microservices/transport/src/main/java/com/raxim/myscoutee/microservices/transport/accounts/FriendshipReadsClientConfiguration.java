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
public class FriendshipReadsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteFriendshipReads remoteFriendshipReads(
            @Value("${myscoutee.remote.friendship-reads.url}") URI origin,
            @Value("${myscoutee.remote.friendship-reads.read-token}") String token,
            @Value("${myscoutee.remote.friendship-reads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.friendship-reads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.friendship-reads.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteFriendshipReads(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
