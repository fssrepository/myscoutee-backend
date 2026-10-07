package com.raxim.myscoutee.domain.assets.api;
import java.util.List;
public interface AssetPrivacy {
    void purgeOwnedMedia(List<? extends AssetOwnership.Asset> assets);
    void deleteOwnedRecords(List<? extends AssetOwnership.Asset> assets);
    void purgeRemainingAssetRequests(String userId);
}
