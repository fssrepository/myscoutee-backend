package com.raxim.myscoutee.microservices.transport.email;

import com.raxim.myscoutee.domain.email.api.ScheduledMessages;

public final class ScheduledMessagesProtocol {
    public static final String STAGES = "/_internal/v1/email/scheduled-messages/stages";
    public static final String SUSPEND = "/_internal/v1/email/scheduled-messages/suspend";
    public static final String CASE = "/_internal/v1/email/scheduled-messages/case";
    public static final String DEFINITION = "/_internal/v1/email/scheduled-messages/definition";
    public static final String WATCHLIST = "/_internal/v1/email/scheduled-messages/watchlist";
    public static final String LIFECYCLE_ONCE = "/_internal/v1/email/scheduled-messages/lifecycle-once";
    public static final String LIFECYCLE = "/_internal/v1/email/scheduled-messages/lifecycle";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ScheduledMessagesProtocol() {}
    public static String[] paths() { return new String[]{STAGES, SUSPEND, CASE, DEFINITION, WATCHLIST, LIFECYCLE, LIFECYCLE_ONCE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Event(Scope scope, com.raxim.myscoutee.domain.events.dto.EventScheduleDto event, String actor) {}
    public record Suspend(Scope scope, String eventId, String actor) {}
    public record Feedback(Scope scope, com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation.Request closed) {}
    public record Change(Scope scope, String eventId, String title, java.util.Collection<String> audience, java.util.Collection<String> reasons, String actor) {}
    public record LifecycleOnce(String deliveryId, Change change) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto value) {}
    public static boolean valid(Event q) { return q != null && scope(q.scope()) && text(q.actor(),512); }
    public static boolean valid(Suspend q) { return q != null && scope(q.scope()) && text(q.eventId(),512) && text(q.actor(),512); }
    public static boolean valid(Feedback q) { return q != null && scope(q.scope()) && (q.closed() == null || text(q.closed().snapshot(),1024*1024)); }
    public static boolean valid(LifecycleOnce q) { return q != null && q.deliveryId() != null && q.deliveryId().matches("[a-f0-9-]{36}") && valid(q.change()); }
    public static boolean valid(Change q) { return q != null && scope(q.scope()) && text(q.eventId(),512) && text(q.title(),8192) && text(q.actor(),512) && (q.audience()==null || ids(q.audience())) && (q.reasons()==null || q.reasons().size()<=4096 && q.reasons().stream().allMatch(v -> text(v,8192))); }
}
