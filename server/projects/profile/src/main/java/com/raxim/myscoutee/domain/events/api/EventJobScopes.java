package com.raxim.myscoutee.domain.events.api;

import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;

public interface EventJobScopes extends com.raxim.myscoutee.domain.platform.api.JobTargetResolver {
    EventJobScopeDto findJobScope(String id);

    @Override default String jobTargetType() { return "event"; }
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
