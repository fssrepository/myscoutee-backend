package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.events.api.EventCheckout;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.domain.payments.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.domain.payments.service.PaymentService.GatewayTransition;

@Service
public class PaymentAuthorizationCoordinator {
    private final PaymentService paymentService;
    private final EventCheckout activitiesEventsService;

    public PaymentAuthorizationCoordinator(
            PaymentService paymentService,
            EventCheckout activitiesEventsService) {
        this.paymentService = paymentService;
        this.activitiesEventsService = activitiesEventsService;
    }

    public GatewayTransition apply(
            String internalPaymentSessionId,
            AuthorizationResult authorization,
            String gatewayEventId) {
        GatewayTransition transition = paymentService.applyGatewayAuthorization(
                internalPaymentSessionId,
                authorization,
                gatewayEventId);
        Payment payment = transition.payment();
        if (payment == null || !"captured".equalsIgnoreCase(payment.getStatus())) {
            return transition;
        }
        if ("succeeded".equalsIgnoreCase(payment.getFulfillmentStatus())) {
            return transition;
        }
        if ("failed".equalsIgnoreCase(payment.getFulfillmentStatus())) {
            paymentService.refundFailedFulfillment(
                    payment,
                    "The captured payment could not be fulfilled.");
            return transition;
        }

        if (PaymentService.FULFILLMENT_KIND_CLIENT.equals(payment.getFulfillmentKind())) {
            return transition;
        }

        try {
            EventParticipationActionResultDto fulfillment = activitiesEventsService.finalizeAuthorizedPayment(payment);
            boolean accepted = fulfillment != null
                    && "accepted".equalsIgnoreCase(fulfillment.membershipStatus());
            if (accepted) {
                paymentService.markGatewayFulfillment(payment.getId(), true, null);
                return transition;
            }
            compensateUnfulfilledAuthorization(
                    payment,
                    "The event place could not be fulfilled after payment authorization.");
        } catch (RuntimeException failure) {
            compensateUnfulfilledAuthorization(payment, failure.getClass().getSimpleName());
        }
        return transition;
    }

    private void compensateUnfulfilledAuthorization(Payment payment, String reason) {
        Payment failed = paymentService.markGatewayFulfillment(payment.getId(), false, reason);
        paymentService.refundFailedFulfillment(failed, reason);
    }
}
