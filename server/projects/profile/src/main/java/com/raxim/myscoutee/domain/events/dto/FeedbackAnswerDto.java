package com.raxim.myscoutee.domain.events.dto;

import java.util.List;
import com.raxim.myscoutee.domain.events.api.FeedbackDirectory;

/** Detached form of the existing feedback directory projection. */
public record FeedbackAnswerDto(String id, String syncKey, String viewerUserId, String eventId, String cardId, String kind, String targetUserId, String targetRole, String primaryValue, String secondaryValue, String eventComment, List<String> personalityTraitIds, List<String> tags, String submittedAtIso, String createdDate, String createdUser, String updatedDate, String updatedUser) implements FeedbackDirectory.Answer {
    public FeedbackAnswerDto {
        if (personalityTraitIds != null) personalityTraitIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(personalityTraitIds));
        if (tags != null) tags = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(tags));
    }
    public static FeedbackAnswerDto from(FeedbackDirectory.Answer answer) {
        return new FeedbackAnswerDto(answer.getId(), answer.getSyncKey(), answer.getViewerUserId(), answer.getEventId(), answer.getCardId(), answer.getKind(), answer.getTargetUserId(), answer.getTargetRole(), answer.getPrimaryValue(), answer.getSecondaryValue(), answer.getEventComment(), answer.getPersonalityTraitIds(), answer.getTags(), answer.getSubmittedAtIso(), answer.getCreatedDate(), answer.getCreatedUser(), answer.getUpdatedDate(), answer.getUpdatedUser());
    }
    @Override public String getId() { return id; }
    @Override public String getSyncKey() { return syncKey; }
    @Override public String getViewerUserId() { return viewerUserId; }
    @Override public String getEventId() { return eventId; }
    @Override public String getCardId() { return cardId; }
    @Override public String getKind() { return kind; }
    @Override public String getTargetUserId() { return targetUserId; }
    @Override public String getTargetRole() { return targetRole; }
    @Override public String getPrimaryValue() { return primaryValue; }
    @Override public String getSecondaryValue() { return secondaryValue; }
    @Override public String getEventComment() { return eventComment; }
    @Override public List<String> getPersonalityTraitIds() { return personalityTraitIds; }
    @Override public List<String> getTags() { return tags; }
    @Override public String getSubmittedAtIso() { return submittedAtIso; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getCreatedUser() { return createdUser; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getUpdatedUser() { return updatedUser; }
}
