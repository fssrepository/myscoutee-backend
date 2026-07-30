package com.raxim.myscoutee.profile.service;

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

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class EventCounterExpiryService {
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
    private final UsersRepository usersRepository;
    private final MongoTemplate mongoTemplate;
    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final AdminTelemetryService adminTelemetryService;
    private final int batchSize;
    private final AtomicBoolean processing = new AtomicBoolean(false);

    private record ExpiryRunResult(
            int dueSources,
            int affectedUsers,
            int updatedUsers,
            long markedEventRecords,
            long markedTicketRecords) {}
    private record EventCounterState(int invitations, int events, int hosting) {}

    public EventCounterExpiryService(
            ActivityMembersRepository activityMembersRepository,
            UsersRepository usersRepository,
            MongoTemplate mongoTemplate,
            NotificationRuleRegistryService notificationRuleRegistryService,
            AdminTelemetryService adminTelemetryService,
            @Value("${events.counter-expiry.batch-size:200}") int batchSize) {
        this.activityMembersRepository = activityMembersRepository;
        this.usersRepository = usersRepository;
        this.mongoTemplate = mongoTemplate;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.adminTelemetryService = adminTelemetryService;
        this.batchSize = Math.max(1, Math.min(1000, batchSize));
    }

    public int runExpiryPassNow() {
        return runExpiryPass(Instant.now(), false).dueSources();
    }

    public int runScheduledExpiryPass(Instant scheduledAt) {
        return runExpiryPass(scheduledAt, true).dueSources();
    }

    private ExpiryRunResult runExpiryPass(Instant requestedStart, boolean scheduled) {
        if (!processing.compareAndSet(false, true)) {
            return new ExpiryRunResult(0, 0, 0, 0L, 0L);
        }
        Instant startedAt = requestedStart == null ? Instant.now() : requestedStart;
        int claimedPendingCount = 0;
        boolean runStarted = !scheduled;
        try {
            if (scheduled) {
                if (notificationRuleRegistryService.beginScheduledRun(
                        NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                        "Scanning expired event counters.",
                        SYSTEM_USER,
                        startedAt) == null) {
                    return new ExpiryRunResult(0, 0, 0, 0L, 0L);
                }
            } else {
                notificationRuleRegistryService.beginRun(
                        NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                        "Scanning expired event counters.",
                        SYSTEM_USER,
                        startedAt);
            }
            runStarted = true;
            claimedPendingCount = notificationRuleRegistryService.claimPendingCount(
                    NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY);
            ExpiryRunResult result = processDueEvents(Instant.now());
            String detail = result.dueSources() == 0 && result.markedTicketRecords() == 0
                    ? "No expired event counters or ticket records were due."
                    : "Expired " + result.dueSources() + " event source(s), refreshed "
                    + result.updatedUsers() + "/" + result.affectedUsers()
                    + " affected user counter document(s), marked "
                    + result.markedEventRecords() + " event record(s), and marked "
                    + result.markedTicketRecords() + " ticket record(s).";
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                    result.dueSources(),
                    "completed",
                    detail,
                    SYSTEM_USER,
                    startedAt);
            if (result.dueSources() > 0) {
                adminTelemetryService.record(
                        "event.counter.expired",
                        "jobs",
                        NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                        SYSTEM_USER,
                        result.dueSources());
            }
            return result;
        } catch (RuntimeException exception) {
            if (runStarted) {
                notificationRuleRegistryService.restoreClaimedPendingCount(
                        NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                        claimedPendingCount,
                        "admin.jobs.table.affected");
            }
            LOGGER.warn("Event counter expiry pass failed.", exception);
            if (runStarted) {
                notificationRuleRegistryService.recordRun(
                        NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        SYSTEM_USER,
                        startedAt);
            }
            return new ExpiryRunResult(0, 0, 0, 0L, 0L);
        } finally {
            processing.set(false);
        }
    }

    private ExpiryRunResult processDueEvents(Instant now) {
        String nowIso = (now == null ? Instant.now() : now).toString();
        List<ActivityEvent> dueDocuments = dueEventDocuments(nowIso);
        List<ActivityEvent> dueTicketDocuments = dueTicketDocuments(nowIso);
        LinkedHashSet<String> dueSourceIds = sourceIds(dueDocuments);
        long markedTicketRecords = markDueTicketsExpired(dueTicketDocuments, nowIso);
        if (dueSourceIds.isEmpty()) {
            return new ExpiryRunResult(0, 0, 0, 0L, markedTicketRecords);
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
                markedTicketRecords);
    }

    private List<ActivityEvent> dueEventDocuments(String nowIso) {
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("expired").ne(true),
                Criteria.where("sourceId").exists(true).nin("", null),
                Criteria.where("status").is(ActivityEvent.STATUS_ACTIVE),
                dueBoundary(nowIso)));
        query.with(Sort.by(Sort.Order.asc("endAtIso"), Sort.Order.asc("startAtIso"), Sort.Order.asc("sourceId")));
        query.limit(batchSize);
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

        List<Users> changedUsers = new ArrayList<>();
        for (Users user : usersRepository.findByUserIdIn(normalizedUserIds)) {
            String userId = normalizeId(user == null ? null : user.getUserId());
            if (!StringUtils.hasText(userId)) {
                continue;
            }
            EventCounterState counters = countersForUser(
                    userId,
                    directRecordsByUserId.get(userId),
                    membersByUserId.get(userId),
                    preferredEventsBySourceId,
                    nowIso);
            Users.UserActivitiesRecord next = withEventCounters(user.getActivities(), counters);
            if (!activitiesEqual(user.getActivities(), next)) {
                user.setActivities(next);
                changedUsers.add(user);
            }
        }

        if (!changedUsers.isEmpty()) {
            usersRepository.saveAll(changedUsers);
        }
        return changedUsers.size();
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

    private Users.UserActivitiesRecord withEventCounters(
            Users.UserActivitiesRecord existing,
            EventCounterState counters) {
        EventCounterState safeCounters = counters == null ? new EventCounterState(0, 0, 0) : counters;
        return new Users.UserActivitiesRecord(
                count(existing == null ? null : existing.game()),
                count(existing == null ? null : existing.chats()),
                safeCounters.invitations(),
                safeCounters.events(),
                safeCounters.hosting(),
                count(existing == null ? null : existing.cars()),
                count(existing == null ? null : existing.accommodation()),
                count(existing == null ? null : existing.supplies()),
                count(existing == null ? null : existing.tickets()),
                count(existing == null ? null : existing.contacts()),
                count(existing == null ? null : existing.feedback()),
                existing == null ? null : existing.chat(),
                new Users.UserEventCountersRecord(
                        safeCounters.events()
                                + safeCounters.invitations()
                                + safeCounters.hosting()
                                + count(existing == null || existing.event() == null ? null : existing.event().pending())
                                + count(existing == null || existing.event() == null ? null : existing.event().drafts()),
                        safeCounters.events(),
                        count(existing == null || existing.event() == null ? null : existing.event().pending()),
                        safeCounters.invitations(),
                        safeCounters.hosting(),
                        count(existing == null || existing.event() == null ? null : existing.event().drafts()),
                        count(existing == null || existing.event() == null ? null : existing.event().trash())),
                existing == null ? null : existing.asset(),
                existing == null ? null : existing.eventFeedback(),
                count(existing == null ? null : existing.adminJobs()),
                count(existing == null ? null : existing.adminMetrics()),
                count(existing == null ? null : existing.notifications()));
    }

    boolean activitiesEqual(Users.UserActivitiesRecord first, Users.UserActivitiesRecord second) {
        if (first == second) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return Objects.equals(count(first.game()), count(second.game()))
                && Objects.equals(count(first.chats()), count(second.chats()))
                && Objects.equals(first.chat(), second.chat())
                && Objects.equals(first.event(), second.event())
                && Objects.equals(count(first.invitations()), count(second.invitations()))
                && Objects.equals(count(first.events()), count(second.events()))
                && Objects.equals(count(first.hosting()), count(second.hosting()))
                && Objects.equals(count(first.cars()), count(second.cars()))
                && Objects.equals(count(first.accommodation()), count(second.accommodation()))
                && Objects.equals(count(first.supplies()), count(second.supplies()))
                && Objects.equals(count(first.tickets()), count(second.tickets()))
                && Objects.equals(count(first.contacts()), count(second.contacts()))
                && Objects.equals(count(first.feedback()), count(second.feedback()))
                && Objects.equals(count(first.adminJobs()), count(second.adminJobs()))
                && Objects.equals(count(first.adminMetrics()), count(second.adminMetrics()))
                && Objects.equals(count(first.notifications()), count(second.notifications()));
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
