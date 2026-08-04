package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

@Service
public class EventInviteNotificationService {
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";
    private static final String APP_FALLBACK_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";

    private final NotificationOutboxService notificationOutboxService;
    private final UserNotificationService userNotificationService;

    public EventInviteNotificationService(
            NotificationOutboxService notificationOutboxService,
            UserNotificationService userNotificationService) {
        this.notificationOutboxService = notificationOutboxService;
        this.userNotificationService = userNotificationService;
    }

    public void notifyInvitees(
            ActivityEvent event,
            List<String> invitedUserIds,
            String actorUserId) {
        if (event == null || invitedUserIds == null || invitedUserIds.isEmpty()) {
            return;
        }
        String senderUserId = safeText(actorUserId);
        List<String> recipients = invitedUserIds.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(senderUserId))
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
        payload.put("invitationOccurrenceId", UUID.randomUUID().toString());
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

    public int markInvitationResolved(String eventId, String recipientUserId) {
        return userNotificationService.markEventInvitationResolved(
                safeText(recipientUserId),
                safeText(eventId));
    }

    public void notifyInvitationAccepted(
            ActivityEvent event,
            String acceptedUserId,
            String acceptedUserName,
            String acceptedAtIso,
            List<String> recipientUserIds) {
        if (event == null) {
            return;
        }
        String memberUserId = safeText(acceptedUserId);
        if (!StringUtils.hasText(memberUserId)) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>();
        if (recipientUserIds != null) {
            recipientUserIds.stream()
                    .map(this::safeText)
                    .filter(StringUtils::hasText)
                    .forEach(recipients::add);
        }
        recipients.remove(memberUserId);
        if (recipients.isEmpty()) {
            return;
        }
        List<String> notificationRecipients = List.copyOf(recipients);

        String eventId = safeText(event.getSourceId());
        String eventTitle = resolveTitle(event);
        String memberName = StringUtils.hasText(safeText(acceptedUserName))
                ? safeText(acceptedUserName)
                : memberUserId;
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("eventScope", "members");
        payload.put("memberUserId", memberUserId);
        payload.put("memberName", memberName);
        payload.put("membershipAction", "accepted");
        payload.put("notification_tone", "accent");
        if (StringUtils.hasText(safeText(acceptedAtIso))) {
            payload.put("acceptedAtIso", safeText(acceptedAtIso));
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-invitation-accepted",
                "event",
                eventId,
                "event-participants",
                notificationRecipients,
                "Event invitation accepted",
                memberName + " accepted the invitation to " + eventTitle + ".",
                DEFAULT_CLICK_URL,
                resolveImageUrl(event),
                APP_BADGE_URL,
                "event-invitation-accepted-" + eventId + "-" + memberUserId,
                payload,
                memberUserId));
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
