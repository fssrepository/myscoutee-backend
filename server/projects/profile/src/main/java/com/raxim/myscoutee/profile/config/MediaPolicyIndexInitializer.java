package com.raxim.myscoutee.profile.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class MediaPolicyIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public MediaPolicyIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (var factory : databases) {
            var database = factory.getMongoDatabase();
            for (String name : List.of("assets", "events")) database.getCollection(name).createIndex(
                    new Document("imageUrl", 1), new IndexOptions().name("media_image_url").sparse(true));
            database.getCollection("events").createIndex(new Document("imageUrls", 1),
                    new IndexOptions().name("media_image_urls").sparse(true));
            database.getCollection("photoFeedPosts").createIndex(new Document("locationGeo", "2dsphere"),
                    new IndexOptions().name("feed_location"));
            database.getCollection("photoFeedPosts").createIndex(new Document("imageUrls", 1),
                    new IndexOptions().name("feed_media"));
            database.getCollection("contentModerationItems").createIndex(new Document("category", 1).append("status", 1).append("_id", 1), new IndexOptions().name("moderation_page"));
            database.getCollection("contentModerationItems").createIndex(new Document("status", 1).append("_id", 1), new IndexOptions().name("moderation_all_page"));
            database.getCollection("contentModerationItems").createIndex(new Document("status", 1).append("submittedAtIso", 1), new IndexOptions().name("moderation_due"));
            for (String field : List.of("attachments.url", "attachments.previewUrl")) {
                database.getCollection("chatMessages").createIndex(new Document(field, 1),
                        new IndexOptions().name("media_" + field.replace('.', '_')).sparse(true));
            }
        }
    }
}
