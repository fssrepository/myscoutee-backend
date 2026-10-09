package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetModerationDetails;

public final class AssetModerationDetailsProtocol {
    public static final String DETAIL = "/_internal/v1/assets/asset-moderation-details/detail";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetModerationDetailsProtocol() {}
    public static String[] paths() { return new String[]{DETAIL}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Query(Scope scope, String assetId) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto value) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && text(q.assetId(),512); }
}
