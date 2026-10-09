package com.raxim.myscoutee.domain.affinity.dto;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileDetailGroupDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserImpressionsDto;

/** Only the proposed profile fields consumed by the existing affinity calculation. */
public record UserAffinityInputDto(
        String id, Integer age, String city, String height, String physique,
        List<String> languages, String horoscope, String gender, String hostTier,
        String traitLabel, Integer completion, String headline, String about,
        List<ProfileDetailGroupDto> profileDetails, UserImpressionsDto impressions) {
    public static UserAffinityInputDto from(UserDto user) {
        return user == null ? null : new UserAffinityInputDto(user.id(), user.age(), user.city(),
                user.height(), user.physique(), user.languages(), user.horoscope(), user.gender(),
                user.hostTier(), user.traitLabel(), user.completion(), user.headline(), user.about(),
                user.profileDetails(), user.impressions());
    }
}
