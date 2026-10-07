package com.raxim.myscoutee.domain.operator.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.accounts.api.AccountIdentity;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.OperatorRegistryMutationResultDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.OperatorRegistryStatusDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryConfirmRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryInspectRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryInspectionDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryRegisterRequestDto;
import com.raxim.myscoutee.domain.operator.service.OperatorRegistryService;

@RestController
@RequestMapping("/operator/registry")
@PreAuthorize("hasAuthority('O')")
public class OperatorRegistryController {
    private final OperatorRegistryService service;

    public OperatorRegistryController(OperatorRegistryService service) {
        this.service = service;
    }

    @GetMapping
    public OperatorRegistryStatusDto status() {
        return service.status();
    }

    @PostMapping("/inspect")
    public RegistryInspectionDto inspect(
            @RequestBody(required = false) RegistryInspectRequestDto request,
            Authentication authentication) {
        return service.inspect(request, actorUserId(authentication));
    }

    @PostMapping("/confirm")
    public OperatorRegistryStatusDto confirm(
            @RequestBody(required = false) RegistryConfirmRequestDto request,
            Authentication authentication) {
        return service.confirm(
                request == null ? null : request.inspectionToken(),
                actorUserId(authentication));
    }

    @PostMapping("/register")
    public OperatorRegistryMutationResultDto register(
            @RequestBody(required = false) RegistryRegisterRequestDto request,
            Authentication authentication) {
        return service.register(request, actorUserId(authentication));
    }

    @PostMapping("/retry")
    public OperatorRegistryStatusDto retry(Authentication authentication) {
        return service.retry(actorUserId(authentication));
    }

    @PostMapping("/disconnect")
    public OperatorRegistryMutationResultDto disconnect(Authentication authentication) {
        return service.disconnect(actorUserId(authentication));
    }

    private String actorUserId(Authentication authentication) {
        if (authentication != null
                && authentication.getPrincipal() instanceof AccountIdentity principal) {
            return principal.getUserId();
        }
        return authentication == null ? null : authentication.getName();
    }
}
