package com.raxim.myscoutee.microservices.transport.events;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.events.api.AssetMemberships;

public final class AssetMembershipsProtocol {
    public static final String PROMOTE = "/_internal/v1/events/asset-memberships/promote";
    public static final String DELETE = "/_internal/v1/events/asset-memberships/delete";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetMembershipsProtocol() {}
    public static String[] paths() { return new String[]{PROMOTE, DELETE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Promote(Scope scope, com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto current, String assetId, String targetUserId, String actorUserId, String nowIso) {}
    public record Delete(Scope scope, com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto member) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto value) {}
    public static boolean valid(Promote value) { return value != null && scope(value.scope()) && text(value.assetId(), 512) && text(value.targetUserId(), 512) && text(value.actorUserId(), 512) && text(value.nowIso(), 128) && (value.current() == null || "asset".equals(value.current().ownerType()) && java.util.Objects.equals(value.assetId(), value.current().ownerId()) && java.util.Objects.equals(value.targetUserId(), value.current().userId())); }
    public static boolean valid(Delete value) { return value != null && scope(value.scope()) && value.member() != null && "asset".equals(value.member().ownerType()) && value.member().id() != null && !value.member().id().isBlank() && text(value.member().id(), 512); }
}
