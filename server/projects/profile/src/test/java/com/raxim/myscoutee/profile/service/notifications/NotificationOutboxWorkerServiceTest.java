package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;

class NotificationOutboxWorkerServiceTest {
    @Test
    void chatDeliverySuppressesForegroundUsersImmediatelyBeforeDeviceLookup() {
        ChatWebSocketSessionRegistry sessionRegistry = org.mockito.Mockito.mock(ChatWebSocketSessionRegistry.class);
        when(sessionRegistry.isUserConnected("chat-1", "connected-viewer")).thenReturn(true);
        NotificationOutboxWorkerService service = service(sessionRegistry);
        NotificationOutboxItem item = item("chat-message", List.of(
                "connected-viewer",
                "offline-viewer"));
        item.setEntityType("chat");
        item.setEntityId("chat-1");
        item.setPayload(Map.of("chatId", "chat-1"));

        List<String> recipients = service.deliveryRecipientUserIds(item);

        assertThat(recipients).containsExactly("offline-viewer");
        verify(sessionRegistry).isUserConnected("chat-1", "connected-viewer");
        verify(sessionRegistry).isUserConnected("chat-1", "offline-viewer");
    }

    @Test
    void nonChatDeliveryKeepsItsAudienceUnchanged() {
        ChatWebSocketSessionRegistry sessionRegistry = org.mockito.Mockito.mock(ChatWebSocketSessionRegistry.class);
        NotificationOutboxWorkerService service = service(sessionRegistry);
        NotificationOutboxItem item = item("event-invite", List.of("viewer-1", "viewer-2"));
        item.setEntityType("event");
        item.setEntityId("event-1");

        List<String> recipients = service.deliveryRecipientUserIds(item);

        assertThat(recipients).containsExactly("viewer-1", "viewer-2");
        verifyNoInteractions(sessionRegistry);
    }

    @Test
    void workerLooksUpDevicesOnlyForChatUsersNotConnectedAtDeliveryTime() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setFirebaseEnabled(true);
        NotificationOutboxRepository outboxRepository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        UsersRepository usersRepository = org.mockito.Mockito.mock(UsersRepository.class);
        ChatWebSocketSessionRegistry sessionRegistry = org.mockito.Mockito.mock(ChatWebSocketSessionRegistry.class);
        MongoTemplate mongoTemplate = org.mockito.Mockito.mock(MongoTemplate.class);
        NotificationOutboxItem item = item(
                "chat-message",
                List.of("connected-viewer", "offline-viewer"));
        item.setId("outbox-1");
        item.setStatus(NotificationOutboxItem.STATUS_PENDING);
        item.setDeliveryStrategy("direct");
        item.setEntityId("chat-1");
        when(sessionRegistry.isUserConnected("chat-1", "connected-viewer")).thenReturn(true);
        when(mongoTemplate.find(any(Query.class), eq(NotificationOutboxItem.class))).thenReturn(List.of(item));
        when(mongoTemplate.updateFirst(
                any(Query.class),
                any(Update.class),
                eq(NotificationOutboxItem.class))).thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(outboxRepository.findById("outbox-1")).thenReturn(Optional.of(item));
        when(usersRepository.findByUserIdIn(List.of("offline-viewer"))).thenReturn(List.of());
        NotificationOutboxWorkerService service = new NotificationOutboxWorkerService(
                configProperties,
                outboxRepository,
                usersRepository,
                sessionRegistry,
                mongoTemplate,
                null,
                null,
                org.mockito.Mockito.mock(AdminTelemetryService.class),
                org.mockito.Mockito.mock(FirebaseMessagingGateway.class),
                50,
                500,
                5,
                300_000L,
                60_000L,
                0,
                24,
                null);

        service.processDueNotifications();

        verify(usersRepository).findByUserIdIn(List.of("offline-viewer"));
    }

    private NotificationOutboxWorkerService service(ChatWebSocketSessionRegistry sessionRegistry) {
        return new NotificationOutboxWorkerService(
                new ConfigProperties(),
                org.mockito.Mockito.mock(NotificationOutboxRepository.class),
                org.mockito.Mockito.mock(UsersRepository.class),
                sessionRegistry,
                org.mockito.Mockito.mock(MongoTemplate.class),
                null,
                null,
                org.mockito.Mockito.mock(AdminTelemetryService.class),
                org.mockito.Mockito.mock(FirebaseMessagingGateway.class),
                50,
                500,
                5,
                300_000L,
                60_000L,
                0,
                24,
                null);
    }

    private NotificationOutboxItem item(String type, List<String> recipientUserIds) {
        NotificationOutboxItem item = new NotificationOutboxItem();
        item.setNotificationType(type);
        item.setRecipientUserIds(recipientUserIds);
        return item;
    }
}
