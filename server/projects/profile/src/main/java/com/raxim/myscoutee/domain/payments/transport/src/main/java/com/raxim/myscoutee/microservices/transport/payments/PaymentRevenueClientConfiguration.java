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
public class PaymentRevenueClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePaymentRevenue remotePaymentRevenue(
            @Value("${myscoutee.remote.payment-revenue.url}") URI origin,
            @Value("${myscoutee.remote.payment-revenue.read-token}") String token,
            @Value("${myscoutee.remote.payment-revenue.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.payment-revenue.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.payment-revenue.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemotePaymentRevenue(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
