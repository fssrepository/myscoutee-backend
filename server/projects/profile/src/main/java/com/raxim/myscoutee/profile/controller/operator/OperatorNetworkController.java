package com.raxim.myscoutee.profile.controller.operator;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionReferenceRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClientTokenRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorIdempotencyRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardDeploymentPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorRedeemClientTokenRequestDto;
import com.raxim.myscoutee.profile.service.operator.OperatorNetworkService;
import com.raxim.myscoutee.registry.RegistryProtocol;

@RestController
@RequestMapping("/operator")
@PreAuthorize("hasAuthority('O')")
public class OperatorNetworkController {
    private final OperatorNetworkService service;

    public OperatorNetworkController(OperatorNetworkService service) {
        this.service = service;
    }

    @PostMapping("/network/actions")
    public OperatorActionResultDto action(
            @RequestBody OperatorActionRequestDto request,
            Authentication authentication) {
        return service.apply(request, actorUserId(authentication));
    }

    @PostMapping("/claim")
    public OperatorActionResultDto claim(
            @RequestBody(required = false) OperatorClaimRequestDto request,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_CLAIM,
                        request == null ? null : request.operatorName(),
                        request == null ? null : request.operatorAvatarUrl(),
                        null,
                        null,
                        null,
                        null,
                        request == null ? null : request.idempotencyKey()),
                actorUserId(authentication));
    }

    @GetMapping("/claim")
    public OperatorClaimStatusDto claimStatus(Authentication authentication) {
        return service.claimStatus(actorUserId(authentication));
    }

    @PostMapping("/claim/withdraw")
    public OperatorActionResultDto withdrawClaim(
            @RequestBody(required = false) OperatorIdempotencyRequestDto request,
            Authentication authentication) {
        return noPayloadAction(
                RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
                request == null ? null : request.idempotencyKey(),
                authentication);
    }

    @PostMapping("/claim/client-token")
    public OperatorActionResultDto issueClientToken(
            @RequestBody(required = false) OperatorClientTokenRequestDto request,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN,
                        null,
                        null,
                        null,
                        request == null ? null : request.tokenTtlSeconds(),
                        null,
                        null,
                        request == null ? null : request.idempotencyKey()),
                actorUserId(authentication));
    }

    @PostMapping("/claim/client-token/revoke")
    public OperatorActionResultDto revokeClientToken(
            @RequestBody OperatorActionReferenceRequestDto request,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN,
                        null,
                        null,
                        null,
                        null,
                        request == null ? null : request.referenceId(),
                        null,
                        request == null ? null : request.idempotencyKey()),
                actorUserId(authentication));
    }

    @PostMapping("/claim/redeem")
    public OperatorActionResultDto redeemClientToken(
            @RequestBody OperatorRedeemClientTokenRequestDto request,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                        null,
                        null,
                        request == null ? null : request.clientToken(),
                        null,
                        null,
                        null,
                        request == null ? null : request.idempotencyKey()),
                actorUserId(authentication));
    }

    @PostMapping("/claim/group-link/revoke")
    public OperatorActionResultDto revokeGroupLink(
            @RequestBody OperatorActionReferenceRequestDto request,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK,
                        null,
                        null,
                        null,
                        null,
                        null,
                        request == null ? null : request.referenceId(),
                        request == null ? null : request.idempotencyKey()),
                actorUserId(authentication));
    }

    @PostMapping("/deployment/deactivate")
    public OperatorActionResultDto deactivateDeployment(
            @RequestBody(required = false) OperatorIdempotencyRequestDto request,
            Authentication authentication) {
        return noPayloadAction(
                RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                request == null ? null : request.idempotencyKey(),
                authentication);
    }

    @PostMapping("/deployment/reactivate")
    public OperatorActionResultDto reactivateDeployment(
            @RequestBody(required = false) OperatorIdempotencyRequestDto request,
            Authentication authentication) {
        return noPayloadAction(
                RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT,
                request == null ? null : request.idempotencyKey(),
                authentication);
    }

    @GetMapping("/leaderboard")
    public OperatorLeaderboardPageDto leaderboard(
            @RequestParam(defaultValue = "claimed") String view,
            @RequestParam(required = false) String throughPeriod,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String cursor) {
        return service.leaderboard(view, throughPeriod, limit, cursor);
    }

    @GetMapping("/announcements")
    public OperatorAnnouncementPageDto announcements(
            @RequestParam(required = false) String kind,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) Boolean includeExpired,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String cursor) {
        return service.announcements(
                kind,
                severity,
                channel,
                includeExpired,
                limit,
                cursor);
    }

    @GetMapping("/leaderboard/groups/{groupId}/deployments")
    public OperatorLeaderboardDeploymentPageDto leaderboardDeployments(
            @PathVariable String groupId,
            @RequestParam(required = false) String throughPeriod,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String cursor) {
        return service.leaderboardDeployments(
                groupId,
                throughPeriod,
                limit,
                cursor);
    }

    private OperatorActionResultDto noPayloadAction(
            String action,
            String idempotencyKey,
            Authentication authentication) {
        return service.apply(
                new OperatorActionRequestDto(
                        action,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        idempotencyKey),
                actorUserId(authentication));
    }

    private String actorUserId(Authentication authentication) {
        if (authentication != null
                && authentication.getPrincipal() instanceof FirebasePrincipal principal) {
            return principal.getUserId();
        }
        return authentication == null ? null : authentication.getName();
    }
}
