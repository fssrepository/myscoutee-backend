package com.raxim.myscoutee.microservices.transport.notifications;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.notifications.api.NotificationAdministration;

public final class NotificationAdministrationProtocol {
    public static final String STATE_1 = "/_internal/v1/notifications/notification-administration/state_1";
    public static final String RULESTATE_1 = "/_internal/v1/notifications/notification-administration/rulestate_1";
    public static final String SAVE_1 = "/_internal/v1/notifications/notification-administration/save_1";
    public static final String RUN_1 = "/_internal/v1/notifications/notification-administration/run_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "notifications:notification-administration";
    public static boolean delegated(String path) { return java.util.Set.of(STATE_1, RULESTATE_1, SAVE_1, RUN_1).contains(path); }
    private NotificationAdministrationProtocol() {}
    public static String[] paths() { return new String[]{STATE_1, RULESTATE_1, SAVE_1, RUN_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record State1(Scope scope, String adminUserId, String filter) {}
    public static boolean valid(State1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.filter(),8192); }
    public record RuleState1(Scope scope, String ruleKey, String adminUserId) {}
    public static boolean valid(RuleState1 q) { return q!=null && scope(q.scope()) && text(q.ruleKey(),8192) && text(q.adminUserId(),8192); }
    public record Save1(Scope scope, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleSaveRequestDto request, String filter) {}
    public static boolean valid(Save1 q) { return q!=null && scope(q.scope()) && text(q.filter(),8192); }
    public record Run1(Scope scope, String ruleKey, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunRequestDto request) {}
    public static boolean valid(Run1 q) { return q!=null && scope(q.scope()) && text(q.ruleKey(),8192); }
}
