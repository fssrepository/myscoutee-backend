package com.raxim.myscoutee.domain.payments.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Existing local simulator URL policy shared by the two provider-specific resolvers. */
final class PaymentSimulatorEndpoint {
    private PaymentSimulatorEndpoint() {}
    private static final Set<String> DEVELOPMENT_SIMULATOR_HOSTS = Set.of("localhost", "127.0.0.1", "::1", "payment-simulator");
    static String validate(String baseUrl, String provider) {
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
                        "The demo " + provider + " simulator URL is invalid or uses a non-local host.");
            }
            return baseUrl.transform(edgeText -> org.springframework.util.StringUtils.trimTrailingCharacter(edgeText, '/'));
        } catch (URISyntaxException exception) {
            throw unavailable("The demo " + provider + " simulator URL is invalid.");
        }
    }
    private static ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, message);
    }
}
