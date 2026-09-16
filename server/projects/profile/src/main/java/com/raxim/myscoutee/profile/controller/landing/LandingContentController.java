package com.raxim.myscoutee.profile.controller.landing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.LandingContentDto;
import com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.SupportedCountryDto;
import com.raxim.myscoutee.profile.service.CountryPartitionService;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostPublicPageDto;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;

@RestController
@RequestMapping("/landing")
public class LandingContentController {
    private final HelpCenterService helpCenterService;
    private final IdeaPostsService ideaPostsService;
    private final HomeUserProfileService homeUserProfileService;
    private final CountryPartitionService countryPartitionService;

    public LandingContentController(
            HelpCenterService helpCenterService,
            IdeaPostsService ideaPostsService,
            HomeUserProfileService homeUserProfileService,
            CountryPartitionService countryPartitionService) {
        this.helpCenterService = helpCenterService;
        this.ideaPostsService = ideaPostsService;
        this.homeUserProfileService = homeUserProfileService;
        this.countryPartitionService = countryPartitionService;
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
        IdeaPostPublicPageDto ideaPreview = ideaPostsService.publicFeaturedPosts(lang, acceptLanguage);
        return new LandingContentDto(
                helpCenterService.activeState("privacy", lang, acceptLanguage),
                helpCenterService.activeState("terms", lang, acceptLanguage),
                ideaPreview.records(),
                ideaPreview.total(),
                loginAvailability,
                countryPartitionService.supportedCountries().stream()
                        .map(country -> new SupportedCountryDto(country.getCountryCode(), country.getCountryName()))
                        .toList());
    }

    @GetMapping("/articles")
    public IdeaPostPublicPageDto articles(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "lang", required = false) String lang,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "cursor", required = false) String cursor) {
        return ideaPostsService.publicPostsPage(lang, acceptLanguage, page, pageSize, cursor);
    }

    private boolean hasCoordinates(Double latitude, Double longitude) {
        return latitude != null
                && longitude != null
                && Double.isFinite(latitude)
                && Double.isFinite(longitude);
    }
}
