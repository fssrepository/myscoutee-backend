package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs.Configuration;
import com.raxim.myscoutee.domain.payments.document.SavedPaymentMethod;
import com.raxim.myscoutee.domain.payments.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;

@Service
public class PaymentMethodExpiryTaskService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentMethodExpiryTaskService.class);
    private static final String ACTIVE = "active";
    private static final String SYSTEM_USER = "payment-method-expiry-task";
    private final SavedPaymentMethodsRepository repository;
    private final NotificationDelivery notificationOutboxService;
    private final NotificationJobs notificationRuleRegistryService;
    private final ScheduledMongoSessionRunner scheduledMongoSessionRunner;

    public PaymentMethodExpiryTaskService(
            SavedPaymentMethodsRepository repository,
            NotificationDelivery notificationOutboxService,
            NotificationJobs notificationRuleRegistryService,
            ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.repository = repository;
        this.notificationOutboxService = notificationOutboxService;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @Scheduled(fixedDelay = 60_000L)
    public void markExpiredAndNotify() {
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::runScheduledPassForCurrentDatabase);
    }

    private void runScheduledPassForCurrentDatabase() {
        var registry = notificationRuleRegistryService;
        if (registry != null) registry.forEachGroup(NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY, this::runScheduledPassForCurrentDatabaseInGroup);
    }

    private void runScheduledPassForCurrentDatabaseInGroup() {
        Instant startedAt = Instant.now();
        Configuration rule = notificationRuleRegistryService
                .findRule(NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY)
                .orElse(null);
        if (rule == null || !notificationRuleRegistryService.shouldRunScheduledRule(
                NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY,
                startedAt)) {
            return;
        }
        if (notificationRuleRegistryService.beginScheduledRun(
                NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY,
                "Scanning expired saved payment cards.",
                SYSTEM_USER,
                startedAt) == null) {
            return;
        }
        try {
            int expiredCount = expireDuePaymentMethods();
            notificationRuleRegistryService.recordRun(
                    NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY,
                    expiredCount,
                    "completed",
                    expiredCount == 0
                            ? "No expired saved payment cards were due."
                            : "Expired and queued notifications for " + expiredCount + " saved payment card(s).",
                    SYSTEM_USER,
                    startedAt);
        } catch (RuntimeException exception) {
            LOGGER.warn("Saved payment card expiry pass failed.", exception);
            notificationRuleRegistryService.recordRun(
                    NotificationJobs.RULE_PAYMENT_METHOD_EXPIRY,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    SYSTEM_USER,
                    startedAt);
        }
    }

    private int expireDuePaymentMethods() {
        YearMonth now = YearMonth.now(ZoneOffset.UTC);
        int currentExpiryKey = now.getYear() * 100 + now.getMonthValue();
        int expiredCount = 0;
        while (true) {
            List<SavedPaymentMethod> candidates = jobGroupScope.findOwned(
                    org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("status").is(ACTIVE)
                            .and("expiryKey").lt(currentExpiryKey).and("expiredNotifiedAtIso").is(null))
                        .with(org.springframework.data.domain.Sort.by("expiryKey")).limit(100), SavedPaymentMethod.class, "userId");
            if (candidates.isEmpty()) {
                return expiredCount;
            }
            int expiredInBatch = 0;
            for (SavedPaymentMethod method : candidates) {
                if (expireAndNotify(method)) {
                    expiredCount += 1;
                    expiredInBatch += 1;
                }
            }
            if (candidates.size() < 100 || expiredInBatch == 0) {
                return expiredCount;
            }
        }
    }

    private boolean expireAndNotify(SavedPaymentMethod method) {
        if (method == null || !StringUtils.hasText(method.getUserId()) || !ACTIVE.equals(method.getStatus())) {
            return false;
        }
        String now = Instant.now().toString();
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("paymentMethodId", method.getId());
        payload.put("provider", safeText(method.getProvider()));
        payload.put("last4", safeText(method.getLast4()));
        payload.put("notification_title_key", "notification.payment.card.expired.title");
        payload.put("notification_message_key", "notification.payment.card.expired.message");
        payload.put("notification_tone", "warning");
        payload.put("notification_avatar_icon", "credit_card_off");
        notificationOutboxService.enqueue(new NotificationIntent(
                "payment-card-expired",
                "payment-method",
                method.getId(),
                "payment-method-owner",
                List.of(method.getUserId()),
                "Payment card expired",
                "Your saved card ending in " + safeText(method.getLast4()) + " has expired.",
                "/home",
                "/assets/logo/heart.webp",
                "/assets/logo/heart.webp",
                "payment-card-expired-" + method.getId(),
                payload,
                SYSTEM_USER));
        return repository.markExpired(method.getId(), method.getUserId(), now) == 1;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
