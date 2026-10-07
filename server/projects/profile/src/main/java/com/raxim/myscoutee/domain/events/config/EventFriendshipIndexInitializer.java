package com.raxim.myscoutee.domain.events.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

/** Index-only startup setup for both session databases; never synthesizes friendships. */
@Component
public class EventFriendshipIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public EventFriendshipIndexInitializer(
            @Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        this.databases = List.of(real, demo);
    }

    @PostConstruct
    public void ensureIndexes() {
        for (MongoDatabaseFactory factory : databases) {
            var database = factory.getMongoDatabase();
            database.getCollection("events").createIndex(
                    new Document("friendshipsProjected", 1).append("endAtIso", 1).append("sourceId", 1),
                    new IndexOptions().name("event_friendships_due"));
        }
    }
}
