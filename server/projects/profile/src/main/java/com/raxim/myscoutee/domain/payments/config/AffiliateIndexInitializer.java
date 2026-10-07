package com.raxim.myscoutee.domain.payments.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class AffiliateIndexInitializer {
    private final List<MongoDatabaseFactory> databases;
    public AffiliateIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) { databases = List.of(real, demo); }

    @PostConstruct
    public void initialize() {
        for (var factory : databases) {
            var db = factory.getMongoDatabase();
            db.getCollection("affiliateLinks").createIndex(new Document("code", 1), new IndexOptions().unique(true).name("affiliate_code"));
            db.getCollection("affiliateRegistrations").createIndex(new Document("referrerUserId", 1), new IndexOptions().name("affiliate_referrer"));
        }
    }
}
