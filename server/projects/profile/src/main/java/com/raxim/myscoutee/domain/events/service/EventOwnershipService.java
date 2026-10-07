package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@Service
public class EventOwnershipService implements EventOwnership {
    private final ActivityEventsRepository events;
    public EventOwnershipService(ActivityEventsRepository events) { this.events = events; }
    @Override public List<ActivityEvent> findBySourceId(String sourceId) { return events.findBySourceId(sourceId); }
}
