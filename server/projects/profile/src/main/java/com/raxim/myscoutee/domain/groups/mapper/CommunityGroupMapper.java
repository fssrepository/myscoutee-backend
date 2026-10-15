package com.raxim.myscoutee.domain.groups.mapper;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;

import java.util.List;

import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Group;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;

public final class CommunityGroupMapper {
    private CommunityGroupMapper() {}
    public static String membershipBucket(String role, String status, String requestKind) {
        if ("deleted".equals(status) || "blocked".equals(status)) return "trash";
        if ("accepted".equals(status) && "Admin".equals(role)) return "hosting";
        if ("pending".equals(status) && "invite".equals(requestKind)) return "invitations";
        if ("pending".equals(status)) return "pending";
        return "accepted".equals(status) ? "participation" : "explore";
    }
    public static Group toDto(CommunityGroup group, DiscoveryProfile owner, DiscoveryProfile viewer,
            List<CommunityMember> members, long activity) {
        return toDto(group, owner, viewer, members, activity, java.util.Map.of());
    }
    public static Group toDto(CommunityGroup group, DiscoveryProfile owner, DiscoveryProfile viewer,
            List<CommunityMember> members, long activity, java.util.Map<String, Integer> menuCounters) {
        CommunityMember own = members.stream().filter(m -> viewer.getUserId().equals(m.getUserId()) && (List.of("accepted", "pending").contains(m.getStatus()) || restorableMembership(m))).findFirst().orElse(null);
        boolean admin = own != null && "accepted".equals(own.getStatus()) && "Admin".equals(own.getRole());
        return new Group(group.id(), group.ownerUserId(), owner.getName(), avatar(owner),
                group.name(), group.description(), group.imageUrl(), group.category(), group.visibility(),
                group.hideMembers(), group.policy(), group.createdAtIso(), group.updatedAtIso(), group.version(),
                own == null ? null : own.getRole(), own == null ? null : own.getStatus(),
                own == null ? null : own.getRequestKind(), own != null && Boolean.TRUE.equals(own.getOrganizerOnly()),
                (int)members.stream().filter(m -> "accepted".equals(m.getStatus())).count(),
                (int)pendingMembers(group, own),
                (own != null && "accepted".equals(own.getStatus()) ? activity : 0) + membersActivity(group, own)
                    + (admin ? group.pendingModerationCount() : 0), distance(owner, viewer), group.moderationStatus(),
                admin ? group.pendingModerationCount() : 0, admin && group.moderationQueueRevision() != null ? group.moderationQueueRevision() : 0, membersActivity(group, own), group.lifecycleStatus(), canTakeOver(group, members, own), canRestoreGroup(group, own), group.effectiveType(), menuCounters);
    }
    public static boolean restorableMembership(CommunityMember member) {
        return member != null && ("blocked".equals(member.getStatus()) || "deleted".equals(member.getStatus()) && member.getRequestKind() == null
            && "remove".equals(member.getCommunityAction()) && member.getUserId().equals(member.getCommunityActor()));
    }
    public static boolean canRestoreGroup(CommunityGroup group, CommunityMember own) {
        return group.deleted() && restorableMembership(own) && "Admin".equals(own.getRole())
            && "deleted".equals(own.getStatus());
    }
    public static boolean canTakeOver(CommunityGroup group, List<CommunityMember> members, CommunityMember own) {
        return group.awaitingOwner() && own != null && "accepted".equals(own.getStatus())
            && ("Admin".equals(own.getRole()) || members.stream().noneMatch(m -> "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole())));
    }
    public static long membersActivity(CommunityGroup group, CommunityMember own) {
        if (own == null || !List.of("accepted", "pending").contains(own.getStatus())) return 0;
        long updates = own.getCommunityUpdates() == null ? 0 : Math.max(0, own.getCommunityUpdates());
        return updates + pendingMembers(group, own);
    }
    private static long pendingMembers(CommunityGroup group, CommunityMember own) {
        if (own == null) return 0;
        if ("accepted".equals(own.getStatus()) && "Admin".equals(own.getRole())) return group.pendingMemberCount();
        return "pending".equals(own.getStatus()) && "invite".equals(own.getRequestKind()) ? 1 : 0;
    }
    public static ActivityMemberEntryDto member(CommunityMember m, DiscoveryProfile user, String actor) {
        return new ActivityMemberEntryDto(m.getId(), m.getUserId(), user.getName(), user.getInitials(),
                user.getGender(), user.getCity(), "", m.getRole(), m.getStatus(), m.getPendingSource(),
                m.getRequestKind(), m.getInvitedByUserId(), actor.equals(m.getInvitedByUserId()),
                m.getMetAtIso(), m.getActionAtIso(), m.getMetWhere(), avatar(user), null, List.of(),
                m.getUpdatedDate(), null, null, null, null, m.getManagerGrantedByUserId(), m.getOrganizerOnly(), m.getVotingEligible());
    }
    private static String avatar(DiscoveryProfile user) {
        return user.getImages() == null || user.getImages().isEmpty() ? null : user.getImages().getFirst();
    }
    private static Double distance(DiscoveryProfile owner, DiscoveryProfile viewer) {
        var a = owner.getLocationCoordinates(); var b = viewer.getLocationCoordinates();
        if (a == null || b == null || a.latitude() == null || a.longitude() == null
                || b.latitude() == null || b.longitude() == null) return null;
        double lat = Math.toRadians(b.latitude() - a.latitude());
        double lon = Math.toRadians(b.longitude() - a.longitude());
        double h = Math.pow(Math.sin(lat / 2), 2) + Math.cos(Math.toRadians(a.latitude()))
                * Math.cos(Math.toRadians(b.latitude())) * Math.pow(Math.sin(lon / 2), 2);
        return Math.round(6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h))) * 10.0) / 10.0;
    }
}
