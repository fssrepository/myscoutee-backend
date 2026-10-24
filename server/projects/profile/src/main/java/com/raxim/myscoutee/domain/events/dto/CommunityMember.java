package com.raxim.myscoutee.domain.events.dto;

/** Detached community membership state used to calculate conditional transitions. */
public class CommunityMember implements com.raxim.myscoutee.domain.events.api.CommunityMemberState.Mutable {
    private String id;
    public String getId() { return id; }
    public void setId(String value) { this.id = value; }
    private String ownerType;
    public String getOwnerType() { return ownerType; }
    public void setOwnerType(String value) { this.ownerType = value; }
    private String ownerId;
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String value) { this.ownerId = value; }
    private String userId;
    public String getUserId() { return userId; }
    public void setUserId(String value) { this.userId = value; }
    private String role;
    public String getRole() { return role; }
    public void setRole(String value) { this.role = value; }
    private String status;
    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }
    private String requestKind;
    public String getRequestKind() { return requestKind; }
    public void setRequestKind(String value) { this.requestKind = value; }
    private String pendingSource;
    public String getPendingSource() { return pendingSource; }
    public void setPendingSource(String value) { this.pendingSource = value; }
    private String invitedByUserId;
    public String getInvitedByUserId() { return invitedByUserId; }
    public void setInvitedByUserId(String value) { this.invitedByUserId = value; }
    private String metWhere;
    public String getMetWhere() { return metWhere; }
    public void setMetWhere(String value) { this.metWhere = value; }
    private String metAtIso;
    public String getMetAtIso() { return metAtIso; }
    public void setMetAtIso(String value) { this.metAtIso = value; }
    private String actionAtIso;
    public String getActionAtIso() { return actionAtIso; }
    public void setActionAtIso(String value) { this.actionAtIso = value; }
    private String updatedDate;
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String value) { this.updatedDate = value; }
    private String createdDate;
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String value) { this.createdDate = value; }
    private String communityAction;
    public String getCommunityAction() { return communityAction; }
    public void setCommunityAction(String value) { this.communityAction = value; }
    private String communityActor;
    public String getCommunityActor() { return communityActor; }
    public void setCommunityActor(String value) { this.communityActor = value; }
    private Boolean organizerOnly = false;
    public Boolean getOrganizerOnly() { return organizerOnly; }
    public void setOrganizerOnly(Boolean value) { this.organizerOnly = value; }
    private String managerGrantedByUserId;
    public String getManagerGrantedByUserId() { return managerGrantedByUserId; }
    public void setManagerGrantedByUserId(String value) { this.managerGrantedByUserId = value; }
    private Boolean votingEligible = false;
    public Boolean getVotingEligible() { return votingEligible; }
    public void setVotingEligible(Boolean value) { this.votingEligible = value; }
    private Long communityUpdates;
    public Long getCommunityUpdates() { return communityUpdates; }
    public void setCommunityUpdates(Long value) { this.communityUpdates = value; }
}
