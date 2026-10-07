package com.raxim.myscoutee.domain.chat.api;

import java.util.List;

public interface CampaignConversations {
    List<Interaction> interactions(String actorId, String targetId);
    record Interaction(String campaignId, String dateIso) {}
}
