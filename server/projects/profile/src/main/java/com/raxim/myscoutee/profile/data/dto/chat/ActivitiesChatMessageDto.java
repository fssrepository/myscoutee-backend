package com.raxim.myscoutee.profile.data.dto.chat;

import java.util.List;

public record ActivitiesChatMessageDto(
        String id,
        String senderId,
        String senderName,
        String senderInitials,
        String senderGender,
        String text,
        String sentAtIso,
        boolean mine,
        List<ActivitiesChatReadAvatarDto> readBy) {
}
