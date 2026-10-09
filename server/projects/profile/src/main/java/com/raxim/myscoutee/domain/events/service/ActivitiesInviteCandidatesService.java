package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.accounts.api.ProfileCards;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.accounts.api.RatingProfiles;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.groups.api.Groups;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityMember;

import com.raxim.myscoutee.domain.affinity.api.RatingView;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.events.dto.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.domain.events.dto.ActivityInviteDtos.ActivityInviteCandidatesPageDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.accounts.api.ContactDirectory;
import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;

@Service
public class ActivitiesInviteCandidatesService {
    @org.springframework.beans.factory.annotation.Autowired
    private Groups communityGroups;
    private final ProfileSummaries usersRepository;
    private final RatingDirectory userRatesRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final ProfileCards profileCards;
    private final SelectedProfile selectedProfile;
    private final RatingProfiles ratingProfiles;
    private final ContactDirectory navigatorContactsProfilesRepository;

    public ActivitiesInviteCandidatesService(
            ProfileSummaries usersRepository,
            RatingDirectory userRatesRepository,
            ActivityMembersRepository activityMembersRepository,
            ActivitiesMembersService activitiesMembersService,
            ProfileCards profileCards,
            SelectedProfile selectedProfile,
            RatingProfiles ratingProfiles,
            ContactDirectory navigatorContactsProfilesRepository) {
        this.usersRepository = usersRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.profileCards = profileCards;
        this.selectedProfile = selectedProfile;
        this.ratingProfiles = ratingProfiles;
        this.navigatorContactsProfilesRepository = navigatorContactsProfilesRepository;
    }

    public ActivityInviteCandidatesPageDto queryCandidates(ActivityInviteCandidatesRequestDto request) {
        int page = normalizePage(request == null ? null : request.page());
        int pageSize = normalizePageSize(request == null ? null : request.pageSize());
        if (request == null) {
            return emptyPage(page, pageSize);
        }

        String ownerType = normalizeOwnerType(request.ownerType());
        var communityActor = "community".equals(ownerType) ? communityGroups.actor(request.activeUserId()) : null;
        ProfileIdentityDto activeUser = "community".equals(ownerType)
                ? identity(communityActor) : selectedProfile.resolveSelectedIdentity(request.activeUserId());
        String ownerId = normalizeId(request.ownerId());
        if (!"payment".equals(request.purpose()) && "asset".equals(ownerType) && activeUser != null
                && StringUtils.hasText(ownerId)
                && StringUtils.hasText(activeUser.accountUserId())
                && ownerId.equals(normalizeId(activeUser.accountUserId()))) {
            // Contacts uses the authenticated account as its picker owner.
            // Event and actual Asset member pickers retain their profile scope.
            communityActor = communityGroups.actor(request.activeUserId());
            activeUser = identity(communityActor);
        }
        String activeUserId = normalizeId(activeUser == null ? null : activeUser.userId());
        if (!StringUtils.hasText(activeUserId) || !StringUtils.hasText(ownerId) || !StringUtils.hasText(ownerType)) {
            return emptyPage(page, pageSize);
        }

        if("payment".equals(request.purpose())) {
            if(!"asset".equals(ownerType)||!ownerId.equals(activeUserId))return emptyPage(page,pageSize);
            var records=usersRepository.paymentMemberSummaries(activeUser.workspaceGroupId(),activeUserId,page,pageSize);
            var signal=new CandidateSignal("","",0d);
            var cards = cards(records.items().stream().map(ProfileSummary::getUserId).toList());
            return new ActivityInviteCandidatesPageDto(records.items().stream().map(u->toEntry(u.getUserId(),u,signal,cards.get(u.getUserId()))).toList(),(int)Math.min(Integer.MAX_VALUE,records.total()),page,pageSize);
        }
        if ("community".equals(ownerType)) communityGroups.requireAdmin(communityActor, ownerId);
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(ownerType, ownerId);
        String parentOwnerId = normalizeId(request.parentOwnerId());
        String parentOwnerType = normalizeOwnerType(request.parentOwnerType());
        LinkedHashSet<String> existingMemberUserIds = normalizeUserIds(request.existingMemberUserIds());
        if (request.existingMemberUserIds() == null && snapshot != null) {
            existingMemberUserIds.addAll(snapshot.acceptedMemberUserIds());
            existingMemberUserIds.addAll(snapshot.pendingMemberUserIds());
        }
        LinkedHashSet<String> pendingInviteUserIds = normalizeUserIds(request.pendingInviteUserIds());
        if (request.pendingInviteUserIds() == null && snapshot != null) {
            pendingInviteUserIds.addAll(snapshot.pendingMemberUserIds());
        }
        if (!"event".equals(ownerType)
                && StringUtils.hasText(parentOwnerType)
                && StringUtils.hasText(parentOwnerId)) {
            return queryParentMemberCandidates(
                    activeUserId,
                    parentOwnerId,
                    parentOwnerType,
                    existingMemberUserIds,
                    pendingInviteUserIds,
                    snapshot,
                    page,
                    pageSize);
        }

        List<ActivityMember> communityMembers = "community".equals(ownerType)
                ? activityMembersRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId) : List.of();
        Set<String> blockedUserIds = new LinkedHashSet<>();
        blockedUserIds.add(activeUserId);
        communityMembers.stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus())).map(ActivityMember::getUserId).forEach(blockedUserIds::add);
        if (snapshot != null) {
            blockedUserIds.addAll(snapshot.acceptedMemberUserIds());
            blockedUserIds.addAll(snapshot.pendingMemberUserIds());
        }
        blockedUserIds.addAll(existingMemberUserIds);
        if ("asset".equals(ownerType)) {
            blockedUserIds.addAll(querySavedContactUserIds(activeUserId));
        }

        Map<String, CandidateSignal> signalsByUserId = new LinkedHashMap<>();
        for (RatingView rate : userRatesRepository.findRelevantByUserIds(List.of(activeUserId))) {
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
        List<ActivityMember> pendingMembers = ("community".equals(ownerType) ? communityMembers
                : snapshot == null ? List.<ActivityMember>of() : snapshot.members()).stream()
                        .filter(member -> "pending".equals(safeText(member == null ? null : member.getStatus())))
                        .filter(member -> !"community".equals(ownerType) || "invite".equals(member.getRequestKind()))
                        .filter(member -> !activeUserId.equals(normalizeId(member.getUserId())))
                        .toList();
        LinkedHashSet<String> candidateUserIds = signalsByUserId.keySet().stream()
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        pendingMembers.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(candidateUserIds::add);
        if (candidateUserIds.isEmpty()) {
            return emptyPage(page, pageSize);
        }

        Set<String> visibleIds = ratingProfiles.queryRatingProfiles(candidateUserIds).stream()
                .filter(profile -> profile != null && profile.activityRateVisible())
                .map(com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto::userId)
                .collect(java.util.stream.Collectors.toSet());
        Map<String, ProfileSummary> usersById = usersRepository.findByUserIdIn(candidateUserIds).stream()
                .filter(user -> user != null && StringUtils.hasText(normalizeId(user.getUserId())))
                .filter(user -> visibleIds.contains(user.getUserId()))
                .collect(LinkedHashMap::new, (map, user) -> map.put(normalizeId(user.getUserId()), user), Map::putAll);

        var cards = cards(usersById.keySet());
        Comparator<Map.Entry<String, CandidateSignal>> comparator = "relevant".equals(safeText(request.sort()))
                ? Comparator.<Map.Entry<String, CandidateSignal>>comparingDouble(entry -> safeDouble(entry.getValue().userRateAffinity())).reversed()
                        .thenComparing(entry -> toSortableDate(entry.getValue().metAtIso()), Comparator.reverseOrder())
                : Comparator.<Map.Entry<String, CandidateSignal>>comparingLong(entry -> toSortableDate(entry.getValue().metAtIso())).reversed()
                        .thenComparing(entry -> safeDouble(entry.getValue().userRateAffinity()), Comparator.reverseOrder());
        List<ActivityMemberEntryDto> candidates = new ArrayList<>();
        pendingMembers.stream()
                .sorted(Comparator.comparing(
                        member -> toSortableDate(member == null ? null : member.getActionAtIso()),
                        Comparator.reverseOrder()))
                .map(member -> toInviteEntryFromMember(member, usersById.get(normalizeId(member.getUserId())), cards.get(normalizeId(member.getUserId()))))
                .filter(entry -> entry != null)
                .forEach(candidates::add);
        Set<String> pendingUserIds = candidates.stream()
                .map(ActivityMemberEntryDto::userId)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        signalsByUserId.entrySet().stream()
                .filter(entry -> !pendingUserIds.contains(entry.getKey()))
                .sorted(comparator)
                .map(entry -> toEntry(entry.getKey(), usersById.get(entry.getKey()), entry.getValue(), cards.get(entry.getKey())))
                .filter(entry -> entry != null)
                .forEach(candidates::add);
        return toPage(candidates, page, pageSize);
    }

    private ActivityInviteCandidatesPageDto queryParentMemberCandidates(
            String activeUserId,
            String parentOwnerId,
            String parentOwnerType,
            Set<String> childMemberUserIds,
            Set<String> pendingInviteUserIds,
            ActivitiesMembersService.OwnerMembersSnapshot childSnapshot,
            int page,
            int pageSize) {
        LinkedHashSet<String> excludedUserIds = new LinkedHashSet<>();
        excludedUserIds.add(activeUserId);
        excludedUserIds.addAll(childMemberUserIds == null ? Set.of() : childMemberUserIds);
        LinkedHashSet<String> selectedPendingUserIds = new LinkedHashSet<>(
                pendingInviteUserIds == null ? Set.of() : pendingInviteUserIds);
        selectedPendingUserIds.remove(activeUserId);
        excludedUserIds.addAll(selectedPendingUserIds);

        List<String> selectedPendingIds = List.copyOf(selectedPendingUserIds);
        long requestedStart = (long) page * pageSize;
        int pendingStart = (int) Math.min(selectedPendingIds.size(), requestedStart);
        int pendingEnd = Math.min(selectedPendingIds.size(), pendingStart + pageSize);
        List<String> pendingIdsOnPage = selectedPendingIds.subList(pendingStart, pendingEnd);
        int remainingSlots = pageSize - pendingIdsOnPage.size();
        long parentOffset = Math.max(0L, requestedStart - selectedPendingIds.size());
        Sort sort = Sort.by(Sort.Order.desc("actionAtIso"), Sort.Order.asc("userId"));
        Pageable pageable = new OffsetPageRequest(parentOffset, Math.max(1, remainingSlots), sort);
        Page<ActivityMember> parentMembers = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndStatusAndUserIdNotIn(
                        parentOwnerType,
                        parentOwnerId,
                        "accepted",
                        excludedUserIds,
                        pageable);
        Map<String, ActivityMember> pendingMembersByUserId = childSnapshot == null
                ? Map.of()
                : childSnapshot.members().stream()
                        .filter(member -> member != null && "pending".equals(safeText(member.getStatus())))
                        .filter(member -> selectedPendingUserIds.contains(normalizeId(member.getUserId())))
                        .collect(LinkedHashMap::new,
                                (map, member) -> map.putIfAbsent(normalizeId(member.getUserId()), member),
                                Map::putAll);
        Set<String> pageUserIds = parentMembers.getContent().stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        pageUserIds.addAll(pendingIdsOnPage);
        Map<String, ProfileSummary> usersById = usersRepository.findByUserIdIn(pageUserIds).stream()
                .filter(user -> user != null && StringUtils.hasText(normalizeId(user.getUserId())))
                .collect(LinkedHashMap::new, (map, user) -> map.put(normalizeId(user.getUserId()), user), Map::putAll);
        var cards = cards(usersById.keySet());
        List<ActivityMemberEntryDto> items = new ArrayList<>();
        pendingIdsOnPage.stream()
                .map(userId -> toInviteEntryFromMember(
                        pendingMembersByUserId.getOrDefault(userId, pendingInviteMember(userId)),
                        usersById.get(userId), cards.get(userId)))
                .filter(entry -> entry != null)
                .forEach(items::add);
        if (remainingSlots > 0) {
            parentMembers.getContent().stream()
                    .limit(remainingSlots)
                    .map(member -> toInviteEntryFromMember(member, usersById.get(normalizeId(member.getUserId())), cards.get(normalizeId(member.getUserId()))))
                    .filter(entry -> entry != null)
                    .forEach(items::add);
        }
        long total = Math.min(Integer.MAX_VALUE, parentMembers.getTotalElements() + selectedPendingIds.size());
        return new ActivityInviteCandidatesPageDto(
                items,
                (int) total,
                page,
                pageSize);
    }

    private static ProfileIdentityDto identity(ProfileSummary profile) {
        return profile == null ? null : new ProfileIdentityDto(profile.getUserId(), profile.getAccountUserId(), profile.getWorkspaceGroupId());
    }

    private Map<String, UserDto> cards(java.util.Collection<String> ids) {
        if (ids.isEmpty()) return Map.of();
        Map<String, UserDto> cards = new LinkedHashMap<>();
        for (var card : profileCards.presentGameCards(ids)) {
            if (card != null) cards.put(card.id(), card);
        }
        return cards;
    }

    private ActivityMember pendingInviteMember(String userId) {
        ActivityMember member = new ActivityMember();
        member.setUserId(userId);
        member.setStatus("pending");
        member.setPendingSource("admin");
        member.setRequestKind("invite");
        member.setActionAtIso(Instant.now().toString());
        member.setMetWhere("Pending invitation");
        return member;
    }

    private static final class OffsetPageRequest implements Pageable {
        private final long offset;
        private final int pageSize;
        private final Sort sort;

        private OffsetPageRequest(long offset, int pageSize, Sort sort) {
            this.offset = Math.max(0L, offset);
            this.pageSize = Math.max(1, pageSize);
            this.sort = sort == null ? Sort.unsorted() : sort;
        }

        @Override
        public int getPageNumber() {
            return (int) Math.min(Integer.MAX_VALUE, offset / pageSize);
        }

        @Override
        public int getPageSize() {
            return pageSize;
        }

        @Override
        public long getOffset() {
            return offset;
        }

        @Override
        public Sort getSort() {
            return sort;
        }

        @Override
        public Pageable next() {
            return new OffsetPageRequest(offset + pageSize, pageSize, sort);
        }

        @Override
        public Pageable previousOrFirst() {
            return hasPrevious()
                    ? new OffsetPageRequest(Math.max(0L, offset - pageSize), pageSize, sort)
                    : first();
        }

        @Override
        public Pageable first() {
            return new OffsetPageRequest(0L, pageSize, sort);
        }

        @Override
        public Pageable withPage(int pageNumber) {
            return new OffsetPageRequest((long) Math.max(0, pageNumber) * pageSize, pageSize, sort);
        }

        @Override
        public boolean hasPrevious() {
            return offset > 0L;
        }
    }

    private ActivityMemberEntryDto toInviteEntryFromMember(ActivityMember member, ProfileSummary user, UserDto card) {
        String userId = normalizeId(member == null ? null : member.getUserId());
        if (!StringUtils.hasText(userId) || user == null) {
            return null;
        }
        String actionAtIso = firstNonBlank(
                member.getActionAtIso(),
                member.getMetAtIso(),
                Instant.now().toString());
        return new ActivityMemberEntryDto(
                userId,
                userId,
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
                actionAtIso,
                actionAtIso,
                firstNonBlank(member.getMetWhere(), "Parent member"),
                resolveAvatarUrl(user),
                card,
                List.of(),
                actionAtIso,
                null,
                null,
                null,
                null);
    }

    private ActivityInviteCandidatesPageDto toPage(
            List<ActivityMemberEntryDto> candidates,
            int page,
            int pageSize) {
        List<ActivityMemberEntryDto> safeCandidates = candidates == null ? List.of() : candidates;
        long requestedStart = (long) page * pageSize;
        int start = (int) Math.min(safeCandidates.size(), requestedStart);
        int end = Math.min(safeCandidates.size(), start + pageSize);
        return new ActivityInviteCandidatesPageDto(
                List.copyOf(safeCandidates.subList(start, end)),
                safeCandidates.size(),
                page,
                pageSize);
    }

    private ActivityInviteCandidatesPageDto emptyPage(int page, int pageSize) {
        return new ActivityInviteCandidatesPageDto(List.of(), 0, page, pageSize);
    }

    private int normalizePage(Integer page) {
        return Math.max(0, page == null ? 0 : page);
    }

    private int normalizePageSize(Integer pageSize) {
        return Math.max(1, Math.min(100, pageSize == null ? 16 : pageSize));
    }

    private ActivityMemberEntryDto toEntry(String candidateUserId, ProfileSummary user, CandidateSignal signal, UserDto card) {
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
                card,
                List.of(),
                signal.metAtIso(),
                null,
                null,
                null,
                null);
    }

    private CandidateSignal toSignal(RatingView rate) {
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

    private boolean isEligibleSingleMetRate(RatingView rate, String activeUserId) {
        return rate != null
                && "single".equals(safeText(rate.getMode()))
                && Boolean.TRUE.equals(rate.getMet())
                && !singleMetCounterpartUserIds(rate, activeUserId).isEmpty();
    }

    private List<String> singleMetCounterpartUserIds(RatingView rate, String activeUserId) {
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

    private Set<String> querySavedContactUserIds(String activeUserId) { return navigatorContactsProfilesRepository.savedCandidateIds(activeUserId); }

    private String normalizeOwnerType(String ownerType) {
        String normalizedOwnerType = safeText(ownerType);
        return switch (normalizedOwnerType) {
            case "event", "subEvent", "group", "asset", "community" -> normalizedOwnerType;
            default -> null;
        };
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private LinkedHashSet<String> normalizeUserIds(List<String> userIds) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String userId : userIds == null ? List.<String>of() : userIds) {
            String value = normalizeId(userId);
            if (StringUtils.hasText(value)) {
                normalized.add(value);
            }
        }
        return normalized;
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String resolveAvatarUrl(ProfileSummary user) {
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
