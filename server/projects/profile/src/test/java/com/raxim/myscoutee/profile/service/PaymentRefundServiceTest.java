package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.UpdateDefinition;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryMutationDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class PaymentRefundServiceTest {

    @Test
    void payerRequestPersistsPendingStateIncrementsRecipientWriteModelAndNotifiesOwner() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized");
        Payment request = fixture.refundRequest("pending");
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.payments.findById("refund:payment-1")).thenReturn(Optional.empty());
        when(fixture.paymentService.saveRefundRequestHistoryRecord(
                eq(payment), any(String.class), eq("nova"), any(PaymentRefundCalculator.Preview.class)))
                .thenReturn(request);
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(mock(com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryItemDto.class), Map.of("HUF", 3200D), Map.of(), 0);
        when(fixture.history.mutationDto(request, "nova")).thenReturn(expected);

        assertThat(fixture.service.requestRefund("payment-1", "nova")).isSameAs(expected);
        assertThat(payment.getRefundRequestStatus()).isNull();
        assertThat(request.getRefundRequestStatus()).isEqualTo("pending");
        assertThat(request.getRefundedAmount()).isEqualTo(1600D);
        assertThat(request.getRefundRuleId()).isEqualTo("qa-refund");
        assertThat(request.getSupersedesPaymentId()).isEqualTo("payment-1");
        verify(fixture.mongo).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(fixture.outbox).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("payment-refund-requested");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("casey");
    }

    @Test
    void repeatedPendingRequestIsIdempotent() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized");
        Payment request = fixture.refundRequest("pending");
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(mock(com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryItemDto.class), Map.of(), Map.of(), 0);
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.payments.findById("refund:payment-1")).thenReturn(Optional.of(request));
        when(fixture.history.mutationDto(request, "nova")).thenReturn(expected);

        assertThat(fixture.service.requestRefund("payment-1", "nova")).isSameAs(expected);
        verify(fixture.paymentService, never()).saveRefundRequestHistoryRecord(
                any(), any(), any(), any());
        verify(fixture.mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));
        verify(fixture.outbox, never()).enqueue(any());
    }

    @Test
    void recipientApprovalRefundsOnceAndNotifiesPayerAfterLedgerSettlement() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized");
        Payment request = fixture.refundRequest("pending");
        when(fixture.payments.findById("refund:payment-1")).thenReturn(Optional.of(request));
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.paymentService.approvePolicyRefund(
                eq(payment), any(String.class), eq(1600D), eq("HUF"), eq("qa-refund"), any(String.class)))
                .thenAnswer(invocation -> {
            payment.setStatus("partially_refunded");
            payment.setRefundStatus("partial");
            payment.setRefundedAmount(1600D);
            payment.setRefundCurrency("HUF");
            payment.setRefundedAtIso(Instant.now().toString());
            return payment;
        });
        when(fixture.paymentService.saveRefundHistoryRecord(payment)).thenAnswer(invocation -> {
            request.setStatus("refunded");
            request.setRefundRequestStatus("approved");
            return request;
        });
        when(fixture.payments.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(mock(com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryItemDto.class), Map.of(), Map.of(), 0);
        when(fixture.history.mutationDto(request, "casey")).thenReturn(expected);

        assertThat(fixture.service.approveRefund("refund:payment-1", "casey")).isSameAs(expected);
        assertThat(payment.getRefundRequestStatus()).isNull();
        assertThat(request.getStatus()).isEqualTo("refunded");
        assertThat(request.getRefundRequestStatus()).isEqualTo("approved");
        assertThat(request.getRefundReviewedByUserId()).isEqualTo("casey");
        assertThat(request.getRefundReviewedAtIso()).isNotBlank();
        verify(fixture.paymentService).approvePolicyRefund(
                eq(payment), any(String.class), eq(1600D), eq("HUF"), eq("qa-refund"), any(String.class));
        verify(fixture.mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(fixture.outbox).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("payment-refund-approved");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("nova");
    }

    @Test
    void unrelatedUserCannotRequestOrApproveRefund() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized");
        Payment request = fixture.refundRequest("pending");
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.payments.findById("refund:payment-1")).thenReturn(Optional.of(request));

        assertThatThrownBy(() -> fixture.service.requestRefund("payment-1", "riley"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Only the payer");
        assertThatThrownBy(() -> fixture.service.approveRefund("refund:payment-1", "riley"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Only the payment recipient");
    }

    private static final class Fixture {
        private final PaymentsRepository payments = mock(PaymentsRepository.class);
        private final PaymentService paymentService = mock(PaymentService.class);
        private final SavedPaymentMethodsService history = mock(SavedPaymentMethodsService.class);
        private final NotificationOutboxService outbox = mock(NotificationOutboxService.class);
        private final MongoTemplate mongo = mock(MongoTemplate.class);
        private final PaymentRefundService service = new PaymentRefundService(
                payments,
                paymentService,
                history,
                outbox,
                mongo);

        private Payment payment(String status) {
            Payment payment = new Payment();
            payment.setId("payment-1");
            payment.setUserId("nova");
            payment.setRecipientUserId("casey");
            payment.setSourceId("asset-1");
            payment.setProvider("barion");
            payment.setStatus(status);
            payment.setAuditKind("payment");
            payment.setAmount(3200D);
            payment.setCurrency("HUF");
            payment.setBookingStartAtIso(Instant.now().plus(Duration.ofDays(2)).toString());
            payment.setCancellationPolicy(new PricingCancellationPolicyDto(
                    true,
                    List.of(new PricingCancellationRuleDto("qa-refund", "days", 1, "percent", 50D))));
            return payment;
        }

        private Payment refundRequest(String status) {
            Payment request = new Payment();
            request.setId("refund:payment-1");
            request.setUserId("nova");
            request.setRecipientUserId("casey");
            request.setSourceId("asset-1");
            request.setProvider("barion");
            request.setStatus("refund_requested");
            request.setAuditKind("refund");
            request.setSupersedesPaymentId("payment-1");
            request.setAmount(1600D);
            request.setCurrency("HUF");
            request.setRefundRequestStatus(status);
            request.setRefundedAmount(1600D);
            request.setRefundCurrency("HUF");
            request.setRefundRuleId("qa-refund");
            request.setRefundNote("Refund 50% when requested at least 1 day before start.");
            return request;
        }
    }
}
