package com.raxim.myscoutee.domain.assets.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;

@Service
public class AssetOwnershipService implements AssetOwnership {
    @org.springframework.beans.factory.annotation.Autowired private MongoTemplate mongo;
    private final AssetsRepository assets;
    public AssetOwnershipService(AssetsRepository assets) { this.assets = assets; }
    @Override public Optional<com.raxim.myscoutee.domain.assets.document.Asset> findByAssetId(String assetId) { return assets.findByAssetId(assetId); }
    @Override public java.util.List<com.raxim.myscoutee.domain.assets.document.Asset> findByAssetIdIn(java.util.Collection<String> ids) { return assets.findByAssetIdIn(ids); }
    @Override public java.util.List<com.raxim.myscoutee.domain.assets.document.Asset> findByOwnerUserId(String id) { return assets.findByOwnerUserId(id); }
    @Override public java.util.List<com.raxim.myscoutee.domain.assets.document.Asset> findAll() { return assets.findAll(); }
    @Override public boolean updateAffinity(AssetOwnership.Asset asset, double nextAffinity, double nextBoost) {
        if (asset == null) {
            return false;
        }
        String id = normalizeId(asset.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(asset.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongo.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                com.raxim.myscoutee.domain.assets.document.Asset.class);
        if (result.getMatchedCount() <= 0) {
            return false;
        }
        ((com.raxim.myscoutee.domain.assets.document.Asset) asset).setAffinity(nextAffinity);
        ((com.raxim.myscoutee.domain.assets.document.Asset) asset).setBoost(nextBoost);
        return true;
    }
    private String normalizeId(String value) { return value == null ? "" : value.trim(); }
}
