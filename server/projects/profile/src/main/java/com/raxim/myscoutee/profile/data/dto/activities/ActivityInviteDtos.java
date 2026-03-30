package com.raxim.myscoutee.profile.data.dto.activities;

public final class ActivityInviteDtos {
    private ActivityInviteDtos() {
    }

    public record ActivityInviteCandidatesRequestDto(
            String activeUserId,
            String ownerId,
            String ownerType,
            String sort) {
    }
}
