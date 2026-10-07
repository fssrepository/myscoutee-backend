package com.raxim.myscoutee.domain.assets.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class AssetsMediaIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public AssetsMediaIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (var factory : databases) {
            var database = factory.getMongoDatabase();
            database.getCollection("assets").createIndex(new Document("imageUrl", 1), new IndexOptions().name("media_image_url").sparse(true));
        }
    }
}
