package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.domain.accounts.api.AssetAffinityProfile;

public record AssetAffinityProfileDto(String workspaceGroupId, Double affinity,
        HostConfidenceFactsDto hostConfidenceFacts) implements AssetAffinityProfile {
    public static AssetAffinityProfileDto from(AssetAffinityProfile value) {
        return value == null ? null : new AssetAffinityProfileDto(value.getWorkspaceGroupId(), value.getAffinity(), value.getHostConfidenceFacts());
    }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public Double getAffinity() { return affinity; }
    @Override public HostConfidenceFactsDto getHostConfidenceFacts() { return hostConfidenceFacts; }
}
