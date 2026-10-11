package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;

import java.util.Collection;
public interface AssetPrivacy extends AccountPurgeActions {
    void purgeOwnedMedia(Collection<String> assetIds);
    void deleteOwnedRecords(Collection<String> assetIds);
    void purgeRemainingAssetRequests(String userId);

    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.ASSET_REQUESTS, context -> purgeRemainingAssetRequests(context.userId())),
                Map.entry(Action.OWNED_ASSET_MEDIA, context -> purgeOwnedMedia(context.discoveredAssetIds())),
                Map.entry(Action.OWNED_ASSET_RECORDS, context -> {
                    if (!context.discoveredAssetIds().isEmpty()) deleteOwnedRecords(context.discoveredAssetIds());
                }));
    }
}
