package com.raxim.myscoutee.domain.events.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class MingleIntegrationIndexInitializer {
    private final List<MongoDatabaseFactory> databases;
    public MingleIntegrationIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) { databases = List.of(real, demo); }

    @PostConstruct
    public void initialize() {
        for (var factory : databases) {
            var db = factory.getMongoDatabase();
            db.getCollection("activityMingleSessions").createIndex(new Document("status", 1).append("encountersPublished", 1).append("updatedAtIso", 1),
                    new IndexOptions().name("mingle_session_encounters_due"));
            db.getCollection("activityMingleRounds").createIndex(new Document("status", 1).append("meetingsProjected", 1).append("completedAtIso", 1),
                    new IndexOptions().name("mingle_round_meetings_due"));
            db.getCollection("activityMingleRounds").createIndex(new Document("eventId", 1).append("status", 1),
                    new IndexOptions().name("mingle_round_event_status"));
        }
    }
}
