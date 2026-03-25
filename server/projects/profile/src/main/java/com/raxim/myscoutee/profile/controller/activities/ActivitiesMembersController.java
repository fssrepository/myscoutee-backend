package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMembersSummaryDto;

@RestController
@RequestMapping("/activities/events/members")
public class ActivitiesMembersController {

    @GetMapping
    public List<ActivityMemberEntryDto> queryMembers(
            @RequestParam("ownerType") String ownerType,
            @RequestParam("ownerId") String ownerId) {
        return List.of();
    }

    @PostMapping("/summaries")
    public List<ActivityMembersSummaryDto> querySummaries(@RequestBody ActivityMembersSummariesRequestDto request) {
        return List.of();
    }

    @PostMapping("/replace")
    public void replace(@RequestBody ActivityMembersReplaceRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/sync")
    public void sync(@RequestBody ActivitiesEventSyncPayloadDto request) {
        // no-op skeleton
    }
}
