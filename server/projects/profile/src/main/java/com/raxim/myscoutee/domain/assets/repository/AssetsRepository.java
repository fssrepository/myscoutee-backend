package com.raxim.myscoutee.domain.assets.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.assets.document.Asset;

public interface AssetsRepository extends MongoRepository<Asset, String> {
    Optional<Asset> findBySyncKey(String syncKey);

    Optional<Asset> findByAssetId(String assetId);

    List<Asset> findByAssetIdIn(Collection<String> assetIds);

    Optional<Asset> findByOwnerUserIdAndAssetId(String ownerUserId, String assetId);

    List<Asset> findByOwnerUserId(String ownerUserId);

    List<Asset> findByOwnerUserIdOrderByUpdatedDateDesc(String ownerUserId);

}
