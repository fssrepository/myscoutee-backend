package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

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
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class AffinityMaintenanceService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;

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
    private final MongoTemplate mongoTemplate;

    public AffinityMaintenanceService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            UserRatesRepository userRatesRepository,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService,
            MongoTemplate mongoTemplate) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
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
        if (user == null) {
            return;
        }
        String userId = normalizeId(user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
        Users refreshed = user;
        if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
            if (updateUserAffinityOnly(user, nextAffinity)) {
                refreshed = user;
            }
        }
        refreshRateAffinitiesForUser(refreshed);
        refreshForUser(refreshed);
    }

    public void refreshUserAffinityAndRates(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(this::refreshUserAffinityAndRates);
    }

    public void refreshUserAffinityAndRates(Users user) {
        if (user == null) {
            return;
        }
        String userId = normalizeId(user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
        Users refreshed = user;
        if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
            if (updateUserAffinityOnly(user, nextAffinity)) {
                refreshed = user;
            }
        }
        refreshRateAffinitiesForUser(refreshed);
    }

    public UserAffinityDependents resolveUserAffinityDependents(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new UserAffinityDependents(List.of(), List.of());
        }

        LinkedHashSet<String> eventSourceIds = new LinkedHashSet<>();
        for (ActivityEvent event : activityEventsRepository.findByCreatorUserId(normalizedUserId)) {
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
        List<Asset> assets = normalizedAssetIds.size() == 1
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

        Map<String, Users> ownersById = indexUsers(usersRepository.findByUserIdIn(new ArrayList<>(ownerUserIds)));
        List<String> updatedAssetIds = new ArrayList<>();
        List<String> conflictedAssetIds = new ArrayList<>();
        for (Asset asset : assets) {
            if (asset == null) {
                continue;
            }
            Users owner = ownersById.get(normalizeId(asset.getOwnerUserId()));
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
        List<Users> users = usersRepository.findByUserIdIn(normalizedUserIds);
        for (Users user : users == null ? List.<Users>of() : users) {
            refreshForUser(user);
        }
    }

    public StoredAffinityRecomputeOutcome refreshAllStoredAffinities() {
        List<Users> users = (JobGroupContext.isActive() ? mongoTemplate.find(Query.query(jobGroupScope.workspaceCriteria("workspaceGroupId")), Users.class) : usersRepository.findAll()).stream()
                .filter(user -> StringUtils.hasText(normalizeId(user == null ? null : user.getId())))
                .toList();
        for (Users user : users) {
            double nextAffinity = absoluteAffinityService.resolveUserAffinity(user);
            if (Math.abs(safeDouble(user.getAffinity()) - nextAffinity) > 0.000001d) {
                updateUserAffinityOnly(user, nextAffinity);
            }
        }

        Map<String, Users> usersById = indexUsers(users);
        refreshAllRateAffinities();
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
        List<ActivityEvent> events = normalizedSourceIds.size() == 1
                ? activityEventsRepository.findBySourceId(normalizedSourceIds.get(0))
                : activityEventsRepository.findBySourceIdIn(normalizedSourceIds);
        if (events == null || events.isEmpty()) {
            return RecomputeOutcome.empty();
        }
        LinkedHashSet<String> participantUserIds = new LinkedHashSet<>();
        for (ActivityEvent event : events) {
            String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                participantUserIds.add(creatorUserId);
            }
        }
        participantUserIds.addAll(eventAcceptedMemberUserIdsBySourceId(events).values().stream()
                .flatMap(Collection::stream)
                .toList());
        Map<String, Users> usersById = new LinkedHashMap<>();
        List<Users> participants = usersRepository.findByUserIdIn(new ArrayList<>(participantUserIds));
        for (Users user : participants == null ? List.<Users>of() : participants) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        return saveChangedEvents(events, usersById);
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

    private RecomputeOutcome refreshAllEventAffinities(Map<String, Users> usersById) {
        return saveChangedEvents(activityEventsRepository.findAll(), usersById);
    }

    private RecomputeOutcome saveChangedEvents(Collection<ActivityEvent> events, Map<String, Users> usersById) {
        List<ActivityEvent> eventList = events == null
                ? List.of()
                : events.stream().filter(event -> event != null)
                        .filter(event -> !JobGroupContext.isActive() || jobGroupScope.matchesWorkspace(event.getWorkspaceGroupId())).toList();
        Map<String, List<String>> acceptedMembersBySourceId = eventAcceptedMemberUserIdsBySourceId(eventList);
        List<String> updatedSourceIds = new ArrayList<>();
        List<String> conflictedSourceIds = new ArrayList<>();
        for (ActivityEvent event : eventList) {
            List<Users> participants = eventAffinityParticipants(event, usersById, acceptedMembersBySourceId.get(normalizeId(event.getSourceId())));
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

    private RecomputeOutcome refreshAssetAffinitiesForOwner(Users owner) {
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

    private RecomputeOutcome refreshAllAssetAffinities(Map<String, Users> usersById) {
        List<String> updatedAssetIds = new ArrayList<>();
        List<String> conflictedAssetIds = new ArrayList<>();
        for (Asset asset : assetsRepository.findAll()) {
            if (asset == null) {
                continue;
            }
            Users owner = usersById.get(normalizeId(asset.getOwnerUserId()));
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

    private void refreshRateAffinitiesForUser(Users changedUser) {
        String userId = normalizeId(changedUser == null ? null : changedUser.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        refreshRateAffinities(userRatesRepository.findRelevantByUserIds(List.of(userId)));
    }

    private void refreshAllRateAffinities() {
        refreshRateAffinities(JobGroupContext.isActive() ? jobGroupScope.findOwned(new Query(), UserRate.class, "ownerUserId") : userRatesRepository.findAll());
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

    private boolean updateUserAffinityOnly(Users user, double nextAffinity) {
        if (user == null) {
            return false;
        }
        String userId = normalizeId(user.getId());
        if (!StringUtils.hasText(userId)) {
            return false;
        }
        UpdateResult result = mongoTemplate.updateFirst(
                new Query(Criteria.where("userId").is(userId)),
                new Update().set("affinity", nextAffinity),
                Users.class);
        if (result.getMatchedCount() <= 0) {
            return false;
        }
        user.setAffinity(nextAffinity);
        return true;
    }

    private boolean updateEventDerivedFieldsIfSnapshotCurrent(ActivityEvent event, double nextAffinity, double nextBoost) {
        if (event == null) {
            return false;
        }
        String id = normalizeId(event.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(event.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongoTemplate.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                ActivityEvent.class);
        if (result.getMatchedCount() <= 0) {
            return false;
        }
        event.setAffinity(nextAffinity);
        event.setBoost(nextBoost);
        return true;
    }

    private boolean updateAssetDerivedFieldsIfSnapshotCurrent(Asset asset, double nextAffinity, double nextBoost) {
        if (asset == null) {
            return false;
        }
        String id = normalizeId(asset.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(asset.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongoTemplate.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                Asset.class);
        if (result.getMatchedCount() <= 0) {
            return false;
        }
        asset.setAffinity(nextAffinity);
        asset.setBoost(nextBoost);
        return true;
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
                return left == right;
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
}
