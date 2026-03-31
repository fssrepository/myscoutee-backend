package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
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
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class EventInviteNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventInviteNotificationService.class);
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";
    private static final String APP_FALLBACK_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";

    private final ConfigProperties configProperties;
    private final UsersRepository usersRepository;

    public EventInviteNotificationService(
            ConfigProperties configProperties,
            UsersRepository usersRepository) {
        this.configProperties = configProperties;
        this.usersRepository = usersRepository;
    }

    public void notifyInvitees(ActivityEvent event, List<String> invitedUserIds) {
        if (!configProperties.isFirebaseEnabled() || event == null || invitedUserIds == null || invitedUserIds.isEmpty()) {
            return;
        }

        String eventId = safeText(event.getSourceId());
        String eventTitle = resolveTitle(event);
        String body = buildBody(event);
        String clickUrl = DEFAULT_CLICK_URL;
        String imageUrl = resolveImageUrl(event);
        String notificationTag = StringUtils.hasText(eventId) ? "event-invite-" + eventId : "event-invite";
        long timestampMillis = resolveTimestampMillis(event.getUpdatedDate(), event.getCreatedDate(), event.getStartAtIso());

        for (String userId : invitedUserIds.stream().map(this::safeText).filter(StringUtils::hasText).distinct().toList()) {
            Users user = usersRepository.findByUserId(userId).orElse(null);
            if (user == null || user.getDevices() == null || user.getDevices().isEmpty()) {
                continue;
            }
            for (String firebaseToken : resolveFirebaseTokens(user)) {
                try {
                    Message.Builder messageBuilder = Message.builder()
                            .setToken(firebaseToken)
                            .putData("type", "event-invite")
                            .putData("eventId", eventId)
                            .putData("eventTitle", eventTitle)
                            .putData("title", eventTitle)
                            .putData("body", body)
                            .putData("location", safeText(event.getLocation()))
                            .putData("startAtIso", safeText(event.getStartAtIso()))
                            .putData("eventScope", "invitations")
                            .putData("url", clickUrl)
                            .putData("icon", imageUrl)
                            .putData("badge", APP_BADGE_URL)
                            .putData("tag", notificationTag);
                    WebpushNotification.Builder notificationBuilder = WebpushNotification.builder()
                            .setTitle(eventTitle)
                            .setBody(body)
                            .setIcon(imageUrl)
                            .setBadge(APP_BADGE_URL)
                            .setTag(notificationTag)
                            .setRenotify(true)
                            .setRequireInteraction(false);
                    if (timestampMillis > 0L) {
                        notificationBuilder.setTimestampMillis(timestampMillis);
                    }
                    messageBuilder.setWebpushConfig(WebpushConfig.builder()
                            .putHeader("Urgency", "high")
                            .putData("type", "event-invite")
                            .putData("eventId", eventId)
                            .putData("eventTitle", eventTitle)
                            .putData("title", eventTitle)
                            .putData("body", body)
                            .putData("location", safeText(event.getLocation()))
                            .putData("startAtIso", safeText(event.getStartAtIso()))
                            .putData("eventScope", "invitations")
                            .putData("url", clickUrl)
                            .putData("icon", imageUrl)
                            .putData("badge", APP_BADGE_URL)
                            .putData("tag", notificationTag)
                            .setFcmOptions(WebpushFcmOptions.withLink(clickUrl))
                            .setNotification(notificationBuilder.build())
                            .build());
                    FirebaseMessaging.getInstance().sendAsync(messageBuilder.build());
                } catch (Exception exception) {
                    LOGGER.warn("Unable to send event invite notification to user {}.", userId, exception);
                }
            }
        }
    }

    private Set<String> resolveFirebaseTokens(Users user) {
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

    private String resolveTitle(ActivityEvent event) {
        String title = safeText(event.getTitle());
        return StringUtils.hasText(title) ? title : "New event invitation";
    }

    private String buildBody(ActivityEvent event) {
        String title = safeText(event.getTitle());
        String location = safeText(event.getLocation());
        if (StringUtils.hasText(title) && StringUtils.hasText(location)) {
            return "You were invited to " + title + " at " + location + ".";
        }
        if (StringUtils.hasText(title)) {
            return "You were invited to " + title + ".";
        }
        return "You have a new event invitation.";
    }

    private String resolveImageUrl(ActivityEvent event) {
        String imageUrl = safeText(event.getImageUrl());
        return StringUtils.hasText(imageUrl) ? imageUrl : APP_FALLBACK_ICON_URL;
    }

    private long resolveTimestampMillis(String updatedDate, String createdDate, String startAtIso) {
        for (String value : List.of(safeText(updatedDate), safeText(createdDate), safeText(startAtIso))) {
            if (!StringUtils.hasText(value)) {
                continue;
            }
            try {
                return Instant.parse(value).toEpochMilli();
            } catch (Exception ignored) {
            }
        }
        return 0L;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
