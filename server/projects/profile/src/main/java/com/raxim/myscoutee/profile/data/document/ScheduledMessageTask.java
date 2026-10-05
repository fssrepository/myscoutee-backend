package com.raxim.myscoutee.profile.data.document;

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
public class ScheduledMessageTask {
    private String baseGroupId;
    public String getBaseGroupId() { return baseGroupId; }
    public void setBaseGroupId(String baseGroupId) { this.baseGroupId = baseGroupId; }

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskKey() { return taskKey; }
    public void setTaskKey(String taskKey) { this.taskKey = taskKey; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getActionKey() { return actionKey; }
    public void setActionKey(String actionKey) { this.actionKey = actionKey; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getSubEventId() { return subEventId; }
    public void setSubEventId(String subEventId) { this.subEventId = subEventId; }
    public String getNotificationTemplateKey() { return notificationTemplateKey; }
    public void setNotificationTemplateKey(String notificationTemplateKey) { this.notificationTemplateKey = notificationTemplateKey; }
    public String getEmailTemplateKey() { return emailTemplateKey; }
    public void setEmailTemplateKey(String emailTemplateKey) { this.emailTemplateKey = emailTemplateKey; }
    public String getDueAtIso() { return dueAtIso; }
    public void setDueAtIso(String dueAtIso) { this.dueAtIso = dueAtIso; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getSuspended() { return suspended; }
    public void setSuspended(Boolean suspended) { this.suspended = suspended; }
    public Boolean getPendingCounterTracked() { return pendingCounterTracked; }
    public void setPendingCounterTracked(Boolean pendingCounterTracked) { this.pendingCounterTracked = pendingCounterTracked; }
    public String getLastRunAtIso() { return lastRunAtIso; }
    public void setLastRunAtIso(String lastRunAtIso) { this.lastRunAtIso = lastRunAtIso; }
    public String getLastRunStatus() { return lastRunStatus; }
    public void setLastRunStatus(String lastRunStatus) { this.lastRunStatus = lastRunStatus; }
    public String getLastRunDetail() { return lastRunDetail; }
    public void setLastRunDetail(String lastRunDetail) { this.lastRunDetail = lastRunDetail; }
    public Integer getLastRunCount() { return lastRunCount; }
    public void setLastRunCount(Integer lastRunCount) { this.lastRunCount = lastRunCount; }
    public Map<String, String> getPayload() { return payload; }
    public void setPayload(Map<String, String> payload) { this.payload = payload == null ? new LinkedHashMap<>() : new LinkedHashMap<>(payload); }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
