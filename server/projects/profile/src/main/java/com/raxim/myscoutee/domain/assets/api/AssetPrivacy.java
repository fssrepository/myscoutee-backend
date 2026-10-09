package com.raxim.myscoutee.domain.assets.api;
import java.util.Collection;
public interface AssetPrivacy {
    void purgeOwnedMedia(Collection<String> assetIds);
    void deleteOwnedRecords(Collection<String> assetIds);
    void purgeRemainingAssetRequests(String userId);
}
