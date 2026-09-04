package com.raxim.myscoutee.profile.config;

import java.util.ArrayList;

import org.bson.Document;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.PartialIndexFilter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;

import jakarta.annotation.PostConstruct;

@Component
public class ActivityResourceIndexInitializer {
    private static final String LEGACY_SCOPE_INDEX = "activity_resource_owner_subevent_asset_owner";
    private static final String ACTIVE_SCOPE_INDEX = "activity_resource_active_owner_subevent_asset_owner";

    private final MongoTemplate mongoTemplate;

    public ActivityResourceIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void ensureActiveScopeIndex() {
        var collection = mongoTemplate.getCollection(
                mongoTemplate.getCollectionName(ActivitySubEventResource.class));
        var indexes = collection.listIndexes().into(new ArrayList<>());
        Document legacy = indexes.stream()
                .filter(index -> LEGACY_SCOPE_INDEX.equals(index.getString("name")))
                .findFirst()
                .orElse(null);
        if (legacy != null) {
            collection.dropIndex(LEGACY_SCOPE_INDEX);
        }
        Document existing = indexes.stream()
                .filter(index -> ACTIVE_SCOPE_INDEX.equals(index.getString("name")))
                .findFirst()
                .orElse(null);
        Document partial = existing == null
                ? null
                : existing.get("partialFilterExpression", Document.class);
        if (existing != null
                && (!Boolean.TRUE.equals(existing.getBoolean("unique"))
                        || partial == null
                        || !"A".equals(partial.getString("status")))) {
            collection.dropIndex(ACTIVE_SCOPE_INDEX);
        }
        mongoTemplate.indexOps(ActivitySubEventResource.class).createIndex(
                new Index()
                        .on("ownerId", Direction.ASC)
                        .on("subEventId", Direction.ASC)
                        .on("assetOwnerUserId", Direction.ASC)
                        .unique()
                        .partial(PartialIndexFilter.of(Criteria.where("status").is("A")))
                        .named(ACTIVE_SCOPE_INDEX));
    }
}
