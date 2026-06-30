package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activitySubEventStageRuntime")
@CompoundIndexes({
        @CompoundIndex(name = "activity_subevent_stage_runtime_record_id", def = "{'recordId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_stage_runtime_owner_subevent", def = "{'ownerId': 1, 'subEventId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_stage_runtime_owner", def = "{'ownerId': 1}")
})
public class ActivitySubEventStageRuntime {
    @Id
    private String id;

    @Indexed(name = "activity_subevent_stage_runtime_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String recordId;
    private String status;
    private String ownerId;
    private String subEventId;
    private String stageStatus;
    private String stageStatusReason;
    private String stageStatusUpdatedAt;
    private String stageFinalizedAt;
    private String stageFinalizedByUserId;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getSubEventId() { return subEventId; }
    public void setSubEventId(String subEventId) { this.subEventId = subEventId; }
    public String getStageStatus() { return stageStatus; }
    public void setStageStatus(String stageStatus) { this.stageStatus = stageStatus; }
    public String getStageStatusReason() { return stageStatusReason; }
    public void setStageStatusReason(String stageStatusReason) { this.stageStatusReason = stageStatusReason; }
    public String getStageStatusUpdatedAt() { return stageStatusUpdatedAt; }
    public void setStageStatusUpdatedAt(String stageStatusUpdatedAt) { this.stageStatusUpdatedAt = stageStatusUpdatedAt; }
    public String getStageFinalizedAt() { return stageFinalizedAt; }
    public void setStageFinalizedAt(String stageFinalizedAt) { this.stageFinalizedAt = stageFinalizedAt; }
    public String getStageFinalizedByUserId() { return stageFinalizedByUserId; }
    public void setStageFinalizedByUserId(String stageFinalizedByUserId) { this.stageFinalizedByUserId = stageFinalizedByUserId; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
