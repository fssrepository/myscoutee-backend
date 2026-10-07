package com.raxim.myscoutee.domain.events.service;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.EventWatchDirectory;
import com.raxim.myscoutee.domain.events.repository.EventWatchSubscriptionsRepository;
@Service
public class EventWatchDirectoryService implements EventWatchDirectory {
    private final EventWatchSubscriptionsRepository watches;
    public EventWatchDirectoryService(EventWatchSubscriptionsRepository watches) { this.watches = watches; }
    public java.util.List<String> watchedEventIds(String userId) { return watches.findByUserIdOrderByUpdatedDateDesc(userId).stream().map(s -> s == null ? null : s.getEventId()).toList(); }
}
