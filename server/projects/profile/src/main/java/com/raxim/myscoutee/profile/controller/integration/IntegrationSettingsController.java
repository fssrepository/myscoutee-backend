package com.raxim.myscoutee.profile.controller.integration;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSettingsDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreateRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreatedDto;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService;
import com.raxim.myscoutee.profile.service.IntegrationSettingsService;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSettingsUpdateDto;

@RestController
@RequestMapping("/integrations")
public class IntegrationSettingsController {
    private final IntegrationTokenService tokenService;
    private final AccessControlService accessControlService;
    private final IntegrationSettingsService settingsService;

    public IntegrationSettingsController(
            IntegrationTokenService tokenService,
            AccessControlService accessControlService,
            IntegrationSettingsService settingsService) {
        this.tokenService = tokenService;
        this.accessControlService = accessControlService;
        this.settingsService = settingsService;
    }

    @GetMapping("/settings")
    public IntegrationSettingsDto settings(Authentication authentication) {
        return settingsService.load(actorUserId(authentication));
    }

    @PutMapping("/settings")
    public IntegrationSettingsDto saveSettings(Authentication authentication,
            @RequestBody IntegrationSettingsUpdateDto request) {
        return settingsService.save(actorUserId(authentication), request);
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
