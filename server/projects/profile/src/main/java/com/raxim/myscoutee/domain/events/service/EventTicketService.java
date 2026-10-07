package com.raxim.myscoutee.domain.events.service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

import org.bson.types.ObjectId;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.EventTicket;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.repository.EventTicketsRepository;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;

@Service
public class EventTicketService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String ATTENDANCE_STATUS_CHECKED_IN = "checked-in";
    private static final String CODE_PREFIX = "TKT-";
    private static final Pattern CODE_PATTERN = Pattern.compile(
            "^TKT-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
            Pattern.CASE_INSENSITIVE);
    private static final int ISSUE_ATTEMPTS = 5;

    private final EventTicketsRepository eventTicketsRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AccessPermissions accessControlService;
    private final MongoTemplate mongoTemplate;

    public EventTicketService(
            EventTicketsRepository eventTicketsRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AccessPermissions accessControlService,
            MongoTemplate mongoTemplate) {
        this.eventTicketsRepository = eventTicketsRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.accessControlService = accessControlService;
        this.mongoTemplate = mongoTemplate;
    }

    public EventTicket findActive(String eventId, String holderUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedHolderUserId = normalizeId(holderUserId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedHolderUserId)) {
            return null;
        }
        return eventTicketsRepository
                .findByEventIdAndHolderUserIdAndStatus(
                        normalizedEventId,
                        normalizedHolderUserId,
                        EventTicket.STATUS_ACTIVE)
                .filter(this::isUsableCredential)
                .orElse(null);
    }

    public Set<String> findActiveEventIdsForHolder(String holderUserId) {
        LinkedHashSet<String> eventIds = new LinkedHashSet<>();
        for (EventTicket ticket : findActiveForHolder(holderUserId)) {
            String eventId = normalizeId(ticket.getEventId());
            if (StringUtils.hasText(eventId)) {
                eventIds.add(eventId);
            }
        }
        return eventIds;
    }

    public List<EventTicket> findActiveForHolders(java.util.Collection<String> holderUserIds) {
        if (holderUserIds == null || holderUserIds.isEmpty()) return List.of();
        return eventTicketsRepository.findByHolderUserIdInAndStatus(holderUserIds, EventTicket.STATUS_ACTIVE)
                .stream().filter(this::isUsableCredential).toList();
    }

    public List<EventTicket> findActiveForHolder(String holderUserId) {
        String normalizedHolderUserId = normalizeId(holderUserId);
        if (!StringUtils.hasText(normalizedHolderUserId)) {
            return List.of();
        }
        return eventTicketsRepository.findByHolderUserIdAndStatus(
                        normalizedHolderUserId,
                        EventTicket.STATUS_ACTIVE).stream()
                .filter(this::isUsableCredential)
                .toList();
    }

    public void synchronizeForEvent(
            ActivityEvent canonical,
            Set<String> eligibleHolderUserIds,
            Instant now) {
        String eventId = normalizeId(canonical == null ? null : canonical.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            return;
        }

        LinkedHashSet<String> eligible = new LinkedHashSet<>();
        for (String holderUserId : eligibleHolderUserIds == null ? Set.<String>of() : eligibleHolderUserIds) {
            String normalizedHolderUserId = normalizeId(holderUserId);
            if (StringUtils.hasText(normalizedHolderUserId)
                    && !isEventAdmin(canonical, normalizedHolderUserId)) {
                eligible.add(normalizedHolderUserId);
            }
        }

        boolean ticketingEnabled = Boolean.TRUE.equals(canonical.getTicketing());
        boolean eventActive = canonical.hasStoredStatus(ActivityEvent.STATUS_ACTIVE) && !StringUtils.hasText(canonical.getCancelledAtIso());
        List<EventTicket> toDelete = new ArrayList<>();
        for (EventTicket ticket : eventTicketsRepository.findByEventId(eventId)) {
            if (ticket == null || !isActiveStatus(ticket.getStatus())) {
                continue;
            }
            String holderUserId = normalizeId(ticket.getHolderUserId());
            if (!ticketingEnabled || !eventActive || !eligible.contains(holderUserId)) {
                ticket.setStatus(EventTicket.STATUS_DELETED);
                toDelete.add(ticket);
            }
        }
        if (!toDelete.isEmpty()) {
            eventTicketsRepository.saveAll(toDelete);
        }

        if (!ticketingEnabled || !eventActive) {
            return;
        }
        Instant issuedAt = now == null ? Instant.now() : now;
        for (String holderUserId : eligible) {
            activateForEligibleHolder(eventId, holderUserId, issuedAt);
        }
    }

    EventTicket activateForEligibleHolder(String eventId, String holderUserId, Instant now) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedHolderUserId = normalizeId(holderUserId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedHolderUserId)
                || !isEligibleHolder(normalizedEventId, normalizedHolderUserId)) {
            return null;
        }

        EventTicket existing = eventTicketsRepository
                .findByEventIdAndHolderUserIdAndStatus(
                        normalizedEventId,
                        normalizedHolderUserId,
                        EventTicket.STATUS_ACTIVE)
                .orElse(null);
        if (isUsableCredential(existing)) {
            return existing;
        }
        if (existing != null) {
            return null;
        }

        Instant issuedAt = now == null ? Instant.now() : now;
        for (int attempt = 0; attempt < ISSUE_ATTEMPTS; attempt++) {
            EventTicket ticket = new EventTicket();
            ticket.setId(new ObjectId().toHexString());
            ticket.setCode(newCode());
            ticket.setEventId(normalizedEventId);
            ticket.setHolderUserId(normalizedHolderUserId);
            ticket.setStatus(EventTicket.STATUS_ACTIVE);
            ticket.setIssuedAtIso(issuedAt.toString());
            try {
                return eventTicketsRepository.save(ticket);
            } catch (DuplicateKeyException ignored) {
                EventTicket concurrent = eventTicketsRepository
                        .findByEventIdAndHolderUserIdAndStatus(
                                normalizedEventId,
                                normalizedHolderUserId,
                                EventTicket.STATUS_ACTIVE)
                        .orElse(null);
                if (isUsableCredential(concurrent)) {
                    return concurrent;
                }
            }
        }
        return null;
    }

    public CheckInResult checkIn(String code, String scannerUserId, Instant now) {
        String normalizedCode = normalizeCode(code);
        String normalizedScannerUserId = normalizeId(scannerUserId);
        if (!StringUtils.hasText(normalizedCode)) {
            return CheckInResult.invalid("invalid_code");
        }
        if (!StringUtils.hasText(normalizedScannerUserId)) {
            return CheckInResult.invalid("not_authorized");
        }

        EventTicket ticket = eventTicketsRepository.findByCode(normalizedCode).orElse(null);
        if (!isWellFormedCredential(ticket)) {
            return CheckInResult.invalid("not_found");
        }
        if (EventTicket.STATUS_DELETED.equals(safeText(ticket.getStatus()))) {
            return CheckInResult.invalid("revoked", ticket, findCanonicalEvent(ticket.getEventId()));
        }
        if (!isUsableCredential(ticket)) {
            return CheckInResult.invalid("not_found");
        }
        String eventId = normalizeId(ticket.getEventId());
        ActivityEvent event = findCanonicalEvent(eventId);
        if (event == null) {
            return CheckInResult.invalid("event_unavailable", ticket, null);
        }
        if (!accessControlService.canManageEvent(eventId, normalizedScannerUserId)) {
            return CheckInResult.invalid("not_authorized", ticket, event);
        }
        if (!event.hasStoredStatus(ActivityEvent.STATUS_ACTIVE) || StringUtils.hasText(event.getCancelledAtIso())) {
            return CheckInResult.invalid("event_unavailable", ticket, event);
        }
        if (!Boolean.TRUE.equals(event.getTicketing())) {
            return CheckInResult.invalid("revoked", ticket, event);
        }
        if (!isEligibleHolder(eventId, ticket.getHolderUserId())) {
            return CheckInResult.invalid("revoked", ticket, event);
        }
        if (StringUtils.hasText(ticket.getUsedAtIso())) {
            projectFirstAttendance(ticket);
            return CheckInResult.invalid("already_used", ticket, event);
        }

        Instant checkedAt = now == null ? Instant.now() : now;
        Instant endAt = parseInstant(event.getEndAtIso());
        if (Boolean.TRUE.equals(event.getIsExpired())
                || (endAt != null && !endAt.isAfter(checkedAt))) {
            return CheckInResult.invalid("expired", ticket, event);
        }
        if (endAt == null) {
            return CheckInResult.invalid("event_unavailable", ticket, event);
        }

        Criteria unused = new Criteria().orOperator(
                Criteria.where("usedAtIso").exists(false),
                Criteria.where("usedAtIso").is(null),
                Criteria.where("usedAtIso").is(""));
        Query query = Query.query(Criteria.where("_id").is(ticket.getId())
                .and("code").is(normalizedCode)
                .and("status").is(EventTicket.STATUS_ACTIVE)
                .andOperator(unused));
        EventTicket consumed = mongoTemplate.findAndModify(
                query,
                new Update()
                        .set("usedAtIso", checkedAt.toString())
                        .set("usedByUserId", normalizedScannerUserId),
                FindAndModifyOptions.options().returnNew(true),
                EventTicket.class);
        if (consumed != null) {
            projectFirstAttendance(consumed);
            return CheckInResult.checkedIn(consumed, event);
        }

        EventTicket current = eventTicketsRepository.findById(ticket.getId()).orElse(null);
        if (current != null && StringUtils.hasText(current.getUsedAtIso())) {
            projectFirstAttendance(current);
            return CheckInResult.invalid("already_used", current, event);
        }
        return CheckInResult.invalid("revoked", current, event);
    }

    private void projectFirstAttendance(EventTicket consumed) {
        Instant checkedAt = parseInstant(consumed == null ? null : consumed.getUsedAtIso());
        String scannerUserId = normalizeId(consumed == null ? null : consumed.getUsedByUserId());
        if (consumed == null
                || checkedAt == null
                || !StringUtils.hasText(scannerUserId)
                || !StringUtils.hasText(normalizeId(consumed.getId()))
                || !StringUtils.hasText(normalizeId(consumed.getEventId()))
                || !StringUtils.hasText(normalizeId(consumed.getHolderUserId()))) {
            return;
        }
        Criteria attendanceUnset = new Criteria().orOperator(
                Criteria.where("checkedInAtIso").exists(false),
                Criteria.where("checkedInAtIso").is(null),
                Criteria.where("checkedInAtIso").is(""));
        Query memberQuery = Query.query(Criteria.where("ownerType").is(OWNER_TYPE_EVENT)
                .and("ownerId").is(normalizeId(consumed.getEventId()))
                .and("userId").is(normalizeId(consumed.getHolderUserId()))
                .and("status").is(MEMBER_STATUS_ACCEPTED)
                .andOperator(attendanceUnset));
        String checkedAtIso = checkedAt.toString();
        mongoTemplate.findAndModify(
                memberQuery,
                new Update()
                        .set("attendanceStatus", ATTENDANCE_STATUS_CHECKED_IN)
                        .set("checkedInAtIso", checkedAtIso)
                        .set("checkedInByUserId", scannerUserId)
                        .set("checkedInTicketId", normalizeId(consumed.getId()))
                        .set("updatedDate", checkedAtIso)
                        .set("updatedUser", scannerUserId),
                FindAndModifyOptions.options().returnNew(true),
                ActivityMember.class);
    }

    private ActivityEvent findCanonicalEvent(String eventId) {
        if (!StringUtils.hasText(eventId)) {
            return null;
        }
        List<ActivityEvent> canonicalRecords = activityEventsRepository.findBySourceId(eventId).stream()
                .filter(Objects::nonNull)
                .filter(record -> Objects.equals(
                        normalizeId(record.getOwnerUserId()),
                        normalizeId(record.getCreatorUserId())))
                .toList();
        return canonicalRecords.stream()
                .max(Comparator.comparingLong(record -> sortableInstant(record.getUpdatedDate())))
                .orElse(null);
    }

    private boolean isEligibleHolder(String eventId, String holderUserId) {
        ActivityEvent canonical = findCanonicalEvent(eventId);
        String normalizedHolderUserId = normalizeId(holderUserId);
        if (canonical == null
                || !canonical.hasStoredStatus(ActivityEvent.STATUS_ACTIVE)
                || StringUtils.hasText(canonical.getCancelledAtIso())
                || !Boolean.TRUE.equals(canonical.getTicketing())
                || !StringUtils.hasText(normalizedHolderUserId)) {
            return false;
        }
        if (isEventAdmin(canonical, normalizedHolderUserId)) {
            return false;
        }
        return activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(
                        OWNER_TYPE_EVENT,
                        normalizeId(eventId),
                        normalizedHolderUserId)
                .map(ActivityMember::getStatus)
                .map(this::safeText)
                .filter(MEMBER_STATUS_ACCEPTED::equals)
                .isPresent();
    }

    private boolean isEventAdmin(ActivityEvent event, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (event == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))) {
            return true;
        }
        return event.getAdmins() != null && event.getAdmins().stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private boolean isUsableCredential(EventTicket ticket) {
        return isWellFormedCredential(ticket)
                && isActiveStatus(ticket.getStatus());
    }

    private boolean isWellFormedCredential(EventTicket ticket) {
        return ticket != null
                && StringUtils.hasText(normalizeCode(ticket.getCode()))
                && StringUtils.hasText(normalizeId(ticket.getEventId()))
                && StringUtils.hasText(normalizeId(ticket.getHolderUserId()));
    }

    private boolean isActiveStatus(String value) {
        String status = safeText(value);
        return EventTicket.STATUS_ACTIVE.equals(status) || "active".equalsIgnoreCase(status);
    }

    private String newCode() {
        return CODE_PREFIX + UUID.randomUUID();
    }

    private String normalizeCode(String value) {
        String normalized = safeText(value);
        if (!CODE_PATTERN.matcher(normalized).matches()) {
            return null;
        }
        return CODE_PREFIX + normalized.substring(CODE_PREFIX.length())
                .toLowerCase(java.util.Locale.ROOT);
    }

    private Instant parseInstant(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Instant.parse(value.trim());
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private long sortableInstant(String value) {
        Instant parsed = parseInstant(value);
        return parsed == null ? Long.MIN_VALUE : parsed.toEpochMilli();
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    public record CheckInResult(
            boolean valid,
            String reason,
            EventTicket ticket,
            ActivityEvent event) {
        public static CheckInResult checkedIn(EventTicket ticket, ActivityEvent event) {
            return new CheckInResult(true, "valid", ticket, event);
        }

        public static CheckInResult invalid(String reason) {
            return invalid(reason, null, null);
        }

        public static CheckInResult invalid(
                String reason,
                EventTicket ticket,
                ActivityEvent event) {
            return new CheckInResult(false, reason, ticket, event);
        }
    }
}
