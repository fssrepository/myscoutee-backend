package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.*;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;

@Configuration(proxyBeanMethods=false)
@Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class UserReportsClientConfiguration {
    @Bean(destroyMethod="close") RemoteUserReports remoteUserReports(
            @Value("${myscoutee.remote.user-reports.url}") URI origin,
            @Value("${myscoutee.remote.user-reports.command-token}") String token,
            @Value("${myscoutee.remote.user-reports.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.user-reports.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.user-reports.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        return new RemoteUserReports(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics,issuer);
    }
}
