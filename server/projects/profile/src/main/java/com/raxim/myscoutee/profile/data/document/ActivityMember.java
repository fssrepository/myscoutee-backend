package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityMembers")
@CompoundIndexes({
        @CompoundIndex(name = "activity_member_owner_user", def = "{'ownerType': 1, 'ownerId': 1, 'userId': 1}", unique = true),
        @CompoundIndex(name = "activity_member_owner_action", def = "{'ownerType': 1, 'ownerId': 1, 'actionAtIso': -1}"),
        @CompoundIndex(name = "activity_member_owner_status", def = "{'ownerType': 1, 'ownerId': 1, 'status': 1, 'actionAtIso': -1}")
})
public class ActivityMember {
    @Id
    private String id;

    @Indexed(name = "activity_member_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String ownerType;
    private String ownerId;
    private String userId;
    private String role;
    private String status;
    private String pendingSource;
    private String requestKind;
    private String invitedByUserId;
    private String metAtIso;
    private String actionAtIso;
    private String metWhere;
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

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getOwnerType() {
        return ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPendingSource() {
        return pendingSource;
    }

    public void setPendingSource(String pendingSource) {
        this.pendingSource = pendingSource;
    }

    public String getRequestKind() {
        return requestKind;
    }

    public void setRequestKind(String requestKind) {
        this.requestKind = requestKind;
    }

    public String getInvitedByUserId() {
        return invitedByUserId;
    }

    public void setInvitedByUserId(String invitedByUserId) {
        this.invitedByUserId = invitedByUserId;
    }

    public String getMetAtIso() {
        return metAtIso;
    }

    public void setMetAtIso(String metAtIso) {
        this.metAtIso = metAtIso;
    }

    public String getActionAtIso() {
        return actionAtIso;
    }

    public void setActionAtIso(String actionAtIso) {
        this.actionAtIso = actionAtIso;
    }

    public String getMetWhere() {
        return metWhere;
    }

    public void setMetWhere(String metWhere) {
        this.metWhere = metWhere;
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
