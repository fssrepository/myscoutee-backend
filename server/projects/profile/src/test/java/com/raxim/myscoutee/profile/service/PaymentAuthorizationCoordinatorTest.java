package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationStatus;
import com.raxim.myscoutee.profile.service.PaymentService.GatewayTransition;

class PaymentAuthorizationCoordinatorTest {

    @Test
    void fulfillmentExceptionPersistsFailureAndQueuesAnIdempotentRelease() {
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesEventsService activitiesEventsService = mock(ActivitiesEventsService.class);
        PaymentGatewayOperationService operations = mock(PaymentGatewayOperationService.class);
        Payment payment = authorizedPayment("pending");
        AuthorizationResult authorization = authorization();
        GatewayTransition transition = new GatewayTransition(payment, true, false);
        when(paymentService.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1"))
                .thenReturn(transition);
        when(activitiesEventsService.finalizeAuthorizedPayment(payment))
                .thenThrow(new IllegalStateException("seat changed"));
        when(paymentService.markGatewayFulfillment(payment.getId(), false, "IllegalStateException"))
                .thenReturn(payment);

        PaymentAuthorizationCoordinator coordinator = new PaymentAuthorizationCoordinator(
                paymentService,
                activitiesEventsService,
                operations);

        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(transition);
        verify(paymentService).markGatewayFulfillment(payment.getId(), false, "IllegalStateException");
        verify(operations).enqueueRelease(payment, "fulfillment-compensation");
    }

    @Test
    void repeatedWebhookRepairsAMissingReleaseQueueWithoutRepeatingMembershipFulfillment() {
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesEventsService activitiesEventsService = mock(ActivitiesEventsService.class);
        PaymentGatewayOperationService operations = mock(PaymentGatewayOperationService.class);
        Payment payment = authorizedPayment("failed");
        AuthorizationResult authorization = authorization();
        GatewayTransition duplicate = new GatewayTransition(payment, false, true);
        when(paymentService.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1"))
                .thenReturn(duplicate);

        PaymentAuthorizationCoordinator coordinator = new PaymentAuthorizationCoordinator(
                paymentService,
                activitiesEventsService,
                operations);

        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(duplicate);
        verify(activitiesEventsService, never()).finalizeAuthorizedPayment(payment);
        verify(paymentService, never()).markGatewayFulfillment(anyString(), org.mockito.ArgumentMatchers.anyBoolean(), anyString());
        verify(operations).enqueueRelease(payment, "fulfillment-compensation");
    }

    private Payment authorizedPayment(String fulfillmentStatus) {
        Payment payment = new Payment();
        payment.setId("payment-1");
        payment.setStatus("authorized");
        payment.setFulfillmentStatus(fulfillmentStatus);
        return payment;
    }

    private AuthorizationResult authorization() {
        return new AuthorizationResult(
                "stripe",
                "cs-1",
                "pi-1",
                AuthorizationStatus.AUTHORIZED,
                BigDecimal.TEN,
                "EUR",
                null,
                null,
                "requires_capture");
    }
}
