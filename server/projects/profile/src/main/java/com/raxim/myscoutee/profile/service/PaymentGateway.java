package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Set;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;

/**
 * Provider-neutral authorization contract. Provider resource identifiers are
 * deliberately kept separate: a Stripe PaymentIntent can never be reused as
 * a Barion PaymentId (or vice versa).
 */
public interface PaymentGateway {

    enum AuthorizationStatus {
        PAYMENT_METHOD_READY,
        AUTHORIZATION_PENDING,
        CUSTOMER_ACTION_REQUIRED,
        AUTHORIZED,
        CAPTURED,
        RELEASED,
        EXPIRED,
        FAILED
    }

    enum RefundStatus {
        PENDING,
        SUCCEEDED,
        FAILED
    }

    record Capabilities(
            boolean delayedCapture,
            boolean customerAction,
            boolean partialCapture,
            Duration maximumAuthorizationWindow,
            Set<String> fundingSources) {
        public Capabilities {
            maximumAuthorizationWindow = maximumAuthorizationWindow == null
                    ? Duration.ZERO
                    : maximumAuthorizationWindow;
            fundingSources = fundingSources == null ? Set.of() : Set.copyOf(fundingSources);
        }

        public static Capabilities unavailable() {
            return new Capabilities(false, false, false, Duration.ZERO, Set.of());
        }
    }

    record AuthorizationResult(
            String provider,
            String gatewayCheckoutId,
            String gatewayAuthorizationId,
            AuthorizationStatus status,
            BigDecimal amount,
            String currency,
            String customerActionUrl,
            String captureBeforeIso,
            String providerStatus) {
        public AuthorizationResult {
            amount = amount == null ? BigDecimal.ZERO : amount;
            status = status == null ? AuthorizationStatus.FAILED : status;
        }
    }

    record RefundResult(
            String provider,
            String gatewayAuthorizationId,
            String gatewayRefundId,
            RefundStatus status,
            BigDecimal amount,
            String currency,
            String providerStatus) {
        public RefundResult {
            amount = amount == null ? BigDecimal.ZERO : amount;
            status = status == null ? RefundStatus.FAILED : status;
        }
    }

    String getType();

    Capabilities capabilities();

    AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId);

    default AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId,
            String providerPaymentMethodReference) {
        return prepareAuthorization(request, internalPaymentSessionId);
    }

    AuthorizationResult retrieveAuthorization(
            String gatewayCheckoutId,
            String gatewayAuthorizationId);

    AuthorizationResult captureAuthorization(
            String gatewayAuthorizationId,
            BigDecimal amount,
            String idempotencyKey);

    AuthorizationResult releaseAuthorization(
            String gatewayAuthorizationId,
            String idempotencyKey);

    RefundResult refundCapturedPayment(
            String gatewayAuthorizationId,
            BigDecimal amount,
            String currency,
            String idempotencyKey);

    RefundResult retrieveRefund(String gatewayRefundId);
}
