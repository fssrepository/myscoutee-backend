package com.raxim.myscoutee.domain.assets.dto;

import java.util.List;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership;

/** Stored asset read view. Writes carry only AssetVersionDto and explicit changed fields. */
public record AssetOwnershipDto(
        String statusBeforeSuppression,
        String moderationStatus,
        com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto pricing,
        Boolean policiesEnabled,
        String trashedAtIso,
        String imageUrl,
        String sourceLink,
        String workspaceGroupId,
        String id,
        String syncKey,
        String assetId,
        String type,
        String title,
        String subtitle,
        String city,
        String category,
        Integer capacityTotal,
        Integer quantity,
        String details,
        List<String> routes,
        List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetPolicyRecord> policies,
        String visibility,
        Double affinity,
        Double boost,
        String createdDate,
        String createdUser,
        String updatedDate,
        String updatedUser,
        String status,
        String ownerUserId,
        String ownerReleasedAtIso,
        List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord> requests) implements AssetOwnership.Asset, com.raxim.myscoutee.common.dto.AuditFields.RecordFields, com.raxim.myscoutee.domain.assets.api.AssetScoringFacts.RecordFields {
    public AssetOwnershipDto {
        if (routes != null) routes = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(routes));
        if (policies != null) policies = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(policies));
        if (requests != null) requests = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(requests));
    }
    public static AssetOwnershipDto from(AssetOwnership.Asset value) {
        if (value == null) return null;
        return new AssetOwnershipDto(
                value.getStatusBeforeSuppression(),
                value.getModerationStatus(),
                value.getPricing(),
                value.getPoliciesEnabled(),
                value.getTrashedAtIso(),
                value.getImageUrl(),
                value.getSourceLink(),
                value.getWorkspaceGroupId(),
                value.getId(),
                value.getSyncKey(),
                value.getAssetId(),
                value.getType(),
                value.getTitle(),
                value.getSubtitle(),
                value.getCity(),
                value.getCategory(),
                value.getCapacityTotal(),
                value.getQuantity(),
                value.getDetails(),
                value.getRoutes(),
                value.getPolicies(),
                value.getVisibility(),
                value.getAffinity(),
                value.getBoost(),
                value.getCreatedDate(),
                value.getCreatedUser(),
                value.getUpdatedDate(),
                value.getUpdatedUser(),
                value.getStatus(),
                value.getOwnerUserId(),
                value.getOwnerReleasedAtIso(),
                value.getRequests());
    }
    @Override public String getStatusBeforeSuppression() { return statusBeforeSuppression; }
    @Override public String getModerationStatus() { return moderationStatus; }
    @Override public com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto getPricing() { return pricing; }
    @Override public Boolean getPoliciesEnabled() { return policiesEnabled; }
    @Override public String getTrashedAtIso() { return trashedAtIso; }
    @Override public String getImageUrl() { return imageUrl; }
    @Override public String getSourceLink() { return sourceLink; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getId() { return id; }
    @Override public String getSyncKey() { return syncKey; }
    @Override public String getAssetId() { return assetId; }
    @Override public Integer getCapacityTotal() { return capacityTotal; }
    @Override public Integer getQuantity() { return quantity; }
    @Override public String getDetails() { return details; }
    @Override public List<String> getRoutes() { return routes; }
    @Override public List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetPolicyRecord> getPolicies() { return policies; }
    @Override public String getVisibility() { return visibility; }
    @Override public Double getAffinity() { return affinity; }
    @Override public Double getBoost() { return boost; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getStatus() { return status; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getOwnerReleasedAtIso() { return ownerReleasedAtIso; }
    @Override public List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord> getRequests() { return requests; }
    @Override public String getType() { return type; }
    @Override public String getTitle() { return title; }
}
