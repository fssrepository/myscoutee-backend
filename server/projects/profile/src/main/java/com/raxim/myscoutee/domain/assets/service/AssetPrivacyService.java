package com.raxim.myscoutee.domain.assets.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.assets.api.*;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.media.api.MediaStorage;
@Service
public class AssetPrivacyService implements AssetPrivacy {
    private final AssetsRepository assetsRepository;
    private final MongoTemplate mongoTemplate;
    private final MediaStorage media;
    public AssetPrivacyService(AssetsRepository assets, MongoTemplate mongo, MediaStorage media) {
        assetsRepository = assets; mongoTemplate = mongo; this.media = media;
    }
    @Override public void purgeOwnedMedia(List<? extends AssetOwnership.Asset> assets) {
        for (AssetOwnership.Asset asset : assets == null ? List.<AssetOwnership.Asset>of() : assets) {
            if (asset != null) media.deletePublicObjectOrThrow(asset.getImageUrl());
        }
    }
    @Override public void deleteOwnedRecords(List<? extends AssetOwnership.Asset> assets) {
        if (assets != null && !assets.isEmpty()) assetsRepository.deleteAll(assets.stream().map(value -> (Asset) value).toList());
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
