package com.raxim.myscoutee.domain.payments.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

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
    private static final Set<String> DEVELOPMENT_SIMULATOR_HOSTS = Set.of(
            "localhost",
            "127.0.0.1",
            "::1",
            "payment-simulator");

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
        try {
            URI uri = new URI(baseUrl);
            String host = uri.getHost();
            if (!uri.isAbsolute()
                    || host == null
                    || !("http".equalsIgnoreCase(uri.getScheme())
                            || "https".equalsIgnoreCase(uri.getScheme()))
                    || !DEVELOPMENT_SIMULATOR_HOSTS.contains(host.toLowerCase())
                    || uri.getUserInfo() != null
                    || uri.getQuery() != null
                    || uri.getFragment() != null) {
                throw unavailable(
                        "The demo Stripe simulator URL is invalid or uses a non-local host.");
            }
            return baseUrl.replaceAll("/+$", "");
        } catch (URISyntaxException exception) {
            throw unavailable(
                    "The demo Stripe simulator URL is invalid.");
        }
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
