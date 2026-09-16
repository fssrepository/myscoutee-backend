package com.raxim.myscoutee.profile.controller.operator;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateApprovalDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateEventPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateJobDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateOverviewDto;
import com.raxim.myscoutee.profile.service.operator.OperatorUpdateService;

@RestController
@RequestMapping("/operator/updates")
@PreAuthorize("hasAuthority('O')")
public class OperatorUpdateController {
    private final OperatorUpdateService service;
    private final com.raxim.myscoutee.profile.service.operator.OperatorUpdateReleaseService releases;

    public OperatorUpdateController(OperatorUpdateService service,
            com.raxim.myscoutee.profile.service.operator.OperatorUpdateReleaseService releases) {
        this.service = service;
        this.releases = releases;
    }

    @GetMapping
    public OperatorUpdateOverviewDto overview() {
        return service.overview();
    }

    @GetMapping("/releases")
    public com.raxim.myscoutee.profile.service.operator.OperatorUpdateReleaseService.ReleasePage releases() {
        return releases.releases();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public OperatorUpdateJobDto approve(
            @RequestBody OperatorUpdateApprovalDto approval,
            Authentication authentication) {
        return service.approve(approval, actorUserId(authentication));
    }

    @GetMapping("/jobs/{jobId}")
    public OperatorUpdateJobDto status(@PathVariable String jobId) {
        return service.status(jobId);
    }

    @GetMapping("/jobs/{jobId}/events")
    public OperatorUpdateEventPageDto events(
            @PathVariable String jobId,
            @RequestParam(required = false) Long after,
            @RequestParam(required = false) Integer limit) {
        return service.events(jobId, after, limit);
    }

    private String actorUserId(Authentication authentication) {
        if (authentication != null
                && authentication.getPrincipal() instanceof FirebasePrincipal principal) {
            return principal.getUserId();
        }
        return authentication == null ? null : authentication.getName();
    }
}
