package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.IdeaAdministration;

public final class IdeaAdministrationProtocol {
    public static final String ADMINPOSTS_1 = "/_internal/v1/content/idea-administration/adminposts_1";
    public static final String ADMINPOSTS_2 = "/_internal/v1/content/idea-administration/adminposts_2";
    public static final String ADMINPOSTSPAGE_1 = "/_internal/v1/content/idea-administration/adminpostspage_1";
    public static final String SAVEPOST_1 = "/_internal/v1/content/idea-administration/savepost_1";
    public static final String DELETEPOST_1 = "/_internal/v1/content/idea-administration/deletepost_1";
    public static final String RESTOREPOST_1 = "/_internal/v1/content/idea-administration/restorepost_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "content:idea-administration";
    public static boolean delegated(String path) { return java.util.Set.of(ADMINPOSTS_1, ADMINPOSTS_2, ADMINPOSTSPAGE_1, SAVEPOST_1, DELETEPOST_1, RESTOREPOST_1).contains(path); }
    private IdeaAdministrationProtocol() {}
    public static String[] paths() { return new String[]{ADMINPOSTS_1, ADMINPOSTS_2, ADMINPOSTSPAGE_1, SAVEPOST_1, DELETEPOST_1, RESTOREPOST_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record AdminPosts1(Scope scope, String adminUserId) {}
    public static boolean valid(AdminPosts1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record AdminPosts2(Scope scope, String adminUserId, String lang) {}
    public static boolean valid(AdminPosts2 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.lang(),8192); }
    public record AdminPostsPage1(Scope scope, String adminUserId, String lang, String status, Integer pageSize, String cursor) {}
    public static boolean valid(AdminPostsPage1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.lang(),8192) && text(q.status(),8192) && text(q.cursor(),8192); }
    public record SavePost1(Scope scope, com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostSaveRequestDto request) {}
    public static boolean valid(SavePost1 q) { return q!=null && scope(q.scope()); }
    public record DeletePost1(Scope scope, String postId, com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto request) {}
    public static boolean valid(DeletePost1 q) { return q!=null && scope(q.scope()) && text(q.postId(),8192); }
    public record RestorePost1(Scope scope, String postId, com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto request) {}
    public static boolean valid(RestorePost1 q) { return q!=null && scope(q.scope()) && text(q.postId(),8192); }
}
