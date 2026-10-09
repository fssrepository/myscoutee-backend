package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.events.service.EventJobQueries;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import com.mongodb.client.result.UpdateResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;

@Service
public class EventCounterExpiryService {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates eventCounterUpdates;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.events.service.EventJobQueries jobGroupScope;

    private static final Logger LOGGER = LoggerFactory.getLogger(EventCounterExpiryService.class);
    private static final String SYSTEM_USER = "event-counter-expiry";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String MEMBER_STATUS_PENDING = "pending";
    private static final String MEMBER_STATUS_INVITED = "I";
    private static final String MEMBER_STATUS_DELETED = "deleted";
    private static final String MEMBER_STATUS_SUPPRESSED = "suppressed";
    private static final String MEMBER_STATUS_DISQUALIFIED = "disqualified";
    private static final String REQUEST_KIND_INVITE = "invite";
    private static final String REQUEST_KIND_WAITLIST_INVITE = "waitlist-invite";

    private final ActivityMembersRepository activityMembersRepository;
    private final MongoTemplate mongoTemplate;
    private final NotificationJobs notificationRuleRegistryService;
    private final OperationalTelemetry adminTelemetryService;
    private final ActivityCounters userActivityCountersService;
    private final EventFriendshipProjectionService eventFriendshipProjectionService;
    private final int batchSize;
    private final java.util.concurrent.ConcurrentHashMap<String, AtomicBoolean> processing = new java.util.concurrent.ConcurrentHashMap<>();

    private record ExpiryRunResult(
            int dueSources,
            int affectedUsers,
            int updatedUsers,
            long markedEventRecords,
            long markedTicketRecords,
            int feedbackProjectionSources,
            int feedbackCounterUsers,
            int friendshipProjectionSources) {
        int processedSources() {
            return dueSources + feedbackProjectionSources + friendshipProjectionSources;
        }
    }
    private record EventCounterState(int invitations, int events, int hosting) {}

    public EventCounterExpiryService(
            ActivityMembersRepository activityMembersRepository,
            MongoTemplate mongoTemplate,
            NotificationJobs notificationRuleRegistryService,
            OperationalTelemetry adminTelemetryService,
            ActivityCounters userActivityCountersService,
            EventFriendshipProjectionService eventFriendshipProjectionService,
            @Value("${events.counter-expiry.batch-size:200}") int batchSize) {
        this.activityMembersRepository = activityMembersRepository;
        this.mongoTemplate = mongoTemplate;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.adminTelemetryService = adminTelemetryService;
        this.userActivityCountersService = userActivityCountersService;
        this.eventFriendshipProjectionService = eventFriendshipProjectionService;
        this.batchSize = Math.max(1, Math.min(1000, batchSize));
    }

    public int runExpiryPassNow() {
        return runExpiryPass(Instant.now(), false).processedSources();
    }

    public int runScheduledExpiryPass(Instant scheduledAt) {
        return runExpiryPass(scheduledAt, true).processedSources();
    }

    private ExpiryRunResult runExpiryPass(Instant requestedStart, boolean scheduled) {
        var running = processing.computeIfAbsent(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name() + ":" + JobGroupContext.key(), ignored -> new AtomicBoolean());
        if (!running.compareAndSet(false, true)) {
            return new ExpiryRunResult(0, 0, 0, 0L, 0L, 0, 0, 0);
        }
        Instant startedAt = requestedStart == null ? Instant.now() : requestedStart;
        int claimedPendingCount = 0;
        boolean runStarted = false;
        try {
            if (scheduled) {
                if (notificationRuleRegistryService.beginScheduledRun(
                        NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                        "Scanning expired event counters.",
                        SYSTEM_USER,
                        startedAt) == null) {
                    return new ExpiryRunResult(0, 0, 0, 0L, 0L, 0, 0, 0);
                }
            } else if (notificationRuleRegistryService.beginRun(
                    NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                    "Scanning expired event counters.", SYSTEM_USER, startedAt) == null) {
                return new ExpiryRunResult(0, 0, 0, 0L, 0L, 0, 0, 0);
            }
            runStarted = true;
            claimedPendingCount = notificationRuleRegistryService.claimPendingCount(
                    NotificationJobs.RULE_EVENT_COUNTER_EXPIRY, startedAt);
            ExpiryRunResult result = processDueEvents(Instant.now());
            String detail = result.processedSources() == 0 && result.markedTicketRecords() == 0
                    ? "No expired event counters, ticket records, feedback counters, or friendships were due."
                    : "Expired " + result.dueSources() + " event source(s), refreshed "
                    + result.updatedUsers() + "/" + result.affectedUsers()
                    + " affected user counter document(s), marked "
                    + result.markedEventRecords() + " event record(s), and marked "
                    + result.markedTicketRecords() + " ticket record(s); projected feedback counters for "
                    + result.feedbackCounterUsers() + " user(s) across "
                    + result.feedbackProjectionSources() + " event source(s); projected friendships for "
                    + result.friendshipProjectionSources() + " event source(s).";
            notificationRuleRegistryService.recordRun(
                    NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                    result.processedSources(),
                    "completed",
                    detail,
                    SYSTEM_USER,
                    startedAt);
            if (result.dueSources() > 0) {
                adminTelemetryService.record(
                        "event.counter.expired",
                        "jobs",
                        NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                        SYSTEM_USER,
                        result.dueSources());
            }
            return result;
        } catch (RuntimeException exception) {
            if (runStarted) {
                notificationRuleRegistryService.restoreClaimedPendingCount(
                        NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                        claimedPendingCount,
                        "admin.jobs.table.affected", startedAt);
            }
            LOGGER.warn("Event counter expiry pass failed.", exception);
            if (runStarted) {
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_EVENT_COUNTER_EXPIRY,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        SYSTEM_USER,
                        startedAt);
            }
            return new ExpiryRunResult(0, 0, 0, 0L, 0L, 0, 0, 0);
        } finally {
            running.set(false);
        }
    }

    private ExpiryRunResult processDueEvents(Instant now) {
        userActivityCountersService.expireFollowingCounters(now);
        int friendshipProjectionSources = eventFriendshipProjectionService.projectCompletedEvents(now, batchSize);
        String nowIso = (now == null ? Instant.now() : now).toString();
        List<ActivityEvent> dueDocuments = dueEventDocuments(nowIso);
        List<ActivityEvent> dueTicketDocuments = dueTicketDocuments(nowIso);
        LinkedHashSet<String> feedbackProjectionSourceIds = sourceIds(dueFeedbackProjectionDocuments(now));
        int feedbackCounterUsers = userActivityCountersService.syncFeedbackEligibilityForSourceIds(
                feedbackProjectionSourceIds,
                now);
        LinkedHashSet<String> dueSourceIds = sourceIds(dueDocuments);
        long markedTicketRecords = markDueTicketsExpired(dueTicketDocuments, nowIso);
        if (dueSourceIds.isEmpty()) {
            return new ExpiryRunResult(
                    0,
                    0,
                    0,
                    0L,
                    markedTicketRecords,
                    feedbackProjectionSourceIds.size(),
                    feedbackCounterUsers,
                    friendshipProjectionSources);
        }

        List<ActivityEvent> sourceDocuments = loadEventDocumentsBySourceIds(dueSourceIds);
        List<ActivityMember> sourceMembers = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, dueSourceIds);
        LinkedHashSet<String> affectedUserIds = affectedUserIds(sourceDocuments, sourceMembers);
        int updatedUsers = refreshAffectedUserCounters(affectedUserIds, nowIso);
        long markedEventRecords = markDueEventsExpired(dueSourceIds, nowIso);
        return new ExpiryRunResult(
                dueSourceIds.size(),
                affectedUserIds.size(),
                updatedUsers,
                markedEventRecords,
                markedTicketRecords,
                feedbackProjectionSourceIds.size(),
                feedbackCounterUsers,
                friendshipProjectionSources);
    }

    private List<ActivityEvent> dueFeedbackProjectionDocuments(Instant now) {
        Instant cutoff = (now == null ? Instant.now() : now).minusSeconds(2L * 60L * 60L);
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("feedbackCountersProjected").ne(true),
                Criteria.where("generated").ne(true),
                Criteria.where("sourceId").exists(true).nin("", null),
                Criteria.where("status").ne(ActivityEvent.STATUS_TRASHED),
                Criteria.where("endAtIso").lte(cutoff.toString())));
        query.with(Sort.by(Sort.Order.asc("endAtIso"), Sort.Order.asc("sourceId")));
        query.limit(batchSize);
        if (JobGroupContext.isActive()) query.addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId"));
        return mongoTemplate.find(query, ActivityEvent.class);
    }

    private List<ActivityEvent> dueEventDocuments(String nowIso) {
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("expired").ne(true),
                Criteria.where("sourceId").exists(true).nin("", null),
                Criteria.where("status").is(ActivityEvent.STATUS_ACTIVE),
                dueBoundary(nowIso)));
        query.with(Sort.by(Sort.Order.asc("endAtIso"), Sort.Order.asc("startAtIso"), Sort.Order.asc("sourceId")));
        query.limit(batchSize);
        if (JobGroupContext.isActive()) query.addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId"));
        return mongoTemplate.find(query, ActivityEvent.class);
    }

    private List<ActivityEvent> dueTicketDocuments(String nowIso) {
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("expired").ne(true),
                Criteria.where("ticketing").is(true),
                Criteria.where("sourceId").exists(true).nin("", null),
                Criteria.where("status").ne(ActivityEvent.STATUS_TRASHED),
                dueBoundary(nowIso)));
        query.with(Sort.by(Sort.Order.asc("endAtIso"), Sort.Order.asc("startAtIso"), Sort.Order.asc("_id")));
        query.limit(batchSize);
        if (JobGroupContext.isActive()) query.addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId"));
        return mongoTemplate.find(query, ActivityEvent.class);
    }

    private long markDueEventsExpired(Collection<String> sourceIds, String nowIso) {
        LinkedHashSet<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return 0L;
        }
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("sourceId").in(normalizedSourceIds),
                Criteria.where("expired").ne(true),
                dueBoundary(nowIso)));
        Update update = expiryUpdate(nowIso);
        UpdateResult result = mongoTemplate.updateMulti(query, update, ActivityEvent.class);
        return result == null ? 0L : result.getModifiedCount();
    }

    private long markDueTicketsExpired(Collection<ActivityEvent> ticketDocuments, String nowIso) {
        LinkedHashSet<String> ticketRecordIds = recordIds(ticketDocuments);
        if (ticketRecordIds.isEmpty()) {
            return 0L;
        }
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("_id").in(ticketRecordIds),
                Criteria.where("expired").ne(true),
                Criteria.where("ticketing").is(true),
                Criteria.where("status").ne(ActivityEvent.STATUS_TRASHED),
                dueBoundary(nowIso)));
        Update update = expiryUpdate(nowIso);
        UpdateResult result = mongoTemplate.updateMulti(query, update, ActivityEvent.class);
        return result == null ? 0L : result.getModifiedCount();
    }

    private Update expiryUpdate(String nowIso) {
        return new Update()
                .set("expired", true)
                .set("updatedDate", nowIso)
                .set("updatedUser", SYSTEM_USER);
    }

    private Criteria dueBoundary(String nowIso) {
        Criteria missingEnd = new Criteria().orOperator(
                Criteria.where("endAtIso").exists(false),
                Criteria.where("endAtIso").is(null),
                Criteria.where("endAtIso").is(""));
        return new Criteria().orOperator(
                Criteria.where("endAtIso").lte(nowIso),
                new Criteria().andOperator(missingEnd, Criteria.where("startAtIso").lte(nowIso)));
    }

    private LinkedHashSet<String> recordIds(Collection<ActivityEvent> records) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String id = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(id)) {
                ids.add(id);
            }
        }
        return ids;
    }

    private int refreshAffectedUserCounters(Set<String> affectedUserIds, String nowIso) {
        LinkedHashSet<String> normalizedUserIds = normalizeIds(affectedUserIds);
        if (normalizedUserIds.isEmpty()) {
            return 0;
        }

        List<ActivityEvent> directRecords = loadDirectEventDocuments(normalizedUserIds);
        Map<String, List<ActivityEvent>> directRecordsByUserId = eventsByOwnerUserId(directRecords);
        List<ActivityMember> userMembers = loadUserMemberships(normalizedUserIds);
        Map<String, List<ActivityMember>> membersByUserId = membersByUserId(userMembers);
        Map<String, ActivityEvent> preferredEventsBySourceId =
                preferredEventRecordsBySourceId(loadEventDocumentsBySourceIds(memberOwnerIds(userMembers)));

        List<com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates.Change> changedUsers = new ArrayList<>();
        for (String userId : normalizedUserIds) {
            EventCounterState counters = countersForUser(
                    userId,
                    directRecordsByUserId.get(userId),
                    membersByUserId.get(userId),
                    preferredEventsBySourceId,
                    nowIso);
            changedUsers.add(new com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates.Change(userId, counters.invitations(), counters.events(), counters.hosting()));
        }
        return eventCounterUpdates.replaceExpired(changedUsers);
    }

    private EventCounterState countersForUser(
            String userId,
            List<ActivityEvent> directRecords,
            List<ActivityMember> memberships,
            Map<String, ActivityEvent> preferredEventsBySourceId,
            String nowIso) {
        LinkedHashSet<String> invitationSourceIds = new LinkedHashSet<>();
        LinkedHashSet<String> eventSourceIds = new LinkedHashSet<>();
        LinkedHashSet<String> hostingSourceIds = new LinkedHashSet<>();

        for (ActivityEvent record : directRecords == null ? List.<ActivityEvent>of() : directRecords) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (!StringUtils.hasText(sourceId) || !isActiveForCounters(record, nowIso)) {
                continue;
            }
            if (isHostingRecordForUser(record, userId)) {
                hostingSourceIds.add(sourceId);
            } else {
                eventSourceIds.add(sourceId);
            }
        }

        for (ActivityMember member : memberships == null ? List.<ActivityMember>of() : memberships) {
            String sourceId = normalizeId(member == null ? null : member.getOwnerId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent event = preferredEventsBySourceId.get(sourceId);
            if (event == null || !isActiveForCounters(event, nowIso)) {
                continue;
            }
            String status = normalizeMemberStatus(member.getStatus());
            if (MEMBER_STATUS_INVITED.equals(status)) {
                invitationSourceIds.add(sourceId);
            } else if (MEMBER_STATUS_ACCEPTED.equals(status)) {
                eventSourceIds.add(sourceId);
            } else if (MEMBER_STATUS_PENDING.equals(status) && isPendingInvitation(member)) {
                invitationSourceIds.add(sourceId);
            } else if (MEMBER_STATUS_PENDING.equals(status)) {
                eventSourceIds.add(sourceId);
            }
        }

        return new EventCounterState(invitationSourceIds.size(), eventSourceIds.size(), hostingSourceIds.size());
    }

    private boolean isActiveForCounters(ActivityEvent record, String nowIso) {
        if (record == null || Boolean.TRUE.equals(record.getIsExpired()) || eventPast(record, nowIso)) {
            return false;
        }
        if (Boolean.FALSE.equals(record.getPublished()) || Boolean.TRUE.equals(record.getIsTrashed())) {
            return false;
        }
        String status = safeText(record.getStatus());
        return !ActivityEvent.STATUS_DRAFT.equals(status)
                && !ActivityEvent.STATUS_TRASHED.equals(status)
                && !ActivityEvent.STATUS_DELETED.equals(status)
                && !ActivityEvent.STATUS_INACTIVE.equals(status);
    }

    private boolean eventPast(ActivityEvent record, String nowIso) {
        String boundary = firstNonBlank(record == null ? null : record.getEndAtIso(), record == null ? null : record.getStartAtIso());
        return StringUtils.hasText(boundary) && boundary.compareTo(safeText(nowIso)) <= 0;
    }

    private boolean isHostingRecordForUser(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId)) {
            return false;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId()))) {
            return true;
        }
        for (String adminUserId : record.getAdmins() == null ? List.<String>of() : record.getAdmins()) {
            if (userId.equals(normalizeId(adminUserId))) {
                return true;
            }
        }
        return false;
    }

    private boolean isPendingInvitation(ActivityMember member) {
        if (!MEMBER_STATUS_PENDING.equals(normalizeMemberStatus(member == null ? null : member.getStatus()))) {
            return false;
        }
        String requestKind = safeText(member.getRequestKind());
        return REQUEST_KIND_INVITE.equals(requestKind)
                || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind)
                || "admin".equals(safeText(member.getPendingSource()));
    }

    private List<ActivityEvent> loadDirectEventDocuments(Collection<String> userIds) {
        LinkedHashSet<String> normalizedUserIds = normalizeIds(userIds);
        if (normalizedUserIds.isEmpty()) {
            return List.of();
        }
        return mongoTemplate.find(
                Query.query(Criteria.where("ownerUserId").in(normalizedUserIds)),
                ActivityEvent.class);
    }

    private List<ActivityMember> loadUserMemberships(Collection<String> userIds) {
        LinkedHashSet<String> normalizedUserIds = normalizeIds(userIds);
        if (normalizedUserIds.isEmpty()) {
            return List.of();
        }
        return mongoTemplate.find(
                Query.query(Criteria.where("ownerType").is(OWNER_TYPE_EVENT).and("userId").in(normalizedUserIds)),
                ActivityMember.class);
    }

    private List<ActivityEvent> loadEventDocumentsBySourceIds(Collection<String> sourceIds) {
        LinkedHashSet<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return List.of();
        }
        return mongoTemplate.find(
                Query.query(Criteria.where("sourceId").in(normalizedSourceIds)),
                ActivityEvent.class);
    }

    private LinkedHashSet<String> sourceIds(Collection<ActivityEvent> records) {
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        return sourceIds;
    }

    private LinkedHashSet<String> memberOwnerIds(Collection<ActivityMember> members) {
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            String sourceId = normalizeId(member == null ? null : member.getOwnerId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        return sourceIds;
    }

    private LinkedHashSet<String> affectedUserIds(List<ActivityEvent> records, List<ActivityMember> members) {
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            addUserId(userIds, record == null ? null : record.getOwnerUserId());
            addUserId(userIds, record == null ? null : record.getCreatorUserId());
            if (record != null && record.getAdmins() != null) {
                for (String adminUserId : record.getAdmins()) {
                    addUserId(userIds, adminUserId);
                }
            }
        }
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            addUserId(userIds, member == null ? null : member.getUserId());
        }
        return userIds;
    }

    private void addUserId(Set<String> userIds, String value) {
        String userId = normalizeId(value);
        if (StringUtils.hasText(userId)) {
            userIds.add(userId);
        }
    }

    private Map<String, List<ActivityEvent>> eventsByOwnerUserId(List<ActivityEvent> records) {
        Map<String, List<ActivityEvent>> byUserId = new LinkedHashMap<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String userId = normalizeId(record == null ? null : record.getOwnerUserId());
            if (StringUtils.hasText(userId)) {
                byUserId.computeIfAbsent(userId, ignored -> new ArrayList<>()).add(record);
            }
        }
        return byUserId;
    }

    private Map<String, List<ActivityMember>> membersByUserId(List<ActivityMember> members) {
        Map<String, List<ActivityMember>> byUserId = new LinkedHashMap<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(userId)) {
                byUserId.computeIfAbsent(userId, ignored -> new ArrayList<>()).add(member);
            }
        }
        return byUserId;
    }

    private Map<String, ActivityEvent> preferredEventRecordsBySourceId(List<ActivityEvent> records) {
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || shouldPreferEventRecord(record, current)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        return preferredBySourceId;
    }

    private boolean shouldPreferEventRecord(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getPublished()) && !Boolean.TRUE.equals(current.getPublished())) {
            return true;
        }
        if (!Boolean.TRUE.equals(next.getPublished()) && Boolean.TRUE.equals(current.getPublished())) {
            return false;
        }
        return count(next.getAcceptedMembers()) >= count(current.getAcceptedMembers());
    }

    private LinkedHashSet<String> normalizeIds(Collection<String> values) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : values == null ? List.<String>of() : values) {
            String id = normalizeId(value);
            if (StringUtils.hasText(id)) {
                normalized.add(id);
            }
        }
        return normalized;
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String normalizeMemberStatus(String value) {
        String normalized = safeText(value);
        if (MEMBER_STATUS_INVITED.equals(normalized)) {
            return MEMBER_STATUS_INVITED;
        }
        if (MEMBER_STATUS_PENDING.equals(normalized)) {
            return MEMBER_STATUS_PENDING;
        }
        if (MEMBER_STATUS_DELETED.equals(normalized)) {
            return MEMBER_STATUS_DELETED;
        }
        if (MEMBER_STATUS_SUPPRESSED.equals(normalized)) {
            return MEMBER_STATUS_SUPPRESSED;
        }
        if (MEMBER_STATUS_DISQUALIFIED.equals(normalized)) {
            return MEMBER_STATUS_DISQUALIFIED;
        }
        return MEMBER_STATUS_ACCEPTED;
    }

    private Integer count(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
