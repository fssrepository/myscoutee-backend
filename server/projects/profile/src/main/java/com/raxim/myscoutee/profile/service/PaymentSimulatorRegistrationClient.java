package com.raxim.myscoutee.profile.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class PaymentSimulatorRegistrationClient {
    private final boolean enabled;
    private final String baseUrl;
    private final String apiKey;
    private final String callbackUrl;
    private final RestTemplate restTemplate;

    @Autowired
    public PaymentSimulatorRegistrationClient(
            @Value("${payment.simulator.enabled:false}") boolean enabled,
            @Value("${payment.simulator.baseUrl:}") String baseUrl,
            @Value("${payment.simulator.apiKey:}") String apiKey,
            @Value("${payment.simulator.registrationCallbackUrl:}") String callbackUrl) {
        this(enabled, baseUrl, apiKey, callbackUrl, new RestTemplate());
    }

    PaymentSimulatorRegistrationClient(
            boolean enabled,
            String baseUrl,
            String apiKey,
            String callbackUrl,
            RestTemplate restTemplate) {
        this.enabled = enabled;
        this.baseUrl = trimTrailingSlash(baseUrl);
        this.apiKey = safeText(apiKey);
        this.callbackUrl = safeText(callbackUrl);
        this.restTemplate = restTemplate;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public GatewayRegistration begin(
            String registrationId,
            String userReference,
            String provider,
            String expiresAtIso) {
        requireConfigured();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("registration_id", required(registrationId, "registration id"));
        body.put("user_reference", required(userReference, "user reference"));
        body.put("provider", required(provider, "provider"));
        body.put("expires_at", required(expiresAtIso, "registration expiry"));
        body.put("callback_url", required(callbackUrl, "registration callback URL"));
        ResponseEntity<GatewayRegistration> response = restTemplate.exchange(
                baseUrl + "/myscoutee/v1/payment-method-registrations",
                HttpMethod.POST,
                new HttpEntity<>(body, headers()),
                GatewayRegistration.class);
        return requireBody(response.getBody());
    }

    public GatewayRegistration retrieve(String registrationId) {
        requireConfigured();
        ResponseEntity<GatewayRegistration> response = restTemplate.exchange(
                baseUrl + "/myscoutee/v1/payment-method-registrations/" + required(registrationId, "registration id"),
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                GatewayRegistration.class);
        return requireBody(response.getBody());
    }

    public GatewayConfiguration configuration() {
        requireConfigured();
        ResponseEntity<GatewayConfiguration> response = restTemplate.exchange(
                baseUrl + "/myscoutee/v1/configuration",
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                GatewayConfiguration.class);
        GatewayConfiguration configuration = response.getBody();
        if (configuration == null || !StringUtils.hasText(configuration.provider())) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment simulator returned an invalid configuration.");
        }
        return configuration;
    }

    public boolean authorizesCallback(String authorization) {
        String supplied = safeText(authorization);
        if (supplied.startsWith("Bearer ")) {
            supplied = supplied.substring("Bearer ".length()).trim();
        }
        return enabled
                && StringUtils.hasText(apiKey)
                && MessageDigest.isEqual(
                        supplied.getBytes(StandardCharsets.UTF_8),
                        apiKey.getBytes(StandardCharsets.UTF_8));
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private GatewayRegistration requireBody(GatewayRegistration value) {
        if (value == null || !StringUtils.hasText(value.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned an invalid registration response.");
        }
        return value;
    }

    private void requireConfigured() {
        if (!enabled || !StringUtils.hasText(baseUrl) || !StringUtils.hasText(apiKey) || !StringUtils.hasText(callbackUrl)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Saved-card registration is not enabled for this deployment.");
        }
        if (!apiKey.startsWith("sk_test_") || apiKey.startsWith("sk_live_")) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The development payment simulator requires a test API key.");
        }
    }

    private String required(String value, String label) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            throw new IllegalArgumentException(label + " is required.");
        }
        return normalized;
    }

    private static String trimTrailingSlash(String value) {
        return safeText(value).replaceAll("/+$", "");
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    public record GatewayRegistration(
            String id,
            String provider,
            String status,
            String url,
            String providerToken,
            String brand,
            String last4,
            Integer expiryMonth,
            Integer expiryYear,
            String cardholderName,
            String expiresAt) {}

    public record GatewayConfiguration(String provider, boolean requires3ds) {}
}
