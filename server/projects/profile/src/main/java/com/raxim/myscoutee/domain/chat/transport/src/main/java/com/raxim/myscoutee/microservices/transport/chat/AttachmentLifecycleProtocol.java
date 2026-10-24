package com.raxim.myscoutee.microservices.transport.chat;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;

public final class AttachmentLifecycleProtocol {
    public static final String PROJECT = "/_internal/v1/chat/attachment-lifecycle/project";
    public static final String EVENT_UNAVAILABLE = "/_internal/v1/chat/attachment-lifecycle/event-unavailable";
    public static final String EVENT_AVAILABLE = "/_internal/v1/chat/attachment-lifecycle/event-available";
    public static final String ASSET_UNAVAILABLE = "/_internal/v1/chat/attachment-lifecycle/asset-unavailable";
    public static final String ASSET_AVAILABLE = "/_internal/v1/chat/attachment-lifecycle/asset-available";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AttachmentLifecycleProtocol() {}
    public static String[] paths() { return new String[]{PROJECT, EVENT_UNAVAILABLE, EVENT_AVAILABLE, ASSET_UNAVAILABLE, ASSET_AVAILABLE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Project(Scope scope, AttachmentLifecycle.Projection projection) {}
    public record Receipt(Boolean completed) {}
    public record Change(Scope scope, String id, String reason) {}
    public static boolean valid(Project q) {
        return q != null && scope(q.scope()) && q.projection() != null && q.projection().type() != null
                && java.util.List.of("asset", "event").contains(q.projection().type())
                && q.projection().entityId() != null && !q.projection().entityId().isBlank()
                && text(q.projection().entityId(), 512) && q.projection().revision() >= 0 && text(q.projection().reason(), 8192);
    }
    public static boolean valid(Change value) { return value != null && scope(value.scope()) && text(value.id(), 512) && text(value.reason(), 8192); }
}
