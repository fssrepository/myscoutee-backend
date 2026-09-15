package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.test.util.ReflectionTestUtils;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;
import com.raxim.myscoutee.profile.service.notifications.FirebaseMessagingGateway.FirebaseBatchSendResult;

class NotificationDeliveryDecisionTest {
    private final ConfigProperties config = new ConfigProperties();
    private final NotificationOutboxRepository outbox = mock(NotificationOutboxRepository.class);
    private final UsersRepository users = mock(UsersRepository.class);
    private final ChatWebSocketSessionRegistry sessions = mock(ChatWebSocketSessionRegistry.class);
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final FirebaseMessagingGateway gateway = mock(FirebaseMessagingGateway.class);

    @Test
    void enqueueSnapshotsOnlyEnabledDevicesButKeepsTheWholeInboxAudience() {
        config.setFirebaseEnabled(true);
        Users allowed = user("allowed", device("phone", "test-token", true));
        Users denied = user("denied", device("denied-phone", "denied-token", false));
        Users absent = user("absent");
        when(users.findByUserIdIn(anyList())).thenReturn(List.of(allowed, denied, absent));
        UserNotificationService inbox = mock(UserNotificationService.class);
        @SuppressWarnings("unchecked") ObjectProvider<UserNotificationService> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(inbox);
        NotificationOutboxService producer = new NotificationOutboxService(outbox, null, null, null, provider);
        producer.configureDelivery(config, users, sessions);
        when(outbox.save(any())).thenAnswer(call -> call.getArgument(0));

        NotificationOutboxItem item = producer.enqueue(intent(List.of("allowed", "denied", "absent"))).orElseThrow();

        assertThat(item.getFirebaseDeliveryRequested()).isTrue();
        assertThat(item.getFirebaseDevices()).containsEntry("denied", Map.of()).containsEntry("absent", Map.of());
        assertThat(item.getFirebaseDevices().get("allowed"))
                .containsExactlyEntriesOf(Map.of("phone", NotificationOutboxService.sha256("test-token")));
        assertThat(item.getFirebaseDevices().toString()).doesNotContain("test-token", "denied-token");
        assertThat(item.getRecipientUserIds()).containsExactly("allowed", "denied", "absent");
        verify(inbox).materialize(item);
        verify(users).findByUserIdIn(List.of("allowed", "denied", "absent"));
    }

    @Test
    void unavailableFirebaseDecisionSurvivesActivationAndRecipientMerge() {
        NotificationOutboxService producer = producer();
        NotificationOutboxItem first = producer.enqueue(intent(List.of("viewer"))).orElseThrow();
        String syncKey = first.getSyncKey();
        when(outbox.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(
                anyString(), anyCollection(), anyString())).thenReturn(Optional.of(first));
        config.setFirebaseEnabled(true);

        NotificationOutboxItem merged = producer.enqueue(intent(List.of("viewer", "other"))).orElseThrow();

        assertThat(merged.getId()).isEqualTo(first.getId());
        assertThat(merged.getSyncKey()).isEqualTo(syncKey);
        assertThat(merged.getFirebaseDeliveryRequested()).isFalse();
        assertThat(merged.getFirebaseDevices()).containsEntry("viewer", Map.of()).containsEntry("other", Map.of());
        verifyNoInteractions(users, sessions);
    }

    @Test
    void deniedRecipientIsNotReevaluatedWhenThePendingMessageIsMerged() {
        config.setFirebaseEnabled(true);
        when(users.findByUserIdIn(List.of("viewer"))).thenReturn(List.of(user("viewer", device("phone", "test-token", false))));
        NotificationOutboxService producer = producer();
        NotificationOutboxItem first = producer.enqueue(intent(List.of("viewer"))).orElseThrow();
        when(outbox.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(
                anyString(), anyCollection(), anyString())).thenReturn(Optional.of(first));
        when(users.findByUserIdIn(List.of("other"))).thenReturn(List.of(user("other", device("other-phone", "other-token", true))));

        NotificationOutboxItem merged = producer.enqueue(intent(List.of("viewer", "other"))).orElseThrow();

        assertThat(merged.getFirebaseDevices().get("viewer")).isEmpty();
        assertThat(merged.getFirebaseDevices().get("other")).containsKey("other-phone");
        verify(users, times(1)).findByUserIdIn(List.of("viewer"));
    }

    @Test
    void workerCompletesAnExplicitNoFirebaseDecisionWithoutLookupOrSend() {
        NotificationOutboxItem item = queued(false, Map.of("viewer", Map.of()));
        worker(item).processDueNotifications();

        verifyNoInteractions(users, sessions, gateway);
        assertThat(completionUpdates()).anySatisfy(update -> {
            assertThat(update.getString("status")).isEqualTo("sent");
            assertThat(update.getInteger("tokenSuccessCount")).isZero();
            assertThat(update.getInteger("tokenFailureCount")).isZero();
        });
    }

    @Test
    void workerUsesSavedTargetsEvenWhenCurrentConfigurationHasChanged() throws Exception {
        NotificationOutboxItem item = queued(true,
                Map.of("viewer", Map.of("phone", NotificationOutboxService.sha256("test-token")), "denied", Map.of()));
        when(users.findByUserIdIn(List.of("viewer"))).thenReturn(List.of(user("viewer",
                device("phone", "test-token", true), device("new-phone", "new-token", true))));
        when(gateway.sendAll(anyList(), eq(List.of("test-token")))).thenReturn(FirebaseBatchSendResult.allSuccessful(1));

        worker(item).processDueNotifications();

        verify(gateway).sendAll(anyList(), eq(List.of("test-token")));
        verify(users).findByUserIdIn(List.of("viewer"));
        verifyNoInteractions(sessions);
    }

    @Test
    void revokedAndRotatedDevicesCannotReceiveAnOldQueuedMessage() {
        NotificationOutboxItem item = queued(true, Map.of("viewer", Map.of(
                "revoked", NotificationOutboxService.sha256("old-token"),
                "rotated", NotificationOutboxService.sha256("previous-token"))));
        when(users.findByUserIdIn(List.of("viewer"))).thenReturn(List.of(user("viewer",
                device("revoked", "old-token", false), device("rotated", "replacement-token", true))));

        worker(item).processDueNotifications();

        verifyNoInteractions(gateway);
        assertThat(completionUpdates()).anySatisfy(update -> assertThat(update.getInteger("tokenSuccessCount")).isZero());
    }

    @Test
    void retryKeepsTheOriginalIdentityAndDeliveryDecision() throws Exception {
        NotificationOutboxItem item = queued(true, Map.of("viewer", Map.of("phone", NotificationOutboxService.sha256("test-token"))));
        Map<String, Map<String, String>> plan = item.getFirebaseDevices();
        when(users.findByUserIdIn(List.of("viewer"))).thenReturn(List.of(user("viewer", device("phone", "test-token", true))));
        when(gateway.sendAll(anyList(), anyList())).thenThrow(new IllegalStateException("temporary provider failure"))
                .thenReturn(FirebaseBatchSendResult.allSuccessful(1));
        NotificationOutboxWorkerService worker = worker(item);
        worker.processDueNotifications();
        ReflectionTestUtils.setField(worker, "lastScheduledPollAt", Instant.EPOCH);
        worker.processDueNotifications();

        verify(gateway, times(2)).sendAll(anyList(), eq(List.of("test-token")));
        verify(outbox, times(2)).findById("queued-item");
        assertThat(item.getFirebaseDeliveryRequested()).isTrue();
        assertThat(item.getFirebaseDevices()).isEqualTo(plan);
        assertThat(completionUpdates()).allSatisfy(update ->
                assertThat(update).doesNotContainKeys("firebaseDeliveryRequested", "firebaseDevices", "syncKey", "_id"));
        assertThat(completionUpdates()).anySatisfy(update -> {
            assertThat(update.getString("status")).isEqualTo("pending");
            assertThat(update.getInteger("retryCount")).isEqualTo(1);
        });
    }

    private NotificationOutboxService producer() {
        when(outbox.save(any())).thenAnswer(call -> call.getArgument(0));
        NotificationOutboxService producer = new NotificationOutboxService(outbox);
        producer.configureDelivery(config, users, sessions);
        return producer;
    }

    private NotificationOutboxWorkerService worker(NotificationOutboxItem item) {
        when(mongo.find(any(Query.class), eq(NotificationOutboxItem.class))).thenReturn(List.of(item));
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(NotificationOutboxItem.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));
        when(outbox.findById(item.getId())).thenReturn(Optional.of(item));
        return new NotificationOutboxWorkerService(config, outbox, users, sessions, mongo, null, null,
                mock(AdminTelemetryService.class), gateway, 50, 500, 5, 300000L, 60000L, 0, 24, null);
    }

    private List<Document> completionUpdates() {
        ArgumentCaptor<Update> updates = ArgumentCaptor.forClass(Update.class);
        verify(mongo, atLeastOnce()).updateFirst(any(Query.class), updates.capture(), eq(NotificationOutboxItem.class));
        return updates.getAllValues().stream().map(update -> (Document) update.getUpdateObject().get("$set")).toList();
    }

    private NotificationOutboxItem queued(boolean requested, Map<String, Map<String, String>> devices) {
        NotificationOutboxItem item = new NotificationOutboxItem();
        item.setId("queued-item");
        item.setSyncKey("unchanged-logical-key");
        item.setNotificationType("chat-message");
        item.setStatus("pending");
        item.setDeliveryStrategy("direct");
        item.setFirebaseDeliveryRequested(requested);
        item.setFirebaseDevices(devices);
        item.setRecipientUserIds(List.copyOf(devices.keySet()));
        item.setPayload(Map.of());
        return item;
    }

    private NotificationOutboxService.NotificationIntent intent(List<String> recipients) {
        return new NotificationOutboxService.NotificationIntent("chat-message", "chat", "chat-1", "users", recipients,
                "Chat", "Message", "/game", null, null, "chat-1", Map.of("chatId", "chat-1"), "sender");
    }

    private Users user(String id, Users.UserDeviceRecord... devices) {
        Users user = new Users(); user.setUserId(id); user.setDevices(List.of(devices)); return user;
    }

    private Users.UserDeviceRecord device(String id, String token, boolean enabled) {
        Users.UserDeviceRecord device = new Users.UserDeviceRecord();
        device.setDeviceId(id); device.setFirebaseToken(token); device.setNotificationsEnabled(enabled); return device;
    }
}
