package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;

public interface AssetJobScopes extends com.raxim.myscoutee.domain.platform.api.JobTargetResolver {
    AssetJobScopeDto findJobScope(String id);

    @Override default String jobTargetType() { return "asset"; }
    @Override
    default String jobGroupForTarget(String id, java.util.function.Function<String, String> workspaceGroup,
            java.util.function.Function<String, String> userGroup) {
        var record = findJobScope(id);
        if (record == null) return com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId();
        if (record.workspaceGroupId() != null) return workspaceGroup.apply(record.workspaceGroupId());
        String owner = record.ownerUserId() == null ? record.creatorUserId() : record.ownerUserId();
        return owner == null ? null : userGroup.apply(owner);
    }
}
