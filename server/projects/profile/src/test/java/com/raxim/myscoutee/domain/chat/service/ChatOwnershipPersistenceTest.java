package com.raxim.myscoutee.domain.chat.service;

import static org.assertj.core.api.Assertions.*;
import java.util.List;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.ChatCounters.Change;
import com.raxim.myscoutee.domain.accounts.service.AccountChatCounterService;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository;

@Tag("embedded")
class ChatOwnershipPersistenceTest {
    @Test void ownerWritesPreserveCounterBucketsWorkspaceDeduplicationAndConsentVersionGuard() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "chat-ownership");
                mongo.getCollection("users").insertMany(List.of(
                    new Document("userId", "recipient").append("activities", new Document("chats", 2).append("chat", new Document("all", 2).append("contacts", 2))),
                    new Document("userId", "unrelated").append("activities", new Document("chats", 7))));
                var counters = new AccountChatCounterService(mongo);
                counters.increment(List.of(new Change("recipient", "contacts", 2), new Change("recipient", "event", 1)));
                counters.increment(new Change("recipient", "contacts", -3));
                var stored = mongo.getCollection("users").find(new Document("userId", "recipient")).first().get("activities", Document.class);
                assertThat(stored.getInteger("chats")).isEqualTo(2);
                assertThat(stored.get("chat", Document.class)).containsEntry("all", 2).containsEntry("contacts", 1).containsEntry("event", 1);
                assertThat(mongo.getCollection("users").find(new Document("userId", "unrelated")).first().get("activities", Document.class).getInteger("chats")).isEqualTo(7);
                mongo.getCollection("chats").insertMany(List.of(
                    new Document("id", "case-a").append("channelType", "supportCase").append("supportBaseGroupId", "workspace").append("supportCase", new Document("status", "pending")),
                    new Document("id", "case-a").append("channelType", "supportCase").append("supportBaseGroupId", "workspace").append("supportCase", new Document("status", "pending")),
                    new Document("id", "case-b").append("channelType", "appSupport").append("supportBaseGroupId", "workspace").append("supportCase", new Document("status", "picked")),
                    new Document("id", "other").append("channelType", "supportCase").append("supportBaseGroupId", "other").append("supportCase", new Document("status", "pending"))));
                var directory = new ChatDirectoryService(null);
                ReflectionTestUtils.setField(directory, "mongo", mongo);
                assertThat(directory.supportCaseCounts("workspace")).containsOnly(entry("pending", 1), entry("picked", 1));
                var permissions = new ContactPermissionService(new MongoRepositoryFactory(mongo).getRepository(ContactChatAccessRepository.class));
                String id = permissions.pairId("alice", "bob");
                assertThat(permissions.pairId("bob", "alice")).isEqualTo(id);
                var pending = permissions.save(new ContactPermissions.Change(id, "alice", "bob", "alice", "pending", "2026-10-07T00:00:00Z", null, null));
                var approval = new ContactPermissions.Change(id, "alice", "bob", "alice", "approved", pending.requestedAtIso(), "2026-10-07T01:00:00Z", pending.version());
                permissions.save(approval);
                assertThatThrownBy(() -> permissions.save(approval)).isInstanceOf(OptimisticLockingFailureException.class);
                assertThat(permissions.findForUser("bob")).singleElement().satisfies(value -> {
                    assertThat(value.status()).isEqualTo("approved");
                    assertThat(value.version()).isGreaterThan(pending.version());
                });
                assertThat(permissions.findForUser("unrelated")).isEmpty();
            }
        }
    }
}
