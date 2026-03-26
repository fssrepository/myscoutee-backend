package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.Objects;

import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatReadAvatarDto;

public record ChatStreamEvent(
        String chatId,
        String id,
        String senderId,
        String senderName,
        String senderInitials,
        String senderGender,
        String text,
        String sentAtIso,
        List<ChatReadAvatarDto> readBy) {

    public ChatMessageDto toMessage(String viewerUserId) {
        return new ChatMessageDto(
                id,
                senderId,
                senderName,
                senderInitials,
                senderGender,
                text,
                sentAtIso,
                Objects.equals(senderId, viewerUserId),
                readBy == null ? List.of() : List.copyOf(readBy));
    }
}
