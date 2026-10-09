package com.raxim.myscoutee.domain.events.service;
import java.time.Instant;
import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.events.api.FeedbackEligibility;
import com.raxim.myscoutee.domain.events.document.*;
import com.raxim.myscoutee.domain.events.repository.*;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.FeedbackBucketDelta;
@Service
public class EventFeedbackEligibilityService implements FeedbackEligibility {
    private static final long EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS = 2L * 60L * 60L;
    private static final String FEEDBACK_COUNTER_PROJECTOR = "event-feedback-counter";
    @org.springframework.beans.factory.annotation.Autowired private FeedbackCounterWork counterWork;
    private final ActivityEventsRepository activityEventsRepository;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final MongoTemplate mongoTemplate;
    public EventFeedbackEligibilityService(ActivityEventsRepository events, EventFeedbackStatesRepository states, MongoTemplate mongo) { activityEventsRepository = events; eventFeedbackStatesRepository = states; mongoTemplate = mongo; }
    private record FeedbackEligibilityKey(String userId, String eventId) {}
    public void complete(Projection projection) { projection.changes().forEach(counterWork::acknowledge); updateFeedbackProjectionMarker(projection.projectedSources(), true); updateFeedbackProjectionMarker(projection.waitingSources(), false); }
    public Projection project(Collection<String> sourceIds, Instant requestedNow) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return new Projection(Map.of(), List.of(), List.of(), List.of());
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
            state = counterWork.finish(state);
            FeedbackEligibilityKey key = feedbackEligibilityKey(state);
            if (key != null) {
                existingStates.putIfAbsent(key, state);
            }
        }

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
                counterWork.prepare(state, Map.of(key.userId(), FeedbackBucketDelta.forBucket("pending", 1)));
                changedStates.add(state);
                continue;
            }
            if (state == null) {
                continue;
            }

            if (desired && !currentEligible) {
                counterWork.prepare(state, Map.of(key.userId(), FeedbackBucketDelta.forBucket(feedbackBucket(state), 1)));
                state.setEligible(true);
                state.setCounterTracked(true);
                touchFeedbackEligibilityState(state, nowIso);
                changedStates.add(state);
            } else if (!desired && currentEligible) {
                if (counterTracked) {
                    counterWork.prepare(state, Map.of(key.userId(), FeedbackBucketDelta.forBucket(feedbackBucket(state), -1)));
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
        var plan = projectionPlan(normalizedSourceIds, eventsBySourceId, now, Map.of());
        return new Projection(Map.of(), plan.projectedSources(), plan.waitingSources(), changedStates.stream()
                .map(EventFeedbackState::getCounterChange).filter(Objects::nonNull).toList());
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
    private boolean isFeedbackUnlocked(ActivityEvent event, Instant now) {
        Instant endAt = parseInstant(event == null ? null : event.getEndAtIso());
        return endAt != null
                && !endAt.plusSeconds(EVENT_FEEDBACK_UNLOCK_DELAY_SECONDS)
                        .isAfter(now == null ? Instant.now() : now);
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
    private Projection projectionPlan(
            Collection<String> sourceIds,
            Map<String, ActivityEvent> eventsBySourceId,
            Instant now, Map<String, FeedbackBucketDelta> deltas) {
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
        return new Projection(deltas, List.copyOf(projectedSourceIds), List.copyOf(waitingSourceIds), List.of());
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
    private Set<String> feedbackAdminUserIds(ActivityEvent event) {
        Set<String> userIds = new LinkedHashSet<>();
        addUserId(userIds, event == null ? null : event.getOwnerUserId());
        addUserId(userIds, event == null ? null : event.getCreatorUserId());
        safeStrings(event == null ? List.of() : event.getAdmins()).forEach(userIds::add);
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
    private boolean isTrashScopeStatus(ActivityEvent event) {
        if (event == null || Boolean.TRUE.equals(event.getIsTrashed())) {
            return true;
        }
        String status = normalizeStatus(event.getStatus());
        return ActivityEvent.STATUS_TRASHED.equals(status);
    }
    private void addUserId(Set<String> userIds, String userId) {
        String normalized = normalizeId(userId);
        if (StringUtils.hasText(normalized)) {
            userIds.add(normalized);
        }
    }
}
