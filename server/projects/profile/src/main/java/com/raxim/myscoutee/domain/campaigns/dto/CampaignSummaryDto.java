package com.raxim.myscoutee.domain.campaigns.dto;

import com.raxim.myscoutee.domain.campaigns.api.CampaignView;

/** Campaign identity, scope and display fields already consumed by chat/rating/integration callers. */
public record CampaignSummaryDto(String id, String workspaceGroupId, String ownerUserId, String title, String status) implements CampaignView {
    public static CampaignSummaryDto from(CampaignView value) {
        return value == null ? null : new CampaignSummaryDto(value.id(), value.workspaceGroupId(), value.ownerUserId(), value.title(), value.status());
    }
}
