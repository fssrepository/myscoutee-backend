package com.raxim.myscoutee.microservices.transport.operator;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns operator to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class OperatorReportsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemoteOperatorReports remoteOperatorReports(
            @Value("${myscoutee.remote.operator-reports.url}") URI origin,
            @Value("${myscoutee.remote.operator-reports.read-token}") String token,
            @Value("${myscoutee.remote.operator-reports.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.operator-reports.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.operator-reports.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemoteOperatorReports(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
    @Bean com.raxim.myscoutee.domain.operator.api.MeasurementReports measurementReports(RemoteOperatorReports client) { return client::measurements; }
    @Bean com.raxim.myscoutee.domain.operator.api.RevenueReports revenueReports(RemoteOperatorReports client) { return client::revenue; }
}
