package com.raxim.myscoutee.microservices.transport.content;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class ContentPrivacyProtocol {
    public static final String PURGE_IDEA_POSTS = "/_internal/v1/content/content-privacy/purge-idea-posts";
    public static final String PURGE_FEEDBACK = "/_internal/v1/content/content-privacy/purge-feedback";
    public static final String PURGE_REPORTS = "/_internal/v1/content/content-privacy/purge-reports";
    public static final String PURGE_FEED_VIEWS = "/_internal/v1/content/content-privacy/purge-feed-views";
    public static final String PURGE_SHARE_TOKENS = "/_internal/v1/content/content-privacy/purge-share-tokens";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ContentPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_IDEA_POSTS, PURGE_FEEDBACK, PURGE_REPORTS, PURGE_FEED_VIEWS, PURGE_SHARE_TOKENS}; }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record UserCommand(Scope scope, String userId) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value != null && !value.isBlank() && value.length() <= 512; }
    private static boolean scope(Scope value) {
        return value != null && value.active() != null && (value.groupId() == null || id(value.groupId()))
                && (value.active() || value.groupId() == null);
    }
    public static boolean valid(UserCommand value) { return value != null && scope(value.scope()) && id(value.userId()); }
}
