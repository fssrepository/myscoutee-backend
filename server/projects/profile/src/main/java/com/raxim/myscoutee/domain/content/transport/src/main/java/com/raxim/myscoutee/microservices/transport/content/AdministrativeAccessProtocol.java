package com.raxim.myscoutee.microservices.transport.content;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;

public final class AdministrativeAccessProtocol {
    public static final String DASHBOARD_1 = "/_internal/v1/content/administrative-access/dashboard_1";
    public static final String DASHBOARD_2 = "/_internal/v1/content/administrative-access/dashboard_2";
    public static final String WARN_1 = "/_internal/v1/content/administrative-access/warn_1";
    public static final String BLOCK_1 = "/_internal/v1/content/administrative-access/block_1";
    public static final String UNBLOCK_1 = "/_internal/v1/content/administrative-access/unblock_1";
    public static final String RESOLVEREPORT_1 = "/_internal/v1/content/administrative-access/resolvereport_1";
    public static final String RESOLVEFEEDBACK_1 = "/_internal/v1/content/administrative-access/resolvefeedback_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "content:administrative-access";
    public static boolean delegated(String path) { return java.util.Set.of(DASHBOARD_1, DASHBOARD_2, WARN_1, BLOCK_1, UNBLOCK_1, RESOLVEREPORT_1, RESOLVEFEEDBACK_1).contains(path); }
    private AdministrativeAccessProtocol() {}
    public static String[] paths() { return new String[]{DASHBOARD_1, DASHBOARD_2, WARN_1, BLOCK_1, UNBLOCK_1, RESOLVEREPORT_1, RESOLVEFEEDBACK_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Dashboard1(Scope scope, String adminUserId) {}
    public static boolean valid(Dashboard1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record Dashboard2(Scope scope, String adminUserId, String reportsStatus, String feedbackStatus) {}
    public static boolean valid(Dashboard2 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.reportsStatus(),8192) && text(q.feedbackStatus(),8192); }
    public record Warn1(Scope scope, String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {}
    public static boolean valid(Warn1 q) { return q!=null && scope(q.scope()) && text(q.userId(),8192); }
    public record Block1(Scope scope, String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {}
    public static boolean valid(Block1 q) { return q!=null && scope(q.scope()) && text(q.userId(),8192); }
    public record Unblock1(Scope scope, String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {}
    public static boolean valid(Unblock1 q) { return q!=null && scope(q.scope()) && text(q.userId(),8192); }
    public record ResolveReport1(Scope scope, String reportId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto request) {}
    public static boolean valid(ResolveReport1 q) { return q!=null && scope(q.scope()) && text(q.reportId(),8192); }
    public record ResolveFeedback1(Scope scope, String feedbackId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto request) {}
    public static boolean valid(ResolveFeedback1 q) { return q!=null && scope(q.scope()) && text(q.feedbackId(),8192); }
}
