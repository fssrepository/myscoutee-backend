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
    private final com.raxim.myscoutee.profile.service.CommunityGroupsService groups;
    private boolean community(String type) { return "community".equals(type); }

    public ActivitiesMembersController(ActivitiesMembersService activitiesMembersService, com.raxim.myscoutee.profile.service.CommunityGroupsService groups) {
        this.activitiesMembersService = activitiesMembersService;
        this.groups = groups;
    }

    @GetMapping
    public List<ActivityMemberEntryDto> queryMembers(
            @RequestParam("ownerType") String ownerType,
            @RequestParam("ownerId") String ownerId,
            @RequestParam(value = "pendingOnly", required = false) Boolean pendingOnly,
            @RequestParam(value = "eventId", required = false) String eventId,
            @RequestParam(value = "subEventId", required = false) String subEventId,
            @RequestParam(value = "assetRequestId", required = false) String assetRequestId) {
        if (community(ownerType)) return groups.roster(groups.actor(null), ownerId, Boolean.TRUE.equals(pendingOnly));
        return activitiesMembersService.queryMembers(ownerType, ownerId, pendingOnly, eventId, subEventId, assetRequestId);
    }

    @PostMapping("/summaries")
    public List<ActivityMembersSummaryDto> querySummaries(@RequestBody ActivityMembersSummariesRequestDto request) {
        return request.owners().stream().map(owner -> community(owner.ownerType())
                ? groups.summary(groups.actor(null), owner.ownerId())
                : activitiesMembersService.querySummary(owner.ownerType(), owner.ownerId())).toList();
    }

    @PostMapping("/sync")
    public ActivityMembersSyncResponseDto syncMembers(@RequestBody ActivityMembersSyncRequestDto request) {
        if (community(request.owner().ownerType())) return groups.sync(groups.actor(null), request);
        return activitiesMembersService.syncMembers(request);
    }

    @PostMapping("/replace")
    public void replace(@RequestBody ActivityMembersReplaceRequestDto request) {
        if (community(request.owner().ownerType())) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED);
        activitiesMembersService.replace(request);
    }

    @PostMapping("/invite")
    public ActivityMembersInviteResponseDto invite(@RequestBody ActivityMembersInviteRequestDto request) {
        if (community(request.owner().ownerType())) return groups.invite(groups.actor(request.actorUserId()), request.owner().ownerId(), request.userIds());
        return activitiesMembersService.inviteEventMembers(request);
    }

    @PostMapping("/action")
    public ActivityMemberActionResponseDto applyAction(@RequestBody ActivityMemberActionRequestDto request) {
        if (community(request.owner().ownerType())) return groups.action(groups.actor(request.actorUserId()), request);
        return activitiesMembersService.applyActionWithContext(request);
    }
}
