package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;

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
    @Mock
    private AccessControlService accessControlService;

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
                adminMenuCounterService,
                accessControlService);
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
    void queryChatsReadsOwnerCopiesWithoutRepairingMemberCopies() {
        ActivityChat viewerChat = chat("chat-1", "viewer", 0);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityChatsRepository.findByOwnerUserIdOrderByDateIsoDesc("viewer")).thenReturn(List.of(viewerChat));

        assertThat(service.queryChats("viewer")).hasSize(1);
        assertThat(service.queryChats("viewer")).hasSize(1);

        verify(activityChatsRepository, times(2)).findByOwnerUserIdOrderByDateIsoDesc("viewer");
        verify(activityChatsRepository, never()).findByMemberIdsContaining("viewer");
        verify(activityChatsRepository, never()).findByChatId(anyString());
        verify(activityChatsRepository, never()).findByOwnerUserIdAndChatId(anyString(), anyString());
        verify(activityChatsRepository, never()).saveAll(anyList());
    }

    @Test
    void queryChatPageSortsLocalIsoSeedDatesByRequestedDateOrder() {
        ActivityChat oldChat = chat("zz-old", "viewer", 0, "2026-03-01T07:48:00");
        ActivityChat newChat = chat("aa-new", "viewer", 0, "2026-03-01T14:03:00");
        ActivityChat midChat = chat("mm-mid", "viewer", 0, "2026-02-28T17:48:00");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityChatsRepository.findByOwnerUserId("viewer")).thenReturn(List.of(oldChat, newChat, midChat));

        var result = service.queryChatPage(
                "viewer",
                "all",
                "date",
                "desc",
                null,
                null,
                10,
                null,
                null,
                false,
                null);

        assertThat(result.items())
                .extracting(item -> item.id())
                .containsExactly("aa-new", "zz-old", "mm-mid");
    }

    @Test
    void queryChatPageFiltersChannelContextsOnServer() {
        ActivityChat eventChat = chat("chat-event", "viewer", 0, "2026-03-01T07:48:00", "mainEvent");
        ActivityChat subEventChat = chat("chat-sub-event", "viewer", 0, "2026-03-01T08:48:00", "optionalSubEvent");
        ActivityChat groupChat = chat("chat-group", "viewer", 0, "2026-03-01T09:48:00", "groupSubEvent");
        ActivityChat serviceChat = chat("chat-service", "viewer", 0, "2026-03-01T10:48:00", "serviceEvent");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityChatsRepository.findByOwnerUserId("viewer")).thenReturn(List.of(
                eventChat,
                subEventChat,
                groupChat,
                serviceChat));

        var all = service.queryChatPage(
                "viewer",
                "all",
                "date",
                "desc",
                null,
                null,
                10,
                null,
                null,
                false,
                null);
        var serviceOnly = service.queryChatPage(
                "viewer",
                "service",
                "date",
                "desc",
                null,
                null,
                10,
                null,
                null,
                false,
                null);
        var subEventOnly = service.queryChatPage(
                "viewer",
                "subEvent",
                "date",
                "desc",
                null,
                null,
                10,
                null,
                null,
                false,
                null);

        assertThat(all.items())
                .extracting(item -> item.id())
                .containsExactly("chat-service", "chat-group", "chat-sub-event", "chat-event");
        assertThat(serviceOnly.items())
                .extracting(item -> item.id())
                .containsExactly("chat-service");
        assertThat(subEventOnly.items())
                .extracting(item -> item.id())
                .containsExactly("chat-sub-event");
    }

    @Test
    void sendMessageRejectsDeniedChatBeforeWrite() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(accessControlService.canCurrentActorCreateChatMessage("viewer", "chat-1")).thenReturn(false);

        assertThatThrownBy(() -> service.sendMessage("chat-1", "viewer", "hello"))
                .hasMessageContaining("post in this chat");

        verify(activityChatMessagesRepository, never()).save(any(ActivityChatMessage.class));
        verify(activityChatsRepository, never()).findByChatId(anyString());
    }

    @Test
    void editMessageRejectsDeniedChatBeforeLoadingMessage() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(accessControlService.canCurrentActorEditChatMessage("viewer", "chat-1")).thenReturn(false);

        assertThatThrownBy(() -> service.editMessage("chat-1", "viewer", "m1", "updated"))
                .hasMessageContaining("change messages");

        verify(activityChatMessagesRepository, never()).findByChatIdAndMessageId(anyString(), anyString());
        verify(activityChatMessagesRepository, never()).save(any(ActivityChatMessage.class));
    }

    @Test
    void updateSupportCaseRejectsDeniedChatBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.can(AccessPolicyKeys.CHAT_SUPPORT_MANAGE, "admin", "admin", "chat-support")).thenReturn(false);

        assertThatThrownBy(() -> service.updateSupportCase("chat-support", "admin", "pick"))
                .hasMessageContaining("support chat");

        verify(activityChatsRepository, never()).findByChatId(anyString());
        verify(activityChatsRepository, never()).saveAll(anyList());
    }

    private ActivityChat chat(String chatId, String ownerUserId, int unread) {
        return chat(chatId, ownerUserId, unread, "2026-05-26T08:00:00Z");
    }

    private ActivityChat chat(String chatId, String ownerUserId, int unread, String dateIso) {
        return chat(chatId, ownerUserId, unread, dateIso, null);
    }

    private ActivityChat chat(String chatId, String ownerUserId, int unread, String dateIso, String channelType) {
        ActivityChat chat = new ActivityChat();
        chat.setMongoId("chat-owner-copy:" + ownerUserId + ":" + chatId);
        chat.setChatId(chatId);
        chat.setOwnerUserId(ownerUserId);
        chat.setTitle("Test chat");
        chat.setLastMessage("hello");
        chat.setDateIso(dateIso);
        chat.setMemberIds(List.of("viewer", "sender"));
        chat.setUnread(unread);
        chat.setChannelType(channelType);
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
