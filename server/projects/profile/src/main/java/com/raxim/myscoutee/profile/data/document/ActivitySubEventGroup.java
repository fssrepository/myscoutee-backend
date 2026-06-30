package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activitySubEventGroups")
@CompoundIndexes({
        @CompoundIndex(name = "activity_subevent_group_record_id", def = "{'recordId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_group_owner_group", def = "{'ownerId': 1, 'groupId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_group_owner", def = "{'ownerId': 1}")
})
public class ActivitySubEventGroup {
    @Id
    private String id;

    @Indexed(name = "activity_subevent_group_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String recordId;
    private String status;
    private String ownerId;
    private String groupId;
    private String name;
    private Integer capacityMin;
    private Integer capacityMax;
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
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getCapacityMin() { return capacityMin; }
    public void setCapacityMin(Integer capacityMin) { this.capacityMin = capacityMin; }
    public Integer getCapacityMax() { return capacityMax; }
    public void setCapacityMax(Integer capacityMax) { this.capacityMax = capacityMax; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
