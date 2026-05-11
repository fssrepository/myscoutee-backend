package com.raxim.myscoutee.profile.service.email;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.NotificationTemplate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ScheduledNotificationDeliveryService {
    private static final String DEFAULT_BADGE_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_PATH = "/game";

    private final EmailProperties emailProperties;
    private final EmailTemplateRenderer templateRenderer;
    private final NotificationOutboxService notificationOutboxService;

    public ScheduledNotificationDeliveryService(
            EmailProperties emailProperties,
            EmailTemplateRenderer templateRenderer,
            NotificationOutboxService notificationOutboxService) {
        this.emailProperties = emailProperties;
        this.templateRenderer = templateRenderer;
        this.notificationOutboxService = notificationOutboxService;
    }

    public boolean send(Users user, NotificationTemplate template, Map<String, String> variables, String ruleKey) {
        if (user == null || template == null || !StringUtils.hasText(safeText(user.getUserId()))) {
            return false;
        }
        String title = templateRenderer.renderText(template.getTitleTemplate(), variables).trim();
        String body = templateRenderer.renderText(template.getBodyTemplate(), variables).trim();
        if (!StringUtils.hasText(title) || !StringUtils.hasText(body)) {
            return false;
        }

        String clickUrl = resolveClickUrl(template);
        String iconUrl = firstNonBlank(template.getIconUrl(), DEFAULT_ICON_URL);
        String badgeUrl = firstNonBlank(template.getBadgeUrl(), DEFAULT_BADGE_URL);
        String templateKey = safeText(template.getTemplateKey());
        String tag = "scheduled-" + firstNonBlank(ruleKey, templateKey);
        Map<String, String> payload = Map.of(
                "ruleKey", safeText(ruleKey),
                "templateKey", templateKey,
                "timestampMillis", Long.toString(Instant.now().toEpochMilli()));
        return notificationOutboxService.enqueue(new NotificationIntent(
                "scheduled-template",
                "notification-template",
                templateKey,
                "scheduled-user",
                List.of(safeText(user.getUserId())),
                title,
                body,
                clickUrl,
                iconUrl,
                badgeUrl,
                tag,
                payload,
                "notification-scheduler")).isPresent();
    }

    private String resolveClickUrl(NotificationTemplate template) {
        String ctaPath = firstNonBlank(template.getCtaPath(), DEFAULT_CLICK_PATH);
        if (ctaPath.startsWith("http://") || ctaPath.startsWith("https://")) {
            return ctaPath;
        }
        String baseUrl = firstNonBlank(emailProperties.getBaseUrl(), "http://localhost:4200").replaceAll("/+$", "");
        return baseUrl + (ctaPath.startsWith("/") ? ctaPath : "/" + ctaPath);
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
