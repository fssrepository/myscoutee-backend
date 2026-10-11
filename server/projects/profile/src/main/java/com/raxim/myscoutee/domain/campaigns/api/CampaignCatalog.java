package com.raxim.myscoutee.domain.campaigns.api;

import com.raxim.myscoutee.domain.campaigns.dto.CampaignOrganizerContactDto;
import java.util.Collection;
import java.util.Map;

public interface CampaignCatalog {
    CampaignView find(String id);
    CampaignOrganizerContactDto organizerContact(
            String id, String viewerId, String workspaceGroupId);
    Map<String, ? extends CampaignView> findByIds(Collection<String> ids);
    boolean ownedExists(String ownerUserId, String id);
}
