package com.raxim.myscoutee.domain.assets.api;

import java.util.List;
import java.util.Optional;

/** Existing facts used by membership authorization; mutation stays with the owner. */
public interface AssetMembershipFacts {
    Optional<? extends Asset> findByAssetId(String assetId);
    interface Asset {
        String getOwnerUserId();
        String getStatus();
        String getOwnerReleasedAtIso();
        List<? extends Request> getRequests();
    }
    interface Request { String userId(); String status(); }
}
