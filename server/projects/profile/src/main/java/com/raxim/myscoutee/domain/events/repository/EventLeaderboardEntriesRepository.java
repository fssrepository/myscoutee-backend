package com.raxim.myscoutee.domain.events.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.EventLeaderboardEntry;

public interface EventLeaderboardEntriesRepository extends MongoRepository<EventLeaderboardEntry, String> {
    List<EventLeaderboardEntry> findByEventIdAndSubEventId(String eventId, String subEventId);

    Optional<EventLeaderboardEntry> findByEventIdAndSubEventIdAndGroupIdAndEntryTypeAndPairKey(
            String eventId,
            String subEventId,
            String groupId,
            String entryType,
            String pairKey);
}
