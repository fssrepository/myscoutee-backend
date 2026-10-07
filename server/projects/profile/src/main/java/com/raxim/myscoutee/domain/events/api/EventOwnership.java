package com.raxim.myscoutee.domain.events.api;

import java.util.List;

public interface EventOwnership {
    List<? extends Event> findBySourceId(String sourceId);
    interface Event {
        String getStatus(); String getCreatorUserId(); String getWorkspaceGroupId(); String getUpdatedDate(); List<String> getAdmins();
    }
}
