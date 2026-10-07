package com.raxim.myscoutee.domain.events.api;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;
public interface PartnerInvitationAdmission { void claimIntegrationInvite(ParticipantInvitation invite, EventOwnership.Event snapshot, String actorUserId); }
