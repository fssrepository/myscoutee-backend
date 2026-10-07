package com.raxim.myscoutee.domain.community.mapper;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.dto.CaseConversation;
public final class CaseConversationMapper {
    private CaseConversationMapper() {}
    public static CaseConversation toConversation(ServiceCase source) {
        if (source == null) return null;
        return new CaseConversation(source.id(), source.baseGroupId(), source.title(),
                source.activeParticipantAccountIds(), source.chatParticipantAccountIds(),
                source.offers().stream().map(offer -> new CaseConversation.Offer(offer.id(), offer.amount(), offer.currency(),
                        source.offerChatParticipantAccountIds(offer.id()))).toList());
    }
}
