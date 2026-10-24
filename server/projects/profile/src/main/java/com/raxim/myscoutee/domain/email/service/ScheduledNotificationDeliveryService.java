package com.raxim.myscoutee.domain.email.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.email.config.EmailProperties;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog.Template;
import com.raxim.myscoutee.domain.accounts.api.EmailProfile;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@Service
public class ScheduledNotificationDeliveryService {
    private static final String DEFAULT_CLICK_PATH = "/game";

    private final EmailProperties emailProperties;
    private final EmailTemplateRenderer templateRenderer;
    private final NotificationDelivery notificationOutboxService;

    public ScheduledNotificationDeliveryService(
            EmailProperties emailProperties,
            EmailTemplateRenderer templateRenderer,
            NotificationDelivery notificationOutboxService) {
        this.emailProperties = emailProperties;
        this.templateRenderer = templateRenderer;
        this.notificationOutboxService = notificationOutboxService;
    }

    public boolean send(EmailProfile user, Template template, Map<String, String> variables, String ruleKey) {
        if (user == null || template == null || !StringUtils.hasText(safeText(user.getUserId()))) {
            return false;
        }
        String title = templateRenderer.renderText(template.titleTemplate(), variables).trim();
        String body = templateRenderer.renderText(template.bodyTemplate(), variables).trim();
        if (!StringUtils.hasText(title) || !StringUtils.hasText(body)) {
            return false;
        }

        String clickUrl = resolveClickUrl(template);
        String iconUrl = templateRenderer
                .renderText(template.iconUrl(), variables)
                .trim();
        String badgeUrl = templateRenderer
                .renderText(template.badgeUrl(), variables)
                .trim();
        String templateKey = safeText(template.templateKey());
        String tag = "scheduled-" + firstNonBlank(ruleKey, templateKey);
        String notificationKind = firstNonBlank(
                variables == null ? null : variables.get("notification_kind"),
                "scheduled-template");
        String notificationSourceType = firstNonBlank(
                variables == null ? null : variables.get("notification_source_type"),
                "notification-template");
        String notificationSourceId = firstNonBlank(
                variables == null ? null : variables.get("notification_source_id"),
                templateKey);
        String notificationRecipientScope = firstNonBlank(
                variables == null ? null : variables.get("notification_recipient_scope"),
                "scheduled-user");
        Map<String, String> payload = notificationPayload(
                variables,
                ruleKey,
                templateKey);
        return notificationOutboxService.enqueue(new NotificationIntent(
                notificationKind,
                notificationSourceType,
                notificationSourceId,
                notificationRecipientScope,
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

    private Map<String, String> notificationPayload(
            Map<String, String> variables,
            String ruleKey,
            String templateKey) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("ruleKey", safeText(ruleKey));
        payload.put("templateKey", templateKey);
        payload.put(
                "timestampMillis",
                Long.toString(Instant.now().toEpochMilli()));
        copyIfText(variables, payload, "productName");
        copyIfText(variables, payload, "product_name");
        copyIfText(variables, payload, "productLogoUrl");
        copyIfText(variables, payload, "product_logo_url");
        copyIfText(variables, payload, "productBrandingRevision");
        copyIfText(variables, payload, "product_branding_revision");
        copyIfText(variables, payload, "notification_tone");
        copyIfText(variables, payload, "notification_title_key");
        copyIfText(variables, payload, "notification_message_key");
        copyIfText(variables, payload, "notification_status_badge_key");
        copyIfText(variables, payload, "notification_status_badge_fallback");
        copyIfText(variables, payload, "notification_status_badge_tone");
        return payload;
    }

    private void copyIfText(
            Map<String, String> source,
            Map<String, String> target,
            String key) {
        String value = source == null ? "" : safeText(source.get(key));
        if (StringUtils.hasText(value)) {
            target.put(key, value);
        }
    }

    private String resolveClickUrl(Template template) {
        String ctaPath = firstNonBlank(template.ctaPath(), DEFAULT_CLICK_PATH);
        if (ctaPath.startsWith("http://") || ctaPath.startsWith("https://")) {
            return ctaPath;
        }
        String baseUrl = firstNonBlank(emailProperties.getBaseUrl(), "http://localhost:4200").transform(edgeText -> org.springframework.util.StringUtils.trimTrailingCharacter(edgeText, '/'));
        return baseUrl + (ctaPath.startsWith("/") ? ctaPath : "/" + ctaPath);
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
