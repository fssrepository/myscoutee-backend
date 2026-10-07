package com.raxim.myscoutee.domain.events.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.access.api.RequiresPolicy;
import com.raxim.myscoutee.domain.events.service.ActivitiesEventLeaderboardService;

@RestController
@RequestMapping("/activities/events/leaderboard")
public class ActivitiesEventLeaderboardController {
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;

    public ActivitiesEventLeaderboardController(ActivitiesEventLeaderboardService activitiesEventLeaderboardService) {
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
    }

    @GetMapping
    public EventLeaderboardStateDto queryState(
            @RequestParam("eventId") String eventId,
            @RequestParam("subEventId") String subEventId) {
        return activitiesEventLeaderboardService.queryState(eventId, subEventId);
    }

    @PostMapping("/entry")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_LEADERBOARD_ENTRY_SUBMIT,
            subject = "#request?.actorUserId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public EventLeaderboardStateDto upsertEntry(@RequestBody EventLeaderboardEntryUpsertRequestDto request) {
        return activitiesEventLeaderboardService.upsertEntry(request);
    }
}
