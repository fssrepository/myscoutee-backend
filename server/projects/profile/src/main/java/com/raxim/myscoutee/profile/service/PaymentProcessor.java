package com.raxim.myscoutee.profile.service;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;

public interface PaymentProcessor extends PaymentGateway {
    @Override
    default Capabilities capabilities() {
        return Capabilities.unavailable();
    }

    @Override
    default AuthorizationResult prepareAuthorization(
            EventCheckoutRequestDto request,
            String internalPaymentSessionId) {
        EventCheckoutSessionDto session = pay(request, internalPaymentSessionId);
        return new AuthorizationResult(
                session.provider(),
                session.id(),
                session.id(),
                switch (session.status()) {
                    case "approved", "authorized" -> AuthorizationStatus.AUTHORIZED;
                    case "requires_action" -> AuthorizationStatus.CUSTOMER_ACTION_REQUIRED;
                    case "failed" -> AuthorizationStatus.FAILED;
                    default -> AuthorizationStatus.AUTHORIZATION_PENDING;
                },
                java.math.BigDecimal.valueOf(session.amount()),
                session.currency(),
                session.paymentUrl(),
                null,
                session.status());
    }

    @Override
    default AuthorizationResult retrieveAuthorization(
            String gatewayCheckoutId,
            String gatewayAuthorizationId) {
        throw new UnsupportedOperationException("Payment authorization retrieval is not implemented.");
    }

    @Override
    default AuthorizationResult captureAuthorization(
            String gatewayAuthorizationId,
            java.math.BigDecimal amount,
            String idempotencyKey) {
        throw new UnsupportedOperationException("Payment capture is not implemented.");
    }

    @Override
    default AuthorizationResult releaseAuthorization(
            String gatewayAuthorizationId,
            String idempotencyKey) {
        throw new UnsupportedOperationException("Payment authorization release is not implemented.");
    }

    @Override
    default RefundResult refundCapturedPayment(
            String gatewayAuthorizationId,
            java.math.BigDecimal amount,
            String currency,
            String idempotencyKey) {
        throw new UnsupportedOperationException("Captured payment refund is not implemented.");
    }

    @Override
    default RefundResult retrieveRefund(String gatewayRefundId) {
        throw new UnsupportedOperationException("Payment refund retrieval is not implemented.");
    }

    default EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
        return new EventCheckoutSessionDto(
                "pending",
                getType(),
                "gateway",
                "pending",
                request.totalAmount(),
                request.currency(),
                null);
    }

    default EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
        AuthorizationResult result = prepareAuthorization(request, paymentSessionId);
        return new EventCheckoutSessionDto(
                result.gatewayCheckoutId(),
                result.provider(),
                "gateway",
                switch (result.status()) {
                    case CUSTOMER_ACTION_REQUIRED -> "requires_action";
                    case AUTHORIZED -> "authorized";
                    case CAPTURED -> "captured";
                    case RELEASED -> "released";
                    case EXPIRED -> "expired";
                    case FAILED -> "failed";
                    default -> "pending";
                },
                result.amount().doubleValue(),
                result.currency(),
                result.customerActionUrl());
    }
}
