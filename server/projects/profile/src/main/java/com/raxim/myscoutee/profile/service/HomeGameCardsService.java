package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.data.dto.game.GameDtos.UserGameCardsQueryRequestDto;
import com.raxim.myscoutee.profile.data.dto.game.GameDtos.UserGameCardsQueryResponseDto;
import com.raxim.myscoutee.profile.data.dto.game.GameDtos.UserGameSocialCardDto;

@Service
public class HomeGameCardsService {
    private final HomeUserProfileService homeUserProfileService;

    public HomeGameCardsService(HomeUserProfileService homeUserProfileService) {
        this.homeUserProfileService = homeUserProfileService;
    }

    public UserGameCardsQueryResponseDto queryPage(UserGameCardsQueryRequestDto request) {
        String resolvedUserId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserGameCardsQueryResponseDto(0, List.of(), null, List.of(), List.of());
        }

        String mode = normalizeMode(request == null ? null : request.mode());
        if (isSocialMode(mode)) {
            return querySocialPage(
                    resolvedUserId,
                    mode,
                    request == null ? null : request.leftQuery(),
                    request == null ? null : request.rightQuery(),
                    request == null ? null : request.cursor(),
                    request == null ? null : request.pageSize());
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
                users,
                List.of());
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

    private UserGameCardsQueryResponseDto querySocialPage(
            String userId,
            String mode,
            String leftQuery,
            String rightQuery,
            String cursor,
            Integer pageSizeValue) {
        List<UserDto> allUsers = homeUserProfileService.queryDemoUsers();
        List<HomeUserProfileService.GameSocialCardCandidate> filteredCards = ("separated-friends".equals(mode)
                ? homeUserProfileService.querySeparatedFriendCards(userId)
                : homeUserProfileService.queryFriendsInCommonCards(userId))
                .stream()
                .filter(card -> matchesSocialQuery(allUsers, card, leftQuery, rightQuery))
                .toList();

        int pageSize = resolvePageSize(pageSizeValue);
        int offset = resolveOffset(cursor);
        int endExclusive = Math.min(filteredCards.size(), offset + pageSize);
        List<HomeUserProfileService.GameSocialCardCandidate> page = offset >= filteredCards.size()
                ? List.of()
                : filteredCards.subList(offset, endExclusive);
        String nextCursor = endExclusive < filteredCards.size() ? String.valueOf(endExclusive) : null;

        Set<String> referencedUserIds = page.stream()
                .flatMap(card -> List.of(card.userId(), card.secondaryUserId(), card.bridgeUserId()).stream())
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
        List<UserDto> users = allUsers.stream()
                .filter(user -> referencedUserIds.contains(user.id()))
                .toList();
        List<UserGameSocialCardDto> socialCards = page.stream()
                .map(card -> new UserGameSocialCardDto(
                        card.id(),
                        card.userId(),
                        card.secondaryUserId(),
                        card.socialContext(),
                        card.bridgeUserId(),
                        card.bridgeCount(),
                        card.eventName()))
                .toList();

        return new UserGameCardsQueryResponseDto(
                filteredCards.size(),
                List.of(),
                nextCursor,
                users,
                socialCards);
    }

    private boolean matchesSocialQuery(
            List<UserDto> users,
            HomeUserProfileService.GameSocialCardCandidate card,
            String leftQuery,
            String rightQuery) {
        if (card == null) {
            return false;
        }
        return matchesSocialSide(users, card.userId(), card.eventName(), leftQuery)
                && matchesSocialSide(users, resolveRightSideUserId(card), card.eventName(), rightQuery);
    }

    private boolean matchesSocialSide(List<UserDto> users, String userId, String eventName, String query) {
        String normalizedQuery = normalize(query);
        if (!StringUtils.hasText(normalizedQuery)) {
            return true;
        }
        UserDto user = users.stream()
                .filter(candidate -> Objects.equals(candidate.id(), userId))
                .findFirst()
                .orElse(null);
        if (containsQuery(user == null ? null : user.name(), normalizedQuery)
                || containsQuery(user == null ? null : user.city(), normalizedQuery)
                || containsQuery(eventName, normalizedQuery)) {
            return true;
        }
        return false;
    }

    private String resolveRightSideUserId(HomeUserProfileService.GameSocialCardCandidate card) {
        if (card == null) {
            return null;
        }
        return StringUtils.hasText(card.secondaryUserId()) ? card.secondaryUserId() : card.bridgeUserId();
    }

    private boolean containsQuery(String value, String query) {
        return normalize(value).contains(query);
    }

    private String normalizeMode(String value) {
        String normalized = normalize(value);
        if ("pair".equals(normalized) || "separated-friends".equals(normalized) || "friends-in-common".equals(normalized)) {
            return normalized;
        }
        return "single";
    }

    private boolean isSocialMode(String value) {
        return "separated-friends".equals(value) || "friends-in-common".equals(value);
    }
}
