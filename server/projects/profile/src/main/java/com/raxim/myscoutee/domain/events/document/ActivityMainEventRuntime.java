package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityEventRuntimeItems")
@CompoundIndexes({
        @CompoundIndex(
                name = "activity_event_runtime_event_kind",
                def = "{'eventId': 1, 'runtimeKind': 1}",
                unique = true),
        @CompoundIndex(
                name = "activity_event_runtime_owner_status",
                def = "{'ownerId': 1, 'status': 1}")
})
@lombok.Getter @lombok.Setter
public class ActivityMainEventRuntime {
    public static final String RUNTIME_KIND_MAIN_EVENT = "MAIN_EVENT";

    @Id
    private String id;

    @Indexed(name = "activity_event_runtime_record_id", unique = true)
    private String recordId;

    @Indexed(name = "activity_event_runtime_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String status;
    private String runtimeKind;
    private String eventId;
    private String ownerId;
    private String subEventId;
    private String title;
    private String description;
    private String timeframe;
    private String startAtIso;
    private String endAtIso;
    private String location;
    private String createdByUserId;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
