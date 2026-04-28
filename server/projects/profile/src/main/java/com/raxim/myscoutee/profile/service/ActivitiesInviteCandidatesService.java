package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

        Map<String, Users> usersById = usersRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(user -> StringUtils.hasText(normalizeId(user.getId())))
                .collect(LinkedHashMap::new, (map, user) -> map.put(normalizeId(user.getId()), user), Map::putAll);

        Map<String, CandidateSignal> signalsByUserId = new LinkedHashMap<>();
        for (UserRate rate : userRatesRepository.findByOwnerUserId(activeUserId)) {
            for (String candidateUserId : counterpartUserIds(rate, activeUserId)) {
                if (blockedUserIds.contains(candidateUserId)) {
                    continue;
                }
                Users candidate = usersById.get(candidateUserId);
                if (candidate == null) {
                    continue;
                }
                CandidateSignal signal = toSignal(rate, candidate);
                CandidateSignal current = signalsByUserId.get(candidateUserId);
                if (current == null || shouldReplace(current, signal)) {
                    signalsByUserId.put(candidateUserId, signal);
                }
            }
        }

        Comparator<ActivityMemberEntryDto> comparator = "relevant".equals(safeText(request.sort()))
                ? Comparator.comparing(ActivityMemberEntryDto::relevance, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(entry -> toSortableDate(entry.metAtIso()), Comparator.reverseOrder())
                : Comparator.comparing((ActivityMemberEntryDto entry) -> toSortableDate(entry.metAtIso()), Comparator.reverseOrder())
                        .thenComparing(entry -> entry.relevance() == null ? 0d : entry.relevance(), Comparator.reverseOrder());

        return signalsByUserId.entrySet().stream()
                .map(entry -> toEntry(entry.getKey(), usersById.get(entry.getKey()), entry.getValue()))
                .filter(Objects::nonNull)
                .sorted(comparator)
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
                signal.relevance(),
                resolveAvatarUrl(user));
    }

    private CandidateSignal toSignal(UserRate rate, Users candidate) {
        String metAtIso = firstNonBlank(rate == null ? null : rate.getUpdatedDate(), rate == null ? null : rate.getCreatedDate(), Instant.now().toString());
        String metWhere = firstNonBlank(rate == null ? null : rate.getEventName(), "Met on MyScoutee");
        double relevance = rate != null && rate.getAffinityScore() != null
                ? Math.max(0d, rate.getAffinityScore())
                : Math.max(0d, candidate.getAffinity() == null ? 0d : candidate.getAffinity());
        return new CandidateSignal(metAtIso, metWhere, relevance);
    }

    private boolean shouldReplace(CandidateSignal current, CandidateSignal next) {
        long currentMetAt = toSortableDate(current.metAtIso());
        long nextMetAt = toSortableDate(next.metAtIso());
        if (nextMetAt != currentMetAt) {
            return nextMetAt > currentMetAt;
        }
        return next.relevance() > current.relevance();
    }

    private List<String> counterpartUserIds(UserRate rate, String activeUserId) {
        LinkedHashSet<String> counterpartIds = new LinkedHashSet<>();
        if (rate == null || !StringUtils.hasText(activeUserId)) {
            return List.of();
        }

        addCounterpart(counterpartIds, rate.getRelatedUserId(), activeUserId);
        addCounterpart(counterpartIds, rate.getSecondaryRelatedUserId(), activeUserId);
        if (!counterpartIds.isEmpty()) {
            return new ArrayList<>(counterpartIds);
        }

        String fromUserId = normalizeId(rate.getFromUserId());
        String toUserId = normalizeId(rate.getToUserId());
        if (activeUserId.equals(fromUserId)) {
            addCounterpart(counterpartIds, toUserId, activeUserId);
        }
        if (activeUserId.equals(toUserId)) {
            addCounterpart(counterpartIds, fromUserId, activeUserId);
        }
        if ("pair".equals(safeText(rate.getMode())) && activeUserId.equals(normalizeId(rate.getOwnerUserId()))) {
            addCounterpart(counterpartIds, fromUserId, activeUserId);
            addCounterpart(counterpartIds, toUserId, activeUserId);
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

    private record CandidateSignal(
            String metAtIso,
            String metWhere,
            Double relevance) {
    }
}
