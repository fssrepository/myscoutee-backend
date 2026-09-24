package com.raxim.myscoutee.profile.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.repository.*;
import com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper;

@Service
public class CommunityGroupProfilesService {
    private final UsersRepository users;
    private final CommunityGroupsRepository groups;
    private final ActivityMembersRepository members;
    public CommunityGroupProfilesService(UsersRepository users, CommunityGroupsRepository groups, ActivityMembersRepository members) {
        this.users = users; this.groups = groups; this.members = members;
    }
    public Users admit(CommunityGroup group, String accountId) {
        if (!group.policy().workspace()) return null;
        var existing = users.findByWorkspaceGroupIdAndAccountUserId(group.id(), accountId);
        if (existing.isPresent()) return existing.get();
        var account = users.findByUserId(accountId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return users.save(CommunityGroupProfileMapper.copy(account, group.id()));
    }
    public Users select(String accountId, String groupId) {
        var group = groups.findById(groupId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var member = members.findByOwnerTypeAndOwnerIdAndUserId("community", groupId, accountId).orElse(null);
        if (!group.policy().workspace() || member == null || !"accepted".equals(member.getStatus()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return users.findByWorkspaceGroupIdAndAccountUserId(groupId, accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT));
    }
    public Map<String, Users> profilesByGroup(String accountId) {
        var result = new HashMap<String, Users>();
        users.findByAccountUserId(accountId).forEach(user -> result.put(user.getWorkspaceGroupId(), user));
        return result;
    }
    public static boolean sameWorkspace(Users left, Users right) {
        return left != null && right != null && Objects.equals(left.getWorkspaceGroupId(), right.getWorkspaceGroupId());
    }
}
