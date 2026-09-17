package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersInviteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersInviteResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMembersSummaryDto;
import com.raxim.myscoutee.profile.service.ActivitiesMembersService;

@RestController
@RequestMapping("/activities/events/members")
public class ActivitiesMembersController {
    private final ActivitiesMembersService activitiesMembersService;

    public ActivitiesMembersController(ActivitiesMembersService activitiesMembersService) {
        this.activitiesMembersService = activitiesMembersService;
    }

    @GetMapping
    public List<ActivityMemberEntryDto> queryMembers(
            @RequestParam("ownerType") String ownerType,
            @RequestParam("ownerId") String ownerId,
            @RequestParam(value = "pendingOnly", required = false) Boolean pendingOnly,
            @RequestParam(value = "eventId", required = false) String eventId,
            @RequestParam(value = "subEventId", required = false) String subEventId,
            @RequestParam(value = "assetRequestId", required = false) String assetRequestId) {
        return activitiesMembersService.queryMembers(ownerType, ownerId, pendingOnly, eventId, subEventId, assetRequestId);
    }

    @PostMapping("/summaries")
    public List<ActivityMembersSummaryDto> querySummaries(@RequestBody ActivityMembersSummariesRequestDto request) {
        return activitiesMembersService.querySummaries(request);
    }

    @PostMapping("/sync")
    public ActivityMembersSyncResponseDto syncMembers(@RequestBody ActivityMembersSyncRequestDto request) {
        return activitiesMembersService.syncMembers(request);
    }

    @PostMapping("/replace")
    public void replace(@RequestBody ActivityMembersReplaceRequestDto request) {
        activitiesMembersService.replace(request);
    }

    @PostMapping("/invite")
    public ActivityMembersInviteResponseDto invite(@RequestBody ActivityMembersInviteRequestDto request) {
        return activitiesMembersService.inviteEventMembers(request);
    }

    @PostMapping("/action")
    public ActivityMemberActionResponseDto applyAction(@RequestBody ActivityMemberActionRequestDto request) {
        return activitiesMembersService.applyActionWithContext(request);
    }
}
