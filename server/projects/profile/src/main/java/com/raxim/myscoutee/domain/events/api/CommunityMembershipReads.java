package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;

/** Existing reads used to resolve and apply account workspace membership. */
public interface CommunityMembershipReads {
    List<CommunityMember> forGroup(String groupId);
    Optional<CommunityMember> member(String groupId, String accountId);
}
