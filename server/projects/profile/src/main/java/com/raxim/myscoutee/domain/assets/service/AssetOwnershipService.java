package com.raxim.myscoutee.domain.assets.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;

@Service
public class AssetOwnershipService implements AssetOwnership {
    private final AssetsRepository assets;
    public AssetOwnershipService(AssetsRepository assets) { this.assets = assets; }
    @Override public Optional<com.raxim.myscoutee.domain.assets.document.Asset> findByAssetId(String assetId) { return assets.findByAssetId(assetId); }
}
