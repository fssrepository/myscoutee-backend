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
public class PaymentSimulatorConfigurationClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePaymentSimulatorConfiguration remotePaymentSimulatorConfiguration(
            @Value("${myscoutee.remote.payment-simulator-configuration.url}") URI origin,
            @Value("${myscoutee.remote.payment-simulator-configuration.read-token}") String token,
            @Value("${myscoutee.remote.payment-simulator-configuration.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.payment-simulator-configuration.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.payment-simulator-configuration.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics) {
        return new RemotePaymentSimulatorConfiguration(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
}
