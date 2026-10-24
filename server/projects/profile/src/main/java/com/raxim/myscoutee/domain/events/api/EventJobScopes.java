package com.raxim.myscoutee.domain.events.api;

import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;

public interface EventJobScopes extends com.raxim.myscoutee.domain.platform.api.JobTargetResolver {
    EventJobScopeDto findJobScope(String id);

    @Override default String jobTargetType() { return "event"; }
    @Override
    default String jobGroupForTarget(String id, java.util.function.Function<String, String> workspaceGroup,
            java.util.function.Function<String, String> userGroup) {
        return com.raxim.myscoutee.domain.platform.api.JobTargetResolver.groupForScope(
                findJobScope(id), workspaceGroup, userGroup);
    }
}
