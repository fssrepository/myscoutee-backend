package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
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
                false,
                true,
                false,
                Duration.ZERO,
                Set.of("bank_card"));
    }

    @Override
    public AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId) {
        return prepareAuthorization(request, internalPaymentSessionId, null);
    }

    @Override
    public AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId,
            String providerPaymentMethodReference) {
        String paymentSessionId = required(internalPaymentSessionId, "internal payment session id");
        String posKey = requirePosKey();
        PaymentRouting routing = routingResolver.require(getType());
        List<Map<String, Object>> items = request.lineItems().stream()
                .map(item -> Map.<String, Object>of(
                        "Name", item.label(),
                        // Checkout detail is optional; Barion requires a description.
                        "Description", StringUtils.hasText(item.detail()) ? item.detail() : item.label(),
                        "Quantity", 1,
                        "Unit", "pcs",
                        "UnitPrice", BigDecimal.valueOf(item.amount()),
                        "ItemTotal", BigDecimal.valueOf(item.amount())))
                .toList();
        Map<String, Object> barionRequest = new LinkedHashMap<>();
        barionRequest.put("POSKey", posKey);
        barionRequest.put("PaymentType", "Immediate");
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
        if (StringUtils.hasText(providerPaymentMethodReference)) {
            barionRequest.put("RecurrenceType", "OneClickPayment");
            barionRequest.put("TraceId", providerPaymentMethodReference.trim());
        }

        Map<String, Object> response = post("/v2/Payment/Start", barionRequest);
        String paymentId = paymentId(response.get("PaymentId"));
        String gatewayUrl = text(response.get("GatewayUrl"));
        String providerStatus = text(response.get("Status"));
        AuthorizationStatus status = switch (providerStatus.toLowerCase(Locale.ROOT)) {
            case "succeeded" -> AuthorizationStatus.CAPTURED;
            case "authorized" -> AuthorizationStatus.AUTHORIZED;
            case "failed", "canceled" -> AuthorizationStatus.FAILED;
            default -> AuthorizationStatus.CUSTOMER_ACTION_REQUIRED;
        };
        if (status == AuthorizationStatus.CUSTOMER_ACTION_REQUIRED && !StringUtils.hasText(gatewayUrl)) {
            throw new RuntimeException("Barion payment start failed: " + sanitizedProviderError(response));
        }
        return new AuthorizationResult(
                getType(),
                paymentId,
                paymentId,
                status,
                BigDecimal.valueOf(request.totalAmount()),
                request.currency(),
                gatewayUrl,
                null,
                providerStatus);
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

    @Override
    public RefundResult refundCapturedPayment(
            String gatewayAuthorizationId,
            BigDecimal amount,
            String currency,
            String idempotencyKey) {
        String paymentId = paymentId(gatewayAuthorizationId, "Barion PaymentId");
        BigDecimal requestedAmount = amount == null ? BigDecimal.ZERO : amount;
        if (requestedAmount.signum() <= 0) {
            throw new IllegalArgumentException("Barion refund amount must be positive.");
        }
        Map<String, Object> state = getPaymentState(paymentId);
        if (!"succeeded".equals(lower(state.get("Status")))) {
            throw new IllegalStateException("Only a succeeded Barion payment can be refunded.");
        }
        String idempotencyGuid = UUID.nameUUIDFromBytes(
                required(idempotencyKey, "refund idempotency key").getBytes(StandardCharsets.UTF_8)).toString();
        List<Map<String, Object>> refunds = refundTransactions(state, requestedAmount, idempotencyGuid);
        Map<String, Object> response = post(
                "/v2/Payment/Refund",
                Map.of(
                        "POSKey", requirePosKey(),
                        "PaymentId", paymentId,
                        "TransactionsToRefund", refunds),
                idempotencyGuid);
        List<Map<String, Object>> errors = mapList(response.get("Errors"));
        if (!errors.isEmpty()) {
            throw new RuntimeException("Barion refund failed: " + sanitizedProviderError(response));
        }
        List<Map<String, Object>> refundedTransactions = mapList(response.get("RefundedTransactions"));
        boolean succeeded = !refundedTransactions.isEmpty()
                && refundedTransactions.stream().allMatch(item -> "succeeded".equals(lower(item.get("Status"))));
        BigDecimal refundedAmount = refundedTransactions.stream()
                .map(item -> decimal(item.get("Total")))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new RefundResult(
                getType(),
                paymentId,
                idempotencyGuid,
                succeeded ? RefundStatus.SUCCEEDED : RefundStatus.FAILED,
                refundedAmount,
                StringUtils.hasText(currency) ? currency.trim().toUpperCase(Locale.ROOT) : text(state.get("Currency")),
                succeeded ? "Succeeded" : "Failed");
    }

    @Override
    public RefundResult retrieveRefund(String gatewayRefundId) {
        throw new UnsupportedOperationException("Barion refunds complete synchronously and are not retrieved by refund id.");
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

    private List<Map<String, Object>> refundTransactions(
            Map<String, Object> state,
            BigDecimal targetTotal,
            String refundKey) {
        List<Map<String, Object>> source = mapList(state.get("Transactions")).stream()
                .filter(transaction -> Set.of("cardpayment", "shop", "banktransferpayment")
                        .contains(lower(transaction.get("TransactionType"))))
                .toList();
        if (source.isEmpty()) {
            throw new IllegalStateException("Barion PaymentState did not return refundable transactions.");
        }
        BigDecimal remaining = targetTotal;
        List<Map<String, Object>> result = new ArrayList<>();
        for (int index = 0; index < source.size() && remaining.signum() > 0; index++) {
            Map<String, Object> transaction = source.get(index);
            BigDecimal refundable = decimal(transaction.get("Total"));
            BigDecimal refunded = remaining.min(refundable).max(BigDecimal.ZERO);
            if (refunded.signum() <= 0) continue;
            result.add(Map.of(
                    "TransactionId", required(text(transaction.get("TransactionId")), "Barion TransactionId"),
                    "POSTransactionId", "myscoutee-refund-" + refundKey + "-" + index,
                    "AmountToRefund", refunded,
                    "Comment", "MyScoutee approved refund"));
            remaining = remaining.subtract(refunded);
        }
        if (remaining.signum() != 0) {
            throw new IllegalArgumentException("Barion refund amount exceeds the refundable payment total.");
        }
        return result;
    }

    private Map<String, Object> post(String path, Map<String, Object> body) {
        return post(path, body, null);
    }

    private Map<String, Object> post(String path, Map<String, Object> body, String idempotencyKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (StringUtils.hasText(idempotencyKey)) {
            headers.set("Idempotency-Key", idempotencyKey.trim());
        }
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
