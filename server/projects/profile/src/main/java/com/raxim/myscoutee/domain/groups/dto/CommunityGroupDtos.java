package com.raxim.myscoutee.domain.groups.dto;

import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;

import java.util.List;
import java.util.Map;

public final class CommunityGroupDtos {
    private CommunityGroupDtos() {}
    public record Save(String userId, String id, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, GroupPolicy policy, Long version, String groupType) {
    public Save(String userId, String id, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, GroupPolicy policy, Long version) {
        this(userId, id, name, description, imageUrl, category, visibility, hideMembers, policy, version, "dating");
    }
}
    public record Group(String id, String ownerUserId, String ownerName, String ownerAvatarUrl,
            String name, String description, String imageUrl, String category, String visibility,
            boolean hideMembers, GroupPolicy policy, String createdAtIso, String updatedAtIso,
            Long version, String role, String membershipStatus, String requestKind,
            boolean organizerOnly, int acceptedMembers, int pendingMembers, long activity,
            Double distanceKm, String moderationStatus, long moderationPending, long moderationQueueRevision, long membersActivity, String lifecycleStatus, boolean canTakeOver, boolean canRestoreGroup, String groupType) {
    public Group(String id, String ownerUserId, String ownerName, String ownerAvatarUrl,
            String name, String description, String imageUrl, String category, String visibility,
            boolean hideMembers, GroupPolicy policy, String createdAtIso, String updatedAtIso,
            Long version, String role, String membershipStatus, String requestKind,
            boolean organizerOnly, int acceptedMembers, int pendingMembers, long activity,
            Double distanceKm, String moderationStatus, long moderationPending, long moderationQueueRevision, long membersActivity, String lifecycleStatus, boolean canTakeOver, boolean canRestoreGroup) {
        this(id, ownerUserId, ownerName, ownerAvatarUrl, name, description, imageUrl, category, visibility, hideMembers, policy, createdAtIso, updatedAtIso, version, role, membershipStatus, requestKind, organizerOnly, acceptedMembers, pendingMembers, activity, distanceKm, moderationStatus, moderationPending, moderationQueueRevision, membersActivity, lifecycleStatus, canTakeOver, canRestoreGroup, "dating");
    }

        @com.fasterxml.jackson.annotation.JsonProperty
        public String revision() {
            try { return java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256")
                .digest(toString().getBytes(java.nio.charset.StandardCharsets.UTF_8))); }
            catch (java.security.NoSuchAlgorithmException exception) { throw new IllegalStateException(exception); }
        }
    }
    public record Summary(String id, String ownerUserId, String ownerName, String ownerAvatarUrl,
            String name, String imageUrl, String category, String visibility, boolean hideMembers,
            String createdAtIso, String updatedAtIso, Long version, String role, String membershipStatus,
            String requestKind, boolean organizerOnly, int acceptedMembers, int pendingMembers, long activity,
            Double distanceKm, String moderationStatus, String revision, long moderationPending, long moderationQueueRevision, long membersActivity, String lifecycleStatus, boolean canTakeOver, boolean canRestoreGroup, String groupType) {
    public Summary(String id, String ownerUserId, String ownerName, String ownerAvatarUrl,
            String name, String imageUrl, String category, String visibility, boolean hideMembers,
            String createdAtIso, String updatedAtIso, Long version, String role, String membershipStatus,
            String requestKind, boolean organizerOnly, int acceptedMembers, int pendingMembers, long activity,
            Double distanceKm, String moderationStatus, String revision, long moderationPending, long moderationQueueRevision, long membersActivity, String lifecycleStatus, boolean canTakeOver, boolean canRestoreGroup) {
        this(id, ownerUserId, ownerName, ownerAvatarUrl, name, imageUrl, category, visibility, hideMembers, createdAtIso, updatedAtIso, version, role, membershipStatus, requestKind, organizerOnly, acceptedMembers, pendingMembers, activity, distanceKm, moderationStatus, revision, moderationPending, moderationQueueRevision, membersActivity, lifecycleStatus, canTakeOver, canRestoreGroup, "dating");
    }

        public static Summary from(Group group) {
            return new Summary(group.id(), group.ownerUserId(), group.ownerName(), group.ownerAvatarUrl(),
                group.name(), group.imageUrl(), group.category(), group.visibility(), group.hideMembers(),
                group.createdAtIso(), group.updatedAtIso(), group.version(), group.role(), group.membershipStatus(),
                group.requestKind(), group.organizerOnly(), group.acceptedMembers(), group.pendingMembers(), group.activity(),
                group.distanceKm(), group.moderationStatus(), group.revision(), group.moderationPending(), group.moderationQueueRevision(), group.membersActivity(), group.lifecycleStatus(), group.canTakeOver(), group.canRestoreGroup(), group.groupType());
        }
    }
    public record Page(List<Summary> items, long total, String nextCursor, Map<String, Long> context) {}
    public record Workspace(String groupId, String profileId, String name, String role, long activity, GroupPolicy policy,
            long moderationPending, long moderationQueueRevision, String category, String membershipStatus, long membersActivity, String requestKind, String groupType) {
    public Workspace(String groupId, String profileId, String name, String role, long activity, GroupPolicy policy,
            long moderationPending, long moderationQueueRevision, String category, String membershipStatus, long membersActivity, String requestKind) {
        this(groupId, profileId, name, role, activity, policy, moderationPending, moderationQueueRevision, category, membershipStatus, membersActivity, requestKind, "dating");
    }
}
    public record WorkspaceSelection(Workspace workspace, com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto profile, com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto accountProfile) {}
    public record KnownGroup(String id, String revision) {}
    public record SyncRequest(String userId, String bucket, String category, int limit, List<KnownGroup> knownItems, String tailId, String sort) {}
    public record SyncResponse(List<Summary> upserts, List<String> removedIds, long total) {}
    public record Command(String userId, String groupId, String action) {}
    public record Report(String userId, String groupId, String details) {}
}
