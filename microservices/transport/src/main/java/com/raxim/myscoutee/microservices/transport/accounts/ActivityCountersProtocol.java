package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.Collection;
import java.time.Instant;
import com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class ActivityCountersProtocol {
    public static final String ROOT = "/_internal/v1/accounts/activity-counters";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16384;
    public static final int MAX_MENU_RESPONSE_BYTES = 2 * 1024 * 1024;
    private ActivityCountersProtocol() {}
    public static final String SUPPORT_PRESENT = ROOT + "/support-present";
    public static final String SUPPORT_REFRESH = ROOT + "/support-refresh";
    public static final String FEED_REFRESH = ROOT + "/feed-refresh";
    public static final String EVENT_SOURCES = ROOT + "/event-sources";
    public static final String ASSET_REFRESH = ROOT + "/asset-refresh";
    public static final String EVENT_USERS = ROOT + "/event-users";
    public static final String MEMBERSHIP_DELTAS = ROOT + "/membership-deltas";
    public static final String STORED_EVENTS = ROOT + "/stored-events";
    public static final String EXPIRE_FOLLOWING = ROOT + "/expire-following";
    public static final String FEEDBACK_ELIGIBILITY = ROOT + "/feedback-eligibility";
    public static final String MENU_CHANGE = ROOT + "/menu-change";
    public static final String FEEDBACK_RECEIPT = ROOT + "/feedback-receipt";
    public static final String FEEDBACK_TRANSITION = ROOT + "/feedback-transition";
    public static final String FEEDBACK_EVALUATION = ROOT + "/feedback-evaluation";
    public static final String STORED_FEED = ROOT + "/stored-feed";
    public static String[] paths() { return new String[]{SUPPORT_PRESENT, SUPPORT_REFRESH, FEED_REFRESH, EVENT_SOURCES, ASSET_REFRESH, EVENT_USERS, MEMBERSHIP_DELTAS, STORED_EVENTS, EXPIRE_FOLLOWING, FEEDBACK_ELIGIBILITY, FEEDBACK_TRANSITION, FEEDBACK_RECEIPT, FEEDBACK_EVALUATION, STORED_FEED, MENU_CHANGE}; }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record IdQuery(Scope scope, String userId) {}
    public record ScopeQuery(Scope scope) {}
    public record IdsQuery(Scope scope, Collection<String> ids) {}
    public record MembershipQuery(Scope scope, Collection<String> added, Collection<String> removed) {}
    public record InstantQuery(Scope scope, Instant now) {}
    public record EligibilityQuery(Scope scope, Collection<String> ids, Instant now) {}
    public record MenuChange(Scope scope, java.util.List<com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change> changes) {}
    public static boolean valid(MenuChange q) { return q != null && scope(q.scope()) && q.changes() != null && q.changes().size() <= 100
            && q.changes().stream().allMatch(c -> c != null && c.valid()); }
    public record FeedbackReceipt(Scope scope, com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change change) {}
    public record FeedbackQuery(Scope scope, FeedbackOwnersDto owners, String userId, Boolean wasSubmitted, Boolean wasRemoved, Boolean isSubmitted, Boolean isRemoved) {}
    public record FeedbackEvaluationQuery(Scope scope, String userId, Integer count) {}
    public record FeedValue(Boolean resolved, Long revision, java.util.Map<String, Long> counts) {}
    public record Decision(Boolean value) {}
    public record Count(Integer value) {}
    public record Counters(Boolean resolved, UserEventCountersDto value) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    private static boolean ids(Collection<String> values) { return values == null || values.size() <= 4096 && values.stream().allMatch(ActivityCountersProtocol::id); }
    private static boolean scope(Scope value) { return value != null && value.active() != null && id(value.groupId()) && (value.active() || value.groupId() == null); }
    public static boolean valid(IdQuery q) { return q != null && scope(q.scope()) && id(q.userId()); }
    public static boolean valid(ScopeQuery q) { return q != null && scope(q.scope()); }
    public static boolean valid(IdsQuery q) { return q != null && scope(q.scope()) && ids(q.ids()); }
    public static boolean valid(MembershipQuery q) { return q != null && scope(q.scope()) && ids(q.added()) && ids(q.removed()); }
    public static boolean valid(InstantQuery q) { return q != null && scope(q.scope()); }
    public static boolean valid(EligibilityQuery q) { return q != null && scope(q.scope()) && ids(q.ids()); }
    public static boolean valid(FeedbackEvaluationQuery q) { return q != null && scope(q.scope()) && id(q.userId()) && q.count() != null; }
    public static boolean valid(FeedbackReceipt q) {
        return q != null && scope(q.scope()) && q.change() != null && q.change().id() != null
                && q.change().id().matches("[a-f0-9]{32}") && q.change().deltas() != null
                && q.change().deltas().size() <= 4096 && q.change().deltas().entrySet().stream()
                    .allMatch(e -> e.getKey() != null && !e.getKey().isBlank() && id(e.getKey()) && e.getValue() != null);
    }
    public static boolean valid(FeedbackQuery q) {
        return q != null && scope(q.scope()) && id(q.userId()) && q.wasSubmitted() != null && q.wasRemoved() != null && q.isSubmitted() != null && q.isRemoved() != null
                && (q.owners() == null || id(q.owners().ownerUserId()) && id(q.owners().creatorUserId()) && ids(q.owners().admins()));
    }
}
