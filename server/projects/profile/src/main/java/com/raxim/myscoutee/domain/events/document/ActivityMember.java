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
@lombok.Getter @lombok.Setter
public class ActivityMember implements com.raxim.myscoutee.domain.events.api.MemberDirectory.Member, com.raxim.myscoutee.domain.events.api.CommunityMemberState.Mutable {
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
    public record GroupCounterState(long revision, String bucket,
            com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change pending) {}
    private GroupCounterState groupCounterState;
    private Long communityUpdates;

    public Boolean getVotingEligible() { return Boolean.TRUE.equals(votingEligible); }

    public void setVotingEligible(Boolean votingEligible) { this.votingEligible = Boolean.TRUE.equals(votingEligible); }

    public void setOrganizerOnly(Boolean organizerOnly) {
        this.organizerOnly = Boolean.TRUE.equals(organizerOnly);
    }

}
