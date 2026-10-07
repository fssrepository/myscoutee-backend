package com.raxim.myscoutee.domain.groups.api;

import java.util.Optional;

public interface GroupDirectory {
    Optional<GroupName> name(String groupId);

    record GroupName(String name) {}
}
