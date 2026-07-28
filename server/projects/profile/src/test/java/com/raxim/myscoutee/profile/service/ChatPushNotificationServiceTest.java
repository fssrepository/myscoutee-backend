package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class ChatPushNotificationServiceTest {
    @Test
    void enqueueKeepsEveryNonSenderChatMemberForInboxMaterialization() {
        UsersRepository usersRepository = org.mockito.Mockito.mock(UsersRepository.class);
        NotificationOutboxService notificationOutboxService = org.mockito.Mockito.mock(NotificationOutboxService.class);
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.empty());
        ChatPushNotificationService service = new ChatPushNotificationService(
                usersRepository,
                notificationOutboxService);
        Chat chat = new Chat();
        chat.setChatId("chat-1");
        chat.setOwnerUserId("connected-viewer");
        chat.setMemberIds(List.of("sender", "connected-viewer", "offline-viewer"));
        ChatStreamEvent event = ChatStreamEvent.message(
                "chat-1",
                "message-1",
                "client-1",
                "sender",
                "Sender",
                "S",
                "",
                "",
                "Hello",
                "2026-07-27T20:00:00Z",
                List.of(),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                List.of(),
                List.of());

        service.notifyRecipients(List.of(chat), event);

        ArgumentCaptor<NotificationIntent> intent = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intent.capture());
        assertThat(intent.getValue().recipientUserIds())
                .containsExactly("connected-viewer", "offline-viewer")
                .doesNotContain("sender");
    }
}
