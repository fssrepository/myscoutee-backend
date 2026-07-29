package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "affinityRecomputeTasks")
@CompoundIndexes({
        @CompoundIndex(name = "affinity_recompute_task_status_available", def = "{'status': 1, 'availableAtIso': 1}"),
        @CompoundIndex(name = "affinity_recompute_task_target_status", def = "{'targetType': 1, 'status': 1}")
})
public class AffinityRecomputeTask {
    @Id
    private String id;

    @Version
    private Long version;

    @Indexed(name = "affinity_recompute_task_key", unique = true)
    private String taskKey;

    private String targetType;
    private String targetId;
    private List<String> reasons = new ArrayList<>();
    private String status;
    private Boolean pendingCounterTracked;
    private String availableAtIso;
    private String leaseUntilIso;
    private String workerId;
    private Boolean rerunRequested;
    private Integer attemptCount;
    private String lastError;
    private String completedAtIso;
    private String createdDate;
    private String updatedDate;
    private String updatedUser;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getTaskKey() { return taskKey; }
    public void setTaskKey(String taskKey) { this.taskKey = taskKey; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons == null ? new ArrayList<>() : new ArrayList<>(reasons); }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getPendingCounterTracked() { return pendingCounterTracked; }
    public void setPendingCounterTracked(Boolean pendingCounterTracked) { this.pendingCounterTracked = pendingCounterTracked; }
    public String getAvailableAtIso() { return availableAtIso; }
    public void setAvailableAtIso(String availableAtIso) { this.availableAtIso = availableAtIso; }
    public String getLeaseUntilIso() { return leaseUntilIso; }
    public void setLeaseUntilIso(String leaseUntilIso) { this.leaseUntilIso = leaseUntilIso; }
    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }
    public Boolean getRerunRequested() { return rerunRequested; }
    public void setRerunRequested(Boolean rerunRequested) { this.rerunRequested = rerunRequested; }
    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public String getCompletedAtIso() { return completedAtIso; }
    public void setCompletedAtIso(String completedAtIso) { this.completedAtIso = completedAtIso; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
