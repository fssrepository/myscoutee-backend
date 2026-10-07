package com.raxim.myscoutee.domain.content.dto;

import java.util.List;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto;

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
