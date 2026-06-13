package com.raxim.myscoutee.profile.controller.landing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.LandingContentDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;

@RestController
@RequestMapping("/landing")
public class LandingContentController {
    private final HelpCenterService helpCenterService;
    private final IdeaPostsService ideaPostsService;
    private final HomeUserProfileService homeUserProfileService;

    public LandingContentController(
            HelpCenterService helpCenterService,
            IdeaPostsService ideaPostsService,
            HomeUserProfileService homeUserProfileService) {
        this.helpCenterService = helpCenterService;
        this.ideaPostsService = ideaPostsService;
        this.homeUserProfileService = homeUserProfileService;
    }

    @GetMapping("/content")
    public LandingContentDto content(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "lang", required = false) String lang) {
        UserLocationEligibilityResponseDto loginAvailability = hasCoordinates(latitude, longitude)
                ? homeUserProfileService.queryLocationEligibility(latitude, longitude)
                : null;
        return new LandingContentDto(
                helpCenterService.activeState("privacy", lang, acceptLanguage),
                helpCenterService.activeState("terms", lang, acceptLanguage),
                ideaPostsService.publicPosts(lang, acceptLanguage),
                loginAvailability);
    }

    private boolean hasCoordinates(Double latitude, Double longitude) {
        return latitude != null
                && longitude != null
                && Double.isFinite(latitude)
                && Double.isFinite(longitude);
    }
}
