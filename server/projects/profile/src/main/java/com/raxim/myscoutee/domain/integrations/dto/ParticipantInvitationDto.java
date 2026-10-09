package com.raxim.myscoutee.domain.integrations.dto;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;
/** Stored invitation facts used by native membership admission; no bearer invite token. */
public record ParticipantInvitationDto(
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) boolean reusable,
        String ownerType, String claimedUserId, String ownerUserId, String eventId) implements ParticipantInvitation {
    public static ParticipantInvitationDto from(ParticipantInvitation invite) {
        return invite == null ? null : new ParticipantInvitationDto(invite.reusable(), invite.ownerType(), invite.claimedUserId(), invite.ownerUserId(), invite.eventId());
    }
}
