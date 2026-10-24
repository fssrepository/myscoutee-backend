package com.raxim.myscoutee.domain.email.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduledMessageDeliveries")
@CompoundIndexes({
        @CompoundIndex(name = "scheduled_message_delivery_run_user", def = "{'runId': 1, 'userId': 1}"),
        @CompoundIndex(name = "scheduled_message_delivery_rule_created", def = "{'ruleKey': 1, 'createdDate': -1}")
})
@lombok.Getter @lombok.Setter
public class ScheduledMessageDelivery {
    @Id
    private String id;

    private String runId;
    private String ruleKey;
    private String userId;
    private String recipientEmail;
    private String notificationTemplateKey;
    private String emailTemplateKey;
    private String channel;
    private String status;
    private String detail;
    private String createdDate;
    private String createdUser;

}
