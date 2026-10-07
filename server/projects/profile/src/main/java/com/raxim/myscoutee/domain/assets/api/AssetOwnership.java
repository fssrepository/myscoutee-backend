package com.raxim.myscoutee.domain.assets.api;

import java.util.List;
import java.util.Optional;

public interface AssetOwnership {
    boolean updateAffinity(Asset value, double affinity, double boost);
    java.util.List<? extends Asset> findByAssetIdIn(java.util.Collection<String> ids);
    java.util.List<? extends Asset> findByOwnerUserId(String id);
    java.util.List<? extends Asset> findAll();
    Optional<? extends Asset> findByAssetId(String assetId);
    interface Asset {
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
        List<? extends Policy> getPolicies();
        String getVisibility();
        Double getAffinity();
        Double getBoost();
        String getCreatedDate();
        String getCreatedUser();
        String getUpdatedDate();
        String getUpdatedUser();
        String getStatus(); String getOwnerUserId(); String getOwnerReleasedAtIso(); List<? extends Request> getRequests();
    }
    interface Request { String userId(); String status(); }
    interface Policy { String title(); String description(); Boolean required(); }
}
