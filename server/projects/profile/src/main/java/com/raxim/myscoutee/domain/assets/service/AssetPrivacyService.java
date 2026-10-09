package com.raxim.myscoutee.domain.assets.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.assets.api.*;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.media.api.MediaCleanup;
@Service
public class AssetPrivacyService implements AssetPrivacy {
    private final AssetsRepository assetsRepository;
    private final MongoTemplate mongoTemplate;
    private final MediaCleanup media;
    public AssetPrivacyService(AssetsRepository assets, MongoTemplate mongo, MediaCleanup media) {
        assetsRepository = assets; mongoTemplate = mongo; this.media = media;
    }
    @Override public void purgeOwnedMedia(Collection<String> assetIds) {
        for (Asset asset : ownedAssets(assetIds)) {
            if (asset != null) media.deletePublicObjectOrThrow(asset.getImageUrl());
        }
    }
    @Override public void deleteOwnedRecords(Collection<String> assetIds) {
        List<Asset> assets = ownedAssets(assetIds);
        if (!assets.isEmpty()) assetsRepository.deleteAll(assets);
    }
    private List<Asset> ownedAssets(Collection<String> assetIds) {
        return assetIds == null || assetIds.isEmpty() ? List.of() : assetsRepository.findByAssetIdIn(assetIds);
    }
    @Override public void purgeRemainingAssetRequests(String userId) {
        List<Asset> assetsWithRequests = mongoTemplate.find(
                Query.query(Criteria.where("requests.userId").is(userId)),
                Asset.class);
        List<Asset> changedAssets = new ArrayList<>();
        for (Asset asset : assetsWithRequests == null ? List.<Asset>of() : assetsWithRequests) {
            if (asset == null || asset.getRequests() == null || asset.getRequests().isEmpty()) {
                continue;
            }
            List<com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord> retainedRequests = asset.getRequests().stream()
                    .filter(request -> request != null && !userId.equals(safeText(request.userId())))
                    .toList();
            if (retainedRequests.size() != asset.getRequests().size()) {
                asset.setRequests(new ArrayList<>(retainedRequests));
                changedAssets.add(asset);
            }
        }
        if (!changedAssets.isEmpty()) {
            assetsRepository.saveAll(changedAssets);
        }
    }
    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
