package com.raxim.myscoutee.domain.email.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduledMessageRuns")
@CompoundIndexes({
        @CompoundIndex(name = "scheduled_message_run_rule_started", def = "{'ruleKey': 1, 'startedAtIso': -1}")
})
public class ScheduledMessageRun {
    @Id
    private String id;

    @Indexed(name = "scheduled_message_run_id", unique = true)
    private String runId;

    private String ruleKey;
    private String scheduleType;
    private String status;
    private String startedAtIso;
    private String finishedAtIso;
    private Integer affectedCount;
    private Integer notificationCount;
    private Integer emailQueuedCount;
    private Integer failedCount;
    private String detail;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public String getScheduleType() {
        return scheduleType;
    }

    public void setScheduleType(String scheduleType) {
        this.scheduleType = scheduleType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStartedAtIso() {
        return startedAtIso;
    }

    public void setStartedAtIso(String startedAtIso) {
        this.startedAtIso = startedAtIso;
    }

    public String getFinishedAtIso() {
        return finishedAtIso;
    }

    public void setFinishedAtIso(String finishedAtIso) {
        this.finishedAtIso = finishedAtIso;
    }

    public Integer getAffectedCount() {
        return affectedCount;
    }

    public void setAffectedCount(Integer affectedCount) {
        this.affectedCount = affectedCount;
    }

    public Integer getNotificationCount() {
        return notificationCount;
    }

    public void setNotificationCount(Integer notificationCount) {
        this.notificationCount = notificationCount;
    }

    public Integer getEmailQueuedCount() {
        return emailQueuedCount;
    }

    public void setEmailQueuedCount(Integer emailQueuedCount) {
        this.emailQueuedCount = emailQueuedCount;
    }

    public Integer getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(Integer failedCount) {
        this.failedCount = failedCount;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }
}
