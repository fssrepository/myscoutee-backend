package com.raxim.myscoutee.domain.assets.repository;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.assets.document.AssetRequest;

@Repository
public class AssetAvailabilityRepository {
    private final AssetRequestsRepository assetRequestsRepository;

    public AssetAvailabilityRepository(AssetRequestsRepository assetRequestsRepository) {
        this.assetRequestsRepository = assetRequestsRepository;
    }

    public List<AssetRequest> findRequestsByOwnerAsset(String ownerUserId, String assetId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedOwnerUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return List.of();
        }
        return assetRequestsRepository.findByOwnerUserIdAndAssetIdAndStatusNot(
                normalizedOwnerUserId,
                normalizedAssetId,
                "D");
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }
}
