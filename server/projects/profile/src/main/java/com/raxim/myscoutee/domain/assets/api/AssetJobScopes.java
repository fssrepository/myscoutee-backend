package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;

public interface AssetJobScopes extends com.raxim.myscoutee.domain.platform.api.JobTargetResolver {
    AssetJobScopeDto findJobScope(String id);

    @Override default String jobTargetType() { return "asset"; }
    @Override
    default String jobGroupForTarget(String id, java.util.function.Function<String, String> workspaceGroup,
            java.util.function.Function<String, String> userGroup) {
        return com.raxim.myscoutee.domain.platform.api.JobTargetResolver.groupForScope(
                findJobScope(id), workspaceGroup, userGroup);
    }
}
