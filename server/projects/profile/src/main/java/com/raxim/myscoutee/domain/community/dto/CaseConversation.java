package com.raxim.myscoutee.domain.community.dto;
import java.util.List;
/** Detached conversation membership, computed by the case owner. */
public record CaseConversation(String id, String baseGroupId, String title,
        List<String> activeParticipantAccountIds, List<String> chatParticipantAccountIds, List<Offer> offers) {
    public CaseConversation {
        activeParticipantAccountIds = List.copyOf(activeParticipantAccountIds);
        chatParticipantAccountIds = List.copyOf(chatParticipantAccountIds);
        offers = List.copyOf(offers);
    }
    public List<String> offerChatParticipantAccountIds(String offerId) {
        return offers.stream().filter(offer -> offer.id().equals(offerId)).findFirst().map(Offer::participants).orElse(List.of());
    }
    public record Offer(String id, double amount, String currency, List<String> participants) {
        public Offer { participants = List.copyOf(participants); }
    }
}
