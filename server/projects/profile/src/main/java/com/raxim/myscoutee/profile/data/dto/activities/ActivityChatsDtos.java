package com.raxim.myscoutee.profile.data.dto.activities;

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

    public record ChatPageResponseDto(
            List<ChatSummaryDto> items,
            Integer total,
            String nextCursor) {
    }

    public record ChatMessageDto(
            String id,
            String clientId,
            String senderId,
            String senderName,
            String senderInitials,
            String senderGender,
            String text,
            String sentAtIso,
            Boolean mine,
            List<ChatReadAvatarDto> readBy,
            List<ChatMessageAttachmentDto> attachments) {
    }

    public record ChatMessageAttachmentDto(
            String id,
            String type,
            String title,
            String url,
            String previewUrl,
            String mimeType,
            Long sizeBytes) {
    }

    public record ChatTypingDto(
            String userId,
            String userName,
            String userInitials,
            String userGender,
            Boolean typing) {
    }

    public record ChatReadReceiptDto(
            String userId,
            String userInitials,
            String userGender,
            List<String> messageIds,
            String readAtIso) {
    }

    public record ChatSocketEventDto(
            String type,
            String chatId,
            ChatMessageDto message,
            ChatTypingDto typing,
            ChatReadReceiptDto read) {
    }

    public record ChatPostMessageRequestDto(
            String text,
            List<ChatMessageAttachmentDto> attachments) {
    }

    public record ChatSocketRequestDto(
            String type,
            String clientId,
            String text,
            List<ChatMessageAttachmentDto> attachments,
            Boolean typing,
            List<String> messageIds) {
    }

    public record ChatDeviceUpsertRequestDto(
            String userId,
            String deviceId,
            String platform,
            String firebaseToken,
            Boolean notificationsEnabled) {
    }

    public record ChatDeviceDeleteRequestDto(
            String userId,
            String deviceId,
            String firebaseToken) {
    }
}
