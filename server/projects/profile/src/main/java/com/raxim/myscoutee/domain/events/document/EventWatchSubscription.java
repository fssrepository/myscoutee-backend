package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventWatchSubscriptions")
@CompoundIndexes({
        @CompoundIndex(name = "event_watch_user_event", def = "{'userId': 1, 'eventId': 1}", unique = true),
        @CompoundIndex(name = "event_watch_user_updated", def = "{'userId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "event_watch_event_updated", def = "{'eventId': 1, 'updatedDate': -1}")
})
@lombok.Getter @lombok.Setter
public class EventWatchSubscription {
    @Id
    private String id;

    @Indexed(name = "event_watch_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String userId;
    private String eventId;
    private Boolean lastObservedFull;
    private Integer lastObservedAvailableCapacity;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
