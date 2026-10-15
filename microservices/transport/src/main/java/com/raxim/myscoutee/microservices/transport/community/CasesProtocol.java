package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.Cases;

public final class CasesProtocol {
    public static final String ACTOR_1 = "/_internal/v1/community/cases/actor_1";
    public static final String DETAIL_1 = "/_internal/v1/community/cases/detail_1";
    public static final String READ_1 = "/_internal/v1/community/cases/read_1";
    public static final String PAGE_1 = "/_internal/v1/community/cases/page_1";
    public static final String SAVE_1 = "/_internal/v1/community/cases/save_1";
    public static final String ACTION_1 = "/_internal/v1/community/cases/action_1";
    public static final String FEEDBACK_CONTEXT = "/_internal/v1/community/cases/feedbackContext";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "community:cases";
    public static boolean delegated(String path) { return java.util.Set.of(ACTOR_1, DETAIL_1, READ_1, PAGE_1, SAVE_1, ACTION_1).contains(path); }
    private CasesProtocol() {}
    public static String[] paths() { return new String[]{FEEDBACK_CONTEXT, ACTOR_1, DETAIL_1, READ_1, PAGE_1, SAVE_1, ACTION_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Actor1(Scope scope, String id) {}
    public static boolean valid(Actor1 q) { return q!=null && scope(q.scope()) && text(q.id(),8192); }
    public record Actor1Result(Boolean resolved, String value) {}
    public record Detail1(Scope scope, String actor, String id) {}
    public static boolean valid(Detail1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.id(),8192); }
    public record Detail1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem value) {}
    public record Read1(Scope scope, String actor, String id) {}
    public static boolean valid(Read1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.id(),8192); }
    public record Read1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem value) {}
    public record Page1(Scope scope, String actor, String status, String type, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int size, String cursor) {}
    public static boolean valid(Page1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.status(),8192) && text(q.type(),8192) && text(q.cursor(),8192); }
    public record Page1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Page<com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem> value) {}
    public record Save1(Scope scope, String actor, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveCase r) {}
    public static boolean valid(Save1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192); }
    public record Save1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem value) {}
    public record Action1(Scope scope, String actor, String id, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command r) {}
    public static boolean valid(Action1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.id(),8192); }
    public record Action1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem value) {}
    public record FeedbackContext(Scope scope, String snapshot) {}
    public static boolean valid(FeedbackContext q) { return q != null && scope(q.scope()) && q.snapshot() != null && text(q.snapshot(), 1048576); }
    public record FeedbackContextResult(Boolean resolved, com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation.Context value) {}
}
