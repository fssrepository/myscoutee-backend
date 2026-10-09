package com.raxim.myscoutee.domain.campaigns.api;

import java.util.Collection;
import java.util.Map;

public interface CampaignCatalog {
    CampaignView find(String id);
    Map<String, ? extends CampaignView> findByIds(Collection<String> ids);
    boolean ownedExists(String ownerUserId, String id);
}
