package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupsStateDto;
import com.raxim.myscoutee.profile.service.ActivitiesEventLeaderboardService;

@RestController
@RequestMapping("/activities/events/tournament-groups")
public class ActivitiesEventTournamentGroupsController {
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;

    public ActivitiesEventTournamentGroupsController(ActivitiesEventLeaderboardService activitiesEventLeaderboardService) {
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
    }

    @GetMapping
    public EventTournamentGroupsStateDto queryState(
            @RequestParam("userId") String userId,
            @RequestParam("eventId") String eventId) {
        return activitiesEventLeaderboardService.queryTournamentGroups(userId, eventId);
    }

    @GetMapping("/stage-groups")
    public List<EventTournamentGroupDto> queryStageGroups(
            @RequestParam("eventId") String eventId,
            @RequestParam(value = "slotId", required = false) String slotId,
            @RequestParam("stageId") String stageId) {
        return activitiesEventLeaderboardService.queryTournamentStageGroups(eventId, slotId, stageId);
    }

    @PostMapping("/group")
    public EventTournamentGroupsStateDto saveGroup(@RequestBody EventTournamentGroupUpsertRequestDto request) {
        return activitiesEventLeaderboardService.saveTournamentGroup(request);
    }

    @PostMapping("/group/delete")
    public EventTournamentGroupsStateDto deleteGroup(@RequestBody EventTournamentGroupDeleteRequestDto request) {
        return activitiesEventLeaderboardService.deleteTournamentGroup(request);
    }
}
