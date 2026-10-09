package com.raxim.myscoutee.domain.assets.service;

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
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.service.ChatAttachmentLifecycleService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;

@Tag("embedded")
class AssetLifecycleRecoveryTest {
    @Test
    void lostDeliveryReplyRetainsWorkAndLateTrashCannotUndoRestoredAttachment() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "asset-lifecycle");
                var assets = new MongoRepositoryFactory(mongo).getRepository(AssetsRepository.class);
                var attachments = new ChatAttachmentLifecycleService(mock(ChatMessagesRepository.class));
                ReflectionTestUtils.setField(attachments, "mongo", mongo);
                mongo.getCollection("chatMessages").insertOne(new Document("_id", "message").append("attachments", List.of(
                        new Document("type", "asset").append("entityId", "asset").append("title", "Keep title").append("status", "available"),
                        new Document("type", "event").append("entityId", "other").append("status", "available"))));
                var notifications = mock(NotificationDelivery.class);
                Set<String> receipts = new HashSet<>();
                var loseReply = new java.util.concurrent.atomic.AtomicBoolean(true);
                when(notifications.enqueueOnce(anyString(), any())).thenAnswer(call -> {
                    receipts.add(call.getArgument(0));
                    if (loseReply.getAndSet(false)) throw new IllegalStateException("notification reply lost");
                    return Optional.empty();
                });
                var work = new AssetLifecycleWork(mongo, null, attachments, notifications, mock(AffinityStatusChanges.class), mock(ActivityCounters.class));
                var asset = new Asset(); asset.setAssetId("asset"); asset.setOwnerUserId("owner"); asset.setStatus("A"); asset = assets.save(asset);
                asset.setStatus("T"); work.prepare(asset, "owner", false, "trashed", intent("asset-unavailable"), "owner");
                var trashed = assets.save(asset);
                assertThatThrownBy(() -> work.deliver(trashed)).hasMessageContaining("reply lost");
                assertThat(assets.findById(asset.getId()).orElseThrow().getLifecycleWork()).hasSize(1);
                var restored = assets.findById(asset.getId()).orElseThrow(); restored.setStatus("A");
                work.prepare(restored, "owner", true, null, intent("asset-restored"), "owner");
                restored = assets.save(restored);
                work.deliver(restored);
                work.deliver(trashed); // delayed older sender after restoration
                assertThat(receipts).hasSize(2);
                assertThat(assets.findById(asset.getId()).orElseThrow().getLifecycleWork()).isEmpty();
                var message = mongo.getCollection("chatMessages").find().first();
                var values = message.getList("attachments", Document.class);
                assertThat(values.getFirst().getString("status")).isEqualTo("available");
                assertThat(values.getFirst().getString("title")).isEqualTo("Keep title");
                assertThat(values.get(1)).doesNotContainKey("lifecycleRevision");
            }
        }
    }
    private NotificationDelivery.NotificationIntent intent(String kind) {
        return new NotificationDelivery.NotificationIntent(kind, "asset", "asset", "users", List.of("recipient"),
                "Title", "Body", "/game", "", "", kind, Map.of(), "owner");
    }
}
