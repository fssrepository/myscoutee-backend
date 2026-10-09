package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDto;
import com.raxim.myscoutee.domain.accounts.repository.ContactChatAccessOperations;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository;
import com.raxim.myscoutee.domain.chat.service.ContactPermissionService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;

@Tag("embedded")
class ContactChatAccessRecoveryTest {
    @Test
    void lostOwnerAndOutboxRepliesResumeWithoutDuplicateConsentCounterContactOrNotification() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "contact-workflow");
                var factory = new MongoRepositoryFactory(mongo);
                var users = factory.getRepository(UsersRepository.class);
                for (String id : List.of("alice", "bob")) {
                    var user = new Users(); user.setUserId(id); user.setProfileStatus("active");
                    user.setContactRequestsPending(0); users.save(user);
                }
                var owner = new ContactPermissionService(factory.getRepository(ContactChatAccessRepository.class));
                var failingOwner = mock(ContactPermissions.class);
                var dropReply = new AtomicBoolean(true);
                when(failingOwner.save(any())).thenAnswer(call -> {
                    var result = owner.save(call.getArgument(0));
                    if (dropReply.getAndSet(false)) throw new IllegalStateException("Injected lost permission reply after commit");
                    return result;
                });
                var notifications = mock(NotificationDelivery.class);
                Map<String, NotificationDelivery.NotificationIntent> outbox = new ConcurrentHashMap<>();
                var dropNotificationReply = new AtomicBoolean(false);
                when(notifications.enqueueOnce(anyString(), any())).thenAnswer(call -> {
                    outbox.putIfAbsent(call.getArgument(0), call.getArgument(1));
                    if (dropNotificationReply.getAndSet(false)) throw new IllegalStateException("Injected lost outbox reply after commit");
                    return java.util.Optional.empty();
                });
                var operations = new ContactChatAccessOperations(mongo);
                var databases = new ScheduledMongoSessionRunner("same", "same");
                var workflow = new ContactChatAccessWorkflow(operations, failingOwner, notifications, users, databases);
                String pair = owner.pairId("alice", "bob");
                var request = new ContactPermissions.Change(pair, "alice", "bob", "alice", "pending", "2026-10-09T00:00:00Z", null, null);
                var context = SecurityContextHolder.getContext();
                assertThatThrownBy(() -> workflow.accept("alice", "bob", null, request, contact("bob")))
                        .hasMessageContaining("lost permission reply");
                assertThat(SecurityContextHolder.getContext()).isSameAs(context);
                assertThat(owner.findById(pair)).isPresent();
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isZero();

                // New service/repository instances use only persisted command state.
                var restarted = new ContactChatAccessWorkflow(new ContactChatAccessOperations(mongo), owner, notifications, users, databases);
                // A second worker cannot execute while the first owns a live lease.
                var leased = operations.claim(operations.pending(pair).getFirst().getString("_id"));
                assertThat(leased).isNotNull();
                assertThatThrownBy(() -> restarted.finishPending(pair)).hasMessageContaining("processing is pending");
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isZero();
                mongo.getCollection("contactAccessOperations").updateOne(new Document("_id", leased.getString("_id")),
                        new Document("$set", new Document("leaseUntil", new java.util.Date(0))));
                dropNotificationReply.set(true);
                assertThatThrownBy(() -> restarted.finishPending(pair)).hasMessageContaining("lost outbox reply");
                assertThatThrownBy(() -> operations.complete(leased)).hasMessageContaining("lease changed");
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isEqualTo(1);
                restarted.finishPending(pair);
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isEqualTo(1);
                assertThat(outbox).hasSize(1);
                assertThat(operations.pending(pair)).isEmpty();

                var pending = owner.findById(pair).orElseThrow();
                var approval = new ContactPermissions.Change(pair, "alice", "bob", "alice", "approved", request.requestedAtIso(),
                        "2026-10-09T00:01:00Z", pending.version());
                dropNotificationReply.set(true);
                assertThatThrownBy(() -> restarted.accept("bob", "alice", null, approval, contact("alice")))
                        .hasMessageContaining("lost outbox reply");
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isZero();
                restarted.finishPending(pair);
                restarted.finishPending(pair);
                assertThat(users.findByUserId("bob").orElseThrow().getContactRequestsPending()).isZero();
                assertThat(outbox).hasSize(2);
                var contacts = mongo.getCollection("navigatorContacts").find(new Document("userId", "bob")).first();
                assertThat(contacts.getList("contacts", Document.class)).singleElement().satisfies(contact -> {
                    assertThat(contact.getString("userId")).isEqualTo("alice");
                    assertThat(contact.getList("methods", Document.class)).isEmpty();
                });
                assertThat(users.findByUserId("bob").orElseThrow().getActivities().contacts()).isEqualTo(1);
                assertThat(mongo.getCollection("contactChatAccess").countDocuments()).isEqualTo(1);
                assertThat(mongo.getCollection("contactAccessOperations").countDocuments(new Document("state", "complete"))).isEqualTo(2);
                assertThat(SecurityContextHolder.getContext()).isSameAs(context);
            }
        }
    }

    private NavigatorContactDto contact(String id) {
        return new NavigatorContactDto(id, id, id, "", "", "", "", "", "2026-10-09T00:00:00Z", "2026-10-09T00:01:00Z", List.of());
    }
}
