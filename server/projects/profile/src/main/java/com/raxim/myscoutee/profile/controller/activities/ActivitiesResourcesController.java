package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionPageDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicies;
import com.raxim.myscoutee.profile.security.RequiresPolicy;
import com.raxim.myscoutee.profile.service.ActivitiesResourcesService;

@RestController
@RequestMapping("/activities/events/subevent-resources")
public class ActivitiesResourcesController {
    private final ActivitiesResourcesService activitiesResourcesService;

    public ActivitiesResourcesController(ActivitiesResourcesService activitiesResourcesService) {
        this.activitiesResourcesService = activitiesResourcesService;
    }

    @GetMapping
    public ActivitySubEventResourceStateDto queryState(
            @RequestParam("ownerId") String ownerId,
            @RequestParam("subEventId") String subEventId,
            @RequestParam("assetOwnerUserId") String assetOwnerUserId) {
        return activitiesResourcesService.queryState(ownerId, subEventId, assetOwnerUserId);
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
        return activitiesResourcesService.replace(request);
    }
}
