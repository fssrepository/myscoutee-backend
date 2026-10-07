package com.raxim.myscoutee.domain.accounts.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class AccountDeletionWarningIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public AccountDeletionWarningIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void initialize() {
        for (var factory : databases) {
            var collection = factory.getMongoDatabase().getCollection("accountDeletionWarnings");
            collection.createIndex(new Document("status", 1).append("nextAttemptAtIso", 1).append("_id", 1),
                    new IndexOptions().name("account_warning_retry_due"));
            collection.createIndex(new Document("status", 1).append("startedAtIso", 1),
                    new IndexOptions().name("account_warning_stale_claim"));
        }
    }
}
