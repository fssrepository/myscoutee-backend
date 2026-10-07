package com.raxim.myscoutee.domain.campaigns.api;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

public interface Campaigns {
    WorkspaceProfile actor(String requestedId);
    CampaignView visible(WorkspaceProfile actor, String id);
    Item detail(WorkspaceProfile actor, String id);
    HistoryPage history(WorkspaceProfile actor, String targetUserId, int pageSize, String cursor);
    Page page(WorkspaceProfile actor, String scope, String status, String search, String kind, String category,
            String sort, int pageSize, String cursor);
    Item save(WorkspaceProfile actor, Save request);
    Item createImported(WorkspaceProfile actor, Save request, String allocatedId);
    Item action(WorkspaceProfile actor, String id, Command request);
}
