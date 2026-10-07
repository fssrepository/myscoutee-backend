package com.raxim.myscoutee.domain.accounts.controller;

import static com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.UserExperiencesResponseDto;
import static com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.UserExperiencesSaveRequestDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.accounts.service.UserExperienceProfilesService;

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
