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
public class BarionApiEndpointResolver {
    private static final String PRODUCTION_API_BASE_URL = "https://api.barion.com";

    private final Environment environment;
    private final String configuredBaseUrl;
    private final boolean testGatewayEnabled;

    public BarionApiEndpointResolver(
            Environment environment,
            @Value("${payment.barion.apiBaseUrl:}") String configuredBaseUrl,
            @Value("${payment.barion.testGatewayEnabled:false}") boolean testGatewayEnabled) {
        this.environment = environment;
        this.configuredBaseUrl = configuredBaseUrl;
        this.testGatewayEnabled = testGatewayEnabled;
    }

    public String resolve() {
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            return PRODUCTION_API_BASE_URL;
        }
        String baseUrl = trim(configuredBaseUrl);
        if (!StringUtils.hasText(baseUrl)) {
            throw unavailable(
                    "The demo Barion payment simulator endpoint is not configured.");
        }
        if (!testGatewayEnabled) {
            throw unavailable(
                    "The demo Barion payment simulator is disabled.");
        }
        return PaymentSimulatorEndpoint.validate(baseUrl, "Barion");
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, message);
    }
}
