package com.raxim.myscoutee.domain.groups.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;

@Service
public class GroupDirectoryService implements GroupDirectory {
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongo;
    private final CommunityGroupsRepository groups;

    public GroupDirectoryService(CommunityGroupsRepository groups) {
        this.groups = groups;
    }

    @Override public java.util.Set<String> activeCommunityIds(java.util.Collection<String> ids) {
        if (ids.isEmpty()) return java.util.Set.of();
        return groups.findByIdIn(ids).stream()
                .filter(group -> "community".equals(group.groupType())
                        && !com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID.equals(group.id())
                        && !"deleted".equals(group.lifecycleStatus()) && !"under-review".equals(group.lifecycleStatus()))
                .map(com.raxim.myscoutee.domain.groups.document.CommunityGroup::id)
                .collect(java.util.stream.Collectors.toSet());
    }
    @Override public java.util.Map<String, String> workspaceBaseIds() {
        var ids = new java.util.HashMap<String, String>();
        com.raxim.myscoutee.domain.groups.api.BaseGroups.BASE_IDS.forEach(id -> ids.put(id, id));
        var query = org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("groupType").in("work", "community"));
        query.fields().include("_id").include("groupType");
        for (org.bson.Document group : mongo.find(query, org.bson.Document.class, "communityGroups")) {
            String id = group.getString("_id");
            if (id != null) ids.put(id, com.raxim.myscoutee.domain.groups.api.BaseGroups.baseIdForType(group.getString("groupType")));
        }
        return ids;
    }
    @Override public Optional<com.raxim.myscoutee.domain.groups.document.CommunityGroup> findById(String id) { return groups.findById(id); }
    @Override public java.util.List<com.raxim.myscoutee.domain.groups.document.CommunityGroup> findByIdIn(java.util.Collection<String> ids) { return groups.findByIdIn(ids); }
    @Override public java.util.List<com.raxim.myscoutee.domain.groups.document.CommunityGroup> findAllById(Iterable<String> ids) { return groups.findAllById(ids); }
    @Override public java.util.Map<String, String> baseGroupIds(java.util.Collection<String> ids) { return groups.baseGroupIds(ids); }
    @Override public java.util.Set<String> workGroupIds(java.util.Collection<String> ids) { return groups.workGroupIds(ids); }
    @Override
    public Optional<GroupName> name(String groupId) {
        return groups.findById(groupId).map(group -> new GroupName(group.name()));
    }
    @Override public java.util.Optional<GroupType> type(String groupId) {
        return groups.findById(groupId).map(group -> new GroupType(group.id(), group.effectiveType()));
    }

}
