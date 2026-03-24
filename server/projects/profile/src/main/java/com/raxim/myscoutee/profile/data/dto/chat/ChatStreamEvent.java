package com.raxim.myscoutee.profile.data.dto.chat;

import java.util.List;
import java.util.Objects;

public record ChatStreamEvent(
        String chatId,
        String id,
        String senderProfileId,
        String senderId,
        String senderName,
        String senderInitials,
        String senderGender,
        String text,
        String sentAtIso) {

    public ActivitiesChatMessageDto toMessage(String viewerProfileId) {
        return new ActivitiesChatMessageDto(
                id,
                senderId,
                senderName,
                senderInitials,
                senderGender,
                text,
                sentAtIso,
                Objects.equals(senderProfileId, viewerProfileId),
                List.of());
    }
}
