package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class EventInviteNotificationService {
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";
    private static final String APP_FALLBACK_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";

    private final NotificationOutboxService notificationOutboxService;

    public EventInviteNotificationService(NotificationOutboxService notificationOutboxService) {
        this.notificationOutboxService = notificationOutboxService;
    }

    public void notifyInvitees(
            ActivityEvent event,
            List<String> invitedUserIds,
            String actorUserId) {
        if (event == null || invitedUserIds == null || invitedUserIds.isEmpty()) {
            return;
        }
        List<String> recipients = invitedUserIds.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (recipients.isEmpty()) {
            return;
        }

        String eventId = safeText(event.getSourceId());
        String eventTitle = resolveTitle(event);
        String body = buildBody(event);
        String clickUrl = DEFAULT_CLICK_URL;
        String imageUrl = resolveImageUrl(event);
        String notificationTag = StringUtils.hasText(eventId) ? "event-invite-" + eventId : "event-invite";
        long timestampMillis = resolveTimestampMillis(event.getUpdatedDate(), event.getCreatedDate(), event.getStartAtIso());
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("location", safeText(event.getLocation()));
        payload.put("startAtIso", safeText(event.getStartAtIso()));
        payload.put("eventScope", "invitations");
        String senderUserId = safeText(actorUserId);
        if (StringUtils.hasText(senderUserId)) {
            payload.put("senderUserId", senderUserId);
        }
        if (timestampMillis > 0L) {
            payload.put("timestampMillis", Long.toString(timestampMillis));
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-invite",
                "event",
                eventId,
                "invitees",
                recipients,
                eventTitle,
                body,
                clickUrl,
                imageUrl,
                APP_BADGE_URL,
                notificationTag,
                payload,
                StringUtils.hasText(senderUserId) ? senderUserId : null));
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
