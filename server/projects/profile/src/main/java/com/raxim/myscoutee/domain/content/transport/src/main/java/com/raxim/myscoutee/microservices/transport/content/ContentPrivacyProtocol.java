package com.raxim.myscoutee.microservices.transport.content;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class ContentPrivacyProtocol {
    public static final String PURGE_IDEA_POSTS = "/_internal/v1/content/content-privacy/purge-idea-posts";
    public static final String PURGE_FEEDBACK = "/_internal/v1/content/content-privacy/purge-feedback";
    public static final String PURGE_REPORTS = "/_internal/v1/content/content-privacy/purge-reports";
    public static final String PURGE_FEED_VIEWS = "/_internal/v1/content/content-privacy/purge-feed-views";
    public static final String PURGE_SHARE_TOKENS = "/_internal/v1/content/content-privacy/purge-share-tokens";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ContentPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_IDEA_POSTS, PURGE_FEEDBACK, PURGE_REPORTS, PURGE_FEED_VIEWS, PURGE_SHARE_TOKENS}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
