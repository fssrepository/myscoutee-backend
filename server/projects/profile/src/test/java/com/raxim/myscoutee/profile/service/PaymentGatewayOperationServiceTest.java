package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.PaymentGatewayOperation;
import com.raxim.myscoutee.profile.repository.PaymentGatewayOperationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

class PaymentGatewayOperationServiceTest {

    @Test
    void idempotentEnqueueReturnsSameOperationButRejectsChangedPayload() {
        PaymentGatewayOperationsRepository operations = mock(PaymentGatewayOperationsRepository.class);
        PaymentsRepository payments = mock(PaymentsRepository.class);
        PaymentService paymentService = mock(PaymentService.class);
        Payment payment = payment();
        PaymentGatewayOperation persisted = operation(
                "payment:payment-1:capture:event-settlement",
                "capture",
                "42.50");
        when(operations.findByOperationKey(persisted.getOperationKey()))
                .thenReturn(Optional.empty(), Optional.of(persisted), Optional.of(persisted));
        when(operations.save(any(PaymentGatewayOperation.class))).thenReturn(persisted);
        PaymentGatewayOperationService service = new PaymentGatewayOperationService(
                operations,
                payments,
                paymentService,
                true);

        assertThat(service.enqueueCapture(payment, new BigDecimal("42.50"), "event-settlement"))
                .isSameAs(persisted);
        assertThat(service.enqueueCapture(payment, new BigDecimal("42.5"), "event-settlement"))
                .isSameAs(persisted);
        assertThatThrownBy(() -> service.enqueueCapture(
                payment,
                new BigDecimal("41.00"),
                "event-settlement"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("idempotency key");
    }

    @Test
    void dueCaptureIsClaimedAndCompletedThroughThePersistedPayment() {
        PaymentGatewayOperationsRepository operations = mock(PaymentGatewayOperationsRepository.class);
        PaymentsRepository payments = mock(PaymentsRepository.class);
        PaymentService paymentService = mock(PaymentService.class);
        Payment payment = payment();
        PaymentGatewayOperation pending = operation(
                "payment:payment-1:capture:event-settlement",
                "capture",
                "42.50");
        pending.setStatus("pending");
        pending.setNextAttemptAtIso("2000-01-01T00:00:00Z");
        pending.setCreatedAtIso("2000-01-01T00:00:00Z");
        when(operations.findByStatusIn(List.of("pending", "in_progress")))
                .thenReturn(List.of(pending));
        when(operations.save(any(PaymentGatewayOperation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(payments.findById("payment-1")).thenReturn(Optional.of(payment));
        PaymentGatewayOperationService service = new PaymentGatewayOperationService(
                operations,
                payments,
                paymentService,
                true);

        service.processPendingOperations();

        verify(paymentService).captureGatewayAuthorization(
                payment,
                new BigDecimal("42.50"),
                pending.getOperationKey());
        assertThat(pending.getStatus()).isEqualTo("succeeded");
        assertThat(pending.getCompletedAtIso()).isNotBlank();
        assertThat(pending.getLockedAtIso()).isNull();
    }

    private Payment payment() {
        Payment payment = new Payment();
        payment.setId("payment-1");
        payment.setProvider("stripe");
        payment.setGatewayAuthorizationId("pi-1");
        return payment;
    }

    private PaymentGatewayOperation operation(String key, String type, String amount) {
        PaymentGatewayOperation operation = new PaymentGatewayOperation();
        operation.setId("operation-1");
        operation.setVersion(0L);
        operation.setOperationKey(key);
        operation.setPaymentId("payment-1");
        operation.setOperationType(type);
        operation.setAmount(amount);
        operation.setAttempts(0);
        return operation;
    }
}
