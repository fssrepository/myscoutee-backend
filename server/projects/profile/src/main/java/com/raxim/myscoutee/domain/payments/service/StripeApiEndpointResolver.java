package com.raxim.myscoutee.domain.payments.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

@Service
public class StripeApiEndpointResolver {

    private final Environment environment;
    private final String configuredBaseUrl;
    private final boolean testGatewayEnabled;

    public StripeApiEndpointResolver(
            Environment environment,
            @Value("${payment.stripe.apiBaseUrl:}") String configuredBaseUrl,
            @Value("${payment.stripe.testGatewayEnabled:false}") boolean testGatewayEnabled) {
        this.environment = environment;
        this.configuredBaseUrl = configuredBaseUrl;
        this.testGatewayEnabled = testGatewayEnabled;
    }

    public String resolve(String apiKey) {
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            return null;
        }
        String baseUrl = trim(configuredBaseUrl);
        if (!StringUtils.hasText(baseUrl)) {
            throw unavailable(
                    "The demo Stripe payment simulator endpoint is not configured.");
        }
        if (!testGatewayEnabled) {
            throw unavailable(
                    "The demo Stripe payment simulator is disabled.");
        }
        if (!StringUtils.hasText(apiKey)
                || !apiKey.trim().startsWith("sk_test_")
                || apiKey.trim().startsWith("sk_live_")) {
            throw unavailable(
                    "The Stripe payment simulator requires a test API key.");
        }
        return PaymentSimulatorEndpoint.validate(baseUrl, "Stripe");
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message);
    }
}
