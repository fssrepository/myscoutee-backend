package com.raxim.myscoutee.profile.controller.operator;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorTlsDtos.TlsConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorTlsDtos.TlsConfigurationUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorTlsDtos.TlsJobDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorTlsDtos.TlsTestRequestDto;
import com.raxim.myscoutee.profile.service.operator.OperatorTlsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/operator/configuration/tls")
@PreAuthorize("hasAuthority('O')")
public class OperatorTlsController {
    private final OperatorTlsService service;

    public OperatorTlsController(OperatorTlsService service) {
        this.service = service;
    }

    @GetMapping
    public TlsConfigurationDto configuration() {
        return service.configuration();
    }

    @PutMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public TlsJobDto apply(
            @Valid @RequestBody TlsConfigurationUpdateDto request,
            Authentication authentication) {
        return service.apply(request, actorUserId(authentication));
    }

    @PostMapping("/tests")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public TlsJobDto test(
            @Valid @RequestBody TlsTestRequestDto request,
            Authentication authentication) {
        return service.test(request, actorUserId(authentication));
    }

    @GetMapping("/jobs/{jobId}")
    public TlsJobDto status(@PathVariable String jobId) {
        return service.status(jobId);
    }

    private String actorUserId(Authentication authentication) {
        if (authentication != null
                && authentication.getPrincipal() instanceof FirebasePrincipal principal) {
            return principal.getUserId();
        }
        return authentication == null ? null : authentication.getName();
    }
}
