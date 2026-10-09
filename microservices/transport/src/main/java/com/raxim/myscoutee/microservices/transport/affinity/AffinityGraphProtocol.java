package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.AffinityGraph;

public final class AffinityGraphProtocol {
    public static final String META_1 = "/_internal/v1/affinity/affinity-graph/meta_1";
    public static final String FULL_1 = "/_internal/v1/affinity/affinity-graph/full_1";
    public static final String NEIGHBORHOOD_1 = "/_internal/v1/affinity/affinity-graph/neighborhood_1";
    public static final String FORESTS_1 = "/_internal/v1/affinity/affinity-graph/forests_1";
    public static final String TILE_1 = "/_internal/v1/affinity/affinity-graph/tile_1";
    public static final String REBUILDLAYOUT_1 = "/_internal/v1/affinity/affinity-graph/rebuildlayout_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "affinity:affinity-graph";
    public static boolean delegated(String path) { return java.util.Set.of(META_1, FULL_1, NEIGHBORHOOD_1, FORESTS_1, TILE_1, REBUILDLAYOUT_1).contains(path); }
    private AffinityGraphProtocol() {}
    public static String[] paths() { return new String[]{META_1, FULL_1, NEIGHBORHOOD_1, FORESTS_1, TILE_1, REBUILDLAYOUT_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Meta1(Scope scope, String adminUserId, Double minWeight, Double maxWeight) {}
    public static boolean valid(Meta1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record Full1(Scope scope, String adminUserId, Double minWeight, Double maxWeight) {}
    public static boolean valid(Full1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record Neighborhood1(Scope scope, String adminUserId, String userId, Integer depth, Double minWeight, Double maxWeight) {}
    public static boolean valid(Neighborhood1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.userId(),8192); }
    public record Forests1(Scope scope, String adminUserId, Double minWeight, Double maxWeight, Integer forestLevel, Integer limit, Integer offset) {}
    public static boolean valid(Forests1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record Tile1(Scope scope, String adminUserId, String layoutVersion, Integer z, Integer x, Integer y, Double minWeight, Double maxWeight, String componentId) {}
    public static boolean valid(Tile1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.layoutVersion(),8192) && text(q.componentId(),8192); }
    public record RebuildLayout1(Scope scope, String adminUserId) {}
    public static boolean valid(RebuildLayout1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
}
