package com.raxim.myscoutee.domain.integrations.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantClaimDto;
import com.raxim.myscoutee.domain.integrations.service.IntegrationParticipantInviteService;

@RestController
public class IntegrationParticipantClaimController {
    private final IntegrationParticipantInviteService invites;
    public IntegrationParticipantClaimController(IntegrationParticipantInviteService invites) { this.invites = invites; }
    public record LinkRequest(String userId, String ownerType, String entityId) { }
    @PostMapping("/auth/me/partner-invite/link")
    public IntegrationParticipantInviteService.ExternalInviteLinkDto link(@RequestBody LinkRequest request) {
        return invites.externalLink(request.userId(), request.ownerType(), request.entityId());
    }
    public record ClaimRequest(String userId, String token) { }

    @PostMapping("/auth/me/partner-invite/claim")
    public IntegrationParticipantClaimDto claim(@RequestBody ClaimRequest request) {
        return invites.claim(request.userId(), request.token());
    }
}
