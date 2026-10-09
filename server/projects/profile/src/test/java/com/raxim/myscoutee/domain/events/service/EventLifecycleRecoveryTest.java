package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.service.ChatAttachmentLifecycleService;
import com.raxim.myscoutee.domain.email.api.ScheduledMessages;

@Tag("embedded")
class EventLifecycleRecoveryTest {
    @Test
    void lostDeliveryReplyRetainsWorkAndLateTrashCannotUndoRestoredAttachment() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "event-lifecycle");
                var events = new MongoRepositoryFactory(mongo).getRepository(ActivityEventsRepository.class);
                var attachments = new ChatAttachmentLifecycleService(mock(ChatMessagesRepository.class));
                ReflectionTestUtils.setField(attachments, "mongo", mongo);
                mongo.getCollection("chatMessages").insertOne(new Document("_id", "message").append("attachments", List.of(
                        new Document("type", "event").append("entityId", "event").append("title", "Keep title").append("status", "available"),
                        new Document("type", "asset").append("entityId", "other").append("status", "available"))));
                var notifications = mock(ScheduledMessages.class);
                Set<String> receipts = new HashSet<>();
                var loseReply = new java.util.concurrent.atomic.AtomicBoolean(true);
                when(notifications.scheduleEventLifecycleChangedOnce(anyString(), anyString(), any(), any(), any(), any())).thenAnswer(call -> {
                    receipts.add(call.getArgument(0));
                    if (loseReply.getAndSet(false)) throw new IllegalStateException("notification reply lost");
                    return null;
                });
                org.springframework.beans.factory.ObjectProvider<ActivityCounters> provider = mock(org.springframework.beans.factory.ObjectProvider.class);
                when(provider.getObject()).thenReturn(mock(ActivityCounters.class));
                var work = new EventLifecycleWork(mongo, null, attachments, notifications, mock(AffinityStatusChanges.class), provider);
                var event = new ActivityEvent(); event.setSourceId("event"); event.setOwnerUserId("owner"); event.setStatus(ActivityEvent.STATUS_ACTIVE); event = events.save(event);
                event.setStatus(ActivityEvent.STATUS_TRASHED); work.prepare(event, "owner", false, "trashed", "deleted", List.of("recipient"));
                var trashed = events.save(event);
                assertThatThrownBy(() -> work.deliver(trashed)).hasMessageContaining("reply lost");
                assertThat(events.findById(event.getId()).orElseThrow().getLifecycleWork()).hasSize(1);
                var restored = events.findById(event.getId()).orElseThrow(); restored.setStatus(ActivityEvent.STATUS_ACTIVE);
                work.prepare(restored, "owner", true, null, "modified", List.of("recipient"));
                restored = events.save(restored);
                work.deliver(restored);
                work.deliver(trashed); // delayed older sender after restoration
                assertThat(receipts).hasSize(2);
                assertThat(events.findById(event.getId()).orElseThrow().getLifecycleWork()).isEmpty();
                var message = mongo.getCollection("chatMessages").find().first();
                var values = message.getList("attachments", Document.class);
                assertThat(values.getFirst().getString("status")).isEqualTo("available");
                assertThat(values.getFirst().getString("title")).isEqualTo("Keep title");
                assertThat(values.get(1)).doesNotContainKey("lifecycleRevision");
            }
        }
    }
}
