package com.raxim.myscoutee.domain.content.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userReports")
@CompoundIndexes({
        @CompoundIndex(name = "user_report_user_created", def = "{'userId': 1, 'createdDate': -1}")
})
@lombok.Getter @lombok.Setter
public class UserReportSubmission {
    @Id
    private String id;

    @Indexed(name = "user_report_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String userId;
    private String handle;
    private String reason;
    private String details;
    private String targetUserId;
    private String memberEntryId;
    private String eventId;
    private String eventTitle;
    private String eventStartAtIso;
    private String sourceType;
    private String sourceId;
    private String sourceText;
    private String chatId;
    private String messageId;
    private String assetId;
    private String assetType;
    private String createdDate;
    private String createdUser;
    private String warnedAtIso;
    private String warnedByAdminUserId;
    @org.springframework.data.mongodb.core.index.Indexed(name = "user_report_resolved")
    private String resolvedAtIso;
    private String resolvedByAdminUserId;
    private String updatedDate;
    private String updatedUser;

}
