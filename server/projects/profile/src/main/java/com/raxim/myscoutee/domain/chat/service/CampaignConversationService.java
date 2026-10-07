package com.raxim.myscoutee.domain.chat.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.chat.api.CampaignConversations;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;

@Service
public class CampaignConversationService implements CampaignConversations {
    private final ChatsRepository chats;
    public CampaignConversationService(ChatsRepository chats) { this.chats = chats; }
    @Override public List<Interaction> interactions(String actorId, String targetId) {
        return chats.findByOwnerUserIdAndChannelTypeAndMemberIdsContaining(actorId, "campaign", targetId).stream()
                .filter(chat -> chat.getMemberIds().contains(actorId))
                .map(chat -> new Interaction(chat.getOwnerId(), chat.getDateIso())).toList();
    }
}
