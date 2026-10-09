package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.api.CommunityMembershipReads;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.accounts.mapper.CommunityGroupProfileMapper;

@Service
public class CommunityGroupProfilesService implements com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces {
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongo;
    private final UsersRepository users;
    private final GroupDirectory groups;
    private final CommunityMembershipReads members;
    public CommunityGroupProfilesService(UsersRepository users, GroupDirectory groups, CommunityMembershipReads members) {
        this.users = users; this.groups = groups; this.members = members;
    }
    public Users admit(GroupView group, String accountId) {
        if (!group.policy().workspace()) return null;
        var existing = users.findByWorkspaceGroupIdAndAccountUserId(group.id(), accountId);
        if (existing.isPresent()) return existing.get();
        var account = users.findByUserId(accountId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return users.save(CommunityGroupProfileMapper.copy(account, group.id()));
    }
    public void applyPolicy(GroupView group) {
        if (!group.policy().workspace()) return;
        var accepted = members.forGroup(group.id()).stream()
                .filter(m -> "accepted".equals(m.getStatus())).map(CommunityMember::getUserId).collect(java.util.stream.Collectors.toSet());
        var existing = users.findByWorkspaceGroupId(group.id());
        existing.forEach(profile -> accepted.remove(profile.getAccountUserId()));
        if (!accepted.isEmpty()) users.saveAll(users.findByUserIdIn(accepted).stream().map(account -> CommunityGroupProfileMapper.copy(account, group.id())).toList());
        if (group.policy().enabled() && !group.policy().requiredFields().isEmpty()) {
            mongo.updateMulti(org.springframework.data.mongodb.core.query.Query.query(
                    org.springframework.data.mongodb.core.query.Criteria.where("workspaceGroupId").is(group.id()).and("profileDetails.0").exists(true)),
                    new org.springframework.data.mongodb.core.query.Update().set("profileDetails.$[].rows.$[required].privacy", "Public")
                        .filterArray(org.springframework.data.mongodb.core.query.Criteria.where("required.labelKey").in(group.policy().requiredFields())), Users.class);
        }
    }
    public Users select(String accountId, String groupId) {
        var group = groups.findById(groupId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var member = members.member(groupId, accountId).orElse(null);
        if (group.deleted() || !group.policy().workspace() || member == null || !"accepted".equals(member.getStatus()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return users.findByWorkspaceGroupIdAndAccountUserId(groupId, accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT));
    }
    @Override public Users activate(String accountId, String groupId) {
        return activate(users.findByUserId(accountId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)), groupId);
    }
    public Users activate(Users account, String groupId) {
        String selectedId = groupId == null || groupId.isBlank() ? null : groupId;
        Users selected = selectedId == null ? account : select(account.getUserId(), selectedId);
        users.updateActiveWorkspace(account.getUserId(), selectedId);
        account.setActiveWorkspaceGroupId(selectedId);
        return selected;
    }
    public Users current(Users account) {
        String groupId = account.getActiveWorkspaceGroupId();
        return groupId == null || groupId.isBlank() ? account : select(account.getUserId(), groupId);
    }
    @Override public void clearActiveWorkspace(String accountId, String groupId) { users.clearActiveWorkspace(accountId, groupId); }
    @Override public Map<String, com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto> profilesByGroup(String accountId) {
        var result = new HashMap<String, com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto>();
        users.findByAccountUserId(accountId).forEach(user -> result.put(user.getWorkspaceGroupId(),
                new com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto(user.getUserId(), CommunityGroupProfileMapper.attention(user))));
        return result;
    }
    public static String currentGroupId() { return com.raxim.myscoutee.domain.groups.api.WorkspaceContext.currentGroupId(); }
    public static boolean allows(String groupId) { return com.raxim.myscoutee.domain.groups.api.WorkspaceContext.allows(groupId); }
    public static boolean sameWorkspace(Users left, Users right) { return com.raxim.myscoutee.domain.groups.api.WorkspaceContext.sameWorkspace(left, right); }
}
