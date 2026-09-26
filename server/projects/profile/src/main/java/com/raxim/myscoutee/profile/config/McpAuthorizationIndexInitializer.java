package com.raxim.myscoutee.profile.config;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;

/** Follows the existing index startup path; OAuth grants only exist in the real database. */
@Component
public class McpAuthorizationIndexInitializer {
    private final MongoDatabaseFactory database;
    public McpAuthorizationIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory database) {
        this.database = database;
    }
    @PostConstruct public void ensureIndexes() {
        var collection = database.getMongoDatabase().getCollection("mcpAuthorizations");
        collection.createIndex(new Document("clientId", 1), new IndexOptions().name("clientId"));
        collection.createIndex(new Document("accessHash", 1), new IndexOptions().name("accessHash"));
        collection.createIndex(new Document("refreshHash", 1), new IndexOptions().name("refreshHash"));
        collection.createIndex(new Document("expiresAt", 1), new IndexOptions().name("expiresAt").expireAfter(0L, TimeUnit.SECONDS));
    }
}
