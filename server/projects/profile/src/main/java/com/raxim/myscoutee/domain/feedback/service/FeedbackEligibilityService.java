package com.raxim.myscoutee.domain.feedback.service;

import static com.raxim.myscoutee.common.util.TextValues.distinctIds;
import static com.raxim.myscoutee.common.util.TextValues.trim;
import static com.raxim.myscoutee.domain.events.api.EventOwnership.normalizedStatus;
import java.time.Instant;
import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.feedback.document.FeedbackState;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.feedback.repository.FeedbackStatesRepository;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.FeedbackBucketDelta;
@Service
public class FeedbackEligibilityService implements FeedbackEligibility {
    private static final long FEEDBACK_UNLOCK_DELAY_SECONDS = 2L * 60L * 60L;
    private static final String FEEDBACK_COUNTER_PROJECTOR = "feedback-counter";
    private final FeedbackCounterWork counterWork;
    private final EventOwnership activityEventsRepository;
    private final FeedbackStatesRepository feedbackStatesRepository;
    private final MongoTemplate mongoTemplate;
    public FeedbackEligibilityService(EventOwnership events, FeedbackStatesRepository states, MongoTemplate mongo,
            FeedbackCounterWork counterWork) {
        this.counterWork = counterWork;
 activityEventsRepository = events; feedbackStatesRepository = states; mongoTemplate = mongo; }
    private record FeedbackEligibilityKey(String userId, String eventId) {}
    public void complete(Projection projection) { projection.changes().forEach(counterWork::acknowledge); updateFeedbackProjectionMarker(projection.projectedSources(), true); updateFeedbackProjectionMarker(projection.waitingSources(), false); }
    public Projection project(Collection<String> sourceIds, Instant requestedNow) {
        List<String> normalizedSourceIds = distinctIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return new Projection(Map.of(), List.of(), List.of(), List.of());
        }

        Instant now = requestedNow == null ? Instant.now() : requestedNow;
        String nowIso = now.toString();
        Map<String, Event> eventsBySourceId = preferredFeedbackEventsBySourceId(
                activityEventsRepository.findBySourceIdIn(normalizedSourceIds));
        Map<FeedbackEligibilityKey, Event> desiredEligibility = new LinkedHashMap<>();
        for (Event event : eventsBySourceId.values()) {
            if (!isFeedbackUnlocked(event, now) || isTrashScopeStatus(event)) {
                continue;
            }
            Set<String> adminUserIds = feedbackAdminUserIds(event);
            for (String userId : distinctIds(event.getAcceptedMemberUserIds())) {
                if (!adminUserIds.contains(userId)) {
                    desiredEligibility.put(new FeedbackEligibilityKey(userId, trim(event.getSourceId())), event);
                }
            }
        }

        Map<FeedbackEligibilityKey, FeedbackState> existingStates = new LinkedHashMap<>();
        for (FeedbackState state : feedbackStatesRepository
                .findByEventIdInOrderByEventIdAscUpdatedDateDesc(normalizedSourceIds)) {
            state = counterWork.finish(state);
            FeedbackEligibilityKey key = feedbackEligibilityKey(state);
            if (key != null) {
                existingStates.putIfAbsent(key, state);
            }
        }

        List<FeedbackState> changedStates = new java.util.ArrayList<>();
        Set<FeedbackEligibilityKey> allKeys = new LinkedHashSet<>(existingStates.keySet());
        allKeys.addAll(desiredEligibility.keySet());
        for (FeedbackEligibilityKey key : allKeys) {
            FeedbackState state = existingStates.get(key);
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
            feedbackStatesRepository.saveAll(changedStates);
        }
        var plan = projectionPlan(normalizedSourceIds, eventsBySourceId, now, Map.of());
        return new Projection(Map.of(), plan.projectedSources(), plan.waitingSources(), changedStates.stream()
                .map(FeedbackState::getCounterChange).filter(Objects::nonNull).toList());
    }
    private String feedbackBucket(boolean submitted, boolean removed) {
        if (removed) {
            return "removed";
        }
        return submitted ? "feedbacked" : "pending";
    }

    private String feedbackBucket(FeedbackState state) {
        return feedbackBucket(
                StringUtils.hasText(state == null ? null : state.getSubmittedAtIso()),
                Boolean.TRUE.equals(state == null ? null : state.getRemoved()));
    }


    private Map<String, Event> preferredFeedbackEventsBySourceId(Collection<? extends Event> events) {
        Map<String, Event> preferred = new LinkedHashMap<>();
        for (Event event : events == null ? List.<Event>of() : events) {
            if (event == null) { continue; }
            String sourceId = trim(event.getSourceId());
            if (!StringUtils.hasText(sourceId) || Boolean.TRUE.equals(event.getGenerated())) {
                continue;
            }
            Event current = preferred.get(sourceId);
            if (current == null || feedbackEventPreferenceScore(event) > feedbackEventPreferenceScore(current)) {
                preferred.put(sourceId, event);
            }
        }
        return preferred;
    }
    private int feedbackEventPreferenceScore(Event event) {
        if (event == null) {
            return 0;
        }
        boolean canonical = trim(event.getCreatorUserId()).equals(trim(event.getOwnerUserId()));
        int acceptedCount = distinctIds(event.getAcceptedMemberUserIds()).size();
        return (canonical ? 1_000_000 : 0) + acceptedCount;
    }
    private boolean isFeedbackUnlocked(Event event, Instant now) {
        Instant endAt = parseInstant(event == null ? null : event.getEndAtIso());
        return endAt != null
                && !endAt.plusSeconds(FEEDBACK_UNLOCK_DELAY_SECONDS)
                        .isAfter(now == null ? Instant.now() : now);
    }
    private FeedbackEligibilityKey feedbackEligibilityKey(FeedbackState state) {
        String userId = trim(state == null ? null : state.getViewerUserId());
        String eventId = trim(state == null ? null : state.getEventId());
        return StringUtils.hasText(userId) && StringUtils.hasText(eventId)
                ? new FeedbackEligibilityKey(userId, eventId)
                : null;
    }
    private FeedbackState newFeedbackEligibilityState(FeedbackEligibilityKey key, String nowIso) {
        FeedbackState state = new FeedbackState();
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
    private void touchFeedbackEligibilityState(FeedbackState state, String nowIso) {
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(FEEDBACK_COUNTER_PROJECTOR);
    }
    private Projection projectionPlan(
            Collection<String> sourceIds,
            Map<String, Event> eventsBySourceId,
            Instant now, Map<String, FeedbackBucketDelta> deltas) {
        Set<String> waitingSourceIds = new LinkedHashSet<>();
        for (Map.Entry<String, Event> entry : eventsBySourceId.entrySet()) {
            Event event = entry.getValue();
            Instant endAt = parseInstant(event == null ? null : event.getEndAtIso());
            if (!isTrashScopeStatus(event)
                    && endAt != null
                    && endAt.plusSeconds(FEEDBACK_UNLOCK_DELAY_SECONDS).isAfter(now)) {
                waitingSourceIds.add(entry.getKey());
            }
        }
        Set<String> projectedSourceIds = new LinkedHashSet<>(distinctIds(sourceIds));
        projectedSourceIds.removeAll(waitingSourceIds);
        return new Projection(deltas, List.copyOf(projectedSourceIds), List.copyOf(waitingSourceIds), List.of());
    }
    private void updateFeedbackProjectionMarker(Collection<String> sourceIds, boolean projected) {
        List<String> normalizedSourceIds = distinctIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return;
        }
        activityEventsRepository.markFeedbackProjected(normalizedSourceIds, projected);
    }
    private Set<String> feedbackAdminUserIds(Event event) {
        Set<String> userIds = new LinkedHashSet<>();
        addUserId(userIds, event == null ? null : event.getOwnerUserId());
        addUserId(userIds, event == null ? null : event.getCreatorUserId());
        distinctIds(event == null ? List.of() : event.getAdmins()).forEach(userIds::add);
        return userIds;
    }
    private Instant parseInstant(String value) {
        return com.raxim.myscoutee.common.util.TimeValues.parseExactInstant(value);
    }
    private void addFeedbackDelta(
            Map<String, FeedbackBucketDelta> deltasByUserId,
            String userId,
            String bucket,
            int amount) {
        com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.accumulate(deltasByUserId, userId, bucket, amount);
    }





    private boolean isTrashScopeStatus(Event event) {
        if (event == null || Boolean.TRUE.equals(event.getIsTrashed())) {
            return true;
        }
        String status = normalizedStatus(event.getStatus());
        return Event.STATUS_TRASHED.equals(status);
    }
    private void addUserId(Set<String> userIds, String userId) {
        String normalized = trim(userId);
        if (StringUtils.hasText(normalized)) {
            userIds.add(normalized);
        }
    }
}
