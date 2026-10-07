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
        String collection = "assets";
        var query = Query.query(Criteria.where("assetId").is(sourceId).andOperator(new Criteria().orOperator(
                Criteria.where("moderationVersion").lte(version), Criteria.where("moderationVersion").exists(false))));
        var records = mongo.find(query, Document.class, collection);
        for (Document record : records) {
            String current = record.getString("status");
            String original = record.getString("moderationPreviousStatus");
            var update = new Update().set("moderationStatus", status).set("moderationVersion", version);
            if (status.equals("accepted")) {
                if (original != null) {
                    if ("B".equals(current)) update.set("status", original);
                    update.unset("moderationPreviousStatus");
                }
            } else if (!List.of("DR", "T", "D").contains(current == null ? "" : current)) {
                if (original == null) update.set("moderationPreviousStatus", current == null ? "A" : current);
                update.set("status", "B");
            }
            mongo.updateFirst(Query.query(Criteria.where("_id").is(record.get("_id")).andOperator(new Criteria().orOperator(
                    Criteria.where("moderationVersion").lte(version), Criteria.where("moderationVersion").exists(false)))), update, collection);
        }
    }
}
