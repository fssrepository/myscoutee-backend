package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
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

    @PostMapping("/replace")
    public ActivitySubEventResourceStateDto replace(@RequestBody ActivitySubEventResourceStateDto request) {
        return activitiesResourcesService.replace(request);
    }
}
