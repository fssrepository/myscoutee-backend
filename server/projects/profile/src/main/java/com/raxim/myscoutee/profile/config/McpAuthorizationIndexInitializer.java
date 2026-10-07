package com.raxim.myscoutee.profile.config;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;

/** Existing integration index startup owner; preserve real/demo database isolation. */
@Component
public class McpAuthorizationIndexInitializer {
    private final java.util.List<MongoDatabaseFactory> databases;
    public McpAuthorizationIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        this.databases = java.util.List.of(real, demo);
    }
    @PostConstruct public void ensureIndexes() {
        for (var database : databases) ensure(database.getMongoDatabase());
    }
    private void ensure(com.mongodb.client.MongoDatabase database) {
        var collection = database.getCollection("mcpAuthorizations");
        collection.createIndex(new Document("clientId", 1), new IndexOptions().name("clientId"));
        collection.createIndex(new Document("accessHash", 1), new IndexOptions().name("accessHash"));
        collection.createIndex(new Document("refreshHash", 1), new IndexOptions().name("refreshHash"));
        collection.createIndex(new Document("expiresAt", 1), new IndexOptions().name("expiresAt").expireAfter(0L, TimeUnit.SECONDS));
        var events = database.getCollection("mcpEventSubscriptions");
        events.createIndex(new Document("ownerUserId", 1).append("name", 1).append("resourceId", 1).append("enabled", 1),
                new IndexOptions().name("mcp_events_owner_event"));
        events.createIndex(new Document("ownerUserId", 1).append("tokenId", 1).append("clientId", 1).append("callbackUrl", 1),
                new IndexOptions().name("mcp_events_callback"));
        events.createIndex(new Document("ownerUserId", 1).append("enabled", 1).append("expiresAt", 1),
                new IndexOptions().name("mcp_events_owner_active"));
        events.createIndex(new Document("deleteAfter", 1), new IndexOptions().name("deleteAfter").expireAfter(0L, TimeUnit.SECONDS));
        var deliveries = database.getCollection("integrationWebhookDeliveries");
        deliveries.createIndex(new Document("protocol", 1).append("status", 1).append("ownerUserId", 1),
                new IndexOptions().name("integration_delivery_protocol_status"));
        deliveries.createIndex(new Document("status", 1).append("nextAttemptAtIso", 1).append("createdAtIso", 1),
                new IndexOptions().name("integration_webhook_delivery_due"));
        deliveries.createIndex(new Document("deleteAfter", 1), new IndexOptions().name("deleteAfter").expireAfter(0L, TimeUnit.SECONDS));
    }
}
