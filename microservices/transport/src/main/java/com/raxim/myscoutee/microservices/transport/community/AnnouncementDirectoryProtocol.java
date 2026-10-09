package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.AnnouncementDirectory;

public final class AnnouncementDirectoryProtocol {
    public static final String FIND = "/_internal/v1/community/announcement-directory/find";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AnnouncementDirectoryProtocol() {}
    public static String[] paths() { return new String[]{FIND}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Query(Scope scope, String id) {}
    public record Result(Boolean resolved, AnnouncementDirectory.Announcement value) {}
    public static boolean valid(Query value) { return value != null && scope(value.scope()) && text(value.id(), 512); }
}
