package com.raxim.myscoutee.domain.email.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emailOutbox")
@CompoundIndexes({
        @CompoundIndex(name = "email_outbox_status_schedule", def = "{'status': 1, 'scheduledAt': 1}"),
        @CompoundIndex(name = "email_outbox_user_rule_created", def = "{'userId': 1, 'ruleKey': 1, 'createdDate': -1}")
})
@lombok.Getter @lombok.Setter
public class EmailOutboxItem {
    @Id
    private String id;
    private String baseGroupId;

    @Indexed(name = "email_outbox_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String userId;
    private String recipientEmail;
    private String recipientName;
    private String templateKey;
    private String ruleKey;
    private String category;
    private String provider;
    private String status;
    private String subject;
    private String htmlBody;
    private String textBody;
    private Map<String, String> templateVariables = new LinkedHashMap<>();
    private String scheduledAt;
    private Integer attemptCount;
    private String providerMessageId;
    private String errorMessage;
    private String sentDate;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public void setTemplateVariables(Map<String, String> templateVariables) {
        this.templateVariables = templateVariables == null ? new LinkedHashMap<>() : new LinkedHashMap<>(templateVariables);
    }

}
