package com.raxim.myscoutee.profile.data.dto.chat;

import java.util.List;

public record ActivitiesChatSummaryDto(
        String id,
        String avatar,
        String title,
        String lastMessage,
        String lastSenderId,
        List<String> memberIds,
        int unread,
        String dateIso,
        String channelType,
        String eventId,
        double distanceKm,
        int distanceMetersExact) {
}
