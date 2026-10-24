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
@lombok.Getter
public class FeedbackState {
    @org.springframework.data.annotation.Version private Long version;
    private String counterChangeId;
    private com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change counterChange;
    public Long getVersion() { return version; }
    public void setVersion(Long value) { version = value; }
    public void setCounterChange(com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change value) { counterChange = value; counterChangeId = value == null ? null : value.id(); }
    @Id
    @lombok.Setter
    private String id;

    @Indexed(name = "feedback_state_sync_key", unique = true, sparse = true)
    @lombok.Setter
    private String syncKey;

    @lombok.Setter
    private String viewerUserId;
    @lombok.Setter
    private String eventId;
    @lombok.Setter
    private Boolean removed;
    @lombok.Setter
    private Boolean eligible;
    @lombok.Setter
    private Boolean counterTracked;
    @lombok.Setter
    private String submittedAtIso;
    @lombok.Setter
    private String removedAtIso;
    @lombok.Setter
    private String organizerNote;
    @lombok.Setter
    private String createdDate;
    @lombok.Setter
    private String createdUser;
    @lombok.Setter
    private String updatedDate;
    @lombok.Setter
    private String updatedUser;

}
