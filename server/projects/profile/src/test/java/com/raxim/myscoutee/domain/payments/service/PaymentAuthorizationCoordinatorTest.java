package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.events.service.ActivitiesEventsService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.payments.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.domain.payments.service.PaymentGateway.AuthorizationStatus;
import com.raxim.myscoutee.domain.payments.service.PaymentService.GatewayTransition;

@org.junit.jupiter.api.Tag("standard")
class PaymentAuthorizationCoordinatorTest {

    @Test
    void unknownRemoteOutcomeKeepsFulfillmentPendingAndDoesNotRefund() {
        PaymentService payments = mock(PaymentService.class);
        var events = mock(com.raxim.myscoutee.domain.events.api.EventCheckout.class);
        var payment = capturedPayment("pending");
        var authorization = authorization();
        when(payments.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1"))
                .thenReturn(new GatewayTransition(payment, true, false));
        var unknown = new com.raxim.myscoutee.domain.events.api.EventCheckout.OutcomeUnknown(new java.io.IOException("lost reply"));
        when(events.finalizeAuthorizedPayment(payment)).thenThrow(unknown);
        var coordinator = new PaymentAuthorizationCoordinator(payments, events);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> coordinator.apply("pay-1", authorization, "stripe:event-1"))
                .isSameAs(unknown);
        verify(payments, never()).markGatewayFulfillment(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.anyBoolean(), org.mockito.ArgumentMatchers.any());
        verify(payments, never()).refundFailedFulfillment(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
        assertThat(payment.getFulfillmentStatus()).isEqualTo("pending");
    }

    @Test
    void acceptedMembershipIsNeverRefundedWhenItsReceiptCannotBeSaved() {
        var payments = mock(PaymentService.class);
        var events = mock(com.raxim.myscoutee.domain.events.api.EventCheckout.class);
        var payment = capturedPayment("pending");
        var authorization = authorization();
        var transition = new GatewayTransition(payment, true, false);
        when(payments.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1")).thenReturn(transition);
        var accepted = mock(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto.class);
        when(accepted.membershipStatus()).thenReturn("accepted");
        when(events.finalizeAuthorizedPayment(payment)).thenReturn(accepted);
        var lostReceipt = new org.springframework.dao.DataAccessResourceFailureException("lost receipt reply");
        when(payments.markGatewayFulfillment(payment.getId(), true, null)).thenThrow(lostReceipt).thenReturn(payment);
        var coordinator = new PaymentAuthorizationCoordinator(payments, events);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> coordinator.apply("pay-1", authorization, "stripe:event-1"))
                .isSameAs(lostReceipt);
        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(transition);
        verify(payments, never()).markGatewayFulfillment(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(false), org.mockito.ArgumentMatchers.any());
        verify(payments, never()).refundFailedFulfillment(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void fulfillmentExceptionPersistsFailureAndRefundsTheCapturedPayment() {
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesEventsService activitiesEventsService = mock(ActivitiesEventsService.class);
        Payment payment = capturedPayment("pending");
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
                activitiesEventsService);

        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(transition);
        verify(paymentService).markGatewayFulfillment(payment.getId(), false, "IllegalStateException");
        verify(paymentService).refundFailedFulfillment(payment, "IllegalStateException");
    }

    @Test
    void repeatedWebhookRepairsAMissingRefundWithoutRepeatingMembershipFulfillment() {
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesEventsService activitiesEventsService = mock(ActivitiesEventsService.class);
        Payment payment = capturedPayment("failed");
        AuthorizationResult authorization = authorization();
        GatewayTransition duplicate = new GatewayTransition(payment, false, true);
        when(paymentService.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1"))
                .thenReturn(duplicate);

        PaymentAuthorizationCoordinator coordinator = new PaymentAuthorizationCoordinator(
                paymentService,
                activitiesEventsService);

        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(duplicate);
        verify(activitiesEventsService, never()).finalizeAuthorizedPayment(payment);
        verify(paymentService, never()).markGatewayFulfillment(anyString(), org.mockito.ArgumentMatchers.anyBoolean(), anyString());
        verify(paymentService).refundFailedFulfillment(payment, "The captured payment could not be fulfilled.");
    }

    @Test
    void clientPaymentWaitsForTheAssetWriteToFulfillThePayment() {
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesEventsService activitiesEventsService = mock(ActivitiesEventsService.class);
        Payment payment = capturedPayment("pending");
        payment.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_CLIENT);
        AuthorizationResult authorization = authorization();
        GatewayTransition transition = new GatewayTransition(payment, true, false);
        when(paymentService.applyGatewayAuthorization("pay-1", authorization, "stripe:event-1"))
                .thenReturn(transition);

        PaymentAuthorizationCoordinator coordinator = new PaymentAuthorizationCoordinator(
                paymentService,
                activitiesEventsService);

        assertThat(coordinator.apply("pay-1", authorization, "stripe:event-1")).isSameAs(transition);
        verify(activitiesEventsService, never()).finalizeAuthorizedPayment(payment);
        verify(paymentService, never()).markGatewayFulfillment(anyString(), org.mockito.ArgumentMatchers.anyBoolean(),
                org.mockito.ArgumentMatchers.any());
        verify(paymentService, never()).refundFailedFulfillment(payment, "fulfillment-compensation");
    }

    private Payment capturedPayment(String fulfillmentStatus) {
        Payment payment = new Payment();
        payment.setId("payment-1");
        payment.setStatus("captured");
        payment.setFulfillmentStatus(fulfillmentStatus);
        return payment;
    }

    private AuthorizationResult authorization() {
        return new AuthorizationResult(
                "stripe",
                "cs-1",
                "pi-1",
                AuthorizationStatus.CAPTURED,
                BigDecimal.TEN,
                "EUR",
                null,
                null,
                "succeeded");
    }
}
