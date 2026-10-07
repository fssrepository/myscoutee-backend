package com.raxim.myscoutee.domain.payments.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.payments.dto.PaymentDtos.CashReceiptRequestDto;
import com.raxim.myscoutee.domain.payments.repository.PaymentsRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;

@org.junit.jupiter.api.Tag("standard")
class CashReceiptTest {
    private final PaymentsRepository payments = mock(PaymentsRepository.class);
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final SavedPaymentMethodsService history = mock(SavedPaymentMethodsService.class);
    private final NotificationOutboxService notifications = mock(NotificationOutboxService.class);
    private final PaymentService service = new PaymentService(List.of(), payments, null, null, null, history, mongo, null, null);
    private final CashReceiptRequestDto request = new CashReceiptRequestDto(
            "b5e0289c-1b09-47ca-8ba1-20cf5e2dcb02", "payer", 20D, "EUR", "Lunch");

    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(strings={"cash","bank-transfer"})
    void receiptPersistsBothPartiesAndNoteAndRetriesDoNotAddAnotherPayment(String method) {
        CashReceiptRequestDto request=new CashReceiptRequestDto(this.request.requestId(),"payer",20D,"EUR","Lunch",method);
        ReflectionTestUtils.setField(service, "cashNotifications", notifications);
        Users payer = user("payer", "Payer", null);
        Users recipient = user("recipient", "Recipient", null);
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(payer, recipient));
        AtomicReference<Payment> saved = new AtomicReference<>();
        when(payments.findById(anyString())).thenAnswer(call -> Optional.ofNullable(saved.get()));
        when(payments.save(any(Payment.class))).thenAnswer(call -> { saved.set(call.getArgument(0)); return saved.get(); });

        service.recordCashReceipt("recipient", request);
        service.recordCashReceipt("recipient", request);

        assertThat(saved.get().getProvider()).isEqualTo(method);
        assertThat(saved.get().getUserId()).isEqualTo("payer");
        assertThat(saved.get().getRecipientUserId()).isEqualTo("recipient");
        assertThat(saved.get().getReceiptNote()).isEqualTo("Lunch");
        assertThat(saved.get().getAccountedSpentAmount()).isEqualTo(20D);
        verify(payments, times(1)).save(any(Payment.class));
        verify(notifications, times(2)).enqueueOnce(eq(("bank-transfer".equals(method)?"payment-transfer-received:":"payment-cash-received:") + saved.get().getId()),
                argThat(intent -> intent.recipientUserIds().equals(List.of("payer"))));
        assertThatThrownBy(() -> service.recordCashReceipt("recipient", new CashReceiptRequestDto(
                request.requestId(), "payer", 21D, "EUR", "Lunch"))).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void receiptCannotReferenceAnotherWorkspace() {
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(
                user("payer", "Payer", "private-group"), user("recipient", "Recipient", null)));
        assertThatThrownBy(() -> service.recordCashReceipt("recipient", request)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(payments, notifications);
    }

    @Test
    void invalidAmountIsRejectedBeforeReadingOrWritingAnything() {
        assertThatThrownBy(() -> service.recordCashReceipt("recipient", new CashReceiptRequestDto(
                request.requestId(), "payer", Double.NaN, "EUR", "Lunch"))).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(payments, mongo, notifications);
    }

    private Users user(String id, String name, String group) {
        Users user = new Users(); user.setUserId(id); user.setName(name); user.setWorkspaceGroupId(group); return user;
    }
}
