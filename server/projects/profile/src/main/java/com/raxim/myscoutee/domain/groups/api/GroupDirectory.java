package com.raxim.myscoutee.domain.groups.api;

import java.util.Optional;

public interface GroupDirectory {
    java.util.Optional<GroupType> type(String groupId);
    record GroupType(String id, String effectiveType) {}
    Optional<GroupName> name(String groupId);

    record GroupName(String name) {}
}
