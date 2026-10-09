package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.assets.api.AssetScoringFacts;
import com.raxim.myscoutee.domain.accounts.api.AssetAffinityProfile;

public interface AssetAffinityScores {
    double resolveAssetAffinity(AssetScoringFacts asset, AssetAffinityProfile owner);
    double resolveAssetBoost(AssetScoringFacts asset, AssetAffinityProfile owner);
}
