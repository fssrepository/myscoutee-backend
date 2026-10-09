package com.raxim.myscoutee.domain.events.api;

import java.util.List;

/** Existing event reads used by the home activity projection and report eligibility. */
public interface EventHomeReads {
    List<? extends Event> findHomeGameMemberProjections();
    List<? extends Event> findBySourceId(String sourceId);
    interface Event {
        List<String> getAcceptedMemberUserIds();
        String getStartAtIso();
        String getUpdatedDate();
        String getCreatedDate();
        String getEndAtIso();
        String getSourceId();
        String getTitle();
        String getStatus();
        String getOwnerUserId();
        String getCreatorUserId();
        List<String> getAdmins();
        Integer getAcceptedMembers();
        Boolean getIsTrashed();
    }
}
