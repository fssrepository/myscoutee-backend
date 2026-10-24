package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns payments to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class PaymentRefundsClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePaymentRefunds remotePaymentRefunds(
            @Value("${myscoutee.remote.payment-refunds.url}") URI origin,
            @Value("${myscoutee.remote.payment-refunds.command-token}") String token,
            @Value("${myscoutee.remote.payment-refunds.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.payment-refunds.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.payment-refunds.request-timeout:PT30S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemotePaymentRefunds(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}
