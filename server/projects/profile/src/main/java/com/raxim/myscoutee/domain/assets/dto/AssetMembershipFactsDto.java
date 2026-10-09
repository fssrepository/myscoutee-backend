package com.raxim.myscoutee.domain.assets.dto;

import java.util.List;
import com.raxim.myscoutee.domain.assets.api.AssetMembershipFacts;

public record AssetMembershipFactsDto(String ownerUserId, String status, String ownerReleasedAtIso,
        List<AssetMembershipRequestDto> requests) implements AssetMembershipFacts.Asset {
    public AssetMembershipFactsDto {
        if (requests != null) requests = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(requests));
    }
    public static AssetMembershipFactsDto from(AssetMembershipFacts.Asset asset) {
        return new AssetMembershipFactsDto(asset.getOwnerUserId(), asset.getStatus(), asset.getOwnerReleasedAtIso(),
                asset.getRequests() == null ? null : asset.getRequests().stream()
                    .map(request -> request == null ? null : new AssetMembershipRequestDto(request.userId(), request.status())).toList());
    }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getStatus() { return status; }
    @Override public String getOwnerReleasedAtIso() { return ownerReleasedAtIso; }
    @Override public List<AssetMembershipRequestDto> getRequests() { return requests; }
}
