package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventFeedbackStates")
@CompoundIndexes({
        @CompoundIndex(name = "event_feedback_state_user_event", def = "{'viewerUserId': 1, 'eventId': 1}", unique = true),
        @CompoundIndex(name = "event_feedback_state_user_updated", def = "{'viewerUserId': 1, 'updatedDate': -1}")
})
public class EventFeedbackState {
    @Id
    private String id;

    @Indexed(name = "event_feedback_state_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String viewerUserId;
    private String eventId;
    private Boolean removed;
    private String submittedAtIso;
    private String organizerNote;
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

    public String getViewerUserId() {
        return viewerUserId;
    }

    public void setViewerUserId(String viewerUserId) {
        this.viewerUserId = viewerUserId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Boolean getRemoved() {
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public String getSubmittedAtIso() {
        return submittedAtIso;
    }

    public void setSubmittedAtIso(String submittedAtIso) {
        this.submittedAtIso = submittedAtIso;
    }

    public String getOrganizerNote() {
        return organizerNote;
    }

    public void setOrganizerNote(String organizerNote) {
        this.organizerNote = organizerNote;
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
