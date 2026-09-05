package com.raxim.myscoutee.profile.controller.payment;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.service.BarionPaymentProcessor;
import com.raxim.myscoutee.profile.service.PaymentAuthorizationCoordinator;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.profile.service.StripePaymentProcessor;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;

@RestController
@RequestMapping("/payment/webhooks")
public class PaymentGatewayWebhookController {
    private final StripePaymentProcessor stripe;
    private final BarionPaymentProcessor barion;
    private final PaymentAuthorizationCoordinator coordinator;
    private final String stripeWebhookSecret;
    private final String simulatorStripeWebhookSecret;

    public PaymentGatewayWebhookController(
            StripePaymentProcessor stripe,
            BarionPaymentProcessor barion,
            PaymentAuthorizationCoordinator coordinator,
            @Value("${payment.stripe.webhookSecret:}") String stripeWebhookSecret,
            @Value("${payment.simulator.stripeWebhookSecret:}") String simulatorStripeWebhookSecret) {
        this.stripe = stripe;
        this.barion = barion;
        this.coordinator = coordinator;
        this.stripeWebhookSecret = stripeWebhookSecret;
        this.simulatorStripeWebhookSecret = simulatorStripeWebhookSecret;
    }

    @PostMapping("/stripe")
    public ResponseEntity<Void> stripe(
            @RequestBody String rawBody,
            @RequestHeader(value = "Stripe-Signature", required = false) String signature) {
        String webhookSecret = resolveStripeWebhookSecret();
        if (!StringUtils.hasText(webhookSecret) || !StringUtils.hasText(signature)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Stripe webhook signature is required.");
        }
        final Event event;
        try {
            event = Webhook.constructEvent(rawBody, signature, webhookSecret.trim());
        } catch (SignatureVerificationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Stripe webhook signature is invalid.");
        }
        StripeObject object = event.getDataObjectDeserializer().getObject().orElse(null);
        if (!(object instanceof PaymentIntent intent)) {
            return ResponseEntity.ok().build();
        }
        AuthorizationResult authorization = stripe.toAuthorizationResult(null, intent);
        String internalSessionId = intent.getMetadata() == null
                ? null
                : intent.getMetadata().get("checkout_session_id");
        coordinator.apply(internalSessionId, authorization, "stripe:" + event.getId());
        return ResponseEntity.ok().build();
    }

    String resolveStripeWebhookSecret() {
        return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                ? simulatorStripeWebhookSecret
                : stripeWebhookSecret;
    }

    @PostMapping("/barion")
    public ResponseEntity<Void> barion(
            @RequestParam(value = "PaymentId", required = false) String paymentIdUpper,
            @RequestParam(value = "paymentId", required = false) String paymentIdLower) {
        String paymentId = firstNonBlank(paymentIdUpper, paymentIdLower);
        if (!StringUtils.hasText(paymentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Barion PaymentId is required.");
        }
        AuthorizationResult authorization = barion.retrieveAuthorization(paymentId, paymentId);
        String replayStableEventId = "barion:"
                + paymentId.trim()
                + ":"
                + authorization.status().name().toLowerCase(Locale.ROOT)
                + ":"
                + normalize(authorization.providerStatus());
        coordinator.apply(null, authorization, replayStableEventId);
        return ResponseEntity.ok().build();
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
