package com.raxim.myscoutee.profile.service;

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
public class BarionApiEndpointResolver {
    private static final String PRODUCTION_API_BASE_URL = "https://api.barion.com";
    private static final Set<String> DEVELOPMENT_SIMULATOR_HOSTS = Set.of(
            "localhost",
            "127.0.0.1",
            "::1",
            "payment-simulator");

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
        try {
            URI uri = new URI(baseUrl);
            String host = uri.getHost();
            if (!uri.isAbsolute()
                    || host == null
                    || !("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme()))
                    || !DEVELOPMENT_SIMULATOR_HOSTS.contains(host.toLowerCase())
                    || uri.getUserInfo() != null
                    || uri.getQuery() != null
                    || uri.getFragment() != null) {
                throw unavailable(
                        "The demo Barion simulator URL is invalid or uses a non-local host.");
            }
            return baseUrl.replaceAll("/+$", "");
        } catch (URISyntaxException exception) {
            throw unavailable("The demo Barion simulator URL is invalid.");
        }
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, message);
    }
}
