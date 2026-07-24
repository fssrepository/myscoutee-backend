package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesPageDto;
import com.raxim.myscoutee.profile.service.ActivitiesInviteCandidatesService;

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
