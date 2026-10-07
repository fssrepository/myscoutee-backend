package com.raxim.myscoutee.profile.controller.landing;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
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
            @RequestParam(value = "lang", required = false) String lang,
            @RequestParam(value = "groupId", required = false) String groupId) {
        groupId = publicGroupId(groupId);
        UserLocationEligibilityResponseDto loginAvailability = hasCoordinates(latitude, longitude)
                ? homeUserProfileService.queryLocationEligibility(latitude, longitude)
                : null;
        IdeaPostPublicPageDto ideaPreview = ideaPostsService.publicFeaturedPosts(lang, acceptLanguage, groupId);
        return new LandingContentDto(
                helpCenterService.activeState("privacy", lang, acceptLanguage, null, groupId),
                helpCenterService.activeState("terms", lang, acceptLanguage, null, groupId),
                ideaPreview.records(),
                ideaPreview.total(),
                loginAvailability,
                countryPartitionService.supportedCountries().stream()
                        .map(country -> new SupportedCountryDto(country.getCountryCode(), country.getCountryName()))
                        .toList(), groupId, ideaPostsService.publicSlides(groupId));
    }

    @GetMapping("/explanation")
    public HelpCenterStateDto explanation(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam String contextKey,
            @RequestParam(value = "groupId", required = false) String groupId,
            @RequestParam(value = "lang", required = false) String lang) {
        // Only public entry surfaces are exposed; authenticated guides keep their existing route.
        if (!Set.of("landing.home", "landing.guide", "landing.consent", "landing.setup",
                "landing.demo", "landing.auth", "landing.registration").contains(contextKey)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return helpCenterService.activeState("explanation", lang, acceptLanguage, contextKey, groupId);
    }

    @GetMapping("/articles")
    public IdeaPostPublicPageDto articles(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "lang", required = false) String lang,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "cursor", required = false) String cursor,
            @RequestParam(value = "groupId", required = false) String groupId) {
        return ideaPostsService.publicPostsPage(lang, acceptLanguage, page, pageSize, cursor, publicGroupId(groupId));
    }

    private String publicGroupId(String groupId) {
        if (groupId == null || groupId.isBlank()) return null;
        if (com.raxim.myscoutee.profile.data.document.CommunityGroup.isBaseId(groupId)) return groupId;
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    private boolean hasCoordinates(Double latitude, Double longitude) {
        return latitude != null
                && longitude != null
                && Double.isFinite(latitude)
                && Double.isFinite(longitude);
    }
}
