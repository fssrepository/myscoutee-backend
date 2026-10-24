package com.raxim.myscoutee.domain.feedback.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedbackAnswers")
@CompoundIndexes({
        @CompoundIndex(name = "feedback_answer_user_event_card", def = "{'viewerUserId': 1, 'eventId': 1, 'cardId': 1}", unique = true),
        @CompoundIndex(name = "feedback_answer_user_event", def = "{'viewerUserId': 1, 'eventId': 1}"),
        @CompoundIndex(name = "feedback_answer_user_event_submitted", def = "{'viewerUserId': 1, 'eventId': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "feedback_answer_event_submitted", def = "{'eventId': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "feedback_answer_target_user_submitted", def = "{'targetUserId': 1, 'submittedAtIso': -1}")
})
@lombok.Getter @lombok.Setter
public class FeedbackAnswer implements com.raxim.myscoutee.domain.feedback.api.FeedbackDirectory.Answer {
    @Id
    private String id;

    @Indexed(name = "feedback_answer_sync_key", unique = true, sparse = true)
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

}
