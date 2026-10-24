package com.raxim.myscoutee.domain.feedback.api;
import java.util.List;
public interface FeedbackDirectory {
    List<? extends Answer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String userId);
    interface Answer extends com.raxim.myscoutee.common.dto.AuditFields {
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

        

        
    }
}
