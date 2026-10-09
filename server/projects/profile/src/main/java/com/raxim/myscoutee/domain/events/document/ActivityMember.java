package com.raxim.myscoutee.domain.events.document;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityMembers")
@CompoundIndexes({
        @CompoundIndex(name = "activity_member_owner_user", def = "{'ownerType': 1, 'ownerId': 1, 'userId': 1}", unique = true),
        @CompoundIndex(name = "activity_member_owner_action", def = "{'ownerType': 1, 'ownerId': 1, 'actionAtIso': -1}"),
        @CompoundIndex(name = "activity_member_owner_status", def = "{'ownerType': 1, 'ownerId': 1, 'status': 1, 'actionAtIso': -1}"),
        @CompoundIndex(name = "activity_member_user_action", def = "{'ownerType': 1, 'userId': 1, 'actionAtIso': -1}"),
        @CompoundIndex(name = "activity_member_user_owner_status", def = "{'userId': 1, 'ownerId': 1, 'status': 1}"),
        @CompoundIndex(name = "activity_member_status_request", def = "{'ownerType': 1, 'status': 1, 'requestKind': 1}"),
        @CompoundIndex(name = "activity_member_qmau_join", def = "{'ownerType': 1, 'status': 1, 'actionAtIso': 1, 'userId': 1}")
})
public class ActivityMember implements com.raxim.myscoutee.domain.events.api.MemberDirectory.Member {
    @Id
    private String id;

    @Indexed(name = "activity_member_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String ownerType;
    private String ownerId;
    private String userId;
    private String role;
    private String status;
    private String statusBeforeSuppression;
    private String suppressionRootOwnerId;
    private String suppressedAtIso;
    private String pendingSource;
    private String requestKind;
    private String invitedByUserId;
    // Written by the invitation command; never accepted from member update DTOs.
    private Boolean eventVipInvitation;
    private String eventVipAcceptedAtIso;
    private String eventVipOfferedAtIso;
    private PricingConfigDto eventVipOfferedPricing;
    private List<EventVipPriceAudit> eventVipPriceAudit;

    public record EventVipPriceAudit(String invitationId, String action, String actorUserId,
            String atIso, PricingConfigDto pricing) { }
    private String managerGrantedByUserId;
    private Boolean organizerOnly = false;
    private Boolean votingEligible = false;
    private String metAtIso;
    private String actionAtIso;
    private String metWhere;
    private String attendanceStatus;
    private String checkedInAtIso;
    private String checkedInByUserId;
    private String checkedInTicketId;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;
    // Unread member changes, maintained by the notification write path.
    private String communityAction;
    private String communityActor;
    public String getCommunityAction() { return communityAction; }
    public void setCommunityAction(String value) { communityAction = value; }
    public String getCommunityActor() { return communityActor; }
    public void setCommunityActor(String value) { communityActor = value; }
    private Long communityUpdates;
    public Long getCommunityUpdates() { return communityUpdates; }
    public void setCommunityUpdates(Long value) { communityUpdates = value; }

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

    public String getStatusBeforeSuppression() {
        return statusBeforeSuppression;
    }

    public void setStatusBeforeSuppression(String statusBeforeSuppression) {
        this.statusBeforeSuppression = statusBeforeSuppression;
    }

    public String getSuppressionRootOwnerId() {
        return suppressionRootOwnerId;
    }

    public void setSuppressionRootOwnerId(String suppressionRootOwnerId) {
        this.suppressionRootOwnerId = suppressionRootOwnerId;
    }

    public String getSuppressedAtIso() {
        return suppressedAtIso;
    }

    public void setSuppressedAtIso(String suppressedAtIso) {
        this.suppressedAtIso = suppressedAtIso;
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

    public String getEventVipOfferedAtIso() { return eventVipOfferedAtIso; }
    public void setEventVipOfferedAtIso(String value) { eventVipOfferedAtIso = value; }
    public PricingConfigDto getEventVipOfferedPricing() { return eventVipOfferedPricing; }
    public void setEventVipOfferedPricing(PricingConfigDto value) { eventVipOfferedPricing = value; }
    public List<EventVipPriceAudit> getEventVipPriceAudit() { return eventVipPriceAudit; }
    public void setEventVipPriceAudit(List<EventVipPriceAudit> value) { eventVipPriceAudit = value; }

    public Boolean getEventVipInvitation() { return eventVipInvitation; }

    public void setEventVipInvitation(Boolean value) { eventVipInvitation = value; }

    public String getEventVipAcceptedAtIso() { return eventVipAcceptedAtIso; }

    public void setEventVipAcceptedAtIso(String value) { eventVipAcceptedAtIso = value; }

    public String getManagerGrantedByUserId() {
        return managerGrantedByUserId;
    }

    public void setManagerGrantedByUserId(String managerGrantedByUserId) {
        this.managerGrantedByUserId = managerGrantedByUserId;
    }

    public Boolean getVotingEligible() { return Boolean.TRUE.equals(votingEligible); }

    public void setVotingEligible(Boolean votingEligible) { this.votingEligible = Boolean.TRUE.equals(votingEligible); }

    public Boolean getOrganizerOnly() {
        return organizerOnly;
    }

    public void setOrganizerOnly(Boolean organizerOnly) {
        this.organizerOnly = Boolean.TRUE.equals(organizerOnly);
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

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public String getCheckedInAtIso() {
        return checkedInAtIso;
    }

    public void setCheckedInAtIso(String checkedInAtIso) {
        this.checkedInAtIso = checkedInAtIso;
    }

    public String getCheckedInByUserId() {
        return checkedInByUserId;
    }

    public void setCheckedInByUserId(String checkedInByUserId) {
        this.checkedInByUserId = checkedInByUserId;
    }

    public String getCheckedInTicketId() {
        return checkedInTicketId;
    }

    public void setCheckedInTicketId(String checkedInTicketId) {
        this.checkedInTicketId = checkedInTicketId;
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
