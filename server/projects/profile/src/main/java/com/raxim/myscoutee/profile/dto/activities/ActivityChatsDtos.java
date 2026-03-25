package com.raxim.myscoutee.profile.dto.activities;

import java.util.List;

public final class ActivityChatsDtos {
    private ActivityChatsDtos() {
    }

    public record ChatReadAvatarDto(
            String id,
            String initials,
            String gender) {
    }

    public record ChatSummaryDto(
            String id,
            String avatar,
            String title,
            String lastMessage,
            String lastSenderId,
            List<String> memberIds,
            Integer unread,
            String dateIso,
            String channelType,
            String eventId,
            String subEventId,
            String groupId,
            Double distanceKm,
            Integer distanceMetersExact) {
    }

    public record ChatMessageDto(
            String id,
            String senderId,
            String senderName,
            String senderInitials,
            String senderGender,
            String text,
            String sentAtIso,
            Boolean mine,
            List<ChatReadAvatarDto> readBy) {
    }

    public record ChatPostMessageRequestDto(
            String text) {
    }
}
