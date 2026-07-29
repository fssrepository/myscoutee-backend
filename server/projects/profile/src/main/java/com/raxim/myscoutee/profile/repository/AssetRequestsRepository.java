package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AssetRequest;

public interface AssetRequestsRepository extends MongoRepository<AssetRequest, String> {
    List<AssetRequest> findByOwnerUserIdAndAssetId(String ownerUserId, String assetId);

}
