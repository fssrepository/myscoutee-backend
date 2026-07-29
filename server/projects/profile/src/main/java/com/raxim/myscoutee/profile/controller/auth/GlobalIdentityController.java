package com.raxim.myscoutee.profile.controller.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityConsentRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityStatusDto;
import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityUnlinkRequestDto;
import com.raxim.myscoutee.profile.service.operator.OperatorGlobalIdentityService;

@RestController
@RequestMapping("/auth/me/global-identity")
public class GlobalIdentityController {
    private final OperatorGlobalIdentityService service;

    public GlobalIdentityController(
            OperatorGlobalIdentityService service) {
        this.service = service;
    }

    @GetMapping
    public GlobalIdentityStatusDto status(Authentication authentication) {
        return service.status(authentication);
    }

    @PostMapping
    public GlobalIdentityStatusDto link(
            Authentication authentication,
            @RequestBody GlobalIdentityConsentRequestDto request) {
        return service.link(authentication, request);
    }

    @PostMapping("/rotate")
    public GlobalIdentityStatusDto rotate(Authentication authentication) {
        return service.rotate(authentication);
    }

    @PostMapping("/unlink")
    public GlobalIdentityStatusDto unlink(
            Authentication authentication,
            @RequestBody GlobalIdentityUnlinkRequestDto request) {
        return service.unlink(authentication, request);
    }
}
