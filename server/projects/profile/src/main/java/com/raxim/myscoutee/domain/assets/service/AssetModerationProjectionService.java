package com.raxim.myscoutee.domain.assets.service;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@org.springframework.stereotype.Service
public class AssetModerationProjectionService implements com.raxim.myscoutee.domain.assets.api.AssetModerationProjection {
    private final MongoTemplate mongo;
    public AssetModerationProjectionService(MongoTemplate mongo) { this.mongo = mongo; }
    public void apply(String sourceId, long version, String status) {
        com.raxim.myscoutee.common.config.mongo.MongoStatusUpdates.applyModeration(
                mongo, "assets", "assetId", sourceId, version, status);
    }
}
