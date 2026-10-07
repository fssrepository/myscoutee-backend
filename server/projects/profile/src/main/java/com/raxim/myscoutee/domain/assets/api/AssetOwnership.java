package com.raxim.myscoutee.domain.assets.api;

import java.util.List;
import java.util.Optional;

public interface AssetOwnership {
    java.util.Optional<? extends Asset> findById(String id);
    boolean updateAffinity(Asset value, double affinity, double boost);
    java.util.List<? extends Asset> findByAssetIdIn(java.util.Collection<String> ids);
    java.util.List<? extends Asset> findByOwnerUserId(String id);
    java.util.List<? extends Asset> findAll();
    Optional<? extends Asset> findByAssetId(String assetId);
    interface Asset {
        String getStatusBeforeSuppression(); String getModerationStatus();
        com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto getPricing();
        Boolean getPoliciesEnabled(); String getTrashedAtIso();
        String getImageUrl(); String getSourceLink();
        String getWorkspaceGroupId();
        String getId();
        String getSyncKey();
        String getAssetId();
        String getType();
        String getTitle();
        String getSubtitle();
        String getCity();
        String getCategory();
        Integer getCapacityTotal();
        Integer getQuantity();
        String getDetails();
        List<String> getRoutes();
        List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetPolicyRecord> getPolicies();
        String getVisibility();
        Double getAffinity();
        Double getBoost();
        String getCreatedDate();
        String getCreatedUser();
        String getUpdatedDate();
        String getUpdatedUser();
        String getStatus(); String getOwnerUserId(); String getOwnerReleasedAtIso(); List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord> getRequests();
    }
    interface Request { String userId(); String status(); }
    interface Policy { String title(); String description(); Boolean required(); }
    Optional<? extends Asset> findByOwnerUserIdAndAssetId(String owner, String id);
    List<? extends Asset> findByOwnerUserIdOrderByUpdatedDateDesc(String owner);
    Asset findByIdOrAssetId(String id);
    Asset findFirstByAssetId(String id);
    List<? extends Asset> findByOwnersAndIds(java.util.Collection<String> owners, java.util.Collection<String> ids);
    boolean ownedExists(String owner, String id);
    boolean updateStatusIfSnapshotCurrent(Asset asset, String status, String previousStatus);
    Scope findJobScope(String id);
    record Scope(String workspaceGroupId, String ownerUserId, String creatorUserId) {}
}
