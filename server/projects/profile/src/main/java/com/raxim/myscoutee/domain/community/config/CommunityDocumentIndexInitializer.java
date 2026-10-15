package com.raxim.myscoutee.domain.community.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class CommunityDocumentIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public CommunityDocumentIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (var factory : databases) {
            var database = factory.getMongoDatabase();
            database.getCollection("communityAnnouncements").createIndex(new Document("attachments.url", 1),
                    new IndexOptions().name("announcement_attachment"));
            database.getCollection("communityAnnouncements").createIndex(new Document("documentCleanupPending", 1).append("_id", 1),
                    new IndexOptions().name("announcement_document_cleanup").partialFilterExpression(new Document("documentCleanupPending", true)));
        }
    }
}
