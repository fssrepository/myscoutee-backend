package com.raxim.myscoutee.microservices.transport.notifications;

import com.raxim.myscoutee.domain.notifications.api.RoleNotifications.MemberRegistration;

public final class RoleNotificationsProtocol {
    public static final String RELEASE = "/_internal/v1/notifications/roles/release";
    public static final String MEMBER = "/_internal/v1/notifications/roles/member";
    public static final String MODERATION = "/_internal/v1/notifications/roles/moderation";
    public static final int MAX_REQUEST_BYTES = 8192;
    private RoleNotificationsProtocol() {}
    public record Release(String version) {}
    public record Member(MemberRegistration member) {}
    public record Moderation(String kind, String submissionId) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{RELEASE,MEMBER,MODERATION}; }
    public static boolean bounded(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(MemberRegistration member) {
        return member == null || bounded(member.userId()) && (member.email() == null || member.email().length() <= 320);
    }
    public static boolean kind(String value) { return "report-submitted".equals(value) || "feedback-submitted".equals(value); }
}
