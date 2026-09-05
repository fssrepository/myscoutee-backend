package com.raxim.myscoutee.profile.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

class PaymentMethodExpiryTaskServiceTest {
    @Test
    void scheduledPassExpiresDueCardsAndRecordsTheAdminJobRun() {
        SavedPaymentMethodsRepository repository = mock(SavedPaymentMethodsRepository.class);
        NotificationOutboxService outbox = mock(NotificationOutboxService.class);
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        ScheduledMongoSessionRunner sessionRunner = mock(ScheduledMongoSessionRunner.class);
        PaymentMethodExpiryTaskService service = new PaymentMethodExpiryTaskService(
                repository,
                outbox,
                registry,
                sessionRunner);
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setRuleKey(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY);
        SavedPaymentMethod method = dueMethod();

        doAnswer(invocation -> {
            invocation.<Runnable>getArgument(0).run();
            return null;
        }).when(sessionRunner).runAcrossConfiguredDatabases(any(Runnable.class));
        when(registry.findRule(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY))
                .thenReturn(Optional.of(rule));
        when(registry.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY),
                any(Instant.class))).thenReturn(true);
        when(registry.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY),
                eq("Scanning expired saved payment cards."),
                eq("payment-method-expiry-task"),
                any(Instant.class))).thenReturn(rule);
        when(repository.findTop100ByStatusAndExpiryKeyLessThanAndExpiredNotifiedAtIsoIsNullOrderByExpiryKeyAsc(
                eq("active"),
                any(Integer.class))).thenReturn(List.of(method));
        when(repository.markExpired(eq("payment-method-1"), eq("user-1"), anyString())).thenReturn(1L);

        service.markExpiredAndNotify();

        verify(outbox).enqueue(any(NotificationOutboxService.NotificationIntent.class));
        verify(repository).markExpired(eq("payment-method-1"), eq("user-1"), anyString());
        verify(registry).recordRun(
                eq(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY),
                eq(1),
                eq("completed"),
                eq("Expired and queued notifications for 1 saved payment card(s)."),
                eq("payment-method-expiry-task"),
                any(Instant.class));
    }

    @Test
    void scheduledPassDoesNotScanWhenTheAdminJobIsNotDue() {
        SavedPaymentMethodsRepository repository = mock(SavedPaymentMethodsRepository.class);
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        ScheduledMongoSessionRunner sessionRunner = mock(ScheduledMongoSessionRunner.class);
        PaymentMethodExpiryTaskService service = new PaymentMethodExpiryTaskService(
                repository,
                mock(NotificationOutboxService.class),
                registry,
                sessionRunner);
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setRuleKey(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY);

        doAnswer(invocation -> {
            invocation.<Runnable>getArgument(0).run();
            return null;
        }).when(sessionRunner).runAcrossConfiguredDatabases(any(Runnable.class));
        when(registry.findRule(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY))
                .thenReturn(Optional.of(rule));
        when(registry.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_PAYMENT_METHOD_EXPIRY),
                any(Instant.class))).thenReturn(false);

        service.markExpiredAndNotify();

        verify(repository, never())
                .findTop100ByStatusAndExpiryKeyLessThanAndExpiredNotifiedAtIsoIsNullOrderByExpiryKeyAsc(
                        any(String.class),
                        any(Integer.class));
    }

    private SavedPaymentMethod dueMethod() {
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("payment-method-1");
        method.setUserId("user-1");
        method.setStatus("active");
        method.setProvider("stripe");
        method.setLast4("4242");
        method.setExpiryKey(202501);
        return method;
    }
}
