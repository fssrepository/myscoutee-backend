package com.raxim.myscoutee.domain.groups.api;

import java.util.List;

public interface GroupMediaVisibility {
    Group group(String id);
    record Group(String lifecycleStatus) {}
}
