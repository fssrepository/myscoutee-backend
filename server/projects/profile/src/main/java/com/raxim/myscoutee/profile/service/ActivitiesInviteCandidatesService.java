package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class ActivitiesInviteCandidatesService {
    private final UsersRepository usersRepository;
    private final UserRatesRepository userRatesRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final HomeUserProfileService homeUserProfileService;

    public ActivitiesInviteCandidatesService(
            UsersRepository usersRepository,
            UserRatesRepository userRatesRepository,
            ActivitiesMembersService activitiesMembersService,
            HomeUserProfileService homeUserProfileService) {
        this.usersRepository = usersRepository;
        this.userRatesRepository = userRatesRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.homeUserProfileService = homeUserProfileService;
    }

    public List<ActivityMemberEntryDto> queryCandidates(ActivityInviteCandidatesRequestDto request) {
        if (request == null) {
            return List.of();
        }

        Users activeUser = homeUserProfileService.resolveCurrentUser(request.activeUserId());
        String activeUserId = normalizeId(activeUser == null ? null : activeUser.getId());
        String ownerId = normalizeId(request.ownerId());
        String ownerType = normalizeOwnerType(request.ownerType());
        if (!StringUtils.hasText(activeUserId) || !StringUtils.hasText(ownerId) || !StringUtils.hasText(ownerType)) {
            return List.of();
        }

        ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(ownerType, ownerId);
        Set<String> blockedUserIds = new LinkedHashSet<>();
        blockedUserIds.add(activeUserId);
        if (snapshot != null) {
            blockedUserIds.addAll(snapshot.acceptedMemberUserIds());
            blockedUserIds.addAll(snapshot.pendingMemberUserIds());
        }

        Map<String, CandidateSignal> signalsByUserId = new LinkedHashMap<>();
        for (UserRate rate : userRatesRepository.findRelevantByUserIds(List.of(activeUserId))) {
            if (!isEligibleSingleMetRate(rate, activeUserId)) {
                continue;
            }
            CandidateSignal signal = toSignal(rate);
            if (signal == null) {
                continue;
            }
            for (String candidateUserId : singleMetCounterpartUserIds(rate, activeUserId)) {
                if (blockedUserIds.contains(candidateUserId)) {
                    continue;
                }
                CandidateSignal current = signalsByUserId.get(candidateUserId);
                if (current == null || shouldReplace(current, signal)) {
                    signalsByUserId.put(candidateUserId, signal);
                }
            }
        }
        if (signalsByUserId.isEmpty()) {
            return List.of();
        }

        Map<String, Users> usersById = usersRepository.findByUserIdIn(signalsByUserId.keySet()).stream()
                .filter(user -> user != null && StringUtils.hasText(normalizeId(user.getId())))
                .filter(homeUserProfileService::isActivityRateVisibleUser)
                .collect(LinkedHashMap::new, (map, user) -> map.put(normalizeId(user.getId()), user), Map::putAll);

        Comparator<Map.Entry<String, CandidateSignal>> comparator = "relevant".equals(safeText(request.sort()))
                ? Comparator.<Map.Entry<String, CandidateSignal>>comparingDouble(entry -> safeDouble(entry.getValue().userRateAffinity())).reversed()
                        .thenComparing(entry -> toSortableDate(entry.getValue().metAtIso()), Comparator.reverseOrder())
                : Comparator.<Map.Entry<String, CandidateSignal>>comparingLong(entry -> toSortableDate(entry.getValue().metAtIso())).reversed()
                        .thenComparing(entry -> safeDouble(entry.getValue().userRateAffinity()), Comparator.reverseOrder());
        return signalsByUserId.entrySet().stream()
                .sorted(comparator)
                .map(entry -> toEntry(entry.getKey(), usersById.get(entry.getKey()), entry.getValue()))
                .filter(entry -> entry != null)
                .toList();
    }

    private ActivityMemberEntryDto toEntry(String candidateUserId, Users user, CandidateSignal signal) {
        if (user == null || signal == null) {
            return null;
        }
        return new ActivityMemberEntryDto(
                candidateUserId,
                candidateUserId,
                safeText(user.getName()),
                safeText(user.getInitials()),
                normalizeGender(user.getGender()),
                safeText(user.getCity()),
                safeText(user.getStatusText()),
                "Member",
                "pending",
                "admin",
                "invite",
                null,
                true,
                signal.metAtIso(),
                signal.metAtIso(),
                signal.metWhere(),
                resolveAvatarUrl(user),
                homeUserProfileService.toGameCardUserDto(user));
    }

    private CandidateSignal toSignal(UserRate rate) {
        String metAtIso = firstNonBlank(rate == null ? null : rate.getCreatedDate(), rate == null ? null : rate.getUpdatedDate(), Instant.now().toString());
        if (isFutureIso(metAtIso)) {
            return null;
        }
        String metWhere = firstNonBlank(rate == null ? null : rate.getEventName(), "Met on MyScoutee");
        double userRateAffinity = rate != null && rate.getAffinityScore() != null
                ? Math.max(0d, rate.getAffinityScore())
                : 0d;
        return new CandidateSignal(metAtIso, metWhere, userRateAffinity);
    }

    private boolean shouldReplace(CandidateSignal current, CandidateSignal next) {
        long currentMetAt = toSortableDate(current.metAtIso());
        long nextMetAt = toSortableDate(next.metAtIso());
        if (nextMetAt != currentMetAt) {
            return nextMetAt > currentMetAt;
        }
        return next.userRateAffinity() > current.userRateAffinity();
    }

    private boolean isEligibleSingleMetRate(UserRate rate, String activeUserId) {
        return rate != null
                && "single".equals(safeText(rate.getMode()))
                && Boolean.TRUE.equals(rate.getMet())
                && !singleMetCounterpartUserIds(rate, activeUserId).isEmpty();
    }

    private List<String> singleMetCounterpartUserIds(UserRate rate, String activeUserId) {
        LinkedHashSet<String> counterpartIds = new LinkedHashSet<>();
        if (rate == null || !StringUtils.hasText(activeUserId)) {
            return List.of();
        }

        String ownerUserId = normalizeId(rate.getOwnerUserId());
        String relatedUserId = normalizeId(rate.getRelatedUserId());
        if (activeUserId.equals(ownerUserId)) {
            addCounterpart(counterpartIds, relatedUserId, activeUserId);
        } else if (activeUserId.equals(relatedUserId)) {
            addCounterpart(counterpartIds, ownerUserId, activeUserId);
        }
        return new ArrayList<>(counterpartIds);
    }

    private void addCounterpart(Set<String> counterpartIds, String candidateUserId, String activeUserId) {
        String normalizedCandidateUserId = normalizeId(candidateUserId);
        if (StringUtils.hasText(normalizedCandidateUserId) && !normalizedCandidateUserId.equals(activeUserId)) {
            counterpartIds.add(normalizedCandidateUserId);
        }
    }

    private String normalizeOwnerType(String ownerType) {
        String normalizedOwnerType = safeText(ownerType);
        return switch (normalizedOwnerType) {
            case "event", "subEvent", "group", "asset" -> normalizedOwnerType;
            default -> null;
        };
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String resolveAvatarUrl(Users user) {
        if (user == null || user.getImages() == null || user.getImages().isEmpty()) {
            return "";
        }
        return safeText(user.getImages().get(0));
    }

    private long toSortableDate(String value) {
        try {
            return Instant.parse(firstNonBlank(value, Instant.EPOCH.toString())).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private boolean isFutureIso(String value) {
        try {
            return Instant.parse(firstNonBlank(value, Instant.EPOCH.toString())).isAfter(Instant.now());
        } catch (Exception ignored) {
            return false;
        }
    }

    private String firstNonBlank(String first, String second) {
        return firstNonBlank(first, second, "");
    }

    private String firstNonBlank(String first, String second, String fallback) {
        String firstValue = safeText(first);
        if (StringUtils.hasText(firstValue)) {
            return firstValue;
        }
        String secondValue = safeText(second);
        if (StringUtils.hasText(secondValue)) {
            return secondValue;
        }
        return safeText(fallback);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private double safeDouble(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }

    private record CandidateSignal(
            String metAtIso,
            String metWhere,
            Double userRateAffinity) {
    }
}
