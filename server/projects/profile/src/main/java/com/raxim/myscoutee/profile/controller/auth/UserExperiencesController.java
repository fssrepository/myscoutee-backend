package com.raxim.myscoutee.profile.controller.auth;

import static com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.UserExperiencesResponseDto;
import static com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.UserExperiencesSaveRequestDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.service.UserExperienceProfilesService;

@RestController
@RequestMapping("/auth/me/experiences")
public class UserExperiencesController {
    private final UserExperienceProfilesService userExperienceProfilesService;

    public UserExperiencesController(UserExperienceProfilesService userExperienceProfilesService) {
        this.userExperienceProfilesService = userExperienceProfilesService;
    }

    @GetMapping
    public UserExperiencesResponseDto queryUserExperiences(
            @RequestParam(value = "userId", required = false) String userId) {
        return userExperienceProfilesService.queryUserExperiences(userId);
    }

    @PostMapping
    public UserExperiencesResponseDto saveUserExperiences(
            @RequestBody(required = false) UserExperiencesSaveRequestDto request) {
        return userExperienceProfilesService.saveUserExperiences(request);
    }
}
