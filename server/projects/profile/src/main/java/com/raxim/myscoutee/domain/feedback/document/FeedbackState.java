package com.raxim.myscoutee.domain.feedback.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedbackStates")
@CompoundIndexes({
        @CompoundIndex(name = "feedback_state_user_event", def = "{'viewerUserId': 1, 'eventId': 1}", unique = true),
        @CompoundIndex(name = "feedback_state_user_updated", def = "{'viewerUserId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "feedback_state_event_updated", def = "{'eventId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "feedback_state_qmau_window", def = "{'removed': 1, 'submittedAtIso': 1, 'viewerUserId': 1, 'eventId': 1}")
})
public class FeedbackState {
    @org.springframework.data.annotation.Version private Long version;
    private String counterChangeId;
    public String getCounterChangeId() { return counterChangeId; }
    private com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change counterChange;
    public Long getVersion() { return version; }
    public void setVersion(Long value) { version = value; }
    public com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change getCounterChange() { return counterChange; }
    public void setCounterChange(com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change value) { counterChange = value; counterChangeId = value == null ? null : value.id(); }
    @Id
    private String id;

    @Indexed(name = "feedback_state_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String viewerUserId;
    private String eventId;
    private Boolean removed;
    private Boolean eligible;
    private Boolean counterTracked;
    private String submittedAtIso;
    private String removedAtIso;
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

    public Boolean getEligible() {
        return eligible;
    }

    public void setEligible(Boolean eligible) {
        this.eligible = eligible;
    }

    public Boolean getCounterTracked() {
        return counterTracked;
    }

    public void setCounterTracked(Boolean counterTracked) {
        this.counterTracked = counterTracked;
    }

    public String getSubmittedAtIso() {
        return submittedAtIso;
    }

    public void setSubmittedAtIso(String submittedAtIso) {
        this.submittedAtIso = submittedAtIso;
    }

    public String getRemovedAtIso() {
        return removedAtIso;
    }

    public void setRemovedAtIso(String removedAtIso) {
        this.removedAtIso = removedAtIso;
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
