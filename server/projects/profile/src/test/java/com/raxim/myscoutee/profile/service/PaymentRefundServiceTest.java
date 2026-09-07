package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class PaymentRefundServiceTest {

    @Test
    void payerRequestPersistsPendingStateIncrementsRecipientWriteModelAndNotifiesOwner() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized", null);
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.payments.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(null, Map.of("HUF", 3200D), Map.of(), 0);
        when(fixture.history.mutationDto(payment, "nova")).thenReturn(expected);

        assertThat(fixture.service.requestRefund("payment-1", "nova")).isSameAs(expected);
        assertThat(payment.getRefundRequestStatus()).isEqualTo("pending");
        assertThat(payment.getRefundRequestedByUserId()).isEqualTo("nova");
        assertThat(payment.getRefundRequestedAtIso()).isNotBlank();
        verify(fixture.mongo).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(fixture.outbox).enqueue(notification.capture());
        assertThat(notification.getValue().notificationType()).isEqualTo("payment-refund-requested");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("casey");
    }

    @Test
    void repeatedPendingRequestIsIdempotent() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized", "pending");
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(null, Map.of(), Map.of(), 0);
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.history.mutationDto(payment, "nova")).thenReturn(expected);

        assertThat(fixture.service.requestRefund("payment-1", "nova")).isSameAs(expected);
        verify(fixture.payments, never()).save(any());
        verify(fixture.mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));
        verify(fixture.outbox, never()).enqueue(any());
    }

    @Test
    void recipientApprovalRefundsOnceDecrementsWriteModelCounterAndNotifiesPayer() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized", "pending");
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));
        when(fixture.paymentService.approveFullRefund(eq(payment), any(String.class))).thenAnswer(invocation -> {
            payment.setStatus("refunded");
            payment.setRefundStatus("full");
            return payment;
        });
        when(fixture.payments.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PaymentHistoryMutationDto expected = new PaymentHistoryMutationDto(null, Map.of(), Map.of(), 0);
        when(fixture.history.mutationDto(payment, "casey")).thenReturn(expected);

        assertThat(fixture.service.approveRefund("payment-1", "casey")).isSameAs(expected);
        assertThat(payment.getRefundRequestStatus()).isEqualTo("approved");
        assertThat(payment.getRefundReviewedByUserId()).isEqualTo("casey");
        assertThat(payment.getRefundReviewedAtIso()).isNotBlank();
        verify(fixture.paymentService).approveFullRefund(eq(payment), any(String.class));
        verify(fixture.mongo).updateFirst(any(Query.class), any(UpdateDefinition.class), eq(Users.class));

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(fixture.outbox).enqueue(notification.capture());
        assertThat(notification.getValue().notificationType()).isEqualTo("payment-refund-approved");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("nova");
    }

    @Test
    void unrelatedUserCannotRequestOrApproveRefund() {
        Fixture fixture = new Fixture();
        Payment payment = fixture.payment("authorized", null);
        when(fixture.payments.findById("payment-1")).thenReturn(Optional.of(payment));

        assertThatThrownBy(() -> fixture.service.requestRefund("payment-1", "riley"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Only the payer");
        payment.setRefundRequestStatus("pending");
        assertThatThrownBy(() -> fixture.service.approveRefund("payment-1", "riley"))
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

        private Payment payment(String status, String refundRequestStatus) {
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
            payment.setRefundRequestStatus(refundRequestStatus);
            return payment;
        }
    }
}
