package com.raxim.myscoutee.profile.controller.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationParticipantClaimDto;
import com.raxim.myscoutee.profile.service.IntegrationParticipantInviteService;

@RestController
public class IntegrationParticipantClaimController {
    private final IntegrationParticipantInviteService invites;
    public IntegrationParticipantClaimController(IntegrationParticipantInviteService invites) { this.invites = invites; }
    public record ClaimRequest(String userId, String token) { }

    @PostMapping("/auth/me/partner-invite/claim")
    public IntegrationParticipantClaimDto claim(@RequestBody ClaimRequest request) {
        return invites.claim(request.userId(), request.token());
    }
}
