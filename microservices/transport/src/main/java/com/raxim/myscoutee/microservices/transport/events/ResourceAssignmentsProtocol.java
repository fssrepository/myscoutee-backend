package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.ResourceAssignments;

public final class ResourceAssignmentsProtocol {
    public static final String MANAGER = "/_internal/v1/events/resource-assignments/manager";
    public static final String REMOVE_SCOPED = "/_internal/v1/events/resource-assignments/remove-scoped";
    public static final String TRANSFER = "/_internal/v1/events/resource-assignments/transfer";
    public static final String REMOVE = "/_internal/v1/events/resource-assignments/remove";
    public static final String REFRESH = "/_internal/v1/events/resource-assignments/refresh";
    public static final String CANCEL_BORROW = "/_internal/v1/events/resource-assignments/cancel-borrow";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ResourceAssignmentsProtocol() {}
    public static String[] paths() { return new String[]{MANAGER, REMOVE_SCOPED, TRANSFER, REMOVE, REFRESH, CANCEL_BORROW}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Query(Scope scope, String ownerId, String subEventId, String assetId) {}
    public record ScopedChange(Scope scope, String ownerId, String subEventId, String assetId, String expectedManager, String actor) {}
    public record Remove(Scope scope, String assetId, String actor) {}
    public record Refresh(Scope scope, String ownerId, String subEventId, String actor) {}
    public record Manager(Boolean resolved, String userId) {}
    public record Changed(Boolean changed) {}
    private static boolean strings(String... values) { return java.util.Arrays.stream(values).allMatch(v -> text(v, 512)); }
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && strings(q.ownerId(), q.subEventId(), q.assetId()); }
    public static boolean valid(ScopedChange q) { return q != null && scope(q.scope()) && strings(q.ownerId(), q.subEventId(), q.assetId(), q.expectedManager(), q.actor()); }
    public static boolean valid(Remove q) { return q != null && scope(q.scope()) && strings(q.assetId(), q.actor()); }
    public static boolean valid(Refresh q) { return q != null && scope(q.scope()) && strings(q.ownerId(), q.subEventId(), q.actor()); }
}
