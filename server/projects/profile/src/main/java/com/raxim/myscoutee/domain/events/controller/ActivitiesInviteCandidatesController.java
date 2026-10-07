package com.raxim.myscoutee.domain.events.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.events.dto.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.domain.events.dto.ActivityInviteDtos.ActivityInviteCandidatesPageDto;
import com.raxim.myscoutee.domain.events.service.ActivitiesInviteCandidatesService;

@RestController
@RequestMapping("/activities/events/invite-candidates")
public class ActivitiesInviteCandidatesController {
    private final ActivitiesInviteCandidatesService activitiesInviteCandidatesService;

    public ActivitiesInviteCandidatesController(ActivitiesInviteCandidatesService activitiesInviteCandidatesService) {
        this.activitiesInviteCandidatesService = activitiesInviteCandidatesService;
    }

    @PostMapping
    public ActivityInviteCandidatesPageDto queryCandidates(@RequestBody ActivityInviteCandidatesRequestDto request) {
        return activitiesInviteCandidatesService.queryCandidates(request);
    }
}
