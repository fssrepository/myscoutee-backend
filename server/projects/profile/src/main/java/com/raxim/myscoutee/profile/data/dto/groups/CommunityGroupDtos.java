package com.raxim.myscoutee.profile.data.dto.groups;

import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.profile.data.document.CommunityGroup.Policy;

public final class CommunityGroupDtos {
    private CommunityGroupDtos() {}
    public record Save(String userId, String id, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, Policy policy, Long version) {}
    public record Group(String id, String ownerUserId, String ownerName, String ownerAvatarUrl,
            String name, String description, String imageUrl, String category, String visibility,
            boolean hideMembers, Policy policy, String createdAtIso, String updatedAtIso,
            Long version, String role, String membershipStatus, String requestKind,
            boolean organizerOnly, int acceptedMembers, int pendingMembers, long activity,
            Double distanceKm) {
        @com.fasterxml.jackson.annotation.JsonProperty
        public String revision() {
            try { return java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256")
                .digest(toString().getBytes(java.nio.charset.StandardCharsets.UTF_8))); }
            catch (java.security.NoSuchAlgorithmException exception) { throw new IllegalStateException(exception); }
        }
    }
    public record Page(List<Group> items, long total, String nextCursor, Map<String, Long> context) {}
    public record Workspace(String groupId, String profileId, String name, String role, long activity, Policy policy) {}
    public record WorkspaceSelection(Workspace workspace, com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto profile) {}
    public record SelectWorkspace(String userId, String groupId) {}
    public record KnownGroup(String id, String revision) {}
    public record SyncRequest(String userId, String bucket, String category, int limit, List<KnownGroup> knownItems, String tailId) {}
    public record SyncResponse(List<Group> upserts, List<String> removedIds, long total) {}
    public record Command(String userId, String groupId, String action) {}
}
