package com.raxim.myscoutee.domain.feedback.api;
import java.util.List;
public interface FeedbackDirectory {
    List<? extends Answer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String userId);
    interface Answer {
        String getId();
        String getSyncKey();
        String getViewerUserId();
        String getEventId();
        String getCardId();
        String getKind();
        String getTargetUserId();
        String getTargetRole();
        String getPrimaryValue();
        String getSecondaryValue();
        String getEventComment();
        List<String> getPersonalityTraitIds();
        List<String> getTags();
        String getSubmittedAtIso();
        String getCreatedDate();
        String getCreatedUser();
        String getUpdatedDate();
        String getUpdatedUser();
    }
}
