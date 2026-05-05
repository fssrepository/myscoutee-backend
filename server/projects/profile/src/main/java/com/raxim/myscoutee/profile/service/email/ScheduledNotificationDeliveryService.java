package com.raxim.myscoutee.profile.service.email;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;
import com.google.firebase.messaging.WebpushNotification;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.NotificationTemplate;
import com.raxim.myscoutee.profile.data.document.Users;

@Service
public class ScheduledNotificationDeliveryService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduledNotificationDeliveryService.class);
    private static final String DEFAULT_BADGE_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_PATH = "/game";

    private final ConfigProperties configProperties;
    private final EmailProperties emailProperties;
    private final EmailTemplateRenderer templateRenderer;

    public ScheduledNotificationDeliveryService(
            ConfigProperties configProperties,
            EmailProperties emailProperties,
            EmailTemplateRenderer templateRenderer) {
        this.configProperties = configProperties;
        this.emailProperties = emailProperties;
        this.templateRenderer = templateRenderer;
    }

    public boolean send(Users user, NotificationTemplate template, Map<String, String> variables, String ruleKey) {
        if (user == null || template == null || !configProperties.isFirebaseEnabled()) {
            return false;
        }
        Set<String> tokens = firebaseTokens(user);
        if (tokens.isEmpty()) {
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
        boolean accepted = false;
        for (String token : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .putData("type", "scheduled-template")
                        .putData("ruleKey", safeText(ruleKey))
                        .putData("templateKey", templateKey)
                        .putData("title", title)
                        .putData("body", body)
                        .putData("url", clickUrl)
                        .putData("icon", iconUrl)
                        .putData("badge", badgeUrl)
                        .putData("tag", tag)
                        .setWebpushConfig(WebpushConfig.builder()
                                .putHeader("Urgency", "normal")
                                .putData("type", "scheduled-template")
                                .putData("ruleKey", safeText(ruleKey))
                                .putData("templateKey", templateKey)
                                .putData("title", title)
                                .putData("body", body)
                                .putData("url", clickUrl)
                                .putData("icon", iconUrl)
                                .putData("badge", badgeUrl)
                                .putData("tag", tag)
                                .setFcmOptions(WebpushFcmOptions.withLink(clickUrl))
                                .setNotification(WebpushNotification.builder()
                                        .setTitle(title)
                                        .setBody(body)
                                        .setIcon(iconUrl)
                                        .setBadge(badgeUrl)
                                        .setTag(tag)
                                        .setTimestampMillis(Instant.now().toEpochMilli())
                                        .build())
                                .build())
                        .build();
                FirebaseMessaging.getInstance().send(message);
                accepted = true;
            } catch (Exception exception) {
                LOGGER.warn("Unable to send scheduled notification {} to user {}.", templateKey, safeText(user.getId()), exception);
            }
        }
        return accepted;
    }

    private Set<String> firebaseTokens(Users user) {
        Set<String> tokens = new LinkedHashSet<>();
        for (Users.UserDeviceRecord device : user.getDevices()) {
            if (device == null || !Boolean.TRUE.equals(device.getNotificationsEnabled())) {
                continue;
            }
            String token = safeText(device.getFirebaseToken());
            if (StringUtils.hasText(token)) {
                tokens.add(token);
            }
        }
        return tokens;
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
