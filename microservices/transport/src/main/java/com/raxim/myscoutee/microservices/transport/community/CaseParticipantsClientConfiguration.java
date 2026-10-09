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
public class CaseParticipantsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteCaseParticipants remoteCaseParticipants(
            @Value("${myscoutee.remote.case-participants.url}") URI origin,
            @Value("${myscoutee.remote.case-participants.read-token}") String token,
            @Value("${myscoutee.remote.case-participants.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.case-participants.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.case-participants.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemoteCaseParticipants(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
