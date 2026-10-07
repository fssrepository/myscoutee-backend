package com.raxim.myscoutee.domain.integrations.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "integrationParticipantInvites")
public record IntegrationParticipantInvite(@Id String id, String ownerUserId, String eventId,
        String participantId, String token, @Indexed(unique = true) String tokenHash,
        String claimedUserId, String createdAtIso, String claimedAtIso, String ownerType, boolean reusable) {
    public IntegrationParticipantInvite(String id, String ownerUserId, String eventId, String participantId,
            String token, String tokenHash, String claimedUserId, String createdAtIso, String claimedAtIso, String ownerType) {
        this(id, ownerUserId, eventId, participantId, token, tokenHash, claimedUserId, createdAtIso, claimedAtIso, ownerType, false);
    }
    public IntegrationParticipantInvite(String id, String ownerUserId, String eventId, String participantId,
            String token, String tokenHash, String claimedUserId, String createdAtIso, String claimedAtIso) {
        this(id, ownerUserId, eventId, participantId, token, tokenHash, claimedUserId, createdAtIso, claimedAtIso, "event");
    }
}
