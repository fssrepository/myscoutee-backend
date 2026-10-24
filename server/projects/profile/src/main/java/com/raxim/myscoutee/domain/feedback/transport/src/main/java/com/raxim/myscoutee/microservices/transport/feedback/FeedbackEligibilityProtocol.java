package com.raxim.myscoutee.microservices.transport.feedback;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility;

public final class FeedbackEligibilityProtocol {
    public static final String PROJECT = "/_internal/v1/feedback/feedback-eligibility/project";
    public static final String COMPLETE = "/_internal/v1/feedback/feedback-eligibility/complete";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private FeedbackEligibilityProtocol() {}
    public static String[] paths() { return new String[]{PROJECT, COMPLETE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Project(Scope scope, java.util.Collection<String> ids, java.time.Instant now) {}
    public record Complete(Scope scope, com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility.Projection projection) {}
    public static boolean valid(Project q) { return q!=null && scope(q.scope()) && ids(q.ids()) && q.now()!=null; }
    public static boolean valid(Complete q) { return q!=null && scope(q.scope()) && q.projection()!=null && q.projection().deltas()!=null && q.projection().deltas().size()<=4096 && q.projection().changes()!=null && q.projection().changes().size()<=4096 && q.projection().changes().stream().allMatch(c -> c!=null && c.id()!=null && c.id().matches("[a-f0-9]{32}") && c.deltas()!=null && c.deltas().size()<=4096) && ids(q.projection().projectedSources()) && ids(q.projection().waitingSources()); }
}
