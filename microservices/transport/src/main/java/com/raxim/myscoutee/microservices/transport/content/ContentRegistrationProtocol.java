package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.ContentRegistration;

public final class ContentRegistrationProtocol {
    public static final String SNAPSHOT = "/_internal/v1/content/content-registration/snapshot";
    public static final String REGISTER = "/_internal/v1/content/content-registration/register";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ContentRegistrationProtocol() {}
    public static String[] paths() { return new String[]{SNAPSHOT, REGISTER}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Query(Scope scope) {}
    public record Register(Scope scope, String category, String sourceId, String ownerId, String title, String imageUrl) {}
    public static boolean valid(Query value) { return value != null && scope(value.scope()); }
    public static boolean valid(Register value) { return value != null && scope(value.scope()) && value.category() != null && java.util.Set.of("asset", "event", "feed", "group").contains(value.category()) && text(value.sourceId(), 512) && text(value.ownerId(), 512) && text(value.title(), 8192) && text(value.imageUrl(), 24576); }
}
