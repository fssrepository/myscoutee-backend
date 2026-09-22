package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.*;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.*;

@RestController
@RequestMapping("/admin/client-api")
public class AdminClientSettingsController {
    private final AccessControlService actors;
    private final AdminClientAccessService access;
    private final IntegrationTokenService tokens;
    public AdminClientSettingsController(AccessControlService actors, AdminClientAccessService access, IntegrationTokenService tokens) {
        this.actors = actors; this.access = access; this.tokens = tokens;
    }
    private String owner(Authentication authentication) {
        String id = actors.resolveActorUserId(authentication); access.requireAdmin(id); return id;
    }
    @GetMapping("/settings") public IntegrationSettingsDto settings(Authentication authentication) {
        return tokens.settings(owner(authentication), "/api/admin-client/v1", IntegrationTokenService.ADMIN_SCOPE);
    }
    @PostMapping("/tokens") public IntegrationTokenCreatedDto create(Authentication authentication, @RequestBody IntegrationTokenCreateRequestDto request) {
        return tokens.create(owner(authentication), request, IntegrationTokenService.ADMIN_SCOPE);
    }
    @DeleteMapping("/tokens/{id}") public void revoke(Authentication authentication, @PathVariable String id) {
        tokens.revoke(owner(authentication), id, IntegrationTokenService.ADMIN_SCOPE);
    }
}
