package com.raxim.myscoutee.domain.content.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userFeedback")
@CompoundIndexes({
        @CompoundIndex(name = "user_feedback_user_created", def = "{'userId': 1, 'createdDate': -1}")
})
@lombok.Getter @lombok.Setter
public class UserFeedbackSubmission {
    @Id
    private String id;

    @Indexed(name = "user_feedback_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String userId;
    private String category;
    private String subject;
    private String details;
    private String createdDate;
    private String createdUser;
    @org.springframework.data.mongodb.core.index.Indexed(name = "user_feedback_resolved")
    private String resolvedAtIso;
    private String resolvedByAdminUserId;
    private String updatedDate;
    private String updatedUser;

}
