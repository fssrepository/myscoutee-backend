package com.raxim.myscoutee.domain.events.api;

import java.util.List;

/** Existing facts used by membership authorization; grants no actor authority. */
public interface EventMembershipFacts {
    List<? extends Event> findBySourceId(String sourceId);
    interface Event {
        String getWorkspaceGroupId();
        String getUpdatedDate();
        String getCreatorUserId();
        String getStatus();
        List<String> getAdmins();
    }
}
