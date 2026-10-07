package com.raxim.myscoutee.domain.platform.service;

import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import java.util.ArrayList;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;

/** Resolves stored workspace ownership at job boundaries; never accepts an admin-supplied scope. */
@Service
public class JobGroupScopeService implements com.raxim.myscoutee.domain.platform.api.JobAudience {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog configurations;
    @org.springframework.beans.factory.annotation.Autowired
    private GroupDirectory groupDirectory;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.assets.api.AssetOwnership assetOwnership;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.events.api.EventOwnership eventOwnership;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.accounts.api.ProfileDirectory profiles;
    private final MongoTemplate mongo;

    public JobGroupScopeService(MongoTemplate mongo) { this.mongo = mongo; }

    public String forWorkspace(String workspaceId) {
        if (workspaceId == null || workspaceId.isBlank()) return null;
        if (BaseGroups.isBaseId(workspaceId)) return workspaceId;
        var group = groupDirectory.findById(workspaceId).orElse(null);
        return group == null ? null : group.baseId();
    }

    public java.util.Map<String, List<String>> usersByGroup(java.util.Collection<String> userIds) {
        var profiles = this.profiles.findByUserIdIn(userIds);
        var byId = new java.util.HashMap<String, WorkspaceProfile>();
        profiles.forEach(profile -> byId.put(profile.getUserId(), profile));
        var workspaces = workspaces();
        var result = new java.util.LinkedHashMap<String, List<String>>();
        for (String userId : userIds) {
            var user = byId.get(userId);
            String workspace = user == null ? null : user.getWorkspaceGroupId();
            String group = workspaces.get(workspace);
            result.computeIfAbsent(group, ignored -> new ArrayList<>()).add(userId);
        }
        return result;
    }

    public String forUser(String userId) {
        var user = profiles.findFirstByUserId(userId);
        return user == null ? JobGroupContext.groupId() : forWorkspace(user.getWorkspaceGroupId());
    }

    public String forTarget(String type, String id) {
        type = type == null ? "" : type.toLowerCase(java.util.Locale.ROOT);
        if ("user".equals(type)) return forUser(id);
        if ("config".equals(type)) {
            var config = configurations.find(id);
            return config == null ? JobGroupContext.groupId() : "default".equals(config.getKey()) ? null : config.getKey();
        }
        if ("asset".equals(type)) {
            var record = assetOwnership.findJobScope(id);
            if (record == null) return JobGroupContext.groupId();
            if (record.workspaceGroupId() != null) return forWorkspace(record.workspaceGroupId());
            String owner = record.ownerUserId() == null ? record.creatorUserId() : record.ownerUserId();
            return owner == null ? null : forUser(owner);
        }
        if (!"event".equals(type)) return JobGroupContext.groupId();
        var record = eventOwnership.findJobScope(id);
        if (record == null) return JobGroupContext.groupId();
        if (record.workspaceGroupId() != null) return forWorkspace(record.workspaceGroupId());
        String owner = record.ownerUserId() == null ? record.creatorUserId() : record.ownerUserId();
        return owner == null ? null : forUser(owner);
    }

    private java.util.Map<String, String> workspaces() {
        return JobGroupContext.memo("workspaceBaseIds", groupDirectory::workspaceBaseIds);
    }

    public boolean matchesWorkspace(String workspaceId) {
        return !JobGroupContext.isActive()
                || java.util.Objects.equals(workspaces().get(workspaceId), JobGroupContext.groupId());
    }

    @Override public WorkspaceScope workspaceScope() {
        var spaces = workspaces();
        String scope = JobGroupContext.groupId();
        return scope == null ? new WorkspaceScope(java.util.Set.copyOf(spaces.keySet()), false)
                : new WorkspaceScope(spaces.entrySet().stream().filter(entry -> scope.equals(entry.getValue()))
                    .map(java.util.Map.Entry::getKey).collect(java.util.stream.Collectors.toSet()), true);
    }
    public Criteria workspaceCriteria(String field) {
        var workspaces = workspaces();
        String scope = JobGroupContext.groupId();
        return scope == null ? Criteria.where(field).nin(workspaces.keySet())
                : Criteria.where(field).in(workspaces.entrySet().stream()
                    .filter(entry -> scope.equals(entry.getValue())).map(java.util.Map.Entry::getKey).toList());
    }

}
