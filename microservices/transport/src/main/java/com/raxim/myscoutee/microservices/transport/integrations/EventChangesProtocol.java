package com.raxim.myscoutee.microservices.transport.integrations;

import com.raxim.myscoutee.domain.integrations.api.EventChanges;

public final class EventChangesProtocol {
    public static final String EVENT = "/_internal/v1/integrations/event-changes/event";
    public static final String MEMBER = "/_internal/v1/integrations/event-changes/member";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventChangesProtocol() {}
    public static String[] paths() { return new String[]{EVENT, MEMBER}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record EventChange(Scope scope, com.raxim.myscoutee.domain.events.dto.EventChangeDto event) {}
    public record MemberChange(Scope scope, com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto member) {}
    public static boolean valid(EventChange value) { return value != null && scope(value.scope()); }
    public static boolean valid(MemberChange value) { return value != null && scope(value.scope()); }
}
