package com.raxim.myscoutee.domain.email.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduledMessageTasks")
@CompoundIndexes({
        @CompoundIndex(name = "scheduled_message_group_status_due", def = "{'baseGroupId': 1, 'status': 1, 'dueAtIso': 1}"),
        @CompoundIndex(name = "scheduled_message_task_status_due", def = "{'status': 1, 'dueAtIso': 1}"),
        @CompoundIndex(name = "scheduled_message_task_action_due", def = "{'actionKey': 1, 'dueAtIso': 1}")
})
@lombok.Getter @lombok.Setter
public class ScheduledMessageTask implements com.raxim.myscoutee.domain.email.api.ScheduledMessages.Task {
    private String baseGroupId;

    @Id
    private String id;

    @Indexed(name = "scheduled_message_task_key", unique = true)
    private String taskKey;

    @Indexed(name = "scheduled_message_task_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String actionKey;
    private String userId;
    private String eventId;
    private String subEventId;
    private String notificationTemplateKey;
    private String emailTemplateKey;
    private String dueAtIso;
    private String status;
    private Boolean suspended;
    private Boolean pendingCounterTracked;
    @Indexed(name = "scheduled_message_task_last_run", direction = org.springframework.data.mongodb.core.index.IndexDirection.DESCENDING)
    private String lastRunAtIso;
    private String lastRunStatus;
    private String lastRunDetail;
    private Integer lastRunCount;
    private Map<String, String> payload = new LinkedHashMap<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public void setPayload(Map<String, String> payload) { this.payload = payload == null ? new LinkedHashMap<>() : new LinkedHashMap<>(payload); }
}
