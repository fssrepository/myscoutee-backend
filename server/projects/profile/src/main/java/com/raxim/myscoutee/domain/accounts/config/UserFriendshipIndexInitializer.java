package com.raxim.myscoutee.domain.accounts.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

/** Index-only startup setup for both session databases; never synthesizes friendships. */
@Component
public class UserFriendshipIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public UserFriendshipIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        this.databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (MongoDatabaseFactory factory : databases) {
            var database = factory.getMongoDatabase();
            var friendships = database.getCollection("userFriendships");
            friendships.createIndex(new Document("leftUserId", 1), new IndexOptions().name("leftUserId"));
            friendships.createIndex(new Document("rightUserId", 1), new IndexOptions().name("rightUserId"));

        }
    }
}
