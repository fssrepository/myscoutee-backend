package com.raxim.myscoutee.domain.events.api;
import java.util.*;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
/** Community-scoped reads, registration and compare-and-set transitions. */
public interface CommunityMemberships {
    List<CommunityMember> forAccount(String accountId);
    List<CommunityMember> forGroup(String groupId);
    List<CommunityMember> forGroups(Collection<String> groupIds);
    List<CommunityMember> accepted(String groupId);
    Optional<CommunityMember> member(String groupId, String accountId);
    CommunityMember register(CommunityMember member);
    List<CommunityMember> registerAll(List<CommunityMember> members);
    long transition(String id, String expectedStatus, String expectedRole, String expectedActionAtIso,
            String status, String role, String requestKind, String pendingSource, boolean organizerOnly,
            String actionAtIso, String action, String actor, String managerGrantedByUserId, boolean votingEligible);
}
