package com.raxim.myscoutee.domain.accounts.service;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.FeedbackBucketDelta;

import com.raxim.myscoutee.domain.events.api.ParticipationTickets;

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

import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;


import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;

import com.raxim.myscoutee.domain.events.api.EventWatchDirectory;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class UserActivityCountersService implements com.raxim.myscoutee.domain.accounts.api.ServiceFeedbackCounters, com.raxim.myscoutee.domain.accounts.api.ActivityCounters {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.content.api.ContentStatistics contentStatistics;
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
            Map<String, Long> counts = contentStatistics.feedCounts(userId);
            if (before != null && counts.equals(before.counts())) return;
            var next = new com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord(before == null ? 1 : before.revision() + 1, counts);
            if (mongoTemplate.updateFirst(Query.query(Criteria.where("userId").is(userId).and("feedCounters").is(before)),
                    new Update().set("feedCounters", next), Users.class).getMatchedCount() > 0) return;
        }
        throw new IllegalStateException("Feed counters changed concurrently; retry moderation delivery.");
    }

    private static final String OWNER_TYPE_EVENT = "event";
    private static final long EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS = 2L * 60L * 60L;
    private static final String FEEDBACK_COUNTER_PROJECTOR = "event-feedback-counter";

    private final UsersRepository usersRepository;
    private final EventOwnershipReads activityEventsRepository;
    private final MemberDirectory activityMembersRepository;
    private final AssetOwnershipReads assetsRepository;
    private final com.raxim.myscoutee.domain.events.api.FeedbackEligibility feedbackEligibility;
    private final EventWatchDirectory eventWatchSubscriptionsRepository;
    private final ParticipationTickets eventParticipationTicketService;
    private final MongoTemplate mongoTemplate;

    public UserActivityCountersService(
            UsersRepository usersRepository,
            EventOwnershipReads activityEventsRepository,
            MemberDirectory activityMembersRepository,
            AssetOwnershipReads assetsRepository,
            com.raxim.myscoutee.domain.events.api.FeedbackEligibility feedbackEligibility,
            EventWatchDirectory eventWatchSubscriptionsRepository,
            ParticipationTickets eventParticipationTicketService,
            MongoTemplate mongoTemplate,
            OrganizerFollowingService organizerFollowingService) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.feedbackEligibility = feedbackEligibility;
        this.eventWatchSubscriptionsRepository = eventWatchSubscriptionsRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.mongoTemplate = mongoTemplate;
        this.organizerFollowingService = organizerFollowingService;
    }

    public void refreshEventCountersForSourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return;
        }
        Set<String> userIds = new LinkedHashSet<>();
        for (Event event : activityEventsRepository.findBySourceIdIn(normalizedSourceIds)) {
            collectEventUserIds(userIds, event);
        }
        for (Member member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, normalizedSourceIds)) {
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

    public void applyFeedbackTransition(
            com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto event,
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

    /** Counter fields and receipt are updated atomically in the account-owned document. */
    public int applyFeedbackReceipt(com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change change) {
        if (change == null || change.id() == null || !change.id().matches("[a-f0-9]{32}") || change.deltas() == null)
            throw new IllegalArgumentException("Invalid feedback counter receipt");
        int updated = 0;
        for (var entry : change.deltas().entrySet()) {
            String marker = "feedbackCounterReceipts." + change.id();
            var delta = entry.getValue();
            var values = new org.bson.Document();
            String[] fields = {"ownEvents", "pending", "feedbacked", "removed"};
            int[] amounts = {delta.ownEvents(), delta.pending(), delta.feedbacked(), delta.removed()};
            for (int i = 0; i < fields.length; i++) values.put(fields[i], new org.bson.Document("$max", List.of(0,
                    new org.bson.Document("$add", List.of(new org.bson.Document("$ifNull", List.of("$activities.eventFeedback." + fields[i], 0)), amounts[i])))));
            var update = org.springframework.data.mongodb.core.aggregation.AggregationUpdate.update()
                    .set("activities").toValue((org.springframework.data.mongodb.core.aggregation.AggregationExpression) context ->
                            new org.bson.Document("$mergeObjects", List.of(new org.bson.Document("$ifNull", List.of("$activities", new org.bson.Document())),
                                    new org.bson.Document("eventFeedback", values))))
                    .set("activities.feedback").toValue((org.springframework.data.mongodb.core.aggregation.AggregationExpression) context ->
                            new org.bson.Document("$add", List.of("$activities.eventFeedback.pending", "$activities.eventFeedback.ownEvents",
                                    new org.bson.Document("$ifNull", List.of("$activities.serviceFeedbackPending", 0)))))
                    .set(marker).toValue(true);
            var result = mongoTemplate.updateFirst(Query.query(Criteria.where("userId").is(entry.getKey()).and(marker).ne(true)), update, Users.class);
            updated += (int) result.getModifiedCount();
        }
        return updated;
    }

    public int syncFeedbackEligibilityForSourceIds(Collection<String> sourceIds, Instant requestedNow) {
        var projection = feedbackEligibility.project(sourceIds, requestedNow);
        int updated = 0;
        for (var change : projection.changes()) updated += applyFeedbackReceipt(change);
        feedbackEligibility.complete(projection);
        return updated;
    }



    private EventCounters resolveEventCounters(String userId) {
        Instant now = Instant.now();
        Set<String> sourceIds = new LinkedHashSet<>();
        Set<String> watchedSourceIds = eventWatchSubscriptionsRepository
                .watchedEventIds(userId).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<? extends Member> storedMemberships = activityMembersRepository
                .findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId);
        List<? extends Member> memberships = storedMemberships == null ? List.of() : storedMemberships;
        Set<String> legacyDeletedMembershipSourceIds = memberships.stream()
                .filter(Objects::nonNull)
                .filter(member -> isDeletedMembershipStatus(member.getStatus()))
                .map(Member::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Set<String> suppressedMembershipSourceIds = memberships.stream()
                .filter(Objects::nonNull)
                .filter(this::isRestorableSuppressedMembership)
                .map(Member::getOwnerId)
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
        List<? extends Event> eventDocuments = activityEventsRepository.findBySourceIdIn(sourceIds);
        Set<String> personalTrashSourceIds = new LinkedHashSet<>(legacyDeletedMembershipSourceIds);
        for (String sourceId : suppressedMembershipSourceIds) {
            if (hasRestorablePersonalTrashProjection(eventDocuments, sourceId, userId)) {
                personalTrashSourceIds.add(sourceId);
            }
        }
        Map<String, Event> preferredBySourceId = preferredEventsBySourceId(eventDocuments, userId);

        int active = 0;
        int pending = 0;
        int invitations = 0;
        int hosting = 0;
        int drafts = 0;
        int trash = 0;
        Set<String> countedSources = new LinkedHashSet<>();
        Set<String> allBucketSources = new LinkedHashSet<>();
        for (Event event : preferredBySourceId.values()) {
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
        List<? extends Event> tickets;
        if (profiles.isEmpty()) tickets = eventParticipationTicketService.queryTicketRecordsForUser(userId);
        else {
            var ids = new LinkedHashSet<String>(); ids.add(userId);
            profiles.forEach(profile -> ids.add(profile.getUserId()));
            tickets = eventParticipationTicketService.queryTicketSnapshotRecordsForUsers(ids).stream()
                    .map(ParticipationTickets.Snapshot::event).toList();
        }
        long ticketCount = tickets.stream()
                .filter(Objects::nonNull)
                .map(Event::getSourceId)
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





    private Set<String> feedbackAdminUserIds(com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto event) {
        Set<String> userIds = new LinkedHashSet<>();
        addUserId(userIds, event == null ? null : event.ownerUserId());
        addUserId(userIds, event == null ? null : event.creatorUserId());
        safeStrings(event == null ? List.of() : event.admins()).forEach(userIds::add);
        return userIds;
    }



    private Instant parseInstant(String value) {
        try {
            return StringUtils.hasText(value) ? Instant.parse(value) : null;
        } catch (RuntimeException ignored) {
            return null;
        }
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





    private void collectEventUserIds(Set<String> userIds, Event event) {
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

    private Map<String, Event> preferredEventsBySourceId(Collection<? extends Event> events, String userId) {
        Map<String, Event> preferred = new LinkedHashMap<>();
        for (Event event : events == null ? List.<Event>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            Event current = preferred.get(sourceId);
            if (current == null || eventPreferenceScore(event, userId) > eventPreferenceScore(current, userId)) {
                preferred.put(sourceId, event);
            }
        }
        return preferred;
    }

    private void collectSourceIds(Set<String> sourceIds, Collection<? extends Event> events) {
        for (Event event : events == null ? List.<Event>of() : events) {
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

    private boolean isGeneratedSlotRecord(Event event) {
        return event != null
                && (Boolean.TRUE.equals(event.getGenerated())
                || StringUtils.hasText(normalizeId(event.getParentEventId()))
                || "slot".equals(safeText(event.getEventType())));
    }

    private int eventPreferenceScore(Event event, String userId) {
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

    private boolean isHostingRecordForUser(Event event, String userId) {
        if (event == null) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId)
                && (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))
                        || safeStrings(event.getAdmins()).contains(normalizedUserId));
    }

    private boolean isInvitationForUser(Event event, String userId) {
        return event != null && safeStrings(event.getInvitedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isPendingRequestForUser(Event event, String userId) {
        return event != null && safeStrings(event.getPendingRequestMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isAcceptedMemberForUser(Event event, String userId) {
        return event != null && safeStrings(event.getAcceptedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isDraftStatus(Event event) {
        return event != null
                && (Boolean.FALSE.equals(event.getPublished()) || Event.STATUS_DRAFT.equals(normalizeStatus(event.getStatus())));
    }

    private boolean isPendingReviewStatus(Event event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return Event.STATUS_UNDER_REVIEW.equals(status) || Event.STATUS_BLOCKED.equals(status);
    }

    private boolean isActiveEventStatus(Event event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return Event.STATUS_ACTIVE.equals(status) || !StringUtils.hasText(status);
    }

    private boolean isTrashScopeStatus(Event event) {
        if (event == null || Boolean.TRUE.equals(event.getIsTrashed())) {
            return true;
        }
        String status = normalizeStatus(event.getStatus());
        return Event.STATUS_TRASHED.equals(status);
    }

    private boolean isDeletedMembershipStatus(String status) {
        String normalized = safeText(status);
        return "deleted".equalsIgnoreCase(normalized)
                || Event.STATUS_DELETED.equalsIgnoreCase(normalized);
    }

    private boolean isRestorableSuppressedMembership(Member member) {
        if (member == null || !"suppressed".equalsIgnoreCase(safeText(member.getStatus()))) {
            return false;
        }
        String ownerId = normalizeId(member.getOwnerId());
        return StringUtils.hasText(ownerId)
                && ownerId.equals(normalizeId(member.getSuppressionRootOwnerId()))
                && StringUtils.hasText(safeText(member.getStatusBeforeSuppression()));
    }

    private boolean hasRestorablePersonalTrashProjection(
            Collection<? extends Event> events,
            String sourceId,
            String userId) {
        String normalizedSourceId = normalizeId(sourceId);
        String normalizedUserId = normalizeId(userId);
        boolean activeCanonicalExists = false;
        boolean personalTrashOverlayExists = false;
        for (Event event : events == null ? List.<Event>of() : events) {
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
        return Event.STATUS_UNDER_REVIEW.equals(normalized)
                || Event.STATUS_BLOCKED.equals(normalized)
                || Event.STATUS_DELETED.equals(normalized)
                || Event.STATUS_INACTIVE.equals(normalized)
                || Event.STATUS_TRASHED.equals(normalized);
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
            case "active" -> Event.STATUS_ACTIVE;
            case "draft" -> Event.STATUS_DRAFT;
            case "trashed", "trash" -> Event.STATUS_TRASHED;
            case "under-review", "under review" -> Event.STATUS_UNDER_REVIEW;
            case "blocked" -> Event.STATUS_BLOCKED;
            case "deleted" -> Event.STATUS_DELETED;
            case "inactive" -> Event.STATUS_INACTIVE;
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



    private record FeedbackEligibilityKey(String userId, String eventId) {
    }


}
