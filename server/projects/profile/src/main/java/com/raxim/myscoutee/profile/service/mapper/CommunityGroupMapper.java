package com.raxim.myscoutee.profile.service.mapper;

import java.util.List;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.data.dto.groups.CommunityGroupDtos.Group;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;

public final class CommunityGroupMapper {
    private CommunityGroupMapper() {}
    public static Group toDto(CommunityGroup group, Users owner, Users viewer,
            List<ActivityMember> members, long activity) {
        ActivityMember own = members.stream().filter(m -> viewer.getUserId().equals(m.getUserId())).findFirst().orElse(null);
        boolean admin = own != null && "accepted".equals(own.getStatus()) && "Admin".equals(own.getRole());
        return new Group(group.id(), group.ownerUserId(), owner.getName(), avatar(owner),
                group.name(), group.description(), group.imageUrl(), group.category(), group.visibility(),
                group.hideMembers(), group.policy(), group.createdAtIso(), group.updatedAtIso(), group.version(),
                own == null ? null : own.getRole(), own == null ? null : own.getStatus(),
                own == null ? null : own.getRequestKind(), own != null && Boolean.TRUE.equals(own.getOrganizerOnly()),
                (int)members.stream().filter(m -> "accepted".equals(m.getStatus())).count(),
                admin ? (int)group.pendingMemberCount() : 0,
                activity + membersActivity(group, own) + (admin ? group.pendingModerationCount() : 0), distance(owner, viewer), group.moderationStatus(),
                admin ? group.pendingModerationCount() : 0, admin && group.moderationQueueRevision() != null ? group.moderationQueueRevision() : 0, membersActivity(group, own));
    }
    public static long membersActivity(CommunityGroup group, ActivityMember own) {
        if (own == null || !List.of("accepted", "pending").contains(own.getStatus())) return 0;
        long updates = own.getCommunityUpdates() == null ? 0 : Math.max(0, own.getCommunityUpdates());
        if ("accepted".equals(own.getStatus()) && "Admin".equals(own.getRole())) return updates + group.pendingMemberCount();
        return updates + ("pending".equals(own.getStatus()) && "invite".equals(own.getRequestKind()) ? 1 : 0);
    }
    public static ActivityMemberEntryDto member(ActivityMember m, Users user, String actor) {
        return new ActivityMemberEntryDto(m.getId(), m.getUserId(), user.getName(), user.getInitials(),
                user.getGender(), user.getCity(), "", m.getRole(), m.getStatus(), m.getPendingSource(),
                m.getRequestKind(), m.getInvitedByUserId(), actor.equals(m.getInvitedByUserId()),
                m.getMetAtIso(), m.getActionAtIso(), m.getMetWhere(), avatar(user), null, List.of(),
                m.getUpdatedDate(), null, null, null, null, null, m.getOrganizerOnly());
    }
    private static String avatar(Users user) {
        return user.getImages() == null || user.getImages().isEmpty() ? null : user.getImages().getFirst();
    }
    private static Double distance(Users owner, Users viewer) {
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
