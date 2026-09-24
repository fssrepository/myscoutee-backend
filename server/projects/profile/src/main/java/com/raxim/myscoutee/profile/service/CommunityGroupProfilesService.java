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
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongo;
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
    public void applyPolicy(CommunityGroup group) {
        if (!group.policy().workspace()) return;
        var accepted = members.findByOwnerTypeAndOwnerId("community", group.id()).stream()
                .filter(m -> "accepted".equals(m.getStatus())).map(ActivityMember::getUserId).collect(java.util.stream.Collectors.toSet());
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
    public static String currentGroupId() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal principal)
            return principal.getUser() == null ? null : principal.getUser().getWorkspaceGroupId();
        return null;
    }
    public static boolean allows(String groupId) { return Objects.equals(currentGroupId(), groupId); }
    public static boolean sameWorkspace(Users left, Users right) {
        return left != null && right != null && Objects.equals(left.getWorkspaceGroupId(), right.getWorkspaceGroupId());
    }
}
