package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;

@RestController
@RequestMapping("/activities/events/subevent-resources")
public class ActivitiesResourcesController {

    @GetMapping
    public ActivitySubEventResourceStateDto queryState(
            @RequestParam("ownerId") String ownerId,
            @RequestParam("subEventId") String subEventId,
            @RequestParam("assetOwnerUserId") String assetOwnerUserId) {
        return null;
    }

    @PostMapping("/replace")
    public ActivitySubEventResourceStateDto replace(@RequestBody ActivitySubEventResourceStateDto request) {
        return request;
    }
}
