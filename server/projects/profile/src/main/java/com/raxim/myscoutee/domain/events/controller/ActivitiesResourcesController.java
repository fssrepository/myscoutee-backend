package com.raxim.myscoutee.domain.events.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventAssetRemovalRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceReadRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceReadReceiptDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceScopeDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventSupplyContributionPageDto;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.access.api.RequiresPolicies;
import com.raxim.myscoutee.domain.access.api.RequiresPolicy;
import com.raxim.myscoutee.domain.events.service.ActivitiesResourcesService;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;

@RestController
@RequestMapping("/activities/events/subevent-resources")
public class ActivitiesResourcesController {
    private final ActivitiesResourcesService activitiesResourcesService;
    private final SelectedProfile homeUserProfileService;

    public ActivitiesResourcesController(
            ActivitiesResourcesService activitiesResourcesService,
            SelectedProfile homeUserProfileService) {
        this.activitiesResourcesService = activitiesResourcesService;
        this.homeUserProfileService = homeUserProfileService;
    }

    @GetMapping
    public ActivitySubEventResourceStateDto queryState(
            @RequestParam("ownerId") String ownerId,
            @RequestParam("subEventId") String subEventId,
            @RequestParam("assetOwnerUserId") String assetOwnerUserId) {
        return activitiesResourcesService.queryState(ownerId, subEventId, assetOwnerUserId);
    }

    @GetMapping("/scope")
    public ActivitySubEventResourceScopeDto queryScope(
            @RequestParam("ownerId") String ownerId,
            @RequestParam("subEventId") String subEventId,
            @RequestParam("viewerUserId") String viewerUserId) {
        String resolvedViewerUserId = homeUserProfileService.resolveSelectedUserId(viewerUserId);
        return activitiesResourcesService.queryScope(ownerId, subEventId, resolvedViewerUserId);
    }

    @GetMapping("/contributions")
    public SubEventSupplyContributionPageDto querySupplyContributions(
            @RequestParam("ownerId") String ownerId,
            @RequestParam("subEventId") String subEventId,
            @RequestParam("assetOwnerUserId") String assetOwnerUserId,
            @RequestParam("assetId") String assetId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "12") Integer pageSize) {
        return activitiesResourcesService.querySupplyContributions(
                ownerId,
                subEventId,
                assetOwnerUserId,
                assetId,
                page,
                pageSize);
    }

    @PostMapping("/replace")
    @RequiresPolicies(
            mode = RequiresPolicies.Mode.ANY,
            skipWhenAuthenticationOptional = true,
            value = {
                    @RequiresPolicy(
                            key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                            subject = "#request.assetOwnerUserId()",
                            resourceId = "#request.authorizationEventId()"),
                    @RequiresPolicy(
                            key = AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                            subject = "#actorUserId",
                            resourceId = "#request.authorizationEventId()")
            })
    public ActivitySubEventResourceStateDto replace(@RequestBody ActivitySubEventResourceStateDto request) {
        String actorUserId = homeUserProfileService.resolveSelectedUserId(
                request == null ? null : request.assetOwnerUserId());
        return activitiesResourcesService.replace(request, actorUserId);
    }

    @PostMapping("/remove-assignment")
    public ActivitySubEventResourceStateDto removeAssignment(
            @RequestBody ActivitySubEventAssetRemovalRequestDto request) {
        String actorUserId = homeUserProfileService.resolveSelectedUserId(
                request == null ? null : request.userId());
        return activitiesResourcesService.removeScopedAssetAssignmentState(
                request == null ? null : request.ownerId(),
                request == null ? null : request.subEventId(),
                request == null ? null : request.assetId(),
                actorUserId,
                actorUserId);
    }

    @PostMapping("/read")
    public ActivitySubEventResourceReadReceiptDto markResourceTypeRead(
            @RequestBody ActivitySubEventResourceReadRequestDto request) {
        String userId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        return activitiesResourcesService.markResourceTypeRead(request, userId);
    }
}
