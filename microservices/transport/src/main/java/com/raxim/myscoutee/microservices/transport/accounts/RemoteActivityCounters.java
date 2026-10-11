package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded existing bulk upserts; validate the complete input before sending the first batch. No retries. */
public final class RemoteActivityCounters extends RemoteReadTransport implements ActivityCounters, com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters, com.raxim.myscoutee.domain.accounts.api.ServiceFeedbackCounters, com.raxim.myscoutee.domain.accounts.api.FeedCounts {
    private final ObjectMapper mapper;
    public RemoteActivityCounters(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public int applyFeedbackReceipt(com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change change) {
        var query = new ActivityCountersProtocol.FeedbackReceipt(ActivityCountersProtocol.Scope.current(), change);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid feedback counter receipt");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        return exchange(ActivityCountersProtocol.FEEDBACK_RECEIPT, bytes, new TypeReference<ActivityCountersProtocol.Count>() {},
                "activity-counters.feedback-receipt", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> value.value() != null).value();
    }
    @Override public boolean hasSupportCaseCounters(String userId) {
        var query = new ActivityCountersProtocol.IdQuery(ActivityCountersProtocol.Scope.current(), userId);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.SUPPORT_PRESENT, bytes, new TypeReference<ActivityCountersProtocol.Decision>() {},
                "activity-counters.support-present", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> value.value() != null);
        return result.value();
    }
    @Override public void refreshSupportCaseCountersForAdmins() {
        var query = new ActivityCountersProtocol.ScopeQuery(ActivityCountersProtocol.Scope.current());
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.SUPPORT_REFRESH, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.support-refresh", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void refreshFeedCountersForUser(String userId) {
        var query = new ActivityCountersProtocol.IdQuery(ActivityCountersProtocol.Scope.current(), userId);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.FEED_REFRESH, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.feed-refresh", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void refreshEventCountersForSourceIds(java.util.Collection<String> ids) {
        var query = new ActivityCountersProtocol.IdsQuery(ActivityCountersProtocol.Scope.current(), ids);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.EVENT_SOURCES, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.event-sources", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void refreshAssetCountersForUser(String userId) {
        var query = new ActivityCountersProtocol.IdQuery(ActivityCountersProtocol.Scope.current(), userId);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.ASSET_REFRESH, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.asset-refresh", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void refreshEventCountersForUsers(java.util.Collection<String> ids) {
        var query = new ActivityCountersProtocol.IdsQuery(ActivityCountersProtocol.Scope.current(), ids);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.EVENT_USERS, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.event-users", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void applyActiveEventMembershipDeltas(java.util.Collection<String> added, java.util.Collection<String> removed) {
        var query = new ActivityCountersProtocol.MembershipQuery(ActivityCountersProtocol.Scope.current(), added, removed);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.MEMBERSHIP_DELTAS, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.membership-deltas", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto readStoredEventCounters(String userId) {
        var query = new ActivityCountersProtocol.IdQuery(ActivityCountersProtocol.Scope.current(), userId);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.STORED_EVENTS, bytes, new TypeReference<ActivityCountersProtocol.Counters>() {},
                "activity-counters.stored-events", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public void expireFollowingCounters(java.time.Instant now) {
        var query = new ActivityCountersProtocol.InstantQuery(ActivityCountersProtocol.Scope.current(), now);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.EXPIRE_FOLLOWING, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.expire-following", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public int syncFeedbackEligibilityForSourceIds(java.util.Collection<String> ids, java.time.Instant now) {
        var query = new ActivityCountersProtocol.EligibilityQuery(ActivityCountersProtocol.Scope.current(), ids, now);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.FEEDBACK_ELIGIBILITY, bytes, new TypeReference<ActivityCountersProtocol.Count>() {},
                "activity-counters.feedback-eligibility", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> value.value() != null);
        return result.value();
    }
    @Override public void applyFeedbackTransition(com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto owners, String userId, boolean wasSubmitted, boolean wasRemoved, boolean isSubmitted, boolean isRemoved) {
        var query = new ActivityCountersProtocol.FeedbackQuery(ActivityCountersProtocol.Scope.current(), owners, userId, wasSubmitted, wasRemoved, isSubmitted, isRemoved);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid activity counter request");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ActivityCountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Activity counter request exceeds byte limit");
        var result = exchange(ActivityCountersProtocol.FEEDBACK_TRANSITION, bytes, new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.feedback-transition", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void updateServiceFeedbackPending(String userId, int count) {
        var query = new ActivityCountersProtocol.ServiceFeedbackQuery(ActivityCountersProtocol.Scope.current(), userId, count);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid feedback counter request");
        exchange(ActivityCountersProtocol.SERVICE_FEEDBACK, mapper.writeValueAsBytes(query), new TypeReference<ActivityCountersProtocol.Receipt>() {},
                "activity-counters.service-feedback", ActivityCountersProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord counters(String userId) {
        var query = new ActivityCountersProtocol.IdQuery(ActivityCountersProtocol.Scope.current(), userId);
        if (!ActivityCountersProtocol.valid(query)) throw new IllegalArgumentException("Invalid feed counter request");
        var result = exchange(ActivityCountersProtocol.STORED_FEED, mapper.writeValueAsBytes(query), new TypeReference<ActivityCountersProtocol.FeedValue>() {},
                "activity-counters.stored-feed", ActivityCountersProtocol.MAX_RESPONSE_BYTES,
                value -> Boolean.TRUE.equals(value.resolved()) && value.revision() != null);
        return new com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord(result.revision(), result.counts());
    }
}
