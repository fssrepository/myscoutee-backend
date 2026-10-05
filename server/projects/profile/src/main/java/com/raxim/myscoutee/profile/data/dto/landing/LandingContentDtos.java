package com.raxim.myscoutee.profile.data.dto.landing;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;

public final class LandingContentDtos {
    private LandingContentDtos() {
    }

    public record LandingContentDto(
            HelpCenterStateDto privacy,
            HelpCenterStateDto terms,
            List<IdeaPostDto> ideas,
            Integer ideasTotal,
            UserLocationEligibilityResponseDto loginAvailability,
            List<SupportedCountryDto> supportedCountries,
            String groupId,
            List<LandingSlideDto> slides) {
        public LandingContentDto(HelpCenterStateDto privacy, HelpCenterStateDto terms, List<IdeaPostDto> ideas,
                Integer ideasTotal, UserLocationEligibilityResponseDto loginAvailability, List<SupportedCountryDto> supportedCountries) {
            this(privacy, terms, ideas, ideasTotal, loginAvailability, supportedCountries, null, List.of());
        }
    }

    public record LandingSlideDto(String id, String index, String titleKey, String title, String messageKey,
            String message, String imageUrl, String tone, String sliceX, String sliceY) { }

    public record SupportedCountryDto(String countryCode, String countryName) {
    }
}
