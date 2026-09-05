package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class PaymentMethodExpiryTaskService {
    private static final String ACTIVE = "active";
    private final SavedPaymentMethodsRepository repository;
    private final NotificationOutboxService notificationOutboxService;

    public PaymentMethodExpiryTaskService(
            SavedPaymentMethodsRepository repository,
            NotificationOutboxService notificationOutboxService) {
        this.repository = repository;
        this.notificationOutboxService = notificationOutboxService;
    }

    @Scheduled(cron = "0 15 2 * * *")
    public void markExpiredAndNotify() {
        YearMonth now = YearMonth.now();
        int currentExpiryKey = now.getYear() * 100 + now.getMonthValue();
        List<SavedPaymentMethod> candidates = repository
                .findTop100ByStatusAndExpiryKeyLessThanAndExpiredNotifiedAtIsoIsNullOrderByExpiryKeyAsc(
                        ACTIVE,
                        currentExpiryKey);
        for (SavedPaymentMethod method : candidates) {
            expireAndNotify(method);
        }
    }

    private void expireAndNotify(SavedPaymentMethod method) {
        if (method == null || !StringUtils.hasText(method.getUserId()) || !ACTIVE.equals(method.getStatus())) {
            return;
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
                "payment-method-expiry-task"));
        method.setStatus("expired");
        method.setUpdatedAtIso(now);
        method.setExpiredNotifiedAtIso(now);
        repository.save(method);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
