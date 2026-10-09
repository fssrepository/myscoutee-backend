package com.raxim.myscoutee.domain.affinity.dto;

import com.raxim.myscoutee.domain.affinity.api.CampaignGraphs;
public record CampaignGraphDto(java.util.List<String> userIds, java.util.List<AffinityEdgeDto> edges) {
    public static CampaignGraphDto from(CampaignGraphs.Snapshot s) {
        return new CampaignGraphDto(s.userIds(), s.edges() == null ? null : s.edges().stream().map(e -> e == null ? null : AffinityEdgeDto.from(e)).toList());
    }
    public CampaignGraphs.Snapshot snapshot() { return new CampaignGraphs.Snapshot(userIds, edges); }
}
