package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleStateDto;
import com.raxim.myscoutee.profile.service.ActivitiesMingleService;

@RestController
@RequestMapping("/activities/events/mingle")
public class ActivitiesMingleController {
    private final ActivitiesMingleService activitiesMingleService;

    public ActivitiesMingleController(ActivitiesMingleService activitiesMingleService) {
        this.activitiesMingleService = activitiesMingleService;
    }

    @GetMapping("/state")
    public MingleStateDto queryState(
            @RequestParam("userId") String userId,
            @RequestParam(value = "eventId", required = false) String eventId,
            @RequestParam(value = "roundNumber", required = false) Integer roundNumber) {
        return activitiesMingleService.queryState(userId, eventId, roundNumber);
    }

    @PostMapping("/action")
    public MingleStateDto applyAction(@RequestBody MingleActionRequestDto request) {
        return activitiesMingleService.applyAction(request);
    }
}
