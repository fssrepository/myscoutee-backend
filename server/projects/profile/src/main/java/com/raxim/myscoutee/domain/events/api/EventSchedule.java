package com.raxim.myscoutee.domain.events.api;

import java.util.List;
public interface EventSchedule {
    String getId();
    String getSourceId();
    String getTitle();
    String getStartAtIso();
    Boolean getPublished();
    Boolean getIsTrashed();
    List<? extends Stage> getSubEvents();
    interface Stage {
        String id(); String name(); String startAt(); Boolean optional();
        Integer tournamentGroupCapacityMin(); Integer tournamentGroupCapacityMax();
        String tournamentLeaderboardType(); Integer slotStartOffsetMinutes();
    }
}
