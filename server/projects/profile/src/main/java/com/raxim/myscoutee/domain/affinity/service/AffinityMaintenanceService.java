package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.api.JobAudience;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.util.StringUtils;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfile;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.api.EventDerivedUpdates;
import com.raxim.myscoutee.domain.events.dto.EventVersionDto;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfiles;

@Service
public class AffinityMaintenanceService {
    private final com.raxim.myscoutee.domain.platform.api.JobAudience jobGroupScope;

    private final com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections accountProjections;
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String STATUS_ACCEPTED = "accepted";
    private final ScoringProfiles usersRepository;
    private final EventOwnershipReads activityEventsRepository;
    private final EventDerivedUpdates eventDerivedUpdates;
    private final MemberDirectory activityMembersRepository;
    private final AssetOwnershipReads assetsRepository;
    private final com.raxim.myscoutee.domain.assets.api.AssetDerivedUpdates assetDerivedUpdates;
    private final UserRatesRepository userRatesRepository;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityCalculationService affinityCalculationService;
    private final UserAffinityEdgeService userAffinityEdgeService;
    private final MongoTemplate mongoTemplate;

    public AffinityMaintenanceService(
            ScoringProfiles usersRepository,
            EventOwnershipReads activityEventsRepository,
            EventDerivedUpdates eventDerivedUpdates,
            MemberDirectory activityMembersRepository,
            AssetOwnershipReads assetsRepository,
            com.raxim.myscoutee.domain.assets.api.AssetDerivedUpdates assetDerivedUpdates,
            UserRatesRepository userRatesRepository,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService,
            MongoTemplate mongoTemplate,
            com.raxim.myscoutee.domain.platform.api.JobAudience jobGroupScope,
            com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections accountProjections) {
        this.jobGroupScope = jobGroupScope;
        this.accountProjections = accountProjections;

        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.eventDerivedUpdates = eventDerivedUpdates;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.assetDerivedUpdates = assetDerivedUpdates;
        this.userRatesRepository = userRatesRepository;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityCalculationService = affinityCalculationService;
        this.userAffinityEdgeService = userAffinityEdgeService;
        this.mongoTemplate = mongoTemplate;
    }

    public void refreshForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(this::refreshForUser);
    }

    public void refreshForUser(ScoringProfile changedUser) {
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

    public void refreshUserAffinityAndDependents(ScoringProfile user) {
        ScoringProfile refreshed = refreshAffinityAndRates(user);
        if (refreshed != null) refreshForUser(refreshed);
    }

    public void refreshUserAffinityAndRates(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(this::refreshUserAffinityAndRates);
    }

    public void refreshUserAffinityAndRates(ScoringProfile user) {
        refreshAffinityAndRates(user);
    }

    public UserAffinityDependents resolveUserAffinityDependents(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new UserAffinityDependents(List.of(), List.of());
        }

        LinkedHashSet<String> eventSourceIds = new LinkedHashSet<>();
        for (Event event : activityEventsRepository.findByCreatorUserId(normalizedUserId)) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                eventSourceIds.add(sourceId);
            }
        }
        eventSourceIds.addAll(acceptedEventSourceIdsForUser(normalizedUserId));

        LinkedHashSet<String> assetIds = new LinkedHashSet<>();
        for (Asset asset : assetsRepository.findByOwnerUserId(normalizedUserId)) {
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                assetIds.add(assetId);
            }
        }
        return new UserAffinityDependents(new ArrayList<>(eventSourceIds), new ArrayList<>(assetIds));
    }

    public RecomputeOutcome refreshAssetAffinityForAssetId(String assetId) {
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedAssetId)) {
            return RecomputeOutcome.empty();
        }
        return refreshAssetAffinitiesForAssetIds(List.of(normalizedAssetId));
    }

    public RecomputeOutcome refreshAssetAffinitiesForAssetIds(Collection<String> assetIds) {
        List<String> normalizedAssetIds = normalizeIds(assetIds);
        if (normalizedAssetIds.isEmpty()) {
            return RecomputeOutcome.empty();
        }
        List<? extends Asset> assets = normalizedAssetIds.size() == 1
                ? assetsRepository.findByAssetId(normalizedAssetIds.get(0)).map(List::of).orElseGet(List::of)
                : assetsRepository.findByAssetIdIn(normalizedAssetIds);
        if (assets == null || assets.isEmpty()) {
            return RecomputeOutcome.empty();
        }

        LinkedHashSet<String> ownerUserIds = new LinkedHashSet<>();
        for (Asset asset : assets) {
            String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                ownerUserIds.add(ownerUserId);
            }
        }

        Map<String, ScoringProfile> ownersById = indexUsers(usersRepository.findByUserIdIn(new ArrayList<>(ownerUserIds)));
        List<String> updatedAssetIds = new ArrayList<>();
        List<String> conflictedAssetIds = new ArrayList<>();
        for (Asset asset : assets) {
            if (asset == null) {
                continue;
            }
            ScoringProfile owner = ownersById.get(normalizeId(asset.getOwnerUserId()));
            double nextAffinity = absoluteAffinityService.resolveAssetAffinity(asset, owner);
            double nextBoost = absoluteAffinityService.resolveAssetBoost(asset, owner);
            if (Math.abs(safeDouble(asset.getAffinity()) - nextAffinity) > 0.000001d
                    || Math.abs(safeDouble(asset.getBoost()) - nextBoost) > 0.000001d) {
                if (updateAssetDerivedFieldsIfSnapshotCurrent(asset, nextAffinity, nextBoost)) {
                    updatedAssetIds.add(normalizeId(asset.getAssetId()));
                } else {
                    conflictedAssetIds.add(normalizeId(asset.getAssetId()));
                }
            }
        }
        return new RecomputeOutcome(updatedAssetIds, conflictedAssetIds);
    }

    public void refreshForUsers(Collection<String> userIds) {
        List<String> normalizedUserIds = normalizeIds(userIds);
        if (normalizedUserIds.isEmpty()) {
            return;
        }
        List<? extends ScoringProfile> users = usersRepository.findByUserIdIn(normalizedUserIds);
        for (ScoringProfile user : users == null ? List.<ScoringProfile>of() : users) {
            refreshForUser(user);
        }
    }

    public StoredAffinityRecomputeOutcome refreshAllStoredAffinities() {
        List<? extends ScoringProfile> users = accountProjections.profilesForCurrentJob().stream()
                .filter(user -> StringUtils.hasText(normalizeId(user == null ? null : user.getId())))
                .toList();
        Map<String, ScoringProfile> usersById = indexUsers(users);
        for (ScoringProfile user : users) {
            double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
            if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d && updateUserAffinityOnly(user, nextAffinity)) {
                usersById.put(normalizeId(user.getId()), com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto.from(user).withAffinity(nextAffinity));
            }
        }

        refreshAllRateAffinities(usersById.keySet());
        RecomputeOutcome eventOutcome = refreshAllEventAffinities(usersById);
        RecomputeOutcome assetOutcome = refreshAllAssetAffinities(usersById);
        return new StoredAffinityRecomputeOutcome(eventOutcome, assetOutcome);
    }

    public RecomputeOutcome refreshEventAffinitiesForSourceId(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return RecomputeOutcome.empty();
        }
        return refreshEventAffinitiesForSourceIds(List.of(normalizedSourceId));
    }

    public RecomputeOutcome refreshEventAffinitiesForSourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return RecomputeOutcome.empty();
        }
        List<? extends Event> events = normalizedSourceIds.size() == 1
                ? activityEventsRepository.findBySourceId(normalizedSourceIds.get(0))
                : activityEventsRepository.findBySourceIdIn(normalizedSourceIds);
        if (events == null || events.isEmpty()) {
            return RecomputeOutcome.empty();
        }
        LinkedHashSet<String> participantUserIds = new LinkedHashSet<>();
        for (Event event : events) {
            String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                participantUserIds.add(creatorUserId);
            }
        }
        participantUserIds.addAll(eventAcceptedMemberUserIdsBySourceId(events).values().stream()
                .flatMap(Collection::stream)
                .toList());
        Map<String, ScoringProfile> usersById = new LinkedHashMap<>();
        List<? extends ScoringProfile> participants = usersRepository.findByUserIdIn(new ArrayList<>(participantUserIds));
        for (ScoringProfile user : participants == null ? List.<ScoringProfile>of() : participants) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        return saveChangedEvents(events, usersById);
    }

    private void refreshEventAffinitiesForUser(ScoringProfile changedUser) {
        String changedUserId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(changedUserId)) {
            return;
        }

        LinkedHashMap<String, Event> affectedEventsByDocumentId = new LinkedHashMap<>();
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
        for (Event event : affectedEventsByDocumentId.values()) {
            String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                participantUserIds.add(creatorUserId);
            }
        }
        participantUserIds.addAll(eventAcceptedMemberUserIdsBySourceId(affectedEventsByDocumentId.values()).values().stream()
                .flatMap(Collection::stream)
                .toList());

        Map<String, ScoringProfile> usersById = new LinkedHashMap<>();
        usersById.put(changedUserId, changedUser);
        List<? extends ScoringProfile> participants = usersRepository.findByUserIdIn(new ArrayList<>(participantUserIds));
        for (ScoringProfile user : participants == null ? List.<ScoringProfile>of() : participants) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        saveChangedEvents(affectedEventsByDocumentId.values(), usersById);
    }

    private RecomputeOutcome refreshAllEventAffinities(Map<String, ScoringProfile> usersById) {
        return saveChangedEvents(activityEventsRepository.findAll(), usersById);
    }

    private RecomputeOutcome saveChangedEvents(Collection<? extends Event> events, Map<String, ScoringProfile> usersById) {
        List<? extends Event> eventList = events == null
                ? List.of()
                : events.stream().filter(event -> event != null)
                        .filter(event -> !JobGroupContext.isActive() || jobGroupScope.matchesWorkspace(event.getWorkspaceGroupId())).toList();
        Map<String, List<String>> acceptedMembersBySourceId = eventAcceptedMemberUserIdsBySourceId(eventList);
        List<String> updatedSourceIds = new ArrayList<>();
        List<String> conflictedSourceIds = new ArrayList<>();
        for (Event event : eventList) {
            List<? extends ScoringProfile> participants = eventAffinityParticipants(event, usersById, acceptedMembersBySourceId.get(normalizeId(event.getSourceId())));
            double nextAffinity = absoluteAffinityService.resolveEventAffinity(
                    event,
                    participants);
            double nextBoost = absoluteAffinityService.resolveEventBoost(event, participants);
            if (Math.abs(safeDouble(event.getAffinity()) - nextAffinity) > 0.000001d
                    || Math.abs(safeDouble(event.getBoost()) - nextBoost) > 0.000001d) {
                if (updateEventDerivedFieldsIfSnapshotCurrent(event, nextAffinity, nextBoost)) {
                    updatedSourceIds.add(normalizeId(event.getSourceId()));
                } else {
                    conflictedSourceIds.add(normalizeId(event.getSourceId()));
                }
            }
        }
        return new RecomputeOutcome(updatedSourceIds, conflictedSourceIds);
    }

    private RecomputeOutcome refreshAssetAffinitiesForOwner(ScoringProfile owner) {
        String ownerUserId = normalizeId(owner == null ? null : owner.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return RecomputeOutcome.empty();
        }
        List<String> updatedAssetIds = new ArrayList<>();
        List<String> conflictedAssetIds = new ArrayList<>();
        for (Asset asset : assetsRepository.findByOwnerUserId(ownerUserId)) {
            if (asset == null) {
                continue;
            }
            double nextAffinity = absoluteAffinityService.resolveAssetAffinity(asset, owner);
            double nextBoost = absoluteAffinityService.resolveAssetBoost(asset, owner);
            if (Math.abs(safeDouble(asset.getAffinity()) - nextAffinity) > 0.000001d
                    || Math.abs(safeDouble(asset.getBoost()) - nextBoost) > 0.000001d) {
                if (updateAssetDerivedFieldsIfSnapshotCurrent(asset, nextAffinity, nextBoost)) {
                    updatedAssetIds.add(normalizeId(asset.getAssetId()));
                } else {
                    conflictedAssetIds.add(normalizeId(asset.getAssetId()));
                }
            }
        }
        return new RecomputeOutcome(updatedAssetIds, conflictedAssetIds);
    }

    private RecomputeOutcome refreshAllAssetAffinities(Map<String, ScoringProfile> usersById) {
        List<String> updatedAssetIds = new ArrayList<>();
        List<String> conflictedAssetIds = new ArrayList<>();
        for (Asset asset : assetsRepository.findAll()) {
            if (asset == null) {
                continue;
            }
            ScoringProfile owner = usersById.get(normalizeId(asset.getOwnerUserId()));
            if (JobGroupContext.isActive() && owner == null) continue;
            double nextAffinity = absoluteAffinityService.resolveAssetAffinity(asset, owner);
            double nextBoost = absoluteAffinityService.resolveAssetBoost(asset, owner);
            if (Math.abs(safeDouble(asset.getAffinity()) - nextAffinity) > 0.000001d
                    || Math.abs(safeDouble(asset.getBoost()) - nextBoost) > 0.000001d) {
                if (updateAssetDerivedFieldsIfSnapshotCurrent(asset, nextAffinity, nextBoost)) {
                    updatedAssetIds.add(normalizeId(asset.getAssetId()));
                } else {
                    conflictedAssetIds.add(normalizeId(asset.getAssetId()));
                }
            }
        }
        return new RecomputeOutcome(updatedAssetIds, conflictedAssetIds);
    }

    private void addAffectedEvents(Map<String, Event> target, List<? extends Event> events) {
        for (Event event : events == null ? List.<Event>of() : events) {
            String documentId = normalizeId(event == null ? null : event.getId());
            if (StringUtils.hasText(documentId)) {
                target.put(documentId, event);
            }
        }
    }

    private List<? extends ScoringProfile> eventAffinityParticipants(Event event, Map<String, ScoringProfile> usersById, List<String> acceptedMemberUserIds) {
        LinkedHashMap<String, ScoringProfile> participantsById = new LinkedHashMap<>();
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId) && usersById.containsKey(creatorUserId)) {
            participantsById.put(creatorUserId, usersById.get(creatorUserId));
        }
        for (String userId : normalizeIds(acceptedMemberUserIds)) {
            ScoringProfile user = usersById.get(userId);
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
                .map(Member::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private Map<String, List<String>> eventAcceptedMemberUserIdsBySourceId(Collection<? extends Event> events) {
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (Event event : events == null ? List.<Event>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        if (sourceIds.isEmpty()) {
            return Map.of();
        }
        LinkedHashMap<String, LinkedHashSet<String>> membersBySourceId = new LinkedHashMap<>();
        for (Member member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds)) {
            if (member == null || !STATUS_ACCEPTED.equals(normalizeMemberStatus(member.getStatus()))) {
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

    private void refreshRateAffinitiesForUser(ScoringProfile changedUser) {
        String userId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        refreshRateAffinities(userRatesRepository.findRelevantByUserIds(List.of(userId)));
    }

    private void refreshAllRateAffinities(Collection<String> scopedOwners) {
        if (!JobGroupContext.isActive()) { refreshRateAffinities(userRatesRepository.findAll()); return; }
        var owners = new ArrayList<>(scopedOwners);
        var rates = new ArrayList<UserRate>();
        for (int offset = 0; offset < owners.size(); offset += 1000)
            rates.addAll(userRatesRepository.findByOwnerUserIdIn(owners.subList(offset, Math.min(owners.size(), offset + 1000))));
        refreshRateAffinities(rates);
    }

    private void refreshRateAffinities(List<UserRate> rates) {
        if (rates == null || rates.isEmpty()) {
            return;
        }
        Map<String, RateAffinitySnapshot> previousById = new LinkedHashMap<>();
        for (UserRate rate : rates) {
            if (rate == null) {
                continue;
            }
            String id = normalizeId(rate.getId());
            if (StringUtils.hasText(id)) {
                previousById.put(id, RateAffinitySnapshot.of(rate));
            }
        }

        affinityCalculationService.applyAffinity(rates);
        List<UserRate> changedRates = new ArrayList<>();
        for (UserRate rate : rates) {
            if (rate == null) {
                continue;
            }
            String id = normalizeId(rate.getId());
            RateAffinitySnapshot previous = previousById.get(id);
            if (previous == null || !previous.matches(rate)) {
                changedRates.add(rate);
            }
        }
        for (UserRate rate : changedRates) {
            updateRateDerivedFieldsIfSnapshotCurrent(rate);
        }
        userAffinityEdgeService.recomputeForRates(rates);
    }

    private boolean updateUserAffinityOnly(ScoringProfile user, double nextAffinity) {
        return accountProjections.updateAffinity(user.getId(), nextAffinity);
    }

    private boolean updateEventDerivedFieldsIfSnapshotCurrent(Event event, double nextAffinity, double nextBoost) {
        return eventDerivedUpdates.updateAffinityVersion(new EventVersionDto(event.getId(), event.getUpdatedDate()), nextAffinity, nextBoost);
    }

    private boolean updateAssetDerivedFieldsIfSnapshotCurrent(Asset asset, double nextAffinity, double nextBoost) {
        return assetDerivedUpdates.updateAffinityVersion(new com.raxim.myscoutee.domain.assets.dto.AssetVersionDto(asset.getId(), asset.getUpdatedDate()), nextAffinity, nextBoost);
    }

    private boolean updateRateDerivedFieldsIfSnapshotCurrent(UserRate rate) {
        if (rate == null) {
            return false;
        }
        String id = normalizeId(rate.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(rate.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongoTemplate.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinityScore", rate.getAffinityScore())
                        .set("evidenceConfidence", rate.getEvidenceConfidence())
                        .set("scoreReceived", rate.getScoreReceived())
                        .set("mutuallyRated", rate.getMutuallyRated()),
                UserRate.class);
        return result.getMatchedCount() > 0;
    }

    private Map<String, ScoringProfile> indexUsers(List<? extends ScoringProfile> users) {
        Map<String, ScoringProfile> usersById = new LinkedHashMap<>();
        for (ScoringProfile user : users == null ? List.<ScoringProfile>of() : users) {
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
            Double scoreReceived,
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
                    && sameDouble(scoreReceived, rate == null ? null : rate.getScoreReceived())
                    && sameBoolean(mutuallyRated, rate == null ? null : rate.getMutuallyRated());
        }

        private static boolean sameDouble(Double left, Double right) {
            if (left == null || right == null) {
                return left == null && right == null;
            }
            return Math.abs(left.doubleValue() - right.doubleValue()) <= 0.000001d;
        }

        private static boolean sameBoolean(Boolean left, Boolean right) {
            return left == null ? right == null : left.equals(right);
        }
    }

    public record RecomputeOutcome(List<String> updatedTargetIds, List<String> conflictedTargetIds) {
        public RecomputeOutcome {
            updatedTargetIds = compact(updatedTargetIds);
            conflictedTargetIds = compact(conflictedTargetIds);
        }

        public static RecomputeOutcome empty() {
            return new RecomputeOutcome(List.of(), List.of());
        }

        public boolean hasConflicts() {
            return !conflictedTargetIds.isEmpty();
        }

        private static List<String> compact(Collection<String> values) {
            if (values == null || values.isEmpty()) {
                return List.of();
            }
            return values.stream()
                    .map(value -> value == null ? "" : value.trim())
                    .filter(StringUtils::hasText)
                    .distinct()
                    .toList();
        }
    }

    public record StoredAffinityRecomputeOutcome(RecomputeOutcome events, RecomputeOutcome assets) {
        public StoredAffinityRecomputeOutcome {
            events = events == null ? RecomputeOutcome.empty() : events;
            assets = assets == null ? RecomputeOutcome.empty() : assets;
        }
    }

    public record UserAffinityDependents(List<String> eventSourceIds, List<String> assetIds) {
    }

    private ScoringProfile refreshAffinityAndRates(ScoringProfile user) {
        if (user == null) {
            return null;
        }
        String userId = normalizeId(user.getId());
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
        ScoringProfile refreshed = user;
        if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
            if (updateUserAffinityOnly(user, nextAffinity)) {
                refreshed = com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto.from(user).withAffinity(nextAffinity);
            }
        }
        refreshRateAffinitiesForUser(refreshed);
        return refreshed;
    }
}
