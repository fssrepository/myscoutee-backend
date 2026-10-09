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
public class PaymentPrivacyClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePaymentPrivacy remotePaymentPrivacy(
            @Value("${myscoutee.remote.payment-privacy.url}") URI origin,
            @Value("${myscoutee.remote.payment-privacy.command-token}") String token,
            @Value("${myscoutee.remote.payment-privacy.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.payment-privacy.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.payment-privacy.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemotePaymentPrivacy(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
