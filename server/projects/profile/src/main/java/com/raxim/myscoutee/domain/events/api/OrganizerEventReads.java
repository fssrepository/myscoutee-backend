package com.raxim.myscoutee.domain.events.api;

import java.util.Collection;
import java.util.List;

/** Event facts used by following counters; contains no event mutation capability. */
public interface OrganizerEventReads {
    List<? extends Event> activeOriginalEventsByCreators(Collection<String> creators);
    List<? extends Event> storedEventsBySources(Collection<String> sources);

    interface Event {
        String getSourceId();
        String getCreatorUserId();
        String getStatus();
        Boolean getPublished();
        Boolean getGenerated();
        Boolean getIsTrashed();
        String getEventType();
        String getParentEventId();
        String getVisibility();
        String getStartAtIso();
        String getEndAtIso();
    }
}
