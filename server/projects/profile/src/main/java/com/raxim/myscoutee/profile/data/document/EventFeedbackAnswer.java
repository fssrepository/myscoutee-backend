package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventFeedbackAnswers")
@CompoundIndexes({
        @CompoundIndex(name = "event_feedback_answer_user_event_card", def = "{'viewerUserId': 1, 'eventId': 1, 'cardId': 1}", unique = true),
        @CompoundIndex(name = "event_feedback_answer_user_event", def = "{'viewerUserId': 1, 'eventId': 1}"),
        @CompoundIndex(name = "event_feedback_answer_user_event_submitted", def = "{'viewerUserId': 1, 'eventId': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "event_feedback_answer_event_submitted", def = "{'eventId': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "event_feedback_answer_target_user_submitted", def = "{'targetUserId': 1, 'submittedAtIso': -1}")
})
public class EventFeedbackAnswer {
    @Id
    private String id;

    @Indexed(name = "event_feedback_answer_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String viewerUserId;
    private String eventId;
    private String cardId;
    private String kind;
    private String targetUserId;
    private String targetRole;
    private String primaryValue;
    private String secondaryValue;
    private String eventComment;
    private List<String> personalityTraitIds = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private String submittedAtIso;
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

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(String targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getPrimaryValue() {
        return primaryValue;
    }

    public void setPrimaryValue(String primaryValue) {
        this.primaryValue = primaryValue;
    }

    public String getSecondaryValue() {
        return secondaryValue;
    }

    public void setSecondaryValue(String secondaryValue) {
        this.secondaryValue = secondaryValue;
    }

    public String getEventComment() {
        return eventComment;
    }

    public void setEventComment(String eventComment) {
        this.eventComment = eventComment;
    }

    public List<String> getPersonalityTraitIds() {
        return personalityTraitIds;
    }

    public void setPersonalityTraitIds(List<String> personalityTraitIds) {
        this.personalityTraitIds = personalityTraitIds;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getSubmittedAtIso() {
        return submittedAtIso;
    }

    public void setSubmittedAtIso(String submittedAtIso) {
        this.submittedAtIso = submittedAtIso;
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
