package com.raxim.myscoutee.profile.data.dto.notifications;

import java.util.List;
import java.util.Map;

public final class NotificationDtos {
    private NotificationDtos() {
    }

    public record UserNotificationDto(
            String id,
            String recipientUserId,
            String kind,
            String category,
            String title,
            String message,
            String createdAtIso,
            String readAtIso,
            String senderUserId,
            String senderName,
            String senderAvatarUrl,
            String actionPath,
            String sourceType,
            String sourceId,
            Map<String, String> payload) {
    }

    public record UserNotificationsPageResponseDto(
            List<UserNotificationDto> records,
            Long total,
            String nextCursor,
            Integer unreadCount,
            Boolean muted) {
    }

    public record UserNotificationReadResponseDto(
            UserNotificationDto notification,
            Integer unreadCount) {
    }

    public record UserNotificationPreferenceRequestDto(
            Boolean muted) {
    }

    public record UserNotificationPreferenceDto(
            Boolean muted) {
    }
}
