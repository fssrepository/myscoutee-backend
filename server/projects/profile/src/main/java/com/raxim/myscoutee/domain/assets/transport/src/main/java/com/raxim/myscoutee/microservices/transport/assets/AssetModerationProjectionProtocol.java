package com.raxim.myscoutee.microservices.transport.assets;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.assets.api.AssetModerationProjection;

public final class AssetModerationProjectionProtocol {
    public static final String APPLY = "/_internal/v1/assets/asset-moderation-projection/apply";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetModerationProjectionProtocol() {}
    public static String[] paths() { return new String[]{APPLY}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Change(Scope scope, String sourceId, Long version, String status) {}
    public static boolean valid(Change q) { return q != null && scope(q.scope()) && q.version()!=null && text(q.sourceId(),512) && text(q.status(),128); }
}
