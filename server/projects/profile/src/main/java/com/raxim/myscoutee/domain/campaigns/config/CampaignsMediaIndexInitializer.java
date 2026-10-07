package com.raxim.myscoutee.domain.campaigns.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class CampaignsMediaIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public CampaignsMediaIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (var factory : databases) {
            var database = factory.getMongoDatabase();
            database.getCollection("campaigns").createIndex(new Document("attachments.url", 1),
                    new IndexOptions().name("campaign_attachments").sparse(true));
        }
    }
}
