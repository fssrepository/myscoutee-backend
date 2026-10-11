package com.raxim.myscoutee.domain.groups.api;

import java.util.Optional;

public interface GroupDirectory extends com.raxim.myscoutee.domain.platform.api.JobWorkspaceDirectory {
    @Override
    default String jobGroupForWorkspace(String workspaceId) {
        if (workspaceId == null || workspaceId.isBlank()) return null;
        if (BaseGroups.isBaseId(workspaceId)) return workspaceId;
        var group = findById(workspaceId).orElse(null);
        return group == null ? null : group.baseId();
    }

    java.util.Set<String> activeCommunityIds(java.util.Collection<String> ids);
    java.util.Map<String, String> workspaceBaseIds();
    Optional<? extends GroupView> findById(String id);
    java.util.List<? extends GroupView> findByIdIn(java.util.Collection<String> ids);
    java.util.List<? extends GroupView> findAllById(Iterable<String> ids);
    java.util.Map<String, String> baseGroupIds(java.util.Collection<String> ids);
    java.util.Set<String> workGroupIds(java.util.Collection<String> ids);
    java.util.Optional<GroupType> type(String groupId);
    record GroupType(String id, String effectiveType) {}
    Optional<GroupName> name(String groupId);

    record GroupName(String name) {}
}
