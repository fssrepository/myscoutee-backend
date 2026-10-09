package com.raxim.myscoutee.domain.campaigns.api;

import java.util.List;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignMediaVisibilityDto;

/** Facts consumed by media policy, independently of the full campaign catalog. */
public interface CampaignMediaVisibility {
    CampaignMediaVisibilityDto mediaReference(List<String> urls);
}
