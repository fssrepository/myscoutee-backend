package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.events.service.EventParticipationTicketService;

import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.assets.service.AssetCatalog;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.events.document.EventFeedbackState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.domain.events.repository.EventWatchSubscriptionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class UserActivityCountersService implements com.raxim.myscoutee.domain.accounts.api.ServiceFeedbackCounters {
    private final OrganizerFollowingService organizerFollowingService;

    public void expireFollowingCounters(Instant now) {
        organizerFollowingService.expire(now);
    }

    /** Write-side refresh only. The durable moderation intent retries a failed delivery. */
    public void refreshFeedCountersForUser(String userId) {
        for (int attempt = 0; attempt < 8; attempt++) {
            var userQuery = Query.query(Criteria.where("userId").is(userId));
            userQuery.fields().include("feedCounters");
            Users user = mongoTemplate.findOne(userQuery, Users.class);
            if (user == null) return;
            var before = user.getFeedCounters();
            Map<String, Long> counts = new LinkedHashMap<>();
            for (String status : List.of("accepted", "under-review", "rejected", "blocked")) counts.put(status, 0L);
            var rows = mongoTemplate.aggregate(Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("creatorUserId").is(userId).and("deleted").ne(true)),
                    Aggregation.group("moderationStatus").count().as("count")), "photoFeedPosts", Document.class);
            for (Document row : rows) if (counts.containsKey(row.getString("_id")))
                counts.put(row.getString("_id"), ((Number) row.get("count")).longValue());
            if (before != null && counts.equals(before.counts())) return;
            var next = new Users.FeedCountersRecord(before == null ? 1 : before.revision() + 1, counts);
            if (mongoTemplate.updateFirst(Query.query(Criteria.where("userId").is(userId).and("feedCounters").is(before)),
                    new Update().set("feedCounters", next), Users.class).getMatchedCount() > 0) return;
        }
        throw new IllegalStateException("Feed counters changed concurrently; retry moderation delivery.");
    }

    private static final String OWNER_TYPE_EVENT = "event";
    private static final List<String> DEMO_ADMIN_IDS = List.of("admin-demo-ava", "admin-demo-noel");
    private static final List<String> SUPPORT_CASE_STATUSES = List.of(
            "pending", "warned", "picked", "solved", "blocked");
    private static final long EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS = 2L * 60L * 60L;
    private static final String FEEDBACK_COUNTER_PROJECTOR = "event-feedback-counter";

    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final MongoTemplate mongoTemplate;

    public UserActivityCountersService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository,
            EventParticipationTicketService eventParticipationTicketService,
            MongoTemplate mongoTemplate,
            OrganizerFollowingService organizerFollowingService) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventWatchSubscriptionsRepository = eventWatchSubscriptionsRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.mongoTemplate = mongoTemplate;
        this.organizerFollowingService = organizerFollowingService;
    }

    public void refreshEventCountersForDocuments(Collection<ActivityEvent> events) {
        refreshEventCountersForSourceIds(events == null
                ? List.of()
                : events.stream()
                        .map(event -> normalizeId(event == null ? null : event.getSourceId()))
                        .filter(StringUtils::hasText)
                        .toList());
    }

    public void refreshEventCountersForSourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return;
        }
        Set<String> userIds = new LinkedHashSet<>();
        for (ActivityEvent event : activityEventsRepository.findBySourceIdIn(normalizedSourceIds)) {
            collectEventUserIds(userIds, event);
        }
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, normalizedSourceIds)) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(userId)) {
                userIds.add(userId);
            }
        }
        refreshEventCountersForUsers(userIds);
        syncFeedbackEligibilityForSourceIds(normalizedSourceIds, Instant.now());
        organizerFollowingService.refreshForSources(normalizedSourceIds);
    }

    public void refreshEventCountersForUsers(Collection<String> userIds) {
        var affected = new LinkedHashSet<>(normalizeIds(userIds));
        usersRepository.findByUserIdIn(affected).stream().map(Users::getAccountUserId)
                .filter(StringUtils::hasText).forEach(affected::add);
        for (String userId : affected) {
            usersRepository.findByUserId(userId).ifPresent(user -> {
                Users.UserActivitiesRecord current = user.getActivities();
                Users.UserActivitiesRecord next = withEventCounters(
                        current,
                        resolveEventCounters(userId),
                        resolveTicketCount(userId));
                if (!Objects.equals(current, next)) {
                    updateEventCounters(userId, next);
                }
            });
        }
    }

    public void applyActiveEventMembershipDeltas(
            Collection<String> addedUserIds,
            Collection<String> removedUserIds) {
        Map<String, Integer> deltasByUserId = new LinkedHashMap<>();
        for (String userId : normalizeIds(addedUserIds)) {
            deltasByUserId.merge(userId, 1, Integer::sum);
        }
        for (String userId : normalizeIds(removedUserIds)) {
            deltasByUserId.merge(userId, -1, Integer::sum);
        }
        deltasByUserId.entrySet().removeIf(entry -> entry.getValue() == 0);
        if (deltasByUserId.isEmpty()) {
            return;
        }

        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class);
        for (Map.Entry<String, Integer> entry : deltasByUserId.entrySet()) {
            int delta = entry.getValue();
            bulk.updateOne(
                    Query.query(Criteria.where("userId").is(entry.getKey())),
                    new Update()
                            .inc("activities.events", delta)
                            .inc("activities.event.all", delta)
                            .inc("activities.event.active", delta));
        }
        bulk.execute();
    }

    public UserEventCountersDto readStoredEventCounters(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return emptyEventCountersDto();
        }
        return usersRepository.findByUserId(normalizedUserId)
                .map(Users::getActivities)
                .map(Users.UserActivitiesRecord::event)
                .map(this::toEventCountersDto)
                .orElseGet(this::emptyEventCountersDto);
    }

    private UserEventCountersDto toEventCountersDto(Users.UserEventCountersRecord event) {
        return event == null
                ? emptyEventCountersDto()
                : new UserEventCountersDto(
                        count(event.all()),
                        count(event.active()),
                        count(event.pending()),
                        count(event.invitations()),
                        count(event.hosting()),
                        count(event.drafts()),
                        count(event.trash()),
                        count(event.watchlist()));
    }

    private UserEventCountersDto emptyEventCountersDto() {
        return new UserEventCountersDto(0, 0, 0, 0, 0, 0, 0, 0);
    }

    public void refreshSupportCaseCountersForAdmins() {
        Map<String, Users> adminsById = new LinkedHashMap<>();
        for (Users admin : usersRepository.findByHostTier("Admin")) {
            String userId = normalizeId(admin == null ? null : admin.getUserId());
            if (StringUtils.hasText(userId)) {
                adminsById.put(userId, admin);
            }
        }
        for (Users admin : usersRepository.findByUserIdIn(DEMO_ADMIN_IDS)) {
            String userId = normalizeId(admin == null ? null : admin.getUserId());
            if (StringUtils.hasText(userId)) {
                adminsById.put(userId, admin);
            }
        }
        Map<String, SupportCaseCounters> byBase = new LinkedHashMap<>();
        for (Users admin : adminsById.values()) {
            String base = admin.getWorkspaceGroupId();
            SupportCaseCounters counters = byBase.computeIfAbsent(base, this::resolveSupportCaseCounters);
            updateSupportCaseCounters(admin.getUserId(), counters);
        }
    }

    public void refreshAssetCountersForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(user -> {
            Users.UserActivitiesRecord current = user.getActivities();
            Users.UserActivitiesRecord next = withAssetCounters(current, resolveAssetCounters(normalizedUserId));
            if (!Objects.equals(current, next)) {
                updateAssetCounters(normalizedUserId, next);
            }
        });
    }

    public void applyFeedbackStateTransition(
            ActivityEvent event,
            String userId,
            boolean wasSubmitted,
            boolean wasRemoved,
            boolean isSubmitted,
            boolean isRemoved) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        Map<String, FeedbackBucketDelta> deltasByUserId = new LinkedHashMap<>();
        String previousBucket = feedbackBucket(wasSubmitted, wasRemoved);
        String nextBucket = feedbackBucket(isSubmitted, isRemoved);
        if (!Objects.equals(previousBucket, nextBucket)) {
            addFeedbackDelta(deltasByUserId, normalizedUserId, previousBucket, -1);
            addFeedbackDelta(deltasByUserId, normalizedUserId, nextBucket, 1);
        }

        boolean wasActiveSubmission = wasSubmitted && !wasRemoved;
        boolean isActiveSubmission = isSubmitted && !isRemoved;
        if (wasActiveSubmission != isActiveSubmission) {
            int ownEventDelta = isActiveSubmission ? 1 : -1;
            for (String ownerUserId : feedbackAdminUserIds(event)) {
                addFeedbackDelta(deltasByUserId, ownerUserId, "own-events", ownEventDelta);
            }
        }
        applyFeedbackBucketDeltas(deltasByUserId);
    }

    public int syncFeedbackEligibilityForSourceIds(Collection<String> sourceIds, Instant requestedNow) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return 0;
        }

        Instant now = requestedNow == null ? Instant.now() : requestedNow;
        String nowIso = now.toString();
        Map<String, ActivityEvent> eventsBySourceId = preferredFeedbackEventsBySourceId(
                activityEventsRepository.findBySourceIdIn(normalizedSourceIds));
        Map<FeedbackEligibilityKey, ActivityEvent> desiredEligibility = new LinkedHashMap<>();
        for (ActivityEvent event : eventsBySourceId.values()) {
            if (!isFeedbackUnlocked(event, now) || isTrashScopeStatus(event)) {
                continue;
            }
            Set<String> adminUserIds = feedbackAdminUserIds(event);
            for (String userId : safeStrings(event.getAcceptedMemberUserIds())) {
                if (!adminUserIds.contains(userId)) {
                    desiredEligibility.put(new FeedbackEligibilityKey(userId, normalizeId(event.getSourceId())), event);
                }
            }
        }

        Map<FeedbackEligibilityKey, EventFeedbackState> existingStates = new LinkedHashMap<>();
        for (EventFeedbackState state : eventFeedbackStatesRepository
                .findByEventIdInOrderByEventIdAscUpdatedDateDesc(normalizedSourceIds)) {
            FeedbackEligibilityKey key = feedbackEligibilityKey(state);
            if (key != null) {
                existingStates.putIfAbsent(key, state);
            }
        }

        Map<String, FeedbackBucketDelta> deltasByUserId = new LinkedHashMap<>();
        List<EventFeedbackState> changedStates = new java.util.ArrayList<>();
        Set<FeedbackEligibilityKey> allKeys = new LinkedHashSet<>(existingStates.keySet());
        allKeys.addAll(desiredEligibility.keySet());
        for (FeedbackEligibilityKey key : allKeys) {
            EventFeedbackState state = existingStates.get(key);
            boolean desired = desiredEligibility.containsKey(key);
            boolean legacyTracked = state != null
                    && (StringUtils.hasText(state.getSubmittedAtIso()) || Boolean.TRUE.equals(state.getRemoved()));
            boolean currentEligible = state != null
                    && (Boolean.TRUE.equals(state.getEligible())
                    || (state.getEligible() == null && legacyTracked));
            boolean counterTracked = state != null
                    && (Boolean.TRUE.equals(state.getCounterTracked()) || legacyTracked);

            if (state == null && desired) {
                state = newFeedbackEligibilityState(key, nowIso);
                changedStates.add(state);
                addFeedbackDelta(deltasByUserId, key.userId(), "pending", 1);
                continue;
            }
            if (state == null) {
                continue;
            }

            if (desired && !currentEligible) {
                addFeedbackDelta(deltasByUserId, key.userId(), feedbackBucket(state), 1);
                state.setEligible(true);
                state.setCounterTracked(true);
                touchFeedbackEligibilityState(state, nowIso);
                changedStates.add(state);
            } else if (!desired && currentEligible) {
                if (counterTracked) {
                    addFeedbackDelta(deltasByUserId, key.userId(), feedbackBucket(state), -1);
                }
                state.setEligible(false);
                state.setCounterTracked(false);
                touchFeedbackEligibilityState(state, nowIso);
                changedStates.add(state);
            } else if (desired
                    && (state.getEligible() == null || state.getCounterTracked() == null)) {
                state.setEligible(true);
                state.setCounterTracked(true);
                touchFeedbackEligibilityState(state, nowIso);
                changedStates.add(state);
            }
        }

        if (!changedStates.isEmpty()) {
            eventFeedbackStatesRepository.saveAll(changedStates);
        }
        int updatedUsers = applyFeedbackBucketDeltas(deltasByUserId);
        markFeedbackProjectionState(normalizedSourceIds, eventsBySourceId, now);
        return updatedUsers;
    }

    private SupportCaseCounters resolveSupportCaseCounters(String baseGroupId) {
        List<Document> rows = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        context -> new Document("$match", new Document()
                                .append("channelType", new Document("$in", List.of("appSupport", "supportCase")))
                                .append("supportCase.status", new Document("$in", SUPPORT_CASE_STATUSES))
                                .append("supportBaseGroupId", baseGroupId)
                                .append("id", new Document("$type", "string").append("$ne", ""))),
                        context -> new Document("$group", new Document("_id", "$id")
                                .append("status", new Document("$first", "$supportCase.status"))),
                        context -> new Document("$group", new Document("_id", "$status")
                                .append("count", new Document("$sum", 1)))),
                Chat.class,
                Document.class)
                .getMappedResults();
        int pending = 0;
        int warned = 0;
        int picked = 0;
        int solved = 0;
        int blocked = 0;
        for (Document row : rows) {
            Object rawCount = row == null ? null : row.get("count");
            int value = rawCount instanceof Number number
                    ? Math.max(0, number.intValue())
                    : 0;
            String status = row == null ? "" : normalizeId(row.getString("_id"));
            switch (status) {
                case "pending" -> pending = value;
                case "warned" -> warned = value;
                case "picked" -> picked = value;
                case "solved" -> solved = value;
                case "blocked" -> blocked = value;
                default -> {
                }
            }
        }
        return new SupportCaseCounters(
                pending,
                warned,
                picked,
                solved,
                blocked,
                pending + warned + picked + solved + blocked);
    }

    private EventCounters resolveEventCounters(String userId) {
        Instant now = Instant.now();
        Set<String> sourceIds = new LinkedHashSet<>();
        Set<String> watchedSourceIds = eventWatchSubscriptionsRepository
                .findByUserIdOrderByUpdatedDateDesc(userId).stream()
                .map(subscription -> normalizeId(subscription == null ? null : subscription.getEventId()))
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<ActivityMember> storedMemberships = activityMembersRepository
                .findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId);
        List<ActivityMember> memberships = storedMemberships == null ? List.of() : storedMemberships;
        Set<String> legacyDeletedMembershipSourceIds = memberships.stream()
                .filter(Objects::nonNull)
                .filter(member -> isDeletedMembershipStatus(member.getStatus()))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Set<String> suppressedMembershipSourceIds = memberships.stream()
                .filter(Objects::nonNull)
                .filter(this::isRestorableSuppressedMembership)
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        collectSourceIds(sourceIds, activityEventsRepository.findDirectOwnerEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findAdminVisibleEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findAcceptedMembershipEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findActiveInvitationEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findPendingRequestEvents(userId));
        sourceIds.addAll(legacyDeletedMembershipSourceIds);
        sourceIds.addAll(suppressedMembershipSourceIds);
        List<ActivityEvent> eventDocuments = activityEventsRepository.findBySourceIdIn(sourceIds);
        Set<String> personalTrashSourceIds = new LinkedHashSet<>(legacyDeletedMembershipSourceIds);
        for (String sourceId : suppressedMembershipSourceIds) {
            if (hasRestorablePersonalTrashProjection(eventDocuments, sourceId, userId)) {
                personalTrashSourceIds.add(sourceId);
            }
        }
        Map<String, ActivityEvent> preferredBySourceId = preferredEventsBySourceId(eventDocuments, userId);

        int active = 0;
        int pending = 0;
        int invitations = 0;
        int hosting = 0;
        int drafts = 0;
        int trash = 0;
        Set<String> countedSources = new LinkedHashSet<>();
        Set<String> allBucketSources = new LinkedHashSet<>();
        for (ActivityEvent event : preferredBySourceId.values()) {
            String sourceId = normalizeId(event.getSourceId());
            if (!countedSources.add(sourceId)) {
                continue;
            }
            if (personalTrashSourceIds.contains(sourceId)) {
                trash += 1;
                continue;
            }
            if (isTrashScopeStatus(event)) {
                // A globally trashed event belongs only to its organizer/admin
                // Trash bucket. Accepted participants lose the active event;
                // their personal Trash is reserved for an explicitly deleted
                // membership, handled above.
                if (isHostingRecordForUser(event, userId)) {
                    trash += 1;
                }
                continue;
            }
            // Past belongs to history even before the scheduled pass marks expired.
            Instant end = parseInstant(StringUtils.hasText(event.getEndAtIso())
                    ? event.getEndAtIso() : event.getStartAtIso());
            if (end != null && !end.isAfter(now)) {
                continue;
            }
            if (isInvitationForUser(event, userId)) {
                invitations += 1;
                allBucketSources.add(sourceId);
                continue;
            }
            boolean hostingRecord = isHostingRecordForUser(event, userId);
            if (hostingRecord) {
                hosting += 1;
                allBucketSources.add(sourceId);
                if (isDraftStatus(event)) {
                    drafts += 1;
                }
                if (isPendingReviewStatus(event)) {
                    pending += 1;
                }
                continue;
            }
            if (isPendingRequestForUser(event, userId) || isPendingReviewStatus(event)) {
                pending += 1;
                allBucketSources.add(sourceId);
                continue;
            }
            if (isAcceptedMemberForUser(event, userId) || isActiveEventStatus(event)) {
                active += 1;
                allBucketSources.add(sourceId);
            }
        }
        return new EventCounters(
                allBucketSources.size(),
                active,
                pending,
                invitations,
                hosting,
                drafts,
                trash,
                watchedSourceIds.size());
    }

    private AssetCounters resolveAssetCounters(String userId) {
        int cars = 0;
        int accommodation = 0;
        int supplies = 0;
        int carsPending = 0;
        int accommodationPending = 0;
        int suppliesPending = 0;
        for (Asset asset : assetsRepository.findByOwnerUserId(userId)) {
            if (asset == null || isSuppressedAssetStatus(asset.getStatus())) {
                continue;
            }
            int pending = pendingAssetRequestCount(asset);
            switch (safeText(asset.getType())) {
                case AssetCatalog.TYPE_TRANSPORT -> {
                    cars += 1;
                    carsPending += pending;
                }
                case AssetCatalog.TYPE_ACCOMMODATION -> {
                    accommodation += 1;
                    accommodationPending += pending;
                }
                case AssetCatalog.TYPE_SUPPLIES -> {
                    supplies += 1;
                    suppliesPending += pending;
                }
                default -> {
                }
            }
        }
        return new AssetCounters(
                cars,
                accommodation,
                supplies,
                carsPending,
                accommodationPending,
                suppliesPending);
    }

    private int pendingAssetRequestCount(Asset asset) {
        if (asset == null || asset.getRequests() == null) {
            return 0;
        }
        return (int) asset.getRequests().stream()
                .filter(Objects::nonNull)
                .filter(request -> "pending".equalsIgnoreCase(safeText(request.status())))
                .filter(request -> !"manual".equalsIgnoreCase(safeText(request.requestKind())))
                .count();
    }

    private int resolveTicketCount(String userId) {
        var profiles = usersRepository.findByAccountUserId(userId);
        List<ActivityEvent> tickets;
        if (profiles.isEmpty()) tickets = eventParticipationTicketService.queryTicketRecordsForUser(userId);
        else {
            var ids = new LinkedHashSet<String>(); ids.add(userId);
            profiles.forEach(profile -> ids.add(profile.getUserId()));
            tickets = eventParticipationTicketService.queryTicketSnapshotRecordsForUsers(ids).stream()
                    .map(EventParticipationTicketService.TicketSnapshotRecord::event).toList();
        }
        long ticketCount = tickets.stream()
                .filter(Objects::nonNull)
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .count();
        return (int) Math.min(Integer.MAX_VALUE, ticketCount);
    }

    private Users.UserActivitiesRecord withEventCounters(
            Users.UserActivitiesRecord current,
            EventCounters counters,
            int ticketCount) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        Users.UserAssetCountersRecord currentAsset = safe.asset() == null
                ? emptyActivities().asset()
                : safe.asset();
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                counters.invitations(),
                counters.active(),
                counters.hosting(),
                count(safe.cars()),
                count(safe.accommodation()),
                count(safe.supplies()),
                count(ticketCount),
                count(safe.contacts()),
                count(safe.feedback()),
                safe.chat(),
                new Users.UserEventCountersRecord(
                        counters.all(),
                        counters.active(),
                        counters.pending(),
                        counters.invitations(),
                        counters.hosting(),
                        counters.drafts(),
                        counters.trash(),
                        counters.watchlist()),
                new Users.UserAssetCountersRecord(
                        count(currentAsset.cars()),
                        count(currentAsset.accommodation()),
                        count(currentAsset.supplies()),
                        count(ticketCount),
                        count(currentAsset.carsPending()),
                        count(currentAsset.accommodationPending()),
                        count(currentAsset.suppliesPending())),
                safe.eventFeedback(),
                count(safe.adminJobs()),
                count(safe.adminMetrics()),
                count(safe.notifications()),
                count(safe.serviceFeedbackPending()));
    }

    private void updateEventCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserEventCountersRecord event = next.event() == null ? emptyActivities().event() : next.event();
        Update update = new Update()
                .set("activities.invitations", count(next.invitations()))
                .set("activities.events", count(next.events()))
                .set("activities.hosting", count(next.hosting()))
                .set("activities.event.all", count(event.all()))
                .set("activities.event.active", count(event.active()))
                .set("activities.event.pending", count(event.pending()))
                .set("activities.event.invitations", count(event.invitations()))
                .set("activities.event.hosting", count(event.hosting()))
                .set("activities.event.drafts", count(event.drafts()))
                .set("activities.event.trash", count(event.trash()))
                .set("activities.event.watchlist", count(event.watchlist()))
                .set("activities.tickets", count(next.tickets()))
                .set("activities.asset.tickets", count(next.asset() == null ? null : next.asset().tickets()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private Users.UserActivitiesRecord withAssetCounters(Users.UserActivitiesRecord current, AssetCounters counters) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                count(safe.invitations()),
                count(safe.events()),
                count(safe.hosting()),
                counters.cars(),
                counters.accommodation(),
                counters.supplies(),
                count(safe.tickets()),
                count(safe.contacts()),
                count(safe.feedback()),
                safe.chat(),
                safe.event(),
                new Users.UserAssetCountersRecord(
                        counters.cars(),
                        counters.accommodation(),
                        counters.supplies(),
                        count(safe.asset() == null ? null : safe.asset().tickets()),
                        counters.carsPending(),
                        counters.accommodationPending(),
                        counters.suppliesPending()),
                safe.eventFeedback(),
                count(safe.adminJobs()),
                count(safe.adminMetrics()),
                count(safe.notifications()),
                count(safe.serviceFeedbackPending()));
    }

    private void updateAssetCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserAssetCountersRecord asset = next.asset() == null ? emptyActivities().asset() : next.asset();
        Update update = new Update()
                .set("activities.cars", count(next.cars()))
                .set("activities.accommodation", count(next.accommodation()))
                .set("activities.supplies", count(next.supplies()))
                .set("activities.asset.cars", count(asset.cars()))
                .set("activities.asset.accommodation", count(asset.accommodation()))
                .set("activities.asset.supplies", count(asset.supplies()))
                .set("activities.asset.tickets", count(asset.tickets()))
                .set("activities.asset.carsPending", count(asset.carsPending()))
                .set("activities.asset.accommodationPending", count(asset.accommodationPending()))
                .set("activities.asset.suppliesPending", count(asset.suppliesPending()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private Users.UserActivitiesRecord withFeedbackCounters(Users.UserActivitiesRecord current, FeedbackCounters counters) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                count(safe.invitations()),
                count(safe.events()),
                count(safe.hosting()),
                count(safe.cars()),
                count(safe.accommodation()),
                count(safe.supplies()),
                count(safe.tickets()),
                count(safe.contacts()),
                Math.max(0, counters.pending() + counters.ownEvents() + count(safe.serviceFeedbackPending())),
                safe.chat(),
                safe.event(),
                safe.asset(),
                new Users.UserEventFeedbackCountersRecord(
                        counters.ownEvents(),
                        counters.pending(),
                        counters.feedbacked(),
                        counters.removed()),
                count(safe.adminJobs()),
                count(safe.adminMetrics()),
                count(safe.notifications()),
                count(safe.serviceFeedbackPending()));
    }

    private void updateFeedbackCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserEventFeedbackCountersRecord feedback = next.eventFeedback() == null
                ? emptyActivities().eventFeedback()
                : next.eventFeedback();
        Update update = new Update()
                .set("activities.feedback", count(next.feedback()))
                .set("activities.eventFeedback.ownEvents", count(feedback.ownEvents()))
                .set("activities.eventFeedback.pending", count(feedback.pending()))
                .set("activities.eventFeedback.feedbacked", count(feedback.feedbacked()))
                .set("activities.eventFeedback.removed", count(feedback.removed()));
        updateUserActivityFields(normalizedUserId, update);
        refreshFeedbackTotal(normalizedUserId);
    }

    public void updateServiceFeedbackPending(String userId, int pending) {
        updateUserActivityFields(userId, new Update().set("activities.serviceFeedbackPending", Math.max(0,pending)));
        refreshFeedbackTotal(userId);
    }

    private void refreshFeedbackTotal(String userId) {
        // Derive the total atomically from the latest independent bucket projections.
        var fields=java.util.List.of("$activities.eventFeedback.pending", "$activities.eventFeedback.ownEvents", "$activities.serviceFeedbackPending");
        var terms=fields.stream().map(f->new org.bson.Document("$ifNull",java.util.List.of(f,0))).toList();
        mongoTemplate.getCollection("users").updateOne(new org.bson.Document("userId",userId),
            java.util.List.of(new org.bson.Document("$set",new org.bson.Document("activities.feedback",new org.bson.Document("$add",terms)))));
    }

    private void updateSupportCaseCounters(String userId, SupportCaseCounters counters) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || counters == null) {
            return;
        }
        Update update = new Update()
                .set("activities.chat.supportCases.pending", count(counters.pending()))
                .set("activities.chat.supportCases.warned", count(counters.warned()))
                .set("activities.chat.supportCases.picked", count(counters.picked()))
                .set("activities.chat.supportCases.solved", count(counters.solved()))
                .set("activities.chat.supportCases.blocked", count(counters.blocked()))
                .set("activities.chat.supportCases.all", count(counters.all()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private void updateUserActivityFields(String userId, Update update) {
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("userId").is(userId)),
                update,
                Users.class);
    }

    private Users.UserActivitiesRecord emptyActivities() {
        return new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0, 0);
    }

    private FeedbackCounters currentFeedbackCounters(Users.UserActivitiesRecord current) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        Users.UserEventFeedbackCountersRecord feedback = safe.eventFeedback();
        return new FeedbackCounters(
                count(feedback == null ? null : feedback.ownEvents()),
                count(feedback == null ? null : feedback.pending()),
                count(feedback == null ? null : feedback.feedbacked()),
                count(feedback == null ? null : feedback.removed()));
    }

    private String feedbackBucket(boolean submitted, boolean removed) {
        if (removed) {
            return "removed";
        }
        return submitted ? "feedbacked" : "pending";
    }

    private String feedbackBucket(EventFeedbackState state) {
        return feedbackBucket(
                StringUtils.hasText(state == null ? null : state.getSubmittedAtIso()),
                Boolean.TRUE.equals(state == null ? null : state.getRemoved()));
    }

    private Map<String, ActivityEvent> preferredFeedbackEventsBySourceId(Collection<ActivityEvent> events) {
        Map<String, ActivityEvent> preferred = new LinkedHashMap<>();
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(sourceId) || Boolean.TRUE.equals(event.getGenerated())) {
                continue;
            }
            ActivityEvent current = preferred.get(sourceId);
            if (current == null || feedbackEventPreferenceScore(event) > feedbackEventPreferenceScore(current)) {
                preferred.put(sourceId, event);
            }
        }
        return preferred;
    }

    private int feedbackEventPreferenceScore(ActivityEvent event) {
        if (event == null) {
            return 0;
        }
        boolean canonical = normalizeId(event.getCreatorUserId()).equals(normalizeId(event.getOwnerUserId()));
        int acceptedCount = safeStrings(event.getAcceptedMemberUserIds()).size();
        return (canonical ? 1_000_000 : 0) + acceptedCount;
    }

    private Set<String> feedbackAdminUserIds(ActivityEvent event) {
        Set<String> userIds = new LinkedHashSet<>();
        addUserId(userIds, event == null ? null : event.getOwnerUserId());
        addUserId(userIds, event == null ? null : event.getCreatorUserId());
        safeStrings(event == null ? List.of() : event.getAdmins()).forEach(userIds::add);
        return userIds;
    }

    private boolean isFeedbackUnlocked(ActivityEvent event, Instant now) {
        Instant endAt = parseInstant(event == null ? null : event.getEndAtIso());
        return endAt != null
                && !endAt.plusSeconds(EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS)
                        .isAfter(now == null ? Instant.now() : now);
    }

    private Instant parseInstant(String value) {
        try {
            return StringUtils.hasText(value) ? Instant.parse(value) : null;
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private FeedbackEligibilityKey feedbackEligibilityKey(EventFeedbackState state) {
        String userId = normalizeId(state == null ? null : state.getViewerUserId());
        String eventId = normalizeId(state == null ? null : state.getEventId());
        return StringUtils.hasText(userId) && StringUtils.hasText(eventId)
                ? new FeedbackEligibilityKey(userId, eventId)
                : null;
    }

    private EventFeedbackState newFeedbackEligibilityState(FeedbackEligibilityKey key, String nowIso) {
        EventFeedbackState state = new EventFeedbackState();
        state.setId(new ObjectId().toHexString());
        state.setSyncKey(UUID.randomUUID().toString());
        state.setViewerUserId(key.userId());
        state.setEventId(key.eventId());
        state.setRemoved(false);
        state.setEligible(true);
        state.setCounterTracked(true);
        state.setCreatedDate(nowIso);
        state.setCreatedUser(FEEDBACK_COUNTER_PROJECTOR);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(FEEDBACK_COUNTER_PROJECTOR);
        return state;
    }

    private void touchFeedbackEligibilityState(EventFeedbackState state, String nowIso) {
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(FEEDBACK_COUNTER_PROJECTOR);
    }

    private void addFeedbackDelta(
            Map<String, FeedbackBucketDelta> deltasByUserId,
            String userId,
            String bucket,
            int amount) {
        if (!StringUtils.hasText(userId) || amount == 0) {
            return;
        }
        deltasByUserId.merge(
                userId,
                FeedbackBucketDelta.forBucket(bucket, amount),
                FeedbackBucketDelta::plus);
    }

    private int applyFeedbackBucketDeltas(Map<String, FeedbackBucketDelta> deltasByUserId) {
        if (deltasByUserId.isEmpty()) {
            return 0;
        }
        int updated = 0;
        for (Users user : usersRepository.findByUserIdIn(deltasByUserId.keySet())) {
            String userId = normalizeId(user == null ? null : user.getUserId());
            FeedbackBucketDelta delta = deltasByUserId.get(userId);
            if (delta == null) {
                continue;
            }
            FeedbackCounters current = currentFeedbackCounters(user.getActivities());
            FeedbackCounters counters = new FeedbackCounters(
                    Math.max(0, current.ownEvents() + delta.ownEvents()),
                    Math.max(0, current.pending() + delta.pending()),
                    Math.max(0, current.feedbacked() + delta.feedbacked()),
                    Math.max(0, current.removed() + delta.removed()));
            Users.UserActivitiesRecord next = withFeedbackCounters(user.getActivities(), counters);
            if (!Objects.equals(user.getActivities(), next)) {
                updateFeedbackCounters(userId, next);
                updated += 1;
            }
        }
        return updated;
    }

    private void markFeedbackProjectionState(
            Collection<String> sourceIds,
            Map<String, ActivityEvent> eventsBySourceId,
            Instant now) {
        Set<String> waitingSourceIds = new LinkedHashSet<>();
        for (Map.Entry<String, ActivityEvent> entry : eventsBySourceId.entrySet()) {
            ActivityEvent event = entry.getValue();
            Instant endAt = parseInstant(event == null ? null : event.getEndAtIso());
            if (!isTrashScopeStatus(event)
                    && endAt != null
                    && endAt.plusSeconds(EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS).isAfter(now)) {
                waitingSourceIds.add(entry.getKey());
            }
        }
        Set<String> projectedSourceIds = new LinkedHashSet<>(normalizeIds(sourceIds));
        projectedSourceIds.removeAll(waitingSourceIds);
        updateFeedbackProjectionMarker(projectedSourceIds, true);
        updateFeedbackProjectionMarker(waitingSourceIds, false);
    }

    private void updateFeedbackProjectionMarker(Collection<String> sourceIds, boolean projected) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return;
        }
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("sourceId").in(normalizedSourceIds)),
                new Update().set("feedbackCountersProjected", projected),
                ActivityEvent.class);
    }

    private void collectEventUserIds(Set<String> userIds, ActivityEvent event) {
        if (event == null) {
            return;
        }
        addUserId(userIds, event.getOwnerUserId());
        addUserId(userIds, event.getCreatorUserId());
        safeStrings(event.getAdmins()).forEach(userIds::add);
    }

    private void addUserId(Set<String> userIds, String userId) {
        String normalized = normalizeId(userId);
        if (StringUtils.hasText(normalized)) {
            userIds.add(normalized);
        }
    }

    private Map<String, ActivityEvent> preferredEventsBySourceId(Collection<ActivityEvent> events, String userId) {
        Map<String, ActivityEvent> preferred = new LinkedHashMap<>();
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferred.get(sourceId);
            if (current == null || eventPreferenceScore(event, userId) > eventPreferenceScore(current, userId)) {
                preferred.put(sourceId, event);
            }
        }
        return preferred;
    }

    private void collectSourceIds(Set<String> sourceIds, Collection<ActivityEvent> events) {
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String parentEventId = isGeneratedSlotRecord(event)
                    ? normalizeId(event.getParentEventId())
                    : "";
            String sourceId = StringUtils.hasText(parentEventId)
                    ? parentEventId
                    : normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
    }

    private boolean isGeneratedSlotRecord(ActivityEvent event) {
        return event != null
                && (Boolean.TRUE.equals(event.getGenerated())
                || StringUtils.hasText(normalizeId(event.getParentEventId()))
                || "slot".equals(safeText(event.getEventType())));
    }

    private int eventPreferenceScore(ActivityEvent event, String userId) {
        if (event == null) {
            return 0;
        }
        String normalizedUserId = normalizeId(userId);
        return (normalizedUserId.equals(normalizeId(event.getOwnerUserId())) ? 64 : 0)
                + (isTrashScopeStatus(event) ? 0 : 16)
                + (isHostingRecordForUser(event, normalizeId(event.getCreatorUserId())) ? 8 : 0)
                + (isActiveEventStatus(event) ? 2 : 0)
                + (!safeStrings(event.getAdmins()).isEmpty() ? 1 : 0);
    }

    private boolean isHostingRecordForUser(ActivityEvent event, String userId) {
        if (event == null) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId)
                && (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))
                        || safeStrings(event.getAdmins()).contains(normalizedUserId));
    }

    private boolean isInvitationForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getInvitedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isPendingRequestForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getPendingRequestMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isAcceptedMemberForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getAcceptedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isDraftStatus(ActivityEvent event) {
        return event != null
                && (Boolean.FALSE.equals(event.getPublished()) || ActivityEvent.STATUS_DRAFT.equals(normalizeStatus(event.getStatus())));
    }

    private boolean isPendingReviewStatus(ActivityEvent event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(status) || ActivityEvent.STATUS_BLOCKED.equals(status);
    }

    private boolean isActiveEventStatus(ActivityEvent event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return ActivityEvent.STATUS_ACTIVE.equals(status) || !StringUtils.hasText(status);
    }

    private boolean isTrashScopeStatus(ActivityEvent event) {
        if (event == null || Boolean.TRUE.equals(event.getIsTrashed())) {
            return true;
        }
        String status = normalizeStatus(event.getStatus());
        return ActivityEvent.STATUS_TRASHED.equals(status);
    }

    private boolean isDeletedMembershipStatus(String status) {
        String normalized = safeText(status);
        return "deleted".equalsIgnoreCase(normalized)
                || ActivityEvent.STATUS_DELETED.equalsIgnoreCase(normalized);
    }

    private boolean isRestorableSuppressedMembership(ActivityMember member) {
        if (member == null || !"suppressed".equalsIgnoreCase(safeText(member.getStatus()))) {
            return false;
        }
        String ownerId = normalizeId(member.getOwnerId());
        return StringUtils.hasText(ownerId)
                && ownerId.equals(normalizeId(member.getSuppressionRootOwnerId()))
                && StringUtils.hasText(safeText(member.getStatusBeforeSuppression()));
    }

    private boolean hasRestorablePersonalTrashProjection(
            Collection<ActivityEvent> events,
            String sourceId,
            String userId) {
        String normalizedSourceId = normalizeId(sourceId);
        String normalizedUserId = normalizeId(userId);
        boolean activeCanonicalExists = false;
        boolean personalTrashOverlayExists = false;
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            if (event == null || !normalizedSourceId.equals(normalizeId(event.getSourceId()))) {
                continue;
            }
            String ownerUserId = normalizeId(event.getOwnerUserId());
            if (!isTrashScopeStatus(event) && isHostingRecordForUser(event, ownerUserId)) {
                activeCanonicalExists = true;
            }
            if (normalizedUserId.equals(ownerUserId)
                    && isTrashScopeStatus(event)
                    && StringUtils.hasText(safeText(event.getStatusBeforeSuppression()))) {
                personalTrashOverlayExists = true;
            }
        }
        return activeCanonicalExists && personalTrashOverlayExists;
    }

    private boolean isSuppressedAssetStatus(String status) {
        String normalized = normalizeStatus(status);
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(normalized)
                || ActivityEvent.STATUS_BLOCKED.equals(normalized)
                || ActivityEvent.STATUS_DELETED.equals(normalized)
                || ActivityEvent.STATUS_INACTIVE.equals(normalized)
                || ActivityEvent.STATUS_TRASHED.equals(normalized);
    }

    private List<String> normalizeIds(Collection<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private List<String> safeStrings(Collection<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private String normalizeStatus(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "active" -> ActivityEvent.STATUS_ACTIVE;
            case "draft" -> ActivityEvent.STATUS_DRAFT;
            case "trashed", "trash" -> ActivityEvent.STATUS_TRASHED;
            case "under-review", "under review" -> ActivityEvent.STATUS_UNDER_REVIEW;
            case "blocked" -> ActivityEvent.STATUS_BLOCKED;
            case "deleted" -> ActivityEvent.STATUS_DELETED;
            case "inactive" -> ActivityEvent.STATUS_INACTIVE;
            default -> normalized.toUpperCase();
        };
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private int count(Integer value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, value.intValue());
    }

    private record EventCounters(
            int all,
            int active,
            int pending,
            int invitations,
            int hosting,
            int drafts,
            int trash,
            int watchlist) {
    }

    private record AssetCounters(
            int cars,
            int accommodation,
            int supplies,
            int carsPending,
            int accommodationPending,
            int suppliesPending) {
    }

    private record FeedbackCounters(
            int ownEvents,
            int pending,
            int feedbacked,
            int removed) {
        FeedbackCounters plus(String bucket) {
            return switch (bucket) {
                case "removed" -> new FeedbackCounters(ownEvents, pending, feedbacked, removed + 1);
                case "feedbacked" -> new FeedbackCounters(ownEvents, pending, feedbacked + 1, removed);
                default -> new FeedbackCounters(ownEvents, pending + 1, feedbacked, removed);
            };
        }

        FeedbackCounters minus(String bucket) {
            return switch (bucket) {
                case "removed" -> new FeedbackCounters(ownEvents, pending, feedbacked, Math.max(0, removed - 1));
                case "feedbacked" -> new FeedbackCounters(ownEvents, pending, Math.max(0, feedbacked - 1), removed);
                default -> new FeedbackCounters(ownEvents, Math.max(0, pending - 1), feedbacked, removed);
            };
        }
    }

    private record SupportCaseCounters(
            int pending,
            int warned,
            int picked,
            int solved,
            int blocked,
            int all) {
    }

    private record FeedbackEligibilityKey(String userId, String eventId) {
    }

    private record FeedbackBucketDelta(int ownEvents, int pending, int feedbacked, int removed) {
        static FeedbackBucketDelta forBucket(String bucket, int amount) {
            return switch (bucket) {
                case "own-events" -> new FeedbackBucketDelta(amount, 0, 0, 0);
                case "removed" -> new FeedbackBucketDelta(0, 0, 0, amount);
                case "feedbacked" -> new FeedbackBucketDelta(0, 0, amount, 0);
                default -> new FeedbackBucketDelta(0, amount, 0, 0);
            };
        }

        FeedbackBucketDelta plus(FeedbackBucketDelta other) {
            return new FeedbackBucketDelta(
                    ownEvents + other.ownEvents,
                    pending + other.pending,
                    feedbacked + other.feedbacked,
                    removed + other.removed);
        }
    }
}
