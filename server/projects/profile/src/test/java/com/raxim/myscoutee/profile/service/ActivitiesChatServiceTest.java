package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityChatMessage;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.repository.ActivityChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class ActivitiesChatServiceTest {
    @Mock
    private ActivityChatsRepository activityChatsRepository;
    @Mock
    private ActivityChatMessagesRepository activityChatMessagesRepository;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private ChatStreamPublisher chatStreamPublisher;
    @Mock
    private ChatPushNotificationService chatPushNotificationService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AdminMenuCounterService adminMenuCounterService;

    private ActivitiesChatService service;

    @BeforeEach
    void setUp() {
        service = new ActivitiesChatService(
                activityChatsRepository,
                activityChatMessagesRepository,
                mongoTemplate,
                usersRepository,
                homeUserProfileService,
                chatStreamPublisher,
                chatPushNotificationService,
                adminTelemetryService,
                adminMenuCounterService);
    }

    @AfterEach
    void tearDown() {
        service.shutdownChatWriteExecutor();
    }

    @Test
    void queryMessagesReusesUserLookupCacheForRepeatedParticipants() {
        ActivityChat viewerChat = chat("chat-1", "viewer", 0);
        ActivityChat senderChat = chat("chat-1", "sender", 0);
        List<ActivityChatMessage> messages = List.of(
                message("m1", "sender", "viewer", "2026-05-26T08:00:01Z"),
                message("m2", "sender", "viewer", "2026-05-26T08:00:02Z"),
                message("m3", "sender", "viewer", "2026-05-26T08:00:03Z"));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityChatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(activityChatMessagesRepository.findByChatIdOrderBySentAtIsoAsc("chat-1")).thenReturn(messages);
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer User", "VU")));

        var result = service.queryMessages("chat-1", "viewer");

        assertThat(result).hasSize(3);
        verify(usersRepository, times(1)).findByUserId("sender");
        verify(usersRepository, times(1)).findByUserId("viewer");
        verify(activityChatMessagesRepository, never()).saveAll(anyList());
        verify(activityChatsRepository, never()).save(any(ActivityChat.class));
    }

    @Test
    void queryChatsRepairsOwnerCopiesOnceAndAvoidsPerChatLookupWhenLoadedCopiesAreComplete() {
        ActivityChat viewerChat = chat("chat-1", "viewer", 0);
        ActivityChat senderChat = chat("chat-1", "sender", 0);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityChatsRepository.findByMemberIdsContaining("viewer")).thenReturn(List.of(viewerChat, senderChat));
        when(activityChatsRepository.findByOwnerUserIdOrderByDateIsoDesc("viewer")).thenReturn(List.of(viewerChat));

        assertThat(service.queryChats("viewer")).hasSize(1);
        assertThat(service.queryChats("viewer")).hasSize(1);

        verify(activityChatsRepository, times(1)).findByMemberIdsContaining("viewer");
        verify(activityChatsRepository, never()).findByChatId(anyString());
        verify(activityChatsRepository, never()).findByOwnerUserIdAndChatId(anyString(), anyString());
        verify(activityChatsRepository, never()).saveAll(anyList());
    }

    private ActivityChat chat(String chatId, String ownerUserId, int unread) {
        ActivityChat chat = new ActivityChat();
        chat.setMongoId("chat-owner-copy:" + ownerUserId + ":" + chatId);
        chat.setChatId(chatId);
        chat.setOwnerUserId(ownerUserId);
        chat.setTitle("Test chat");
        chat.setLastMessage("hello");
        chat.setDateIso("2026-05-26T08:00:00Z");
        chat.setMemberIds(List.of("viewer", "sender"));
        chat.setUnread(unread);
        return chat;
    }

    private ActivityChatMessage message(String messageId, String senderUserId, String readerUserId, String sentAtIso) {
        ActivityChatMessage message = new ActivityChatMessage();
        message.setMongoId("chat-message:chat-1:" + messageId);
        message.setChatId("chat-1");
        message.setId(messageId);
        message.setSender("Sender User");
        message.setSenderAvatar(avatar(senderUserId, "SU"));
        message.setText("hello");
        message.setSentAtIso(sentAtIso);
        message.setReadBy(List.of(readAvatar(readerUserId, "VU")));
        message.refreshMessageSearchFields();
        return message;
    }

    private ChatAvatarRecord avatar(String userId, String initials) {
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId(userId);
        avatar.setInitials(initials);
        avatar.setGender("man");
        return avatar;
    }

    private ChatReadAvatarRecord readAvatar(String userId, String initials) {
        ChatReadAvatarRecord reader = new ChatReadAvatarRecord();
        reader.setId(userId);
        reader.setInitials(initials);
        reader.setGender("man");
        return reader;
    }

    private Users user(String userId, String name, String initials) {
        Users user = new Users();
        user.setId(userId);
        user.setName(name);
        user.setInitials(initials);
        user.setGender("man");
        user.setStatus("A");
        user.setProfileStatus("public");
        return user;
    }
}
