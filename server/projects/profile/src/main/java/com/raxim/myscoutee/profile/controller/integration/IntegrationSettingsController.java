package com.raxim.myscoutee.profile.controller.integration;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSettingsDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreateRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreatedDto;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationPublicEndpointResolver;
import com.raxim.myscoutee.profile.service.IntegrationTokenService;
import com.raxim.myscoutee.profile.service.AffiliateService;

@RestController
@RequestMapping("/integrations")
public class IntegrationSettingsController {
    private final IntegrationTokenService tokenService;
    private final AffiliateService affiliates;
    private final AccessControlService accessControlService;
    private final IntegrationPublicEndpointResolver publicEndpointResolver;

    public IntegrationSettingsController(
            IntegrationTokenService tokenService,
            AccessControlService accessControlService,
            IntegrationPublicEndpointResolver publicEndpointResolver, AffiliateService affiliates) {
        this.tokenService = tokenService;
        this.affiliates = affiliates;
        this.accessControlService = accessControlService;
        this.publicEndpointResolver = publicEndpointResolver;
    }

    @GetMapping("/settings")
    public IntegrationSettingsDto settings(Authentication authentication) {
        String actor = actorUserId(authentication);
        var settings = tokenService.settings(actor, publicEndpointResolver.resolve());
        return new IntegrationSettingsDto(settings.baseUrl(), settings.maxActiveTokens(), settings.maxBatchSize(),
                settings.tokens(), affiliates.summary(actor), affiliates.participantSummary(actor));
    }

    @PostMapping("/tokens")
    public IntegrationTokenCreatedDto createToken(
            Authentication authentication,
            @RequestBody(required = false) IntegrationTokenCreateRequestDto request) {
        return tokenService.create(actorUserId(authentication), request);
    }

    @DeleteMapping("/tokens/{tokenId}")
    public void revokeToken(
            Authentication authentication,
            @PathVariable("tokenId") String tokenId) {
        tokenService.revoke(actorUserId(authentication), tokenId);
    }

    private String actorUserId(Authentication authentication) {
        return accessControlService.resolveActorUserId(authentication);
    }
}
