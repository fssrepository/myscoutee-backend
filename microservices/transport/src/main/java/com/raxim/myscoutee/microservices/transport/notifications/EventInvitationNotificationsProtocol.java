package com.raxim.myscoutee.microservices.transport.notifications;

import com.raxim.myscoutee.domain.notifications.api.EventInvitationNotifications;

public final class EventInvitationNotificationsProtocol {
    public static final String RESOLVE = "/_internal/v1/notifications/event-invitation-notifications/resolve";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventInvitationNotificationsProtocol() {}
    public static String[] paths() { return new String[]{RESOLVE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Resolve(Scope scope, String userId, String eventId) {}
    public record Count(Integer value) {}
    public static boolean valid(Resolve q) { return q != null && scope(q.scope()) && text(q.userId(),512) && text(q.eventId(),512); }
}
