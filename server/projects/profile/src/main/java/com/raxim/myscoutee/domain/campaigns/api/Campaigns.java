package com.raxim.myscoutee.domain.campaigns.api;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

public interface Campaigns {
    DiscoveryProfile actor(String requestedId);
    CampaignView visible(DiscoveryProfile actor, String id);
    Item detail(DiscoveryProfile actor, String id);
    HistoryPage history(DiscoveryProfile actor, String targetUserId, int pageSize, String cursor);
    Page page(DiscoveryProfile actor, String scope, String status, String search, String kind, String category,
            String sort, int pageSize, String cursor);
    Item save(DiscoveryProfile actor, Save request);
    Item createImported(DiscoveryProfile actor, Save request, String allocatedId);
    Item action(DiscoveryProfile actor, String id, Command request);
}
