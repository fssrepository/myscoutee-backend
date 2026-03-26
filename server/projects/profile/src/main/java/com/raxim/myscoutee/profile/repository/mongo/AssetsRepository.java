package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.Asset;

public interface AssetsRepository extends MongoRepository<Asset, String> {
    Optional<Asset> findBySyncKey(String syncKey);

    Optional<Asset> findByAssetId(String assetId);

    Optional<Asset> findByOwnerUserIdAndAssetId(String ownerUserId, String assetId);

    List<Asset> findByOwnerUserId(String ownerUserId);

    List<Asset> findByOwnerUserIdOrderByUpdatedDateDesc(String ownerUserId);
}
