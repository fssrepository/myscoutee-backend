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
            Double distanceKm) {}
    public record Page(List<Group> items, long total, String nextCursor, Map<String, Long> context) {}
    public record Workspace(String groupId, String profileId, String name, String role, long activity, Policy policy) {}
    public record WorkspaceSelection(Workspace workspace, com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto profile) {}
    public record SelectWorkspace(String userId, String groupId) {}
    public record Command(String userId, String groupId, String action) {}
}
