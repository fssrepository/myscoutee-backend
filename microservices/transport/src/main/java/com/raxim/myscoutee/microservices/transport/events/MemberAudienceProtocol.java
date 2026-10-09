package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.MemberAudience;

public final class MemberAudienceProtocol {
    public static final String QUERY = "/_internal/v1/events/member-audience/query";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private MemberAudienceProtocol() {}
    public static String[] paths() { return new String[]{QUERY}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Query(Scope scope, String ownerType, String ownerId) {}
    public record Result(Boolean resolved, MemberAudience.Audience value) {}
    public static boolean valid(Query value) { return value != null && scope(value.scope()) && text(value.ownerType(), 64) && text(value.ownerId(), 512); }
}
