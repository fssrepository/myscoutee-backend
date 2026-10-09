package com.raxim.myscoutee.domain.assets.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Account, payment and domain readers; grants no asset mutation capability. */
public interface AssetOwnershipReads {
    Optional<? extends AssetOwnership.Asset> findById(String id);
    List<? extends AssetOwnership.Asset> findByAssetIdIn(Collection<String> ids);
    List<? extends AssetOwnership.Asset> findByOwnerUserId(String id);
    List<? extends AssetOwnership.Asset> findAll();
    Optional<? extends AssetOwnership.Asset> findByAssetId(String assetId);
    Optional<? extends AssetOwnership.Asset> findByOwnerUserIdAndAssetId(String owner, String id);
    List<? extends AssetOwnership.Asset> findByOwnerUserIdOrderByUpdatedDateDesc(String owner);
    AssetOwnership.Asset findByIdOrAssetId(String id);
    AssetOwnership.Asset findFirstByAssetId(String id);
    List<? extends AssetOwnership.Asset> findByOwnersAndIds(Collection<String> owners, Collection<String> ids);
    boolean ownedExists(String owner, String id);
}
