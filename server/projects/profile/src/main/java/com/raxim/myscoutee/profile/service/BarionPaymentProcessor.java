package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver.PaymentRouting;

@Service
public class BarionPaymentProcessor implements PaymentProcessor {
    private static final Pattern PAYMENT_ID_PATTERN = Pattern.compile(
            "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");

    private final DeploymentPaymentCredentialResolver credentialResolver;
    private final DeploymentPaymentRoutingResolver routingResolver;
    private final BarionApiEndpointResolver endpointResolver;
    private final String environmentPosKey;
    private final RestTemplate restTemplate;

    public BarionPaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            BarionApiEndpointResolver endpointResolver,
            @Value("${payment.barion.apiKey:}") String environmentPosKey) {
        this(credentialResolver, routingResolver, endpointResolver, environmentPosKey, new RestTemplate());
    }

    public BarionPaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            String environmentPosKey) {
        this(credentialResolver, routingResolver, null, environmentPosKey, new RestTemplate());
    }

    BarionPaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            BarionApiEndpointResolver endpointResolver,
            String environmentPosKey,
            RestTemplate restTemplate) {
        this.credentialResolver = credentialResolver;
        this.routingResolver = routingResolver;
        this.endpointResolver = endpointResolver;
        this.environmentPosKey = environmentPosKey;
        this.restTemplate = restTemplate;
    }

    @Override
    public String getType() {
        return "barion";
    }

    @Override
    public Capabilities capabilities() {
        return new Capabilities(
                true,
                true,
                true,
                Duration.ofDays(7),
                Set.of("bank_card"));
    }

    @Override
    public AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId) {
        String paymentSessionId = required(internalPaymentSessionId, "internal payment session id");
        String posKey = requirePosKey();
        PaymentRouting routing = routingResolver.require(getType());
        List<Map<String, Object>> items = request.lineItems().stream()
                .map(item -> Map.<String, Object>of(
                        "Name", item.label(),
                        "Description", item.detail(),
                        "Quantity", 1,
                        "Unit", "pcs",
                        "UnitPrice", BigDecimal.valueOf(item.amount()),
                        "ItemTotal", BigDecimal.valueOf(item.amount())))
                .toList();
        Map<String, Object> barionRequest = new LinkedHashMap<>();
        barionRequest.put("POSKey", posKey);
        barionRequest.put("PaymentType", "DelayedCapture");
        barionRequest.put("DelayedCapturePeriod", "7.00:00:00");
        barionRequest.put("GuestCheckOut", true);
        barionRequest.put("FundingSources", List.of("BankCard"));
        barionRequest.put("PaymentRequestId", "myscoutee:" + paymentSessionId);
        barionRequest.put("Locale", "en-US");
        barionRequest.put("Currency", request.currency().toUpperCase(Locale.ROOT));
        barionRequest.put("Transactions", List.of(Map.of(
                "POSTransactionId", "myscoutee:" + paymentSessionId + ":0",
                "Payee", routing.merchantAccount(),
                "Total", BigDecimal.valueOf(request.totalAmount()),
                "Items", items)));
        barionRequest.put("RedirectUrl", routing.successUrl(getType()));
        barionRequest.put("CallbackUrl", routing.callbackUrl(getType()));

        Map<String, Object> response = post("/v2/Payment/Start", barionRequest);
        String paymentId = paymentId(response.get("PaymentId"));
        String gatewayUrl = text(response.get("GatewayUrl"));
        if (!StringUtils.hasText(gatewayUrl)) {
            throw new RuntimeException("Barion delayed-capture start failed: " + sanitizedProviderError(response));
        }
        return new AuthorizationResult(
                getType(),
                paymentId,
                paymentId,
                AuthorizationStatus.CUSTOMER_ACTION_REQUIRED,
                BigDecimal.valueOf(request.totalAmount()),
                request.currency(),
                gatewayUrl,
                null,
                text(response.get("Status")));
    }

    @Override
    public AuthorizationResult retrieveAuthorization(
            String gatewayCheckoutId,
            String gatewayAuthorizationId) {
        String paymentId = paymentId(
                StringUtils.hasText(gatewayAuthorizationId) ? gatewayAuthorizationId : gatewayCheckoutId,
                "Barion PaymentId");
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-pos-key", requirePosKey());
        ResponseEntity<Map> response = restTemplate.exchange(
                apiBaseUrl() + "/v4/payment/" + paymentId + "/paymentstate",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class);
        return toAuthorizationResult(paymentId, castMap(response.getBody()));
    }

    @Override
    public AuthorizationResult captureAuthorization(
            String gatewayAuthorizationId,
            BigDecimal amount,
            String idempotencyKey) {
        required(idempotencyKey, "capture idempotency key");
        AuthorizationResult current = retrieveAuthorization(null, gatewayAuthorizationId);
        if (current.status() == AuthorizationStatus.CAPTURED) {
            return current;
        }
        if (current.status() != AuthorizationStatus.AUTHORIZED) {
            throw new IllegalStateException("Only an authorized Barion payment can be captured.");
        }
        Map<String, Object> state = getPaymentState(gatewayAuthorizationId);
        BigDecimal authorizedTotal = decimal(state.get("Total"));
        BigDecimal targetTotal = amount == null ? authorizedTotal : amount;
        if (targetTotal.signum() < 0 || targetTotal.compareTo(authorizedTotal) > 0) {
            throw new IllegalArgumentException("Barion capture amount exceeds the authorized total.");
        }
        List<Map<String, Object>> transactions = captureTransactions(state, targetTotal);
        Map<String, Object> response = post("/v2/Payment/Capture", Map.of(
                "POSKey", requirePosKey(),
                "PaymentId", paymentId(gatewayAuthorizationId, "Barion PaymentId"),
                "Transactions", transactions));
        assertSuccessful(response, "capture");
        return retrieveAuthorization(null, gatewayAuthorizationId);
    }

    @Override
    public AuthorizationResult releaseAuthorization(
            String gatewayAuthorizationId,
            String idempotencyKey) {
        required(idempotencyKey, "release idempotency key");
        AuthorizationResult current = retrieveAuthorization(null, gatewayAuthorizationId);
        if (current.status() == AuthorizationStatus.RELEASED) {
            return current;
        }
        if (current.status() != AuthorizationStatus.AUTHORIZED) {
            throw new IllegalStateException("Only an authorized Barion payment can be released.");
        }
        Map<String, Object> response = post("/v2/Payment/CancelAuthorization", Map.of(
                "POSKey", requirePosKey(),
                "PaymentId", paymentId(gatewayAuthorizationId, "Barion PaymentId")));
        assertSuccessful(response, "authorization release");
        return retrieveAuthorization(null, gatewayAuthorizationId);
    }

    private Map<String, Object> getPaymentState(String paymentId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-pos-key", requirePosKey());
        ResponseEntity<Map> response = restTemplate.exchange(
                apiBaseUrl() + "/v4/payment/" + paymentId(paymentId, "Barion PaymentId") + "/paymentstate",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class);
        return castMap(response.getBody());
    }

    private AuthorizationResult toAuthorizationResult(String paymentId, Map<String, Object> response) {
        String providerStatus = text(response.get("Status"));
        List<Map<String, Object>> transactions = mapList(response.get("Transactions"));
        boolean reversed = !transactions.isEmpty() && transactions.stream()
                .allMatch(item -> "reversed".equals(lower(item.get("Status"))));
        AuthorizationStatus status = switch (providerStatus.toLowerCase(Locale.ROOT)) {
            case "prepared", "started", "inprogress" -> AuthorizationStatus.CUSTOMER_ACTION_REQUIRED;
            case "authorized" -> AuthorizationStatus.AUTHORIZED;
            case "succeeded" -> reversed ? AuthorizationStatus.RELEASED : AuthorizationStatus.CAPTURED;
            case "expired" -> AuthorizationStatus.EXPIRED;
            case "canceled", "failed" -> AuthorizationStatus.FAILED;
            default -> AuthorizationStatus.AUTHORIZATION_PENDING;
        };
        return new AuthorizationResult(
                getType(),
                paymentId,
                paymentId,
                status,
                decimal(response.get("Total")),
                text(response.get("Currency")),
                text(response.get("GatewayUrl")),
                text(response.get("DelayedCaptureUntil")),
                providerStatus);
    }

    private List<Map<String, Object>> captureTransactions(
            Map<String, Object> state,
            BigDecimal targetTotal) {
        List<Map<String, Object>> source = mapList(state.get("Transactions"));
        if (source.isEmpty()) {
            throw new IllegalStateException("Barion PaymentState did not return transactions.");
        }
        BigDecimal remaining = targetTotal;
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> transaction : source) {
            BigDecimal authorized = decimal(transaction.get("Total"));
            BigDecimal captured = remaining.min(authorized).max(BigDecimal.ZERO);
            result.add(Map.of(
                    "TransactionId", required(text(transaction.get("TransactionId")), "Barion TransactionId"),
                    "Total", captured));
            remaining = remaining.subtract(captured);
        }
        if (remaining.signum() != 0) {
            throw new IllegalArgumentException("Barion capture amount could not be allocated to all transactions.");
        }
        return result;
    }

    private Map<String, Object> post(String path, Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<Map> response = restTemplate.exchange(
                apiBaseUrl() + path,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class);
        return castMap(response.getBody());
    }

    private String apiBaseUrl() {
        return endpointResolver == null ? "https://api.barion.com" : endpointResolver.resolve();
    }

    private void assertSuccessful(Map<String, Object> response, String operation) {
        if (!Boolean.TRUE.equals(response.get("IsSuccessful"))) {
            throw new RuntimeException("Barion " + operation + " failed: " + sanitizedProviderError(response));
        }
    }

    private String requirePosKey() {
        String posKey = credentialResolver.resolve(getType(), environmentPosKey);
        if (!StringUtils.hasText(posKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Barion payment credential is not configured.");
        }
        return posKey.trim();
    }

    private String required(String value, String label) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(label + " is required.");
        }
        return value.trim();
    }

    private String paymentId(Object value) {
        return paymentId(text(value), "Barion PaymentId");
    }

    private String paymentId(String value, String label) {
        String normalized = required(value, label);
        if (!PAYMENT_ID_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException(label + " must be a GUID.");
        }
        return normalized;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> castMap(Object value) {
        return value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
    }

    private List<Map<String, Object>> mapList(Object value) {
        if (!(value instanceof List<?> list)) {
            return List.of();
        }
        return list.stream().map(this::castMap).toList();
    }

    private BigDecimal decimal(Object value) {
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        if (value instanceof Number number) {
            return new BigDecimal(number.toString());
        }
        try {
            return new BigDecimal(text(value));
        } catch (NumberFormatException exception) {
            return BigDecimal.ZERO;
        }
    }

    private String text(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    private String lower(Object value) {
        return text(value).toLowerCase(Locale.ROOT);
    }

    private String sanitizedProviderError(Map<String, Object> response) {
        Object errors = response == null ? null : response.get("Errors");
        return errors == null ? "missing response fields" : errors.toString();
    }
}
