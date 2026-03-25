package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberEntryDto;

@RestController
@RequestMapping("/activities/events/invite-candidates")
public class ActivitiesInviteCandidatesController {

    @PostMapping
    public List<ActivityMemberEntryDto> queryCandidates(@RequestBody ActivityInviteCandidatesRequestDto request) {
        return List.of();
    }
}
