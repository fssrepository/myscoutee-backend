package com.raxim.myscoutee.profile.data.document;

import java.util.List;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("serviceCases")
@CompoundIndexes({
    @CompoundIndex(name="case_participant_updated", def="{'participantAccountIds':1,'status':1,'updatedAtIso':-1,'_id':1}"),
    @CompoundIndex(name="case_community_updated", def="{'communityId':1,'status':1,'updatedAtIso':-1,'_id':1}"),
    @CompoundIndex(name="case_attention", def="{'attentionAccountIds':1,'status':1}")
})
public record ServiceCase(@Id String id, String baseGroupId, String communityId, String ownerAccountId,
        String title, String description, String caseType, String status, boolean audienceAll,
        List<String> audienceAccountIds, List<String> participantAccountIds, List<String> attentionAccountIds,
        List<Support> support, List<Recommendation> recommendations, List<Offer> offers,
        String scheduledTaskId, String dueAtIso, String createdAtIso, String updatedAtIso, @Version Long version,
        Map<String, String> memberStates, List<BoardTask> boardTasks, List<String> chatAccountIds) {
    public ServiceCase {
        chatAccountIds = chatAccountIds == null ? List.of() : List.copyOf(chatAccountIds);
        memberStates = memberStates == null ? Map.of() : Map.copyOf(memberStates);
        boardTasks = boardTasks == null ? List.of() : List.copyOf(boardTasks);
    }
    public boolean canTakeOver(String actor) {
        return ownerAccountId == null && !"trash".equals(status)
                && ("invited".equals(membershipStatus(actor)) || "accepted".equals(membershipStatus(actor)));
    }
    public String membershipStatus(String id) {
        if (!participantAccountIds.contains(id)) return null;
        // Existing cases predate explicit resident invitations; preserve their accepted membership.
        return memberStates.getOrDefault(id, support.stream().filter(s -> s.accountId().equals(id))
                .map(Support::status).findFirst().orElse("accepted"));
    }
    public List<String> activeParticipantAccountIds() {
        return participantAccountIds.stream().filter(id -> "accepted".equals(membershipStatus(id))).toList();
    }
    public List<String> chatParticipantAccountIds() {
        return activeParticipantAccountIds().stream().filter(id -> support.stream().noneMatch(s -> s.accountId().equals(id))
                || audienceAccountIds.contains(id) || id.equals(ownerAccountId) || chatAccountIds.contains(id)).toList();
    }
    public List<String> offerChatParticipantAccountIds(String offerId) {
        var offer = offers.stream().filter(o -> o.id().equals(offerId)).findFirst().orElse(null);
        if (offer == null) return List.of();
        return activeParticipantAccountIds().stream().filter(id -> id.equals(offer.providerAccountId())
                || support.stream().noneMatch(s -> s.accountId().equals(id))
                || audienceAccountIds.contains(id) || id.equals(ownerAccountId)).toList();
    }
    public List<String> notifiedParticipantAccountIds() {
        return participantAccountIds.stream().filter(id -> List.of("accepted", "invited").contains(membershipStatus(id))).toList();
    }
    public record BoardTask(String id, String title, String description, String status,
            List<String> assigneeAccountIds, List<String> dependsOnIds, String startAtIso, String endAtIso, List<String> offerIds) {
        public BoardTask { offerIds = offerIds == null ? List.of() : List.copyOf(offerIds); }
    }
    public record Support(String accountId, String serviceId, String status) {}
    public record Recommendation(String accountId, String providerAccountId, String serviceId) {}
    public record Offer(String id, String providerAccountId, String serviceId, double amount, String currency,
            String note, String status, String createdAtIso, String workPolicy, String refundPolicy,
            List<PolicyItemDto> workPolicies, List<PolicyItemDto> refundPolicies) {
        public Offer {
            workPolicies = workPolicies == null ? List.of() : List.copyOf(workPolicies);
            refundPolicies = refundPolicies == null ? List.of() : List.copyOf(refundPolicies);
        }
    }
}
