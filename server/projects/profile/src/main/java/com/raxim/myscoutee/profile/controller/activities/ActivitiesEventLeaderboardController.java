package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.service.ActivitiesEventLeaderboardService;

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
    public EventLeaderboardStateDto upsertEntry(@RequestBody EventLeaderboardEntryUpsertRequestDto request) {
        return activitiesEventLeaderboardService.upsertEntry(request);
    }
}
