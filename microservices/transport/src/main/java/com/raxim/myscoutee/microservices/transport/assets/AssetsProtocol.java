package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.Assets;

public final class AssetsProtocol {
    public static final String MANAGE = "/_internal/v1/assets/assets/manage";
    public static final String FIND = "/_internal/v1/assets/assets/find";
    public static final String SCOPED = "/_internal/v1/assets/assets/scoped";
    public static final String DETAIL = "/_internal/v1/assets/assets/detail";
    public static final String ASSIGNABLE = "/_internal/v1/assets/assets/assignable";
    public static final String REFERENCED = "/_internal/v1/assets/assets/referenced";
    public static final String PAGE = "/_internal/v1/assets/assets/page";
    public static final String DELETE_SCOPE = "/_internal/v1/assets/assets/delete_scope";
    public static final String DELETE_USERS = "/_internal/v1/assets/assets/delete_users";
    public static final String MEMBERS = "/_internal/v1/assets/assets/members";
    public static final String ENTRIES = "/_internal/v1/assets/assets/entries";
    public static final String UPSERT = "/_internal/v1/assets/assets/upsert";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "assets:assets";
    public static boolean delegated(String path) { return java.util.Set.of(MANAGE, DETAIL, ASSIGNABLE, PAGE, UPSERT).contains(path); }
    private AssetsProtocol() {}
    public static String[] paths() { return new String[]{MANAGE, FIND, SCOPED, DETAIL, ASSIGNABLE, REFERENCED, PAGE, DELETE_SCOPE, DELETE_USERS, MEMBERS, ENTRIES, UPSERT}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Query(Scope scope, String userId, String assetId, String eventId, String subEventId, String status, String requestId) {}
    public record Batch(Scope scope, String userId, String eventId, String subEventId, java.util.Collection<String> ids) {}
    public record Page(Scope scope, String userId, String type, String category, String start, String end, Integer page, Integer size, String cursor, String order) {}
    public record DeleteScope(Scope scope, String ownerUserId, java.util.Collection<String> ids, String ownerId, String eventId, String subEventId, String actor, String deletedAt) {}
    public record DeleteUsers(Scope scope, java.util.Collection<String> ids, java.util.Collection<String> users, String eventId, String actor, String deletedAt) {}
    public record Members(Scope scope, String assetId, java.util.List<com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto> members) {}
    public record Entries(Scope scope, String assetId, String eventId, String subEventId, java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto> members, String actor) {}
    public record Save(Scope scope, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto request) {}
    public record Decision(Boolean value) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto value) {}
    public record Detail(Boolean resolved, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto value) {}
    public record Saved(Boolean resolved, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDto value) {}
    public record Status(Boolean resolved, String value) {}
    public static boolean valid(Query q) { return q!=null && scope(q.scope()) && java.util.Arrays.asList(q.userId(),q.assetId(),q.eventId(),q.subEventId(),q.status(),q.requestId()).stream().allMatch(v -> text(v,512)); }
    public static boolean valid(Batch q) { return q!=null && scope(q.scope()) && text(q.userId(),512) && text(q.eventId(),512) && text(q.subEventId(),512) && ids(q.ids()); }
    public static boolean valid(Page q) { return q!=null && scope(q.scope()) && java.util.Arrays.asList(q.userId(),q.type(),q.category(),q.start(),q.end(),q.cursor(),q.order()).stream().allMatch(v -> text(v,8192)); }
    public static boolean valid(DeleteScope q) { return q!=null && scope(q.scope()) && ids(q.ids()) && java.util.Arrays.asList(q.ownerUserId(),q.ownerId(),q.eventId(),q.subEventId(),q.actor(),q.deletedAt()).stream().allMatch(v -> text(v,512)); }
    public static boolean valid(DeleteUsers q) { return q!=null && scope(q.scope()) && ids(q.ids()) && ids(q.users()) && text(q.eventId(),512) && text(q.actor(),512) && text(q.deletedAt(),512); }
    public static boolean valid(Members q) { return q!=null && scope(q.scope()) && text(q.assetId(),512) && (q.members()==null || q.members().size()<=4096); }
    public static boolean valid(Entries q) { return q!=null && scope(q.scope()) && text(q.assetId(),512) && text(q.eventId(),512) && text(q.subEventId(),512) && text(q.actor(),512) && (q.members()==null || q.members().size()<=4096); }
    public static boolean valid(Save q) { return q!=null && scope(q.scope()) && q.request()!=null && text(q.request().userId(),512); }
}
