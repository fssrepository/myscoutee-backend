package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class TicketReadsClientConfiguration {
    @Bean(destroyMethod="close") RemoteTicketReads remoteTicketReads(
            @Value("${myscoutee.remote.ticket-reads.url}") URI origin,
            @Value("${myscoutee.remote.ticket-reads.read-token}") String token,
            @Value("${myscoutee.remote.ticket-reads.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.ticket-reads.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.ticket-reads.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteTicketReads(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
