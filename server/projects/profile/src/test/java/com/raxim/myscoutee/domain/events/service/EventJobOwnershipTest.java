package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.platform.api.JobAudience;

@Tag("embedded")
class EventJobOwnershipTest {
    @Test void eventOwnerRetainsWorkspaceJoinSemanticsBeforePaginationAndSnapshotWriteGuard() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "event-owner-jobs");
                var events = new ArrayList<Document>();
                var sessions = new ArrayList<Document>();
                for (int i = 0; i < 30; i++) {
                    events.add(new Document("_id", "event-"+i).append("sourceId", "source-"+i)
                        .append("workspaceGroupId", i < 20 ? "outside" : "inside").append("updatedDate", "before").append("status", "A"));
                    sessions.add(new Document("_id", "session-"+i).append("eventId", "source-"+i).append("status", "COMPLETED").append("revision", i));
                }
                events.add(new Document("_id", "extra-owner").append("sourceId", "source-20").append("workspaceGroupId", "outside"));
                sessions.add(new Document("_id", "orphan").append("eventId", "missing").append("status", "COMPLETED").append("revision", 40));
                mongo.getCollection("events").insertMany(events);
                mongo.getCollection("activityMingleSessions").insertMany(sessions);
                var audience = mock(JobAudience.class);
                var owner = new EventJobQueries(mongo, audience);
                for (boolean included : List.of(true, false)) {
                    when(audience.workspaceScope()).thenReturn(new JobAudience.WorkspaceScope(Set.of("inside"), included));
                    var query = Query.query(Criteria.where("status").is("COMPLETED")).with(Sort.by("revision")).skip(1).limit(3);
                    var expected = mongo.getCollection("activityMingleSessions").aggregate(List.of(
                        new Document("$match", query.getQueryObject()),
                        new Document("$lookup", new Document("from", "events").append("localField", "eventId").append("foreignField", "sourceId").append("as", "__jobOwner")),
                        new Document("$match", new Document("__jobOwner.0", new Document("$exists", true))),
                        new Document("$match", new Document("__jobOwner.workspaceGroupId", new Document(included ? "$in" : "$nin", List.of("inside")))),
                        new Document("$sort", query.getSortObject()), new Document("$skip", 1), new Document("$limit", 3)
                    )).map(row -> row.getString("_id")).into(new ArrayList<>());
                    assertThat(owner.findEventOwned(query, ActivityMingleSession.class, "eventId"))
                        .extracting(ActivityMingleSession::getId).containsExactlyElementsOf(expected).hasSize(3);
                }
                var ownership = EventTestSupport.ownership(null, mongo);
                var snapshot = ownership.findByIdOrSourceId("source-20");
                mongo.getCollection("events").updateOne(new Document("_id", "event-20"), new Document("$set", new Document("updatedDate", "concurrent")));
                assertThat(ownership.updateStatusIfSnapshotCurrent(snapshot, "B", "A")).isFalse();
                assertThat(mongo.getCollection("events").find(new Document("_id", "event-20")).first()).containsEntry("status", "A").doesNotContainKey("statusBeforeSuppression");
                assertThat(ownership.updateStatusIfSnapshotCurrent(ownership.findByIdOrSourceId("event-20"), "B", "A")).isTrue();
                assertThat(ownership.findByIdOrSourceId("event-20").getStatusBeforeSuppression()).isEqualTo("A");
            }
        }
    }
}
