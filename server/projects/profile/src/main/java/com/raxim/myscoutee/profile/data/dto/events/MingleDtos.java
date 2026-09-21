package com.raxim.myscoutee.profile.data.dto.events;

import java.util.List;

public final class MingleDtos {
    private MingleDtos() {
    }

    public record MingleActionRequestDto(
            String eventId,
            String actorUserId,
            String action) {
    }

    public record MingleParticipantDto(
            String userId,
            String name,
            String initials,
            String avatarUrl) {
    }

    public record MingleTableDto(
            Integer tableNumber,
            List<MingleParticipantDto> participants) {
    }

    public record MingleStateDto(
            String eventId,
            String eventTitle,
            String status,
            Integer roundNumber,
            Integer plannedRounds,
            String phaseStartedAtIso,
            String phaseEndsAtIso,
            Long remainingSeconds,
            Integer tableNumber,
            List<MingleTableDto> tables,
            Boolean canManage,
            Integer revision) {
    }
}
