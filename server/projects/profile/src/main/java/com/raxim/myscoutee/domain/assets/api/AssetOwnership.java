package com.raxim.myscoutee.domain.assets.api;

import java.util.List;
import java.util.Optional;

public interface AssetOwnership {
    Optional<? extends Asset> findByAssetId(String assetId);
    interface Asset {
        String getStatus(); String getOwnerUserId(); String getOwnerReleasedAtIso(); List<? extends Request> getRequests();
    }
    interface Request { String userId(); String status(); }
}
