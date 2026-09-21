package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.mockito.InOrder;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.PaymentMethodRegistrationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

class SavedPaymentMethodsServiceTest {

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void deleteAttemptsProviderCleanupBeforeMarkingTheLocalCardDeleted() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm-1");
        method.setUserId("user-1");
        method.setProvider("stripe");
        method.setProviderPaymentMethodRef("pm-provider-1");
        method.setStatus("active");
        when(methods.findByIdAndUserId("pm-1", "user-1")).thenReturn(Optional.of(method));
        when(methods.markDeleted(org.mockito.ArgumentMatchers.eq("pm-1"), org.mockito.ArgumentMatchers.eq("user-1"), org.mockito.ArgumentMatchers.anyString()))
                .thenReturn(1L);
        when(simulator.isEnabled()).thenReturn(true);

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        service.delete("user-1", "pm-1");

        InOrder deletion = inOrder(simulator, methods);
        deletion.verify(simulator).revoke("stripe", "pm-provider-1");
        deletion.verify(methods).markDeleted(
                org.mockito.ArgumentMatchers.eq("pm-1"),
                org.mockito.ArgumentMatchers.eq("user-1"),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void providerCleanupFailureDoesNotFailTheLocalDeletion() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm-1");
        method.setUserId("user-1");
        method.setProvider("stripe");
        method.setProviderPaymentMethodRef("pm-provider-1");
        method.setStatus("active");
        when(methods.findByIdAndUserId("pm-1", "user-1")).thenReturn(Optional.of(method));
        when(methods.markDeleted(org.mockito.ArgumentMatchers.eq("pm-1"), org.mockito.ArgumentMatchers.eq("user-1"), org.mockito.ArgumentMatchers.anyString()))
                .thenReturn(1L);
        when(simulator.isEnabled()).thenReturn(true);
        org.mockito.Mockito.doThrow(new IllegalStateException("provider unavailable"))
                .when(simulator).revoke("stripe", "pm-provider-1");

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        service.delete("user-1", "pm-1");

        verify(methods).markDeleted(
                org.mockito.ArgumentMatchers.eq("pm-1"),
                org.mockito.ArgumentMatchers.eq("user-1"),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void cardsCanBeAddedOnlyWhenAnExternalDemoProviderIsActive() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentMethodRegistrationsRepository registrations = mock(PaymentMethodRegistrationsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        when(simulator.isEnabled()).thenReturn(true);
        when(registrations.findByUserIdAndStatusOrderByCreatedAtIsoDesc("user-1", "pending"))
                .thenReturn(List.of());
        when(methods.findByUserIdAndStatusInOrderByCreatedAtIsoDesc(
                "user-1", List.of("active", "expired")))
                .thenReturn(List.of());
        when(methods.findByUserIdAndStatusOrderByCreatedAtIsoDesc("user-1", "active"))
                .thenReturn(List.of());

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                registrations,
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        when(simulator.configuration()).thenReturn(
                new PaymentSimulatorRegistrationClient.GatewayConfiguration("none", false, true, ""));
        var cashOnlyPage = service.queryPage("user-1", 0, 6);
        assertThat(cashOnlyPage.canAdd()).isFalse();
        assertThat(cashOnlyPage.currentProvider()).isEqualTo("none");

        when(simulator.configuration()).thenReturn(
                new PaymentSimulatorRegistrationClient.GatewayConfiguration(
                        "stripe", true, true, "sk_test_generated"));
        var stripePage = service.queryPage("user-1", 0, 6);
        assertThat(stripePage.canAdd()).isTrue();
        assertThat(stripePage.currentProvider()).isEqualTo("stripe");
    }

    @Test
    void cardsAreOrderedAsSelectableThenReconnectThenExpired() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentMethodRegistrationsRepository registrations = mock(PaymentMethodRegistrationsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        SavedPaymentMethod expired = paymentMethod("expired", "stripe", "expired", 202001, "2026-09-06T00:00:00Z");
        SavedPaymentMethod reconnect = paymentMethod("reconnect", "barion", "active", 202912, "2026-09-06T00:00:00Z");
        SavedPaymentMethod selectable = paymentMethod("selectable", "stripe", "active", 202912, "2026-09-06T00:00:00Z");
        when(simulator.isEnabled()).thenReturn(true);
        when(simulator.configuration()).thenReturn(
                new PaymentSimulatorRegistrationClient.GatewayConfiguration(
                        "stripe", true, true, "sk_test_generated"));
        when(registrations.findByUserIdAndStatusOrderByCreatedAtIsoDesc("user-1", "pending"))
                .thenReturn(List.of());
        when(methods.findByUserIdAndStatusInOrderByCreatedAtIsoDesc(
                "user-1", List.of("active", "expired")))
                .thenReturn(List.of(expired, reconnect, selectable));
        when(methods.findByUserIdAndStatusOrderByCreatedAtIsoDesc("user-1", "active"))
                .thenReturn(List.of(reconnect, selectable));

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                registrations,
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        assertThat(service.queryPage("user-1", 0, 6).items())
                .extracting(item -> item.id())
                .containsExactly("selectable", "reconnect", "expired");
    }

    @Test
    void historyExposesAssetOwnerRefundActionsAndStoredPendingCounterByViewerRole() {
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentsRepository payments = mock(PaymentsRepository.class);
        UsersRepository users = mock(UsersRepository.class);
        Payment payment = new Payment();
        payment.setId("payment-asset-1");
        payment.setUserId("nova");
        payment.setRecipientUserId("casey");
        payment.setSourceId("asset-1");
        payment.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_CLIENT);
        payment.setContextEventId("event-1");
        payment.setContextSubEventId("sub-event-1");
        payment.setStatus("authorized");
        payment.setAuditKind("payment");
        payment.setProvider("barion");
        payment.setAmount(3200D);
        payment.setCurrency("HUF");
        payment.setBookingStartAtIso(Instant.now().plus(java.time.Duration.ofDays(2)).toString());
        payment.setCancellationPolicy(new com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto(
                true,
                List.of(new com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto(
                        "qa-refund", "days", 1, "percent", 50D))));
        payment.setCreatedDate("2026-09-07T06:00:00Z");

        Payment refundRequest = new Payment();
        refundRequest.setId("refund:payment-asset-1");
        refundRequest.setUserId("nova");
        refundRequest.setRecipientUserId("casey");
        refundRequest.setSourceId("asset-1");
        refundRequest.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_CLIENT);
        refundRequest.setContextEventId("event-1");
        refundRequest.setContextSubEventId("sub-event-1");
        refundRequest.setStatus("refund_requested");
        refundRequest.setAuditKind("refund");
        refundRequest.setSupersedesPaymentId("payment-asset-1");
        refundRequest.setProvider("barion");
        refundRequest.setAmount(1600D);
        refundRequest.setCurrency("HUF");
        refundRequest.setRefundedAmount(1600D);
        refundRequest.setRefundCurrency("HUF");
        refundRequest.setRefundRequestStatus("pending");
        refundRequest.setRefundRequestedAtIso("2026-09-07T07:00:00Z");
        refundRequest.setCancellationPolicy(payment.getCancellationPolicy());
        refundRequest.setCreatedDate("2026-09-07T07:00:00Z");

        Users nova = new Users();
        nova.setUserId("nova");
        nova.setPaymentRefundsPending(0);
        Users casey = new Users();
        casey.setUserId("casey");
        casey.setPaymentRefundsPending(1);
        when(users.findByUserId("nova")).thenReturn(Optional.of(nova));
        when(users.findByUserId("casey")).thenReturn(Optional.of(casey));
        when(payments.findById("refund:payment-asset-1"))
                .thenReturn(Optional.empty(), Optional.of(refundRequest));
        when(payments.findById("payment-asset-1")).thenReturn(Optional.of(payment));
        when(payments.findByUserIdOrderByCreatedDateDesc("nova")).thenReturn(List.of(payment));
        when(payments.findByRecipientUserIdOrderByCreatedDateDesc("nova")).thenReturn(List.of());
        when(payments.findByUserIdOrderByCreatedDateDesc("casey")).thenReturn(List.of());
        when(payments.findByRecipientUserIdOrderByCreatedDateDesc("casey")).thenReturn(List.of(payment));

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                payments,
                mock(PaymentSimulatorRegistrationClient.class),
                mock(DeploymentPaymentProviderResolver.class),
                users);

        var payerPage = service.queryHistory("nova", "all", 0, 20);
        assertThat(payerPage.pendingRefundCount()).isZero();
        assertThat(payerPage.items()).singleElement().satisfies(item -> {
            assertThat(item.direction()).isEqualTo("expense");
            assertThat(item.serviceContext()).isEqualTo("asset");
            assertThat(item.recipientUserId()).isEqualTo("casey");
            assertThat(item.contextAssetId()).isEqualTo("asset-1");
            assertThat(item.contextEventId()).isEqualTo("event-1");
            assertThat(item.contextSubEventId()).isEqualTo("sub-event-1");
            assertThat(item.canRequestRefund()).isTrue();
            assertThat(item.canApproveRefund()).isFalse();
        });

        when(payments.findByRecipientUserIdOrderByCreatedDateDesc("casey"))
                .thenReturn(List.of(refundRequest, payment));
        var recipientPage = service.queryHistory("casey", "all", 0, 20);
        assertThat(recipientPage.pendingRefundCount()).isEqualTo(1);
        assertThat(recipientPage.items()).hasSize(2);
        assertThat(recipientPage.items().get(0)).satisfies(item -> {
            assertThat(item.id()).isEqualTo("refund:payment-asset-1");
            assertThat(item.status()).isEqualTo("refund_requested");
            assertThat(item.direction()).isEqualTo("expense");
            assertThat(item.canApproveRefund()).isTrue();
            assertThat(item.refundRequestStatus()).isEqualTo("pending");
        });
        assertThat(recipientPage.items().get(1)).satisfies(item -> {
            assertThat(item.id()).isEqualTo("payment-asset-1");
            assertThat(item.status()).isEqualTo("authorized");
            assertThat(item.canApproveRefund()).isFalse();
            assertThat(item.refundRequestStatus()).isEqualTo("none");
        });
    }

    @Test
    void refundHistoryIsANewerWriteWithItsOwnDirectionAndGrossTotals() {
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentsRepository payments = mock(PaymentsRepository.class);
        UsersRepository users = mock(UsersRepository.class);

        Payment original = new Payment();
        original.setId("payment-1");
        original.setUserId("riley");
        original.setRecipientUserId("casey");
        original.setSourceId("asset-1");
        original.setStatus("partially_refunded");
        original.setAuditKind("payment");
        original.setProvider("barion");
        original.setAmount(3200D);
        original.setCurrency("HUF");
        original.setRefundedAmount(1600D);
        original.setRefundCurrency("HUF");
        original.setRefundNote("50% refund");
        original.setCreatedDate("2026-09-07T16:00:00Z");

        Payment refund = new Payment();
        refund.setId("refund:payment-1");
        refund.setUserId("riley");
        refund.setRecipientUserId("casey");
        refund.setSourceId("asset-1");
        refund.setStatus("refunded");
        refund.setAuditKind("refund");
        refund.setProvider("barion");
        refund.setAmount(1600D);
        refund.setCurrency("HUF");
        refund.setCreatedDate("2026-09-07T17:00:00Z");

        Users riley = new Users();
        riley.setUserId("riley");
        riley.setPaymentSpentTotals(java.util.Map.of("HUF", 3200D));
        riley.setPaymentIncomeTotals(java.util.Map.of("HUF", 1600D));
        when(users.findByUserId("riley")).thenReturn(Optional.of(riley));
        when(payments.findByUserIdOrderByCreatedDateDesc("riley")).thenReturn(List.of(refund, original));
        when(payments.findByRecipientUserIdOrderByCreatedDateDesc("riley")).thenReturn(List.of());

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                payments,
                mock(PaymentSimulatorRegistrationClient.class),
                mock(DeploymentPaymentProviderResolver.class),
                users);

        var all = service.queryHistory("riley", "all", 0, 20);
        assertThat(all.spendingTotals()).containsEntry("HUF", 3200D);
        assertThat(all.incomeTotals()).containsEntry("HUF", 1600D);
        assertThat(all.items()).extracting(item -> item.id(), item -> item.direction(), item -> item.amount())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("refund:payment-1", "income", 1600D),
                        org.assertj.core.groups.Tuple.tuple("payment-1", "expense", 3200D));
        assertThat(service.queryHistory("riley", "income", 0, 20).items())
                .singleElement().satisfies(item -> assertThat(item.id()).isEqualTo("refund:payment-1"));
        assertThat(service.queryHistory("riley", "expenses", 0, 20).items())
                .singleElement().satisfies(item -> assertThat(item.id()).isEqualTo("payment-1"));
    }

    private SavedPaymentMethod paymentMethod(
            String id,
            String provider,
            String status,
            int expiryKey,
            String createdAtIso) {
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId(id);
        method.setUserId("user-1");
        method.setProvider(provider);
        method.setStatus(status);
        method.setExpiryKey(expiryKey);
        method.setCreatedAtIso(createdAtIso);
        return method;
    }
}
