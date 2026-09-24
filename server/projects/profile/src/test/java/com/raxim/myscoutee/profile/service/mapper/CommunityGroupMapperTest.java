package com.raxim.myscoutee.profile.service.mapper;

import java.util.List;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.profile.data.document.*;
import static org.junit.jupiter.api.Assertions.*;

class CommunityGroupMapperTest {
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
