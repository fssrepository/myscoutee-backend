package com.raxim.myscoutee.profile.service;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                    request == null ? null : request.filterPreferences(),
                    request == null ? null : request.leftQuery(),
                    request == null ? null : request.rightQuery(),
                    request == null ? null : request.cursor(),
                    request == null ? null : request.pageSize(),
                    request == null ? null : request.excludedSocialCardIds());
        }

        UserGameFilterPreferencesDto effectivePreferences =
                request != null && request.filterPreferences() != null
                        ? request.filterPreferences()
                        : homeUserProfileService.resolveFilterPreferences(resolvedUserId);

        List<Users> filteredUsers = homeUserProfileService.queryGameStackUserRecords(resolvedUserId).stream()
                .filter(user -> matchesFilterPreferences(user, effectivePreferences))
                .toList();
        Set<String> excludedCardUserIds = normalizeIds(
                request == null ? null : request.excludedCardUserIds());
        List<Users> unseenUsers = filteredUsers.stream()
                .filter(user -> !excludedCardUserIds.contains(normalizeUserId(user.getId())))
                .toList();

        int pageSize = resolvePageSize(request == null ? null : request.pageSize());
        int offset = excludedCardUserIds.isEmpty()
                ? resolveOffset(request == null ? null : request.cursor())
                : 0;
        int endExclusive = Math.min(unseenUsers.size(), offset + pageSize);
        List<Users> page = offset >= unseenUsers.size()
                ? List.of()
                : unseenUsers.subList(offset, endExclusive);
        String nextCursor = endExclusive < unseenUsers.size() ? String.valueOf(endExclusive) : null;

        List<UserDto> users = page.stream()
                .map(homeUserProfileService::toGameCardUserDto)
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
            UserGameFilterPreferencesDto filterPreferences,
            String leftQuery,
            String rightQuery,
            String cursor,
            Integer pageSizeValue,
            List<String> excludedSocialCardIdsValue) {
        List<Users> allUserRecords = homeUserProfileService.queryOrderedUserRecords();
        Map<String, Users> usersById = allUserRecords.stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeUserId(user.getId()), user), Map::putAll);
        HomeUserProfileService.ActivitySocialGraph socialGraph = homeUserProfileService.queryActivitySocialGraph();
        List<HomeUserProfileService.GameSocialCardCandidate> filteredCards = querySocialCardsForMode(
                userId,
                mode,
                allUserRecords,
                socialGraph)
                .stream()
                .filter(card -> matchesSocialFilterPreferences(usersById, card, filterPreferences))
                .filter(card -> matchesSocialQuery(usersById, card, leftQuery, rightQuery))
                .toList();
        Set<String> excludedSocialCardIds = normalizeIds(excludedSocialCardIdsValue);
        List<HomeUserProfileService.GameSocialCardCandidate> unseenCards = filteredCards.stream()
                .filter(card -> !excludedSocialCardIds.contains(normalizeUserId(card.id())))
                .toList();

        int pageSize = resolvePageSize(pageSizeValue);
        int offset = excludedSocialCardIds.isEmpty() ? resolveOffset(cursor) : 0;
        int endExclusive = Math.min(unseenCards.size(), offset + pageSize);
        List<HomeUserProfileService.GameSocialCardCandidate> page = offset >= unseenCards.size()
                ? List.of()
                : unseenCards.subList(offset, endExclusive);
        String nextCursor = endExclusive < unseenCards.size() ? String.valueOf(endExclusive) : null;

        Set<String> referencedUserIds = page.stream()
                .flatMap(card -> Stream.of(card.userId(), card.secondaryUserId(), card.bridgeUserId()))
                .filter(StringUtils::hasText)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        List<UserDto> users = referencedUserIds.stream()
                .map(usersById::get)
                .filter(Objects::nonNull)
                .map(homeUserProfileService::toGameCardUserDto)
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

    private Set<String> normalizeIds(List<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .filter(StringUtils::hasText)
                .map(this::normalizeUserId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private List<HomeUserProfileService.GameSocialCardCandidate> querySocialCardsForMode(
            String userId,
            String mode,
            List<Users> allUserRecords,
            HomeUserProfileService.ActivitySocialGraph socialGraph) {
        if ("outside-network".equals(mode)) {
            return homeUserProfileService.queryOutsideNetworkCards(userId, allUserRecords, socialGraph);
        }
        if ("separated-friends".equals(mode)) {
            return homeUserProfileService.querySeparatedFriendCards(userId, allUserRecords, socialGraph);
        }
        return homeUserProfileService.queryFriendsInCommonCards(userId, allUserRecords, socialGraph);
    }

    private boolean matchesSocialFilterPreferences(
            Map<String, Users> usersById,
            HomeUserProfileService.GameSocialCardCandidate card,
            UserGameFilterPreferencesDto preferences) {
        if (preferences == null) {
            return true;
        }
        if (card == null) {
            return false;
        }
        List<String> participantIds = "friends-in-common".equals(card.socialContext())
                ? List.of(card.userId())
                : Stream.of(card.userId(), card.secondaryUserId(), card.bridgeUserId())
                        .filter(StringUtils::hasText)
                        .map(this::normalizeUserId)
                        .distinct()
                        .toList();
        if (participantIds.isEmpty()) {
            return false;
        }
        for (String participantId : participantIds) {
            Users user = usersById.get(participantId);
            if (user == null || !matchesFilterPreferences(user, preferences)) {
                return false;
            }
        }
        return true;
    }

    private boolean matchesSocialQuery(
            Map<String, Users> usersById,
            HomeUserProfileService.GameSocialCardCandidate card,
            String leftQuery,
            String rightQuery) {
        if (card == null) {
            return false;
        }
        return matchesSocialSide(usersById, card.userId(), card.eventName(), leftQuery)
                && matchesSocialSide(usersById, resolveRightSideUserId(card), card.eventName(), rightQuery);
    }

    private boolean matchesSocialSide(Map<String, Users> usersById, String userId, String eventName, String query) {
        String normalizedQuery = normalize(query);
        if (!StringUtils.hasText(normalizedQuery)) {
            return true;
        }
        Users user = usersById.get(normalizeUserId(userId));
        if (containsQuery(user == null ? null : user.getName(), normalizedQuery)
                || containsQuery(user == null ? null : user.getCity(), normalizedQuery)
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

    private String normalizeUserId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeMode(String value) {
        String normalized = normalize(value);
        if ("outside-network".equals(normalized) || "separated-friends".equals(normalized) || "friends-in-common".equals(normalized)) {
            return normalized;
        }
        return "single";
    }

    private boolean isSocialMode(String value) {
        return "outside-network".equals(value) || "separated-friends".equals(value) || "friends-in-common".equals(value);
    }
}
