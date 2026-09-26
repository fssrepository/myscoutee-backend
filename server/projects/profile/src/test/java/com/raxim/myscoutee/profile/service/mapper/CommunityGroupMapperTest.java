package com.raxim.myscoutee.profile.service.mapper;

import java.util.List;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.profile.data.document.*;
import static org.junit.jupiter.api.Assertions.*;

class CommunityGroupMapperTest {
    @Test void pendingRequestsAndUnreadChangesAreOperationsNotGroupOrRosterCounts() {
        var group = groupWithPendingMembers(3);
        var owner = new Users(); owner.setUserId("owner");
        var admin = member("Admin", "accepted", null, 2);
        var dto = CommunityGroupMapper.toDto(group, owner, owner, List.of(admin), 0);
        assertEquals(3, dto.pendingMembers());
        assertEquals(5, dto.membersActivity());
        assertEquals(5, dto.activity());
        // Deliberately no pending rows in this limited roster: the canonical write-side counter wins.
        var ordinary = member("Member", "accepted", null, 2);
        var memberDto = CommunityGroupMapper.toDto(group, owner, owner, List.of(ordinary), 0);
        assertEquals(0, memberDto.pendingMembers());
        assertEquals(2, memberDto.membersActivity());
    }

    @Test void invitationsCountForTheirRecipientButOwnJoinRequestsAndExploreDoNot() {
        var group = groupWithPendingMembers(3);
        assertEquals(1, CommunityGroupMapper.membersActivity(group, member("Member", "pending", "invite", 0)));
        assertEquals(0, CommunityGroupMapper.membersActivity(group, member("Member", "pending", "join", 0)));
        assertEquals(0, CommunityGroupMapper.membersActivity(group, null));
        assertEquals(0, CommunityGroupMapper.membersActivity(group, member("Member", "deleted", null, 4)));
    }

    @Test void retainedProfileCountersDoNotAppearInExploreOrPendingInvitations() {
        var group = groupWithPendingMembers(3);
        var viewer = new Users(); viewer.setUserId("owner");
        assertEquals(0, CommunityGroupMapper.toDto(group, viewer, viewer, List.of(), 7).activity());
        var pending = member("Member", "pending", "invite", 0);
        assertEquals(1, CommunityGroupMapper.toDto(group, viewer, viewer, List.of(pending), 7).activity());
    }

    private CommunityGroup groupWithPendingMembers(long pending) {
        return new CommunityGroup("A", "owner", "Group", "", "", "friends", "public", false,
                new CommunityGroup.Policy(true, false, List.of()), "now", "now", 1L, "accepted", 1L, 0L, 0L, pending);
    }

    private ActivityMember member(String role, String status, String request, long updates) {
        var member = new ActivityMember(); member.setUserId("owner"); member.setRole(role);
        member.setStatus(status); member.setRequestKind(request); member.setCommunityUpdates(updates);
        return member;
    }

    @Test void storedModerationAttentionIsExposedOnlyToAnAcceptedGroupAdmin() {
        var group = new CommunityGroup("A", "owner", "Group", "", "", "friends", "public", false,
                new CommunityGroup.Policy(true, false, List.of()), "now", "now", 1L, "accepted", 1L, 3L, 8L);
        var owner = new Users(); owner.setUserId("owner");
        var admin = new ActivityMember(); admin.setUserId("owner"); admin.setRole("Admin"); admin.setStatus("accepted");
        var dto = CommunityGroupMapper.toDto(group, owner, owner, List.of(admin), 4);
        assertEquals(3, dto.moderationPending()); assertEquals(7, dto.activity()); assertEquals(8, dto.moderationQueueRevision());
        admin.setRole("Member");
        var ordinary = CommunityGroupMapper.toDto(group, owner, owner, List.of(admin), 4);
        assertEquals(0, ordinary.moderationPending()); assertEquals(4, ordinary.activity());
        admin.setRole("Admin"); admin.setStatus("pending");
        assertEquals(0, CommunityGroupMapper.toDto(group, owner, owner, List.of(admin), 4).moderationPending());
    }
}
