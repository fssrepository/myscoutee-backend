package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class AffinityMaintenanceService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String STATUS_ACCEPTED = "accepted";
    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final UserRatesRepository userRatesRepository;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityCalculationService affinityCalculationService;
    private final UserAffinityEdgeService userAffinityEdgeService;

    public AffinityMaintenanceService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            UserRatesRepository userRatesRepository,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.userRatesRepository = userRatesRepository;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityCalculationService = affinityCalculationService;
        this.userAffinityEdgeService = userAffinityEdgeService;
    }

    public void refreshForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(this::refreshForUser);
    }

    public void refreshForUser(Users changedUser) {
        String changedUserId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(changedUserId)) {
            return;
        }
        refreshEventAffinitiesForUser(changedUser);
        refreshAssetAffinitiesForOwner(changedUser);
    }

    public void refreshUserAffinityAndDependents(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(this::refreshUserAffinityAndDependents);
    }

    public void refreshUserAffinityAndDependents(Users user) {
        String userId = normalizeId(user == null ? null : user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
        Users refreshed = user;
        if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
            user.setAffinity(nextAffinity);
            refreshed = usersRepository.save(user);
        }
        refreshRateAffinitiesForUser(refreshed);
        refreshForUser(refreshed);
    }

    public void refreshForUsers(Collection<String> userIds) {
        List<String> normalizedUserIds = normalizeIds(userIds);
        if (normalizedUserIds.isEmpty()) {
            return;
        }
        List<Users> users = usersRepository.findByUserIdIn(normalizedUserIds);
        for (Users user : users == null ? List.<Users>of() : users) {
            refreshForUser(user);
        }
    }

    public void refreshAllStoredAffinities() {
        List<Users> users = usersRepository.findAll().stream()
                .filter(user -> StringUtils.hasText(normalizeId(user == null ? null : user.getId())))
                .toList();
        List<Users> changedUsers = new ArrayList<>();
        for (Users user : users) {
            double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
            if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
                user.setAffinity(nextAffinity);
                changedUsers.add(user);
            }
        }
        if (!changedUsers.isEmpty()) {
            usersRepository.saveAll(changedUsers);
        }

        Map<String, Users> usersById = indexUsers(users);
        refreshAllRateAffinities();
        refreshAllEventAffinities(usersById);
        refreshAllAssetAffinities(usersById);
    }

    public void refreshEventAffinitiesForSourceId(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return;
        }
        List<ActivityEvent> events = activityEventsRepository.findBySourceId(normalizedSourceId);
        if (events == null || events.isEmpty()) {
            return;
        }
        LinkedHashSet<String> participantUserIds = new LinkedHashSet<>();
        for (ActivityEvent event : events) {
            String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                participantUserIds.add(creatorUserId);
            }
        }
        participantUserIds.addAll(acceptedEventMemberUserIds(normalizedSourceId));
        Map<String, Users> usersById = new LinkedHashMap<>();
        List<Users> participants = usersRepository.findByUserIdIn(new ArrayList<>(participantUserIds));
        for (Users user : participants == null ? List.<Users>of() : participants) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        saveChangedEvents(events, usersById);
    }

    private void refreshEventAffinitiesForUser(Users changedUser) {
        String changedUserId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(changedUserId)) {
            return;
        }

        LinkedHashMap<String, ActivityEvent> affectedEventsByDocumentId = new LinkedHashMap<>();
        addAffectedEvents(affectedEventsByDocumentId, activityEventsRepository.findByCreatorUserId(changedUserId));
        Set<String> memberEventSourceIds = acceptedEventSourceIdsForUser(changedUserId);
        if (!memberEventSourceIds.isEmpty()) {
            addAffectedEvents(affectedEventsByDocumentId, activityEventsRepository.findBySourceIdIn(memberEventSourceIds));
        }
        if (affectedEventsByDocumentId.isEmpty()) {
            return;
        }

        LinkedHashSet<String> participantUserIds = new LinkedHashSet<>();
        participantUserIds.add(changedUserId);
        for (ActivityEvent event : affectedEventsByDocumentId.values()) {
            String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                participantUserIds.add(creatorUserId);
            }
        }
        participantUserIds.addAll(eventAcceptedMemberUserIdsBySourceId(affectedEventsByDocumentId.values()).values().stream()
                .flatMap(Collection::stream)
                .toList());

        Map<String, Users> usersById = new LinkedHashMap<>();
        usersById.put(changedUserId, changedUser);
        List<Users> participants = usersRepository.findByUserIdIn(new ArrayList<>(participantUserIds));
        for (Users user : participants == null ? List.<Users>of() : participants) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        saveChangedEvents(affectedEventsByDocumentId.values(), usersById);
    }

    private void refreshAllEventAffinities(Map<String, Users> usersById) {
        saveChangedEvents(activityEventsRepository.findAll(), usersById);
    }

    private void saveChangedEvents(Collection<ActivityEvent> events, Map<String, Users> usersById) {
        List<ActivityEvent> eventList = events == null
                ? List.of()
                : events.stream().filter(event -> event != null).toList();
        Map<String, List<String>> acceptedMembersBySourceId = eventAcceptedMemberUserIdsBySourceId(eventList);
        List<ActivityEvent> changedEvents = new ArrayList<>();
        for (ActivityEvent event : eventList) {
            double nextAffinity = absoluteAffinityService.resolveEventAffinity(
                    event,
                    eventAffinityParticipants(event, usersById, acceptedMembersBySourceId.get(normalizeId(event.getSourceId()))));
            if (Math.abs(safeDouble(event.getAffinity()) - nextAffinity) > 0.000001d) {
                event.setAffinity(nextAffinity);
                changedEvents.add(event);
            }
        }
        if (!changedEvents.isEmpty()) {
            activityEventsRepository.saveAll(changedEvents);
        }
    }

    private void refreshAssetAffinitiesForOwner(Users owner) {
        String ownerUserId = normalizeId(owner == null ? null : owner.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return;
        }
        List<Asset> changedAssets = new ArrayList<>();
        for (Asset asset : assetsRepository.findByOwnerUserId(ownerUserId)) {
            if (asset == null) {
                continue;
            }
            double nextAffinity = absoluteAffinityService.resolveAssetAffinity(asset, owner);
            if (Math.abs(safeDouble(asset.getAffinity()) - nextAffinity) > 0.000001d) {
                asset.setAffinity(nextAffinity);
                changedAssets.add(asset);
            }
        }
        if (!changedAssets.isEmpty()) {
            assetsRepository.saveAll(changedAssets);
        }
    }

    private void refreshAllAssetAffinities(Map<String, Users> usersById) {
        List<Asset> changedAssets = new ArrayList<>();
        for (Asset asset : assetsRepository.findAll()) {
            if (asset == null) {
                continue;
            }
            Users owner = usersById.get(normalizeId(asset.getOwnerUserId()));
            double nextAffinity = absoluteAffinityService.resolveAssetAffinity(asset, owner);
            if (Math.abs(safeDouble(asset.getAffinity()) - nextAffinity) > 0.000001d) {
                asset.setAffinity(nextAffinity);
                changedAssets.add(asset);
            }
        }
        if (!changedAssets.isEmpty()) {
            assetsRepository.saveAll(changedAssets);
        }
    }

    private void addAffectedEvents(Map<String, ActivityEvent> target, List<ActivityEvent> events) {
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String documentId = normalizeId(event == null ? null : event.getId());
            if (StringUtils.hasText(documentId)) {
                target.put(documentId, event);
            }
        }
    }

    private List<Users> eventAffinityParticipants(ActivityEvent event, Map<String, Users> usersById, List<String> acceptedMemberUserIds) {
        LinkedHashMap<String, Users> participantsById = new LinkedHashMap<>();
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId) && usersById.containsKey(creatorUserId)) {
            participantsById.put(creatorUserId, usersById.get(creatorUserId));
        }
        for (String userId : normalizeIds(acceptedMemberUserIds)) {
            Users user = usersById.get(userId);
            if (user != null) {
                participantsById.put(userId, user);
            }
        }
        return new ArrayList<>(participantsById.values());
    }

    private Set<String> acceptedEventSourceIdsForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }
        return activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, normalizedUserId).stream()
                .filter(member -> STATUS_ACCEPTED.equals(normalizeMemberStatus(member == null ? null : member.getStatus())))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<String> acceptedEventMemberUserIds(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return List.of();
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_EVENT, normalizedSourceId).stream()
                .filter(member -> STATUS_ACCEPTED.equals(normalizeMemberStatus(member == null ? null : member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private Map<String, List<String>> eventAcceptedMemberUserIdsBySourceId(Collection<ActivityEvent> events) {
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        if (sourceIds.isEmpty()) {
            return Map.of();
        }
        LinkedHashMap<String, LinkedHashSet<String>> membersBySourceId = new LinkedHashMap<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds)) {
            if (!STATUS_ACCEPTED.equals(normalizeMemberStatus(member == null ? null : member.getStatus()))) {
                continue;
            }
            String sourceId = normalizeId(member.getOwnerId());
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(sourceId) && StringUtils.hasText(userId)) {
                membersBySourceId.computeIfAbsent(sourceId, ignored -> new LinkedHashSet<>()).add(userId);
            }
        }
        LinkedHashMap<String, List<String>> result = new LinkedHashMap<>();
        for (Map.Entry<String, LinkedHashSet<String>> entry : membersBySourceId.entrySet()) {
            result.put(entry.getKey(), new ArrayList<>(entry.getValue()));
        }
        return result;
    }

    private void refreshRateAffinitiesForUser(Users changedUser) {
        String userId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        refreshRateAffinities(userRatesRepository.findRelevantByUserIds(List.of(userId)));
    }

    private void refreshAllRateAffinities() {
        refreshRateAffinities(userRatesRepository.findAll());
    }

    private void refreshRateAffinities(List<UserRate> rates) {
        if (rates == null || rates.isEmpty()) {
            return;
        }
        Map<String, RateAffinitySnapshot> previousById = new LinkedHashMap<>();
        for (UserRate rate : rates) {
            String id = normalizeId(rate == null ? null : rate.getId());
            if (StringUtils.hasText(id)) {
                previousById.put(id, RateAffinitySnapshot.of(rate));
            }
        }

        affinityCalculationService.applyAffinity(rates);
        List<UserRate> changedRates = new ArrayList<>();
        for (UserRate rate : rates) {
            String id = normalizeId(rate == null ? null : rate.getId());
            RateAffinitySnapshot previous = previousById.get(id);
            if (previous == null || !previous.matches(rate)) {
                changedRates.add(rate);
            }
        }
        if (!changedRates.isEmpty()) {
            userRatesRepository.saveAll(changedRates);
        }
        userAffinityEdgeService.recomputeForRates(rates);
    }

    private Map<String, Users> indexUsers(List<Users> users) {
        Map<String, Users> usersById = new LinkedHashMap<>();
        for (Users user : users == null ? List.<Users>of() : users) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        return usersById;
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeMemberStatus(String value) {
        return value == null ? "" : value.trim();
    }

    private double safeDouble(Number value) {
        return value == null || !Double.isFinite(value.doubleValue()) ? 0d : value.doubleValue();
    }

    private record RateAffinitySnapshot(
            Double affinityScore,
            Double evidenceConfidence,
            Integer scoreReceived,
            Boolean mutuallyRated) {

        private static RateAffinitySnapshot of(UserRate rate) {
            return new RateAffinitySnapshot(
                    rate == null ? null : rate.getAffinityScore(),
                    rate == null ? null : rate.getEvidenceConfidence(),
                    rate == null ? null : rate.getScoreReceived(),
                    rate == null ? null : rate.getMutuallyRated());
        }

        private boolean matches(UserRate rate) {
            return sameDouble(affinityScore, rate == null ? null : rate.getAffinityScore())
                    && sameDouble(evidenceConfidence, rate == null ? null : rate.getEvidenceConfidence())
                    && sameInteger(scoreReceived, rate == null ? null : rate.getScoreReceived())
                    && sameBoolean(mutuallyRated, rate == null ? null : rate.getMutuallyRated());
        }

        private static boolean sameDouble(Double left, Double right) {
            if (left == null || right == null) {
                return left == right;
            }
            return Math.abs(left.doubleValue() - right.doubleValue()) <= 0.000001d;
        }

        private static boolean sameInteger(Integer left, Integer right) {
            return left == null ? right == null : left.equals(right);
        }

        private static boolean sameBoolean(Boolean left, Boolean right) {
            return left == null ? right == null : left.equals(right);
        }
    }
}
