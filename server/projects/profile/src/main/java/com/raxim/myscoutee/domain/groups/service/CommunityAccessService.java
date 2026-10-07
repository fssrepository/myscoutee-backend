package com.raxim.myscoutee.domain.groups.service;

import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.accounts.api.ProfilePresentation;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Case participants are accounts; workspace membership is checked only for private-community authority. */
@Service
public class CommunityAccessService implements com.raxim.myscoutee.domain.groups.api.CommunityAuthority {
    private final ProfilePresentation profiles;
    private final AccountWorkspaces workspaceProfiles;
    private final CommunityGroupsRepository groups;
    private final CommunityMemberships members;
    public CommunityAccessService(ProfilePresentation profiles, AccountWorkspaces workspaceProfiles,
            CommunityGroupsRepository groups, CommunityMemberships members) {
        this.profiles = profiles; this.workspaceProfiles = workspaceProfiles; this.groups = groups; this.members = members;
    }
    public String actor(String requestedId) {
        WorkspaceProfile profile = profiles.resolveCurrentUser(requestedId);
        if (profile == null) throw error(HttpStatus.UNAUTHORIZED);
        String accountId = profile.getAccountUserId() == null ? profile.getUserId() : profile.getAccountUserId();
        requireBaseMember(accountId);
        return accountId;
    }
    public void requireBaseMember(String accountId) { workspaceProfiles.select(accountId, BaseGroups.COMMUNITY_BASE_ID); }
    public CommunityGroup group(String groupId) {
        CommunityGroup group = groups.findById(groupId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (!"community".equals(group.effectiveType()) || BaseGroups.isBaseId(group.id()) || group.deleted() || group.awaitingOwner())
            throw error(HttpStatus.NOT_FOUND);
        return group;
    }
    public CommunityMember member(String groupId, String accountId) {
        return members.member(groupId, accountId)
                .filter(m -> "accepted".equals(m.getStatus())).orElse(null);
    }
    public boolean admin(String groupId, String accountId) {
        if (groupId == null) return false;
        var member = member(groupId, accountId);
        return member != null && "Admin".equals(member.getRole());
    }
    public CommunityGroup requireMember(String groupId, String accountId) {
        var group = group(groupId);
        if (member(groupId, accountId) == null) throw error(HttpStatus.NOT_FOUND);
        return group;
    }
    public CommunityGroup requireAdmin(String groupId, String accountId) {
        var group = group(groupId);
        if (!admin(groupId, accountId)) throw error(HttpStatus.FORBIDDEN);
        return group;
    }
    public List<CommunityMember> roster(String groupId) {
        return members.accepted(groupId);
    }
    public Set<String> managedGroups(String accountId) {
        return managedGroups(accountId, members, groups);
    }
    public static Set<String> managedGroups(String accountId, CommunityMemberships members, CommunityGroupsRepository groups) {
        var ids = members.forAccount(accountId).stream()
                .filter(m -> "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole()))
                .map(CommunityMember::getOwnerId).toList();
        var result = new HashSet<String>();
        if (!ids.isEmpty()) groups.findByIdIn(ids).stream().filter(g -> "community".equals(g.effectiveType())
                && !BaseGroups.isBaseId(g.id()) && !g.deleted() && !g.awaitingOwner()).forEach(g -> result.add(g.id()));
        return result;
    }
    public List<String> audience(List<CommunityMember> roster, boolean all, List<String> selected) {
        var accepted = roster.stream().map(CommunityMember::getUserId).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        if (all) return List.copyOf(accepted);
        if (selected == null || selected.size() > 10000 || selected.stream().anyMatch(id -> id == null || !accepted.contains(id)))
            throw error(HttpStatus.BAD_REQUEST);
        return selected.stream().distinct().toList();
    }
    public static ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
