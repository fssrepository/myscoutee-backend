package com.raxim.myscoutee.domain.platform.api;

import java.util.function.Function;

/** An installed owner's existing target lookup, using the shared workspace/user resolution. */
public interface JobTargetResolver {
    String jobTargetType();
    String jobGroupForTarget(String id, Function<String, String> workspaceGroup,
            Function<String, String> userGroup);

    interface ScopeFields {
        String workspaceGroupId(); String ownerUserId(); String creatorUserId();
    }
    static String groupForScope(ScopeFields record, Function<String, String> workspaceGroup,
            Function<String, String> userGroup) {
        if (record == null) return JobGroupContext.groupId();
        if (record.workspaceGroupId() != null) return workspaceGroup.apply(record.workspaceGroupId());
        String owner = record.ownerUserId() == null ? record.creatorUserId() : record.ownerUserId();
        return owner == null ? null : userGroup.apply(owner);
    }

}
