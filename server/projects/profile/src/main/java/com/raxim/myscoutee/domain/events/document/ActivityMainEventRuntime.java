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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRuntimeKind() { return runtimeKind; }
    public void setRuntimeKind(String runtimeKind) { this.runtimeKind = runtimeKind; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getSubEventId() { return subEventId; }
    public void setSubEventId(String subEventId) { this.subEventId = subEventId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }
    public String getStartAtIso() { return startAtIso; }
    public void setStartAtIso(String startAtIso) { this.startAtIso = startAtIso; }
    public String getEndAtIso() { return endAtIso; }
    public void setEndAtIso(String endAtIso) { this.endAtIso = endAtIso; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(String createdByUserId) { this.createdByUserId = createdByUserId; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
