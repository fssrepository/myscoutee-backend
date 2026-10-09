package com.raxim.myscoutee.microservices.transport.assets;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class AssetPrivacyProtocol {
    public static final String PURGE_REMAINING_ASSET_REQUESTS = "/_internal/v1/assets/asset-privacy/purge-remaining-asset-requests";
    public static final String PURGE_OWNED_MEDIA = "/_internal/v1/assets/asset-privacy/purge-owned-media";
    public static final String DELETE_OWNED_RECORDS = "/_internal/v1/assets/asset-privacy/delete-owned-records";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_REMAINING_ASSET_REQUESTS, PURGE_OWNED_MEDIA, DELETE_OWNED_RECORDS}; }
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
    public record IdsCommand(Scope scope, Collection<String> ids) {}
    private static boolean ids(Collection<String> value) { return value != null && value.size() <= 4096 && value.stream().allMatch(AssetPrivacyProtocol::id); }
    public static boolean valid(IdsCommand value) { return value != null && scope(value.scope()) && ids(value.ids()); }
}
