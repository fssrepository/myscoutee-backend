package com.raxim.myscoutee.domain.operator.repository;

import static org.assertj.core.api.Assertions.*;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.service.MeasurementEligibilityService;
import com.raxim.myscoutee.domain.affinity.service.RatingMeasurementService;
import com.raxim.myscoutee.domain.events.service.EventMeasurementService;
import com.raxim.myscoutee.domain.chat.service.ChatMeasurementService;
import com.raxim.myscoutee.domain.assets.service.AssetMeasurementService;

@Tag("embedded")
class QualifiedMauOwnerParityTest {
    @Test void ownerStreamsMatchFrozenUnionAcrossAllActionsEligibilityAndBatchBoundaries() {
        try (var mongo = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongo.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var template = new MongoTemplate(client, "qmau-owner-parity");
                var start = Instant.parse("2026-06-01T00:00:00Z");
                var end = Instant.parse("2026-07-01T00:00:00Z");
                var users = List.of(new Document("userId", "human"), new Document("userId", "blocked").append("status", "B"),
                    new Document("userId", "excluded").append("networkMeasurementExcluded", true),
                    new Document("userId", "admin").append("hostTier", "ADMIN"),
                    new Document("userId", "workspace").append("statusText", "Admin Workspace"),
                    new Document("userId", "inactive").append("profileStatus", "inactive"));
                template.getCollection("users").insertMany(users);
                for (var user : List.of("human", "blocked", "excluded", "admin", "workspace", "inactive", "absent")) {
                    template.getCollection("userRates").insertOne(new Document("ownerUserId", user).append("scoreGiven", 5)
                        .append("createdDate", start.plusSeconds(1).toString()).append("updatedDate", ""));
                    template.getCollection("activityMembers").insertOne(new Document("ownerType", "event").append("ownerId", "e")
                        .append("userId", user).append("status", "accepted").append("actionAtIso", start.plusSeconds(2).toString()));
                    template.getCollection("chatMessages").insertOne(new Document("id", user).append("chatId", "c")
                        .append("senderAvatar", new Document("id", user)).append("sentAtIso", start.plusSeconds(3).toString()));
                    template.getCollection("events").insertOne(new Document("creatorUserId", user).append("sourceId", "e"+user)
                        .append("status", "A").append("createdDate", start.plusSeconds(4).toString()));
                    template.getCollection("assetRequests").insertOne(new Document("userId", user).append("status", "accepted")
                        .append("booking", new Document("id", "b")).append("requestedAtIso", start.plusSeconds(5).toString()));
                    template.getCollection("eventFeedbackStates").insertOne(new Document("viewerUserId", user).append("eventId", "e")
                        .append("submittedAtIso", start.plusSeconds(6).toString()));
                }
                var rates = new ArrayList<Document>();
                for (int i=0;i<1007;i++) rates.add(new Document("ownerUserId", "human").append("scoreGiven", 7)
                    .append("updatedDate", start.plusSeconds(100+i).toString()));
                // Boundary and ineligible-action cases must remain excluded.
                rates.add(new Document("ownerUserId", "human").append("scoreGiven", 7).append("updatedDate", end.toString()));
                rates.add(new Document("ownerUserId", "human").append("scoreGiven", 0).append("updatedDate", start.toString()));
                template.getCollection("userRates").insertMany(rates);
                template.getCollection("chatMessages").insertOne(new Document("id", "deleted").append("chatId", "c")
                    .append("senderAvatar", new Document("id", "human")).append("sentAtIso", start.toString()).append("deletedAtIso", start.toString()));
                template.getCollection("eventFeedbackStates").insertOne(new Document("viewerUserId", "human").append("eventId", "not-joined").append("submittedAtIso", start.toString()));
                var expected = new ArrayList<QualifiedMauEvidenceRepository.QualifiedMauActionEvidence>();
                new LegacyQualifiedMauEvidence(template).read(start, end, expected::add);
                var actual = new ArrayList<QualifiedMauEvidenceRepository.QualifiedMauActionEvidence>();
                new MongoQualifiedMauEvidenceRepository(new RatingMeasurementService(template), new EventMeasurementService(template),
                    new ChatMeasurementService(template), new AssetMeasurementService(template), new MeasurementEligibilityService(template)).read(start, end, actual::add);
                assertThat(actual).containsExactlyElementsOf(expected).hasSize(1013);
                assertThat(actual).extracting(QualifiedMauEvidenceRepository.QualifiedMauActionEvidence::actionType)
                    .contains("rate", "join", "message", "host", "book", "verified-attendance");
            }
        }
    }
}
