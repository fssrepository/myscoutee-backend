package com.raxim.myscoutee.profile.data.document;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Boolean getLastObservedFull() {
        return lastObservedFull;
    }

    public void setLastObservedFull(Boolean lastObservedFull) {
        this.lastObservedFull = lastObservedFull;
    }

    public Integer getLastObservedAvailableCapacity() {
        return lastObservedAvailableCapacity;
    }

    public void setLastObservedAvailableCapacity(Integer lastObservedAvailableCapacity) {
        this.lastObservedAvailableCapacity = lastObservedAvailableCapacity;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }
}
