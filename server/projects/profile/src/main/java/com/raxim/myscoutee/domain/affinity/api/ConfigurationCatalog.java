package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.platform.api.SchedulingParameters;

/** MyScoutee configuration source, including explicit affinity configuration lookup. */
public interface ConfigurationCatalog extends SchedulingParameters,
        com.raxim.myscoutee.domain.platform.api.JobTargetResolver {
    Settings find(String id);

    @Override default String jobTargetType() { return "config"; }
    @Override
    default String jobGroupForTarget(String id, java.util.function.Function<String, String> workspaceGroup,
            java.util.function.Function<String, String> userGroup) {
        var config = find(id);
        return config == null ? com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()
                : "default".equals(config.getKey()) ? null : config.getKey();
    }
}
