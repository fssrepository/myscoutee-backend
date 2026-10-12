package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;


import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Account, payment and domain readers; grants no asset mutation capability. */
public interface AssetOwnershipReads extends AccountPurgeActions {
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

    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.DISCOVER_OWNED_ASSETS, context -> {
                    var owned = findByOwnerUserId(context.userId());
                    context.rememberOwnedAssetIds((owned == null ? List.<AssetOwnership.Asset>of() : owned).stream()
                            .filter(java.util.Objects::nonNull).map(AssetOwnership.Asset::getAssetId).toList());
                }));
    }
}
