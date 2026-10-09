package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.assets.dto.AssetVersionDto;

/** Owner-executed optimistic projections; no foreign asset document is accepted. */
public interface AssetDerivedUpdates {
    boolean updateAffinityVersion(AssetVersionDto version, double affinity, double boost);
    boolean updateStatusVersionIfCurrent(AssetVersionDto version, String status, String previousStatus);
}
