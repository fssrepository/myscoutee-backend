package com.raxim.myscoutee.domain.assets.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.assets.document.AssetRequest;

public interface AssetRequestsRepository extends MongoRepository<AssetRequest, String> {
    List<AssetRequest> findByOwnerUserIdAndAssetIdAndStatusNot(
            String ownerUserId,
            String assetId,
            String status);

}
