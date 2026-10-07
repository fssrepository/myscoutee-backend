package com.raxim.myscoutee.domain.campaigns.api;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface CampaignCatalog {
    CampaignView find(String id);
    Map<String, ? extends CampaignView> findByIds(Collection<String> ids);
    boolean ownedExists(String ownerUserId, String id);
    MediaReference mediaReference(List<String> urls);
    record MediaReference(String workspaceGroupId, String status) {}
}
