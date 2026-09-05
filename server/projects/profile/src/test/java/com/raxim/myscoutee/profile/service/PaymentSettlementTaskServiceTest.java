package com.raxim.myscoutee.profile.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

class PaymentSettlementTaskServiceTest {

    @Test
    void capturesOnlyFulfilledEndedBookingsAndReleasesCancelledAuthorizations() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        PaymentGatewayOperationService operations = mock(PaymentGatewayOperationService.class);
        Payment ended = payment("ended", "joined", "succeeded");
        ended.setAmount(42.5d);
        ended.setBookingEndAtIso(Instant.now().minusSeconds(60).toString());
        Payment future = payment("future", "joined", "succeeded");
        future.setAmount(13d);
        future.setBookingEndAtIso(Instant.now().plusSeconds(3600).toString());
        Payment cancelled = payment("cancelled", "cancelled", "failed");
        when(payments.findByStatusAndBookingStatus("authorized", "joined"))
                .thenReturn(List.of(ended, future));
        when(payments.findByStatusAndBookingStatus("authorized", "cancelled"))
                .thenReturn(List.of(cancelled));

        PaymentSettlementTaskService service = new PaymentSettlementTaskService(payments, operations, true);

        service.captureCompletedBookings();

        verify(operations).enqueueCapture(ended, BigDecimal.valueOf(42.5d), "event-settlement");
        verify(operations).enqueueRelease(cancelled, "booking-cancelled");
    }

    @Test
    void acceptsTheExistingLocalDateTimeBookingBoundaryAsUtc() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        PaymentGatewayOperationService operations = mock(PaymentGatewayOperationService.class);
        Payment ended = payment("local-ended", "joined", "succeeded");
        ended.setAmount(8d);
        ended.setBookingEndAtIso(LocalDateTime.ofInstant(
                Instant.now().minusSeconds(60),
                ZoneOffset.UTC).toString());
        when(payments.findByStatusAndBookingStatus("authorized", "joined"))
                .thenReturn(List.of(ended));
        when(payments.findByStatusAndBookingStatus("authorized", "cancelled"))
                .thenReturn(List.of());

        new PaymentSettlementTaskService(payments, operations, true).captureCompletedBookings();

        verify(operations).enqueueCapture(ended, BigDecimal.valueOf(8d), "event-settlement");
    }

    @Test
    void releasesOnlyClientAuthorizationsWhoseFulfillmentWaitExceededTenMinutes() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        PaymentGatewayOperationService operations = mock(PaymentGatewayOperationService.class);
        Payment expired = payment("expired-client", "initiated", "pending");
        expired.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_CLIENT);
        expired.setCreatedDate(Instant.now().minusSeconds(11 * 60).toString());
        Payment current = payment("current-client", "initiated", "pending");
        current.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_CLIENT);
        current.setCreatedDate(Instant.now().minusSeconds(9 * 60).toString());
        when(payments.findByStatusAndFulfillmentStatusAndFulfillmentKind("authorized", "pending", "client"))
                .thenReturn(List.of(expired, current));
        when(payments.findByStatusAndBookingStatus("authorized", "joined")).thenReturn(List.of());
        when(payments.findByStatusAndBookingStatus("authorized", "cancelled")).thenReturn(List.of());
        when(payments.save(expired)).thenReturn(expired);

        new PaymentSettlementTaskService(payments, operations, true).captureCompletedBookings();

        verify(payments).save(expired);
        verify(payments, never()).save(current);
        verify(operations).enqueueRelease(expired, "client-fulfillment-timeout");
    }

    private Payment payment(String id, String bookingStatus, String fulfillmentStatus) {
        Payment payment = new Payment();
        payment.setId(id);
        payment.setStatus("authorized");
        payment.setBookingStatus(bookingStatus);
        payment.setFulfillmentStatus(fulfillmentStatus);
        return payment;
    }
}
