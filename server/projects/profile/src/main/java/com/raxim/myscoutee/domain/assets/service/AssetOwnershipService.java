package com.raxim.myscoutee.domain.assets.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership;
import com.raxim.myscoutee.domain.assets.dto.AssetVersionDto;
import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;
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
        if (asset == null) return false;
        boolean updated = updateAffinityVersion(new AssetVersionDto(asset.getId(), asset.getUpdatedDate()), nextAffinity, nextBoost);
        if (updated) {
            ((com.raxim.myscoutee.domain.assets.document.Asset) asset).setAffinity(nextAffinity);
            ((com.raxim.myscoutee.domain.assets.document.Asset) asset).setBoost(nextBoost);
        }
        return updated;
    }
    @Override public boolean updateAffinityVersion(AssetVersionDto version, double nextAffinity, double nextBoost) {
        if (version == null) {
            return false;
        }
        String id = normalizeId(version.id());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(version.updatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongo.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                com.raxim.myscoutee.domain.assets.document.Asset.class);
        return result.getMatchedCount() > 0;
    }
    private String normalizeId(String value) { return value == null ? "" : value.trim(); }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.assets.document.Asset> findById(String id) { return assets.findById(id); }
    @Override public Optional<com.raxim.myscoutee.domain.assets.document.Asset> findByOwnerUserIdAndAssetId(String owner, String id) { return assets.findByOwnerUserIdAndAssetId(owner, id); }
    @Override public java.util.List<com.raxim.myscoutee.domain.assets.document.Asset> findByOwnerUserIdOrderByUpdatedDateDesc(String owner) { return assets.findByOwnerUserIdOrderByUpdatedDateDesc(owner); }
    @Override public Asset findByIdOrAssetId(String id) { return mongo.findOne(Query.query(new Criteria().orOperator(Criteria.where("_id").is(id), Criteria.where("assetId").is(id))), com.raxim.myscoutee.domain.assets.document.Asset.class); }
    @Override public Asset findFirstByAssetId(String id) { return mongo.findOne(Query.query(Criteria.where("assetId").is(id)), com.raxim.myscoutee.domain.assets.document.Asset.class); }
    @Override public java.util.List<com.raxim.myscoutee.domain.assets.document.Asset> findByOwnersAndIds(java.util.Collection<String> owners, java.util.Collection<String> ids) { return mongo.find(new Query(Criteria.where("ownerUserId").in(owners).and("assetId").in(ids)), com.raxim.myscoutee.domain.assets.document.Asset.class); }
    @Override public boolean ownedExists(String owner, String id) { return mongo.exists(Query.query(Criteria.where("ownerUserId").is(owner).and("assetId").is(id)), com.raxim.myscoutee.domain.assets.document.Asset.class); }

    @Override public boolean updateStatusIfSnapshotCurrent(Asset asset, String nextStatus, String previousStatus) {
        return asset != null && updateStatusVersionIfCurrent(new AssetVersionDto(asset.getId(), asset.getUpdatedDate()), nextStatus, previousStatus);
    }
    @Override public boolean updateStatusVersionIfCurrent(AssetVersionDto version, String nextStatus, String previousStatus) {
        if (version == null) {
            return false;
        }
        String id = normalizeId(version.id());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(version.updatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        Update update = new Update().set("status", nextStatus);
        if (StringUtils.hasText(previousStatus)) {
            update.set("statusBeforeSuppression", previousStatus);
        } else {
            update.unset("statusBeforeSuppression");
        }
        UpdateResult result = mongo.updateFirst(new Query(criteria), update, com.raxim.myscoutee.domain.assets.document.Asset.class);
        return result.getMatchedCount() > 0;
    }
    @Override public AssetJobScopeDto findJobScope(String id) {
        var record = mongo.findOne(Query.query(Criteria.where("assetId").is(id)), org.bson.Document.class, "assets");
        return record == null ? null : new AssetJobScopeDto(record.getString("workspaceGroupId"), record.getString("ownerUserId"), record.getString("creatorUserId"));
    }
}
