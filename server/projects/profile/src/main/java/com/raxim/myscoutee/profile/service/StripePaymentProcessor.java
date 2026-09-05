package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver.PaymentRouting;
import com.stripe.model.checkout.Session;
import com.stripe.model.PaymentIntent;
import com.stripe.net.RequestOptions;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCaptureParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import static java.util.Objects.requireNonNull;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class StripePaymentProcessor implements PaymentProcessor {

    private final DeploymentPaymentCredentialResolver credentialResolver;
    private final DeploymentPaymentRoutingResolver routingResolver;
    private final StripeApiEndpointResolver endpointResolver;
    private final String environmentApiKey;

    @Autowired
    public StripePaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            StripeApiEndpointResolver endpointResolver,
            @Value("${payment.stripe.apiKey:}") String environmentApiKey) {
        this.credentialResolver = credentialResolver;
        this.routingResolver = routingResolver;
        this.endpointResolver = endpointResolver;
        this.environmentApiKey = environmentApiKey;
    }

    public StripePaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            String environmentApiKey) {
        this(credentialResolver, routingResolver, null, environmentApiKey);
    }

    @Override
    public String getType() {
        return "stripe";
    }

    @Override
    public Capabilities capabilities() {
        return new Capabilities(
                true,
                true,
                true,
                Duration.ofDays(7),
                Set.of("card"));
    }

    @Override
    public AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String paymentSessionId) {
        String normalizedPaymentSessionId = requireNonNull(paymentSessionId, "paymentSessionId").trim();
        if (!StringUtils.hasText(normalizedPaymentSessionId)) {
            throw new IllegalArgumentException("A stable internal payment session id is required.");
        }
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        request.lineItems().forEach(item -> {
            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(item.currency().toLowerCase())
                            .setUnitAmount(toMinorUnits(item.amount(), item.currency()))
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.label())
                                    .setDescription(item.detail())
                                    .build()
                            )
                            .build()
                    )
                    .build()
            );
        });

        String apiKey = credentialResolver.resolve(getType(), environmentApiKey);
        if (!StringUtils.hasText(apiKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Stripe payment credential is not configured.");
        }
        PaymentRouting routing = routingResolver.require(getType());
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(routing.successUrl(getType()))
                .setCancelUrl(routing.cancelUrl(getType()))
                .setClientReferenceId(normalizedPaymentSessionId)
                .putMetadata("checkout_session_id", normalizedPaymentSessionId)
                .putMetadata("source_id", request.sourceId())
                .putMetadata("user_id", request.userId())
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .setCaptureMethod(SessionCreateParams.PaymentIntentData.CaptureMethod.MANUAL)
                        .setSetupFutureUsage(SessionCreateParams.PaymentIntentData.SetupFutureUsage.OFF_SESSION)
                        .putMetadata("checkout_session_id", normalizedPaymentSessionId)
                        .putMetadata("source_id", request.sourceId())
                        .putMetadata("user_id", request.userId())
                        .build())
                .addAllLineItem(lineItems)
                .build();

            RequestOptions requestOptions = requestOptions(apiKey, "myscoutee:checkout:" + normalizedPaymentSessionId);
            Session session = Session.create(params, requestOptions);

            return new AuthorizationResult(
                    getType(),
                    session.getId(),
                    session.getPaymentIntent(),
                    AuthorizationStatus.CUSTOMER_ACTION_REQUIRED,
                    BigDecimal.valueOf(request.totalAmount()),
                    request.currency(),
                    session.getUrl(),
                    null,
                    session.getStatus());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe session", e);
        }
    }

    @Override
    public AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String paymentSessionId,
            String providerPaymentMethodReference) {
        String normalizedPaymentSessionId = normalizedRequired(
                paymentSessionId,
                "internal payment session id");
        String paymentMethodReference = normalizedRequired(
                providerPaymentMethodReference,
                "Stripe PaymentMethod id");
        String apiKey = requireApiKey();
        PaymentRouting routing = routingResolver.require(getType());
        String returnUrl = routing.successUrl(getType())
                .replace("{CHECKOUT_SESSION_ID}", normalizedPaymentSessionId);
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(toMinorUnits(request.totalAmount(), request.currency()))
                    .setCurrency(request.currency().toLowerCase(Locale.ROOT))
                    .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL)
                    .setPaymentMethod(paymentMethodReference)
                    .addPaymentMethodType("card")
                    .setConfirm(true)
                    .setReturnUrl(returnUrl)
                    .putMetadata("checkout_session_id", normalizedPaymentSessionId)
                    .putMetadata("source_id", request.sourceId())
                    .putMetadata("user_id", request.userId())
                    .build();
            PaymentIntent intent = PaymentIntent.create(
                    params,
                    requestOptions(apiKey, "myscoutee:authorization:" + normalizedPaymentSessionId));
            return toAuthorizationResult(intent.getId(), intent);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to authorize the saved Stripe payment method", exception);
        }
    }

    @Override
    public AuthorizationResult retrieveAuthorization(
            String gatewayCheckoutId,
            String gatewayAuthorizationId) {
        String apiKey = requireApiKey();
        try {
            String paymentIntentId = normalizedRequired(gatewayAuthorizationId, "Stripe PaymentIntent id");
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId, requestOptions(apiKey, null));
            return toAuthorizationResult(gatewayCheckoutId, intent);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to retrieve Stripe PaymentIntent", exception);
        }
    }

    @Override
    public AuthorizationResult captureAuthorization(
            String gatewayAuthorizationId,
            BigDecimal amount,
            String idempotencyKey) {
        String apiKey = requireApiKey();
        try {
            String paymentIntentId = normalizedRequired(gatewayAuthorizationId, "Stripe PaymentIntent id");
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId, requestOptions(apiKey, null));
            PaymentIntentCaptureParams.Builder params = PaymentIntentCaptureParams.builder();
            if (amount != null) {
                params.setAmountToCapture(toMinorUnits(amount.doubleValue(), intent.getCurrency()));
            }
            PaymentIntent captured = intent.capture(
                    params.build(),
                    requestOptions(apiKey, normalizedRequired(idempotencyKey, "capture idempotency key")));
            return toAuthorizationResult(null, captured);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to capture Stripe PaymentIntent", exception);
        }
    }

    @Override
    public AuthorizationResult releaseAuthorization(
            String gatewayAuthorizationId,
            String idempotencyKey) {
        String apiKey = requireApiKey();
        try {
            String paymentIntentId = normalizedRequired(gatewayAuthorizationId, "Stripe PaymentIntent id");
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId, requestOptions(apiKey, null));
            PaymentIntent released = intent.cancel(
                    PaymentIntentCancelParams.builder()
                            .setCancellationReason(PaymentIntentCancelParams.CancellationReason.REQUESTED_BY_CUSTOMER)
                            .build(),
                    requestOptions(apiKey, normalizedRequired(idempotencyKey, "release idempotency key")));
            return toAuthorizationResult(null, released);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to release Stripe PaymentIntent authorization", exception);
        }
    }

    public AuthorizationResult toAuthorizationResult(String checkoutId, PaymentIntent intent) {
        AuthorizationStatus status = switch (safeLower(intent == null ? null : intent.getStatus())) {
            case "requires_action" -> AuthorizationStatus.CUSTOMER_ACTION_REQUIRED;
            case "requires_capture" -> AuthorizationStatus.AUTHORIZED;
            case "succeeded" -> AuthorizationStatus.CAPTURED;
            case "canceled" -> "abandoned".equals(safeLower(intent.getCancellationReason()))
                    ? AuthorizationStatus.EXPIRED
                    : AuthorizationStatus.RELEASED;
            case "requires_payment_method" -> intent != null && intent.getLastPaymentError() != null
                    ? AuthorizationStatus.FAILED
                    : AuthorizationStatus.AUTHORIZATION_PENDING;
            default -> AuthorizationStatus.AUTHORIZATION_PENDING;
        };
        String actionUrl = intent != null
                && intent.getNextAction() != null
                && intent.getNextAction().getRedirectToUrl() != null
                ? intent.getNextAction().getRedirectToUrl().getUrl()
                : null;
        String currency = intent == null ? null : intent.getCurrency();
        long minorAmount = intent == null || intent.getAmount() == null ? 0L : intent.getAmount();
        return new AuthorizationResult(
                getType(),
                checkoutId,
                intent == null ? null : intent.getId(),
                status,
                fromMinorUnits(minorAmount, currency),
                currency,
                actionUrl,
                null,
                intent == null ? null : intent.getStatus());
    }

    private RequestOptions requestOptions(String apiKey, String idempotencyKey) {
        RequestOptions.RequestOptionsBuilder builder = RequestOptions.builder().setApiKey(apiKey);
        if (StringUtils.hasText(idempotencyKey)) {
            builder.setIdempotencyKey(idempotencyKey.trim());
        }
        String apiBaseUrl = endpointResolver == null ? null : endpointResolver.resolve(apiKey);
        if (StringUtils.hasText(apiBaseUrl)) {
            builder.setBaseUrl(apiBaseUrl);
        }
        return builder.build();
    }

    private String requireApiKey() {
        String apiKey = credentialResolver.resolve(getType(), environmentApiKey);
        if (!StringUtils.hasText(apiKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Stripe payment credential is not configured.");
        }
        return apiKey;
    }

    private long toMinorUnits(double amount, String currencyCode) {
        int fractionDigits = currencyFractionDigits(currencyCode);
        return BigDecimal.valueOf(amount)
                .movePointRight(fractionDigits)
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private BigDecimal fromMinorUnits(long amount, String currencyCode) {
        return BigDecimal.valueOf(amount, currencyFractionDigits(currencyCode));
    }

    private int currencyFractionDigits(String currencyCode) {
        try {
            int digits = Currency.getInstance(normalizedRequired(currencyCode, "currency").toUpperCase(Locale.ROOT))
                    .getDefaultFractionDigits();
            return Math.max(0, digits);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Unsupported payment currency: " + currencyCode, exception);
        }
    }

    private String normalizedRequired(String value, String label) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(label + " is required.");
        }
        return value.trim();
    }

    private String safeLower(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
