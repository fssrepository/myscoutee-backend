package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.dto.game.GameDtos.UserGameCardsQueryRequestDto;
import com.raxim.myscoutee.profile.dto.game.GameDtos.UserGameCardsQueryResponseDto;

@Service
public class HomeGameCardsService {
    private final HomeUserProfileService homeUserProfileService;

    public HomeGameCardsService(HomeUserProfileService homeUserProfileService) {
        this.homeUserProfileService = homeUserProfileService;
    }

    public UserGameCardsQueryResponseDto queryPage(UserGameCardsQueryRequestDto request) {
        String resolvedUserId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserGameCardsQueryResponseDto(0, List.of(), null, List.of());
        }

        UserGameFilterPreferencesDto effectivePreferences =
                request != null && request.filterPreferences() != null
                        ? request.filterPreferences()
                        : homeUserProfileService.resolveFilterPreferences(resolvedUserId);

        List<Users> filteredUsers = homeUserProfileService.queryGameStackUserRecords(resolvedUserId).stream()
                .filter(user -> matchesFilterPreferences(user, effectivePreferences))
                .toList();

        int pageSize = resolvePageSize(request == null ? null : request.pageSize());
        int offset = resolveOffset(request == null ? null : request.cursor());
        int endExclusive = Math.min(filteredUsers.size(), offset + pageSize);
        List<Users> page = offset >= filteredUsers.size()
                ? List.of()
                : filteredUsers.subList(offset, endExclusive);
        String nextCursor = endExclusive < filteredUsers.size() ? String.valueOf(endExclusive) : null;

        List<UserDto> users = page.stream()
                .map(homeUserProfileService::toUserDto)
                .filter(Objects::nonNull)
                .toList();

        return new UserGameCardsQueryResponseDto(
                filteredUsers.size(),
                users.stream().map(UserDto::id).toList(),
                nextCursor,
                users);
    }

    private int resolvePageSize(Integer value) {
        return value == null ? 10 : Math.max(1, Math.min(50, value));
    }

    private int resolveOffset(String cursor) {
        if (!StringUtils.hasText(cursor)) {
            return 0;
        }
        try {
            return Math.max(0, Integer.parseInt(cursor.trim()));
        } catch (NumberFormatException exception) {
            return 0;
        }
    }

    private boolean matchesFilterPreferences(
            Users user,
            UserGameFilterPreferencesDto preferences) {
        if (preferences == null) {
            return true;
        }

        int userAge = user.getAge() == null ? 0 : user.getAge();
        if (preferences.ageMin() != null && userAge < preferences.ageMin()) {
            return false;
        }
        if (preferences.ageMax() != null && userAge > preferences.ageMax()) {
            return false;
        }

        Integer heightCm = parseHeightCm(user.getHeight());
        if (heightCm != null && preferences.heightMinCm() != null && heightCm < preferences.heightMinCm()) {
            return false;
        }
        if (heightCm != null && preferences.heightMaxCm() != null && heightCm > preferences.heightMaxCm()) {
            return false;
        }

        if (!includesNormalized(preferences.physiques(), user.getPhysique())) {
            return false;
        }
        if (!intersectsNormalized(preferences.languages(), user.getLanguages())) {
            return false;
        }
        if (!includesNormalized(preferences.horoscopes(), user.getHoroscope())) {
            return false;
        }
        if (!includesNormalized(preferences.traitLabels(), user.getTraitLabel())) {
            return false;
        }
        if (preferences.genders() != null && !preferences.genders().isEmpty()) {
            Set<String> normalizedGenders = preferences.genders().stream()
                    .filter(Objects::nonNull)
                    .map(value -> value.trim().toLowerCase())
                    .collect(Collectors.toSet());
            if (!normalizedGenders.contains(normalize(user.getGender()))) {
                return false;
            }
        }
        return true;
    }

    private Integer parseHeightCm(String value) {
        try {
            int parsed = Integer.parseInt((value == null ? "" : value).replaceAll("[^0-9]", ""));
            return Math.max(40, Math.min(250, parsed));
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private boolean includesNormalized(List<String> values, String target) {
        if (values == null || values.isEmpty()) {
            return true;
        }
        String normalizedTarget = normalize(target);
        return values.stream()
                .filter(Objects::nonNull)
                .map(value -> value.trim().toLowerCase())
                .anyMatch(normalizedTarget::equals);
    }

    private boolean intersectsNormalized(List<String> left, List<String> right) {
        if (left == null || left.isEmpty()) {
            return true;
        }
        Set<String> normalizedRight = (right == null ? List.<String>of() : right).stream()
                .filter(Objects::nonNull)
                .map(value -> value.trim().toLowerCase())
                .collect(Collectors.toSet());
        return left.stream()
                .filter(Objects::nonNull)
                .map(value -> value.trim().toLowerCase())
                .anyMatch(normalizedRight::contains);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}
