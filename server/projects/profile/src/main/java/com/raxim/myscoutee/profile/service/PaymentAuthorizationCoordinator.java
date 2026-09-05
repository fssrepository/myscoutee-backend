package com.raxim.myscoutee.profile.service;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.profile.service.PaymentService.GatewayTransition;

@Service
public class PaymentAuthorizationCoordinator {
    private final PaymentService paymentService;
    private final ActivitiesEventsService activitiesEventsService;
    private final PaymentGatewayOperationService gatewayOperationService;

    public PaymentAuthorizationCoordinator(
            PaymentService paymentService,
            ActivitiesEventsService activitiesEventsService,
            PaymentGatewayOperationService gatewayOperationService) {
        this.paymentService = paymentService;
        this.activitiesEventsService = activitiesEventsService;
        this.gatewayOperationService = gatewayOperationService;
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
        if (payment == null || !"authorized".equalsIgnoreCase(payment.getStatus())) {
            return transition;
        }
        if ("succeeded".equalsIgnoreCase(payment.getFulfillmentStatus())) {
            return transition;
        }
        if ("failed".equalsIgnoreCase(payment.getFulfillmentStatus())) {
            gatewayOperationService.enqueueRelease(payment, "fulfillment-compensation");
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
        gatewayOperationService.enqueueRelease(failed, "fulfillment-compensation");
    }
}
