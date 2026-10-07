package com.raxim.myscoutee.domain.chat.service;

import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.administration.service.AdminMenuCounterService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicReference;

import org.bson.Document;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.result.UpdateResult;

import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.document.ContactChatAccess;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.assets.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.domain.assets.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatReadAvatarRecord;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserChatCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatServiceEnsureRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.chat.mapper.ChatMapper;
import com.raxim.myscoutee.domain.chat.mapper.ChatMessageMapper;
import com.raxim.myscoutee.domain.notifications.service.UserNotificationService;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class ChatServiceTest {
    @Mock
    private ChatsRepository chatsRepository;
    @Mock
    private ChatMessagesRepository chatMessagesRepository;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private BulkOperations bulkOperations;
    @Mock
    private BulkOperations userCounterBulkOperations;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private UserActivityCountersService userActivityCountersService;
    @Mock
    private ChatStreamPublisher chatStreamPublisher;
    @Mock
    private ChatPushNotificationService chatPushNotificationService;
    @Mock
    private UserNotificationService userNotificationService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AdminMenuCounterService adminMenuCounterService;
    @Mock
    private AccessControlService accessControlService;

    private ChatService service;

    @BeforeEach
    void setUp() {
        org.mockito.Mockito.lenient().when(accessControlService.resolveChatActorUserId(any(), any()))
                .thenAnswer(call -> call.getArgument(1));
        service = campaignAware(new ChatService(
                chatsRepository,
                chatMessagesRepository,
                mongoTemplate,
                usersRepository,
                activityMembersRepository,
                activitySubEventResourcesRepository,
                activitySubEventStageRuntimeRepository,
                homeUserProfileService,
                userActivityCountersService,
                chatStreamPublisher,
                chatPushNotificationService,
                userNotificationService,
                adminTelemetryService,
                adminMenuCounterService,
                accessControlService,
                new ChatMapper(),
                new ChatMessageMapper(usersRepository)), mongoTemplate);
    }

    @AfterEach
    void tearDown() {
        service.shutdownChatWriteExecutor();
    }

    @Test
    void campaignQuestionRequiresAPersistedRatingInTheCampaignWorkspace() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        Users viewer = user("viewer", "Viewer", "V"); viewer.setWorkspaceGroupId("myscoutee-work");
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(viewer));
        var campaign = new com.raxim.myscoutee.domain.campaigns.document.Campaign("campaign", "myscoutee-work", "organizer",
                "Idea", "Description", "business", "technology", List.of(), List.of(), "published", "now", "now", 1L);
        when(mongoTemplate.findById("campaign", com.raxim.myscoutee.domain.campaigns.document.Campaign.class)).thenReturn(campaign);
        var request = new ChatServiceEnsureRequestDto("campaign", null, null, null, "forged-target", "Fake title", "", "campaign", null);
        assertThatThrownBy(() -> service.ensureServiceChat(request, "viewer"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(mongoTemplate, never()).bulkOps(any(), eq(Chat.class));
        when(mongoTemplate.exists(any(Query.class), eq(com.raxim.myscoutee.domain.affinity.document.UserRate.class))).thenReturn(true);
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class)).thenReturn(bulkOperations);
        var chat = service.ensureServiceChat(request, "viewer");
        assertThat(chat.channelType()).isEqualTo("campaign");
        assertThat(chat.title()).isEqualTo("Idea");
        assertThat(chat.memberIds()).containsExactly("viewer", "organizer");
        assertThat(chat.eventId()).isEmpty();
        verify(bulkOperations, times(2)).upsert(any(Query.class), any(Update.class));
        verify(chatPushNotificationService, never()).notifyRecipients(anyList(), any());
    }

    @Test
    void staleCaseChatCopyDoesNotGrantADeclinedProviderAccess() {
        Users provider = user("provider-profile", "Provider", "P"); provider.setAccountUserId("provider"); provider.setWorkspaceGroupId("myscoutee-community");
        when(usersRepository.findByUserId("provider-profile")).thenReturn(Optional.of(provider));
        var stale = chat("c-case-case", "provider-profile", 0, "now", "case"); stale.setOwnerId("case");
        when(chatsRepository.findByOwnerUserIdAndChatId("provider-profile", "c-case-case")).thenReturn(Optional.of(stale));
        var c = new com.raxim.myscoutee.domain.community.document.ServiceCase("case", "myscoutee-community", "private", "owner", "Repair", "", "fault", "open", false,
                List.of("owner"), List.of("owner", "provider"), List.of(),
                List.of(new com.raxim.myscoutee.domain.community.document.ServiceCase.Support("provider", null, "declined")), List.of(), List.of(), null, null, "now", "now", 1L, java.util.Map.of(), List.of(), List.of());
        when(mongoTemplate.findById("case", com.raxim.myscoutee.domain.community.document.ServiceCase.class)).thenReturn(c);
        assertThat(service.hasChatAccess("c-case-case", "provider-profile")).isFalse();
    }

    @Test
    void retriedShareReturnsThePersistedMessageWithoutAnotherUnreadIncrement() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(accessControlService.canCurrentActorCreateChatMessage("viewer", "chat-1")).thenReturn(true);
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(chat("chat-1", "viewer", 0)));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer", "V")));
        var original = message("persisted", "viewer", "Viewer", "2026-09-25T10:00:00Z");
        when(chatMessagesRepository.insert(any(ChatMessage.class)))
                .thenThrow(new org.springframework.dao.DuplicateKeyException("same client command"));
        when(chatMessagesRepository.findByChatIdAndMessageId(eq("chat-1"), anyString())).thenReturn(Optional.of(original));
        var response = service.sendMessage("chat-1", "viewer", "shared event", "share:stable-command");
        assertThat(response.id()).isEqualTo("persisted");
        verify(chatMessagesRepository, never()).save(any(ChatMessage.class));
        verify(chatPushNotificationService, never()).notifyRecipients(anyList(), any());
        verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq(Users.class));
    }

    @Test
    void contactChatRejectsPeopleOutsideTheCallersContactsWithoutWriting() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        assertThatThrownBy(() -> service.ensureContactChat("viewer", "stranger"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void contactInvitationRejectsCrossWorkspaceTargetsEvenWhenSavedAsContacts() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        var contacts = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile();
        var contact = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.NavigatorContactRecord();
        contact.setUserId("target"); contacts.setContacts(List.of(contact));
        when(mongoTemplate.findOne(any(Query.class), eq(com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.class)))
                .thenReturn(contacts);
        var actor = user("viewer", "Viewer", "V");
        var target = user("target", "Target", "T"); target.setWorkspaceGroupId("other-group");
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(actor, target));
        assertThatThrownBy(() -> service.ensureContactChat("viewer", "target"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void savedContactCannotOpenDirectChatWithoutAcceptedPermission() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        var contacts = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile();
        var contact = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.NavigatorContactRecord();
        contact.setUserId("target"); contacts.setContacts(List.of(contact));
        when(mongoTemplate.findOne(any(Query.class), eq(com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.class)))
                .thenReturn(contacts);
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(user("viewer", "Viewer", "V"), user("target", "Target", "T")));
        assertThatThrownBy(() -> service.ensureContactChat("viewer", "target"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class).hasMessageContaining("403");
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void contactMemberCommandCannotAddPeopleToSupportChats() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        for (String channel : List.of("appSupport", "groupSupport")) {
            when(chatsRepository.findByChatId(channel)).thenReturn(List.of(chat(channel, "viewer", 0,
                    "2026-09-25T10:00:00Z", channel)));
            assertThatThrownBy(() -> service.addContactChatMembers(channel, "viewer", List.of("target")))
                    .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                    .hasMessageContaining("403");
        }
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(Chat.class));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void contactInvitationCannotWriteIntoAnotherAccountsConversation() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        Chat foreign = chat("foreign", "other", 7, "2026-09-25T10:00:00Z", "contact");
        foreign.setMemberIds(List.of("other", "peer"));
        when(chatsRepository.findByChatId("foreign")).thenReturn(List.of(foreign));

        assertThatThrownBy(() -> service.addContactChatMembers("foreign", "viewer", List.of("target")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .hasMessageContaining("404");
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(Chat.class));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
        assertThat(foreign.getUnread()).isEqualTo(7);
        assertThat(foreign.getMemberIds()).containsExactly("other", "peer");
    }

    @Test
    void existingContactChatRejectsAnInviteOutsideTheActorsOwnContacts() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("contact")).thenReturn(List.of(chat("contact", "viewer", 0,
                "2026-09-25T10:00:00Z", "contact")));
        assertThatThrownBy(() -> service.addContactChatMembers("contact", "viewer", List.of("stranger")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(Chat.class));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void contactInvitationRequiresEverySavedTargetToHaveApprovedBeforeAnyWrite() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("contact")).thenReturn(List.of(chat("contact", "viewer", 0,
                "2026-09-25T10:00:00Z", "contact")));
        var contacts = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile();
        contacts.setContacts(List.of("approved", "pending").stream().map(id -> {
            var contact = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.NavigatorContactRecord();
            contact.setUserId(id);
            return contact;
        }).toList());
        when(mongoTemplate.findOne(any(Query.class), eq(com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.class)))
                .thenReturn(contacts);
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(
                user("viewer", "Viewer", "V"), user("approved", "Approved", "A"), user("pending", "Pending", "P")));
        when(mongoTemplate.count(any(Query.class), eq(ContactChatAccess.class))).thenReturn(1L);

        assertThatThrownBy(() -> service.addContactChatMembers("contact", "viewer", List.of("approved", "pending")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .hasMessageContaining("403");
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).count(query.capture(), eq(ContactChatAccess.class));
        assertThat(query.getValue().getQueryObject().getString("status")).isEqualTo("approved");
        assertThat(query.getValue().getQueryObject().get("_id", Document.class).getList("$in", String.class))
                .containsExactly(ContactChatAccess.pairId("viewer", "approved"), ContactChatAccess.pairId("viewer", "pending"));
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(Chat.class));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void contactInviteReturnsAllMembersAndPreservesExistingUnreadState() {
        when(mongoTemplate.count(any(Query.class), eq(ContactChatAccess.class))).thenReturn(1L);
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        var current = chat("contact", "viewer", 7, "2026-09-25T10:00:00Z", "contact");
        var other = chat("contact", "sender", 3, current.getDateIso(), "contact");
        when(chatsRepository.findByChatId("contact")).thenReturn(List.of(current, other));
        var contacts = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile();
        var contact = new com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.NavigatorContactRecord();
        contact.setUserId("target");
        contacts.setContacts(List.of(contact));
        when(mongoTemplate.findOne(any(Query.class), eq(com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile.class)))
                .thenReturn(contacts);
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(
                user("viewer", "Viewer", "V"), user("sender", "Sender", "S"), user("target", "Target", "T")));
        when(mongoTemplate.updateMulti(any(Query.class), any(Update.class), eq(Chat.class))).thenAnswer(invocation -> {
            for (Chat copy : List.of(current, other)) {
                var members = new java.util.LinkedHashSet<>(copy.getMemberIds());
                members.add("target");
                copy.setMemberIds(List.copyOf(members));
            }
            return UpdateResult.acknowledged(2, 2L, null);
        });

        var result = service.addContactChatMembers("contact", "viewer", List.of("target"));

        assertThat(result.memberIds()).containsExactly("viewer", "sender", "target");
        assertThat(result.unread()).isEqualTo(7);
        assertThat(other.getUnread()).isEqualTo(3);
        var insert = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).upsert(any(Query.class), insert.capture(), eq(Chat.class));
        assertThat(insert.getValue().getUpdateObject().keySet()).containsExactly("$setOnInsert");
        assertThat(insert.getValue().getUpdateObject().get("$setOnInsert", Document.class).getInteger("unread")).isZero();
        verify(chatMessagesRepository, never()).save(any(ChatMessage.class));

        // If membership was saved but the recipient copy was interrupted, retry still initializes it.
        var retry = service.addContactChatMembers("contact", "viewer", List.of("target"));
        assertThat(retry.memberIds()).containsExactly("viewer", "sender", "target");
        assertThat(retry.unread()).isEqualTo(7);
        verify(mongoTemplate, times(2)).upsert(any(Query.class), any(Update.class), eq(Chat.class));
    }

    @Test
    void sharedMessagesUseAuthenticatedChatAccessWithoutReadingTheConversation() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(chat("chat-1", "viewer", 7)));
        when(chatMessagesRepository.findActiveSharesBySender("chat-1", "viewer", "event"))
                .thenReturn(List.of(message("old-share", "viewer", "viewer", "2026-05-26T08:00:01Z")));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer", "VU")));
        assertThat(service.querySharedMessages("chat-1", "viewer", "event"))
                .extracting(item -> item.id()).containsExactly("old-share");
        verify(chatMessagesRepository, never()).findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class));
        verify(chatsRepository, never()).save(any(Chat.class));
        verify(chatMessagesRepository, never()).saveAll(anyList());
    }

    @Test
    void sharedMessagesRejectActorsOutsideTheChat() {
        when(homeUserProfileService.resolveSelectedUserId("outsider")).thenReturn("outsider");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(chat("chat-1", "viewer", 0)));
        assertThatThrownBy(() -> service.querySharedMessages("chat-1", "outsider", "event"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(chatMessagesRepository, never()).findActiveSharesBySender(anyString(), anyString(), anyString());
    }

    @Test
    void queryMessagesPageReusesUserLookupCacheForRepeatedParticipants() {
        Chat viewerChat = chat("chat-1", "viewer", 0);
        Chat senderChat = chat("chat-1", "sender", 0);
        List<ChatMessage> messages = List.of(
                message("m1", "sender", "viewer", "2026-05-26T08:00:01Z"),
                message("m2", "sender", "viewer", "2026-05-26T08:00:02Z"),
                message("m3", "sender", "viewer", "2026-05-26T08:00:03Z"));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(chatMessagesRepository.countByChatId("chat-1")).thenReturn(3L);
        when(chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class))).thenReturn(messages);
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer User", "VU")));

        var result = service.queryMessagesPage("chat-1", "viewer", 10, null);

        assertThat(result.items()).hasSize(3);
        assertThat(result.total()).isEqualTo(3);
        assertThat(result.read()).isNull();
        verify(usersRepository, times(1)).findByUserId("sender");
        verify(usersRepository, times(1)).findByUserId("viewer");
        verify(chatMessagesRepository, never()).saveAll(anyList());
        verify(chatsRepository, never()).save(any(Chat.class));
    }

    @Test
    void syncChatHeaderReturnsTheCurrentPersistedListRowState() {
        Chat viewerChat = chat("chat-1", "viewer", 3, "2026-08-30T05:15:00Z", "groupSubEvent");
        viewerChat.setRevision(42L);
        viewerChat.setOwnerStatus(ActivityEvent.STATUS_ACTIVE);
        viewerChat.setLastMessage("Latest group message");
        viewerChat.setLastSenderId("sender");
        viewerChat.setContextStartAtIso("2026-08-30T06:00:00Z");
        viewerChat.setContextEndAtIso("2026-08-30T07:30:00Z");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.queryMenuCounters("viewer")).thenReturn(new UserMenuCountersDto(
                0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new UserChatCountersDto(3, 0, 0, 3, 0, 0),
                null, null, null, 0, 0, 0));
        when(chatsRepository.findByOwnerUserIdAndChatId("viewer", "chat-1"))
                .thenReturn(Optional.of(viewerChat));

        var unchanged = service.syncChatHeader("chat-1", "viewer", 42L);
        var changed = service.syncChatHeader("chat-1", "viewer", 41L);

        assertThat(unchanged.changed()).isFalse();
        assertThat(changed.changed()).isTrue();
        assertThat(changed.revision()).isEqualTo(42L);
        assertThat(changed.ownerStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
        assertThat(changed.unread()).isEqualTo(3);
        assertThat(changed.lastMessage()).isEqualTo("Latest group message");
        assertThat(changed.lastSenderId()).isEqualTo("sender");
        assertThat(changed.dateIso()).isEqualTo("2026-08-30T05:15:00Z");
        assertThat(changed.contextStartAtIso()).isEqualTo("2026-08-30T06:00:00Z");
        assertThat(changed.contextEndAtIso()).isEqualTo("2026-08-30T07:30:00Z");
        assertThat(changed.chats()).isEqualTo(3);
        assertThat(changed.chatCounters().group()).isEqualTo(3);
    }

    @Test
    void ensureMainEventChatCreatesOneSystemChannelViewForEveryRoomMember() {
        ActivityEvent room = new ActivityEvent();
        room.setSourceId("random-room:event-1:stage-1:room-1");
        room.setTitle("Random Room R1");
        room.setStartAtIso("2026-03-01T09:00:00Z");
        room.setEndAtIso("2026-03-01T10:00:00Z");
        List<Chat> persisted = new ArrayList<>();
        when(chatsRepository.findByChatId(room.getSourceId()))
                .thenReturn(List.of())
                .thenAnswer(invocation -> List.copyOf(persisted));
        when(chatsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<Chat> saved = invocation.getArgument(0);
            persisted.addAll(saved);
            return saved;
        });

        String chatId = service.ensureMainEventChat(room, List.of("user-2", "user-1", "user-2"));

        assertThat(chatId).isEqualTo(room.getSourceId());
        assertThat(persisted).hasSize(2).allSatisfy(chat -> {
            assertThat(chat.getChatId()).isEqualTo(room.getSourceId());
            assertThat(chat.getEventId()).isEqualTo(room.getSourceId());
            assertThat(chat.getOwnerId()).isEqualTo(room.getSourceId());
            assertThat(chat.getChannelType()).isEqualTo("mainEvent");
            assertThat(chat.getOwnerStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
            assertThat(chat.getTitle()).isEqualTo("Random Room R1");
            assertThat(chat.getAvatar()).isEqualTo("SY");
            assertThat(chat.getMemberIds()).containsExactly("user-1", "user-2");
            assertThat(chat.getContextStartAtIso()).isEqualTo(room.getStartAtIso());
            assertThat(chat.getContextEndAtIso()).isEqualTo(room.getEndAtIso());
        });
        assertThat(persisted).extracting(Chat::getOwnerUserId)
                .containsExactly("user-1", "user-2");
        verify(chatsRepository).saveAll(anyList());
        verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq(Users.class));
    }

    @Test
    void ensureAssetServiceChatMovesTheExistingConversationToTheCurrentTakeOverOwner() {
        String requesterUserId = "riley";
        String previousOwnerUserId = "casey";
        String currentOwnerUserId = "nova";
        String eventId = "event-1";
        String subEventId = "sub-event-1";
        String assetId = "asset-1";
        String chatId = "c-service-asset-" + assetId + "-" + subEventId + "-" + requesterUserId;

        ActivityEvent event = new ActivityEvent();
        event.setSourceId(eventId);
        event.setStartAtIso("2026-09-03T10:00:00Z");
        event.setEndAtIso("2026-09-03T11:00:00Z");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        Asset asset = new Asset();
        asset.setAssetId(assetId);
        asset.setOwnerUserId(currentOwnerUserId);
        asset.setTitle("Group Transport");

        Chat requesterChat = chat(chatId, requesterUserId, 0, "2026-09-03T09:00:00Z", "serviceEvent");
        requesterChat.setMemberIds(List.of(requesterUserId, previousOwnerUserId));
        requesterChat.setContextStartAtIso(event.getStartAtIso());
        requesterChat.setContextEndAtIso(event.getEndAtIso());
        Chat previousOwnerChat = chat(chatId, previousOwnerUserId, 0, "2026-09-03T09:00:00Z", "serviceEvent");
        previousOwnerChat.setMemberIds(List.of(requesterUserId, previousOwnerUserId));
        previousOwnerChat.setContextStartAtIso(event.getStartAtIso());
        previousOwnerChat.setContextEndAtIso(event.getEndAtIso());

        when(homeUserProfileService.resolveSelectedUserId(requesterUserId)).thenReturn(requesterUserId);
        when(mongoTemplate.findOne(any(Query.class), eq(ActivityEvent.class))).thenReturn(event);
        when(mongoTemplate.findOne(any(Query.class), eq(Asset.class))).thenReturn(asset);
        when(usersRepository.findByUserId(currentOwnerUserId))
                .thenReturn(Optional.of(user(currentOwnerUserId, "Nova Social", "NS")));
        when(usersRepository.findByUserIdIn(any()))
                .thenReturn(List.of(
                        user(requesterUserId, "Riley Outside", "RO"),
                        user(currentOwnerUserId, "Nova Social", "NS")));
        when(chatsRepository.findByChatId(chatId)).thenReturn(List.of(requesterChat, previousOwnerChat));
        when(chatsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.ensureServiceChat(new ChatServiceEnsureRequestDto(
                "asset",
                eventId,
                subEventId,
                assetId,
                previousOwnerUserId,
                "Asset Service · Group Transport",
                "Ask the organizer"), requesterUserId);

        assertThat(result.memberIds()).containsExactly(requesterUserId, currentOwnerUserId);
        assertThat(result.avatar()).isEqualTo("NS");
        ArgumentCaptor<Query> assetQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).findOne(assetQuery.capture(), eq(Asset.class));
        assertThat(assetQuery.getValue().getQueryObject()).doesNotContainKey("ownerUserId");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Chat>> savedChats = ArgumentCaptor.forClass(List.class);
        verify(chatsRepository, times(2)).saveAll(savedChats.capture());
        assertThat(savedChats.getAllValues().stream().flatMap(List::stream).toList())
                .anySatisfy(chat -> {
                    assertThat(chat.getOwnerUserId()).isEqualTo(requesterUserId);
                    assertThat(chat.getMemberIds()).containsExactly(requesterUserId, currentOwnerUserId);
                    assertThat(chat.getAvatar()).isEqualTo("NS");
                })
                .anySatisfy(chat -> {
                    assertThat(chat.getOwnerUserId()).isEqualTo(currentOwnerUserId);
                    assertThat(chat.getMemberIds()).containsExactly(requesterUserId, currentOwnerUserId);
                });

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Iterable<Chat>> removedChats = ArgumentCaptor.forClass(Iterable.class);
        verify(chatsRepository).deleteAll(removedChats.capture());
        assertThat(removedChats.getValue()).extracting(Chat::getOwnerUserId)
                .containsExactly(previousOwnerUserId);
    }

    @Test
    void ensureTournamentRoomChatUsesTheManagedTournamentImageAsItsAvatar() {
        ActivityEvent room = new ActivityEvent();
        room.setSourceId("random-room:event-1:stage-1:room-1");
        room.setTitle("Tournament Group R1");
        room.setAvatar("/media/public?key=images/system/tournament-room/v1/large.webp");
        when(chatsRepository.findByChatId(room.getSourceId())).thenReturn(List.of());
        when(chatsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.ensureMainEventChat(room, List.of("user-1"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Chat>> chatsCaptor = ArgumentCaptor.forClass(List.class);
        verify(chatsRepository).saveAll(chatsCaptor.capture());
        assertThat(chatsCaptor.getValue()).singleElement().satisfies(chat -> {
            assertThat(chat.getTitle()).isEqualTo("Tournament Group R1");
            assertThat(chat.getAvatar())
                    .isEqualTo("/media/public?key=images/system/tournament-room/v1/large.webp");
        });
    }

    @Test
    void publishedMainEventChatCreatesAnEmptyChannelWithoutChangingAttentionCounters() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Published Event");
        List<Chat> persisted = new ArrayList<>();
        when(chatsRepository.findByChatId(event.getSourceId()))
                .thenAnswer(invocation -> List.copyOf(persisted));
        when(chatsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<Chat> saved = invocation.getArgument(0);
            persisted.clear();
            persisted.addAll(saved);
            return saved;
        });
        ChatService.PublishedMainEventChatResult firstResult =
                service.ensurePublishedMainEventChat(event, List.of("user-2", "user-1"));
        ChatService.PublishedMainEventChatResult repeatedResult =
                service.ensurePublishedMainEventChat(event, List.of("user-2", "user-1"));

        assertThat(firstResult.createdOwnerUserIds()).containsExactlyInAnyOrder("user-1", "user-2");
        assertThat(repeatedResult.createdOwnerUserIds()).isEmpty();
        assertThat(persisted).allSatisfy(chat -> {
            assertThat(chat.getLastMessage()).isEmpty();
            assertThat(chat.getLastSenderId()).isNull();
            assertThat(chat.getUnread()).isZero();
            assertThat(chat.getOwnerStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
        });
        verify(chatMessagesRepository, never()).insert(any(ChatMessage.class));
        verify(chatPushNotificationService, never()).notifyRecipients(anyList(), any(ChatStreamEvent.class));
        verify(userCounterBulkOperations, never()).execute();
    }

    @Test
    void updateEventChatOwnerStatusMutatesEveryPhysicalEventChatDocumentWithoutReplacingThem() {
        Chat casey = chat("event-1", "casey", 0, "2026-08-06T08:00:00Z", "mainEvent");
        casey.setEventId("event-1");
        Chat nova = chat("event-1:optional-1", "nova", 1, "2026-08-06T08:01:00Z", "optionalSubEvent");
        nova.setEventId("event-1");
        when(chatsRepository.findByEventId("event-1")).thenReturn(List.of(casey, nova));
        when(mongoTemplate.updateMulti(any(Query.class), any(Update.class), eq(Chat.class)))
                .thenReturn(UpdateResult.acknowledged(2L, 2L, null));

        long modified = service.updateEventChatOwnerStatus("event-1", ActivityEvent.STATUS_DRAFT);

        assertThat(modified).isEqualTo(2L);
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateMulti(any(Query.class), updateCaptor.capture(), eq(Chat.class));
        assertThat(updateCaptor.getValue().getUpdateObject().get("$set", Document.class))
                .containsEntry("ownerStatus", ActivityEvent.STATUS_DRAFT);
        verify(homeUserProfileService).evictUserReadCaches(java.util.Set.of("casey", "nova"));
        verify(chatsRepository, never()).deleteAll(anyList());
        verify(chatsRepository, never()).saveAll(anyList());
    }

    @Test
    void initialSystemMessageIsStoredOnceAndIncrementsEveryParticipantChatCounterOnce() {
        Chat first = chat("random-room-1", "user-1", 0, "2026-05-26T08:00:00Z", "mainEvent");
        Chat second = chat("random-room-1", "user-2", 0, "2026-05-26T08:00:00Z", "mainEvent");
        first.setMemberIds(List.of("user-1", "user-2"));
        second.setMemberIds(List.of("user-1", "user-2"));
        AtomicReference<ChatMessage> inserted = new AtomicReference<>();

        when(chatsRepository.findByChatId("random-room-1")).thenReturn(List.of(first, second));
        when(chatMessagesRepository.findByChatIdAndMessageId(
                "random-room-1",
                "system:random-room-welcome"))
                .thenAnswer(invocation -> Optional.ofNullable(inserted.get()));
        when(chatMessagesRepository.insert(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage message = invocation.getArgument(0);
            inserted.set(message);
            return message;
        });
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class))
                .thenReturn(bulkOperations);
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class))
                .thenReturn(userCounterBulkOperations);

        var firstResult = service.ensureInitialSystemMessage(
                "random-room-1",
                "Welcome to this automatically generated room.",
                "random-room-welcome");
        var repeatedResult = service.ensureInitialSystemMessage(
                "random-room-1",
                "Welcome to this automatically generated room.",
                "random-room-welcome");

        assertThat(firstResult).isNotNull();
        assertThat(repeatedResult).isNotNull();
        assertThat(inserted.get()).satisfies(message -> {
            assertThat(message.getId()).isEqualTo("system:random-room-welcome");
            assertThat(message.getSender()).isEqualTo("MyScoutee System");
            assertThat(message.getText()).contains("automatically generated room");
        });
        verify(chatMessagesRepository, times(1)).insert(any(ChatMessage.class));
        ArgumentCaptor<Update> chatUpdates = ArgumentCaptor.forClass(Update.class);
        verify(bulkOperations, times(2)).updateOne(any(Query.class), chatUpdates.capture());
        assertThat(chatUpdates.getAllValues()).allSatisfy(update -> {
            Document increments = update.getUpdateObject().get("$inc", Document.class);
            assertThat(((Number) increments.get("revision")).longValue()).isEqualTo(1L);
        });
        ArgumentCaptor<Update> counterUpdates = ArgumentCaptor.forClass(Update.class);
        verify(userCounterBulkOperations, times(2)).updateOne(
                any(Query.class),
                counterUpdates.capture());
        verify(userCounterBulkOperations).execute();
        assertThat(counterUpdates.getAllValues()).allSatisfy(update -> {
            Document increments = update.getUpdateObject().get("$inc", Document.class);
            assertThat(((Number) increments.get("activities.chats")).intValue()).isEqualTo(1);
            assertThat(((Number) increments.get("activities.chat.all")).intValue()).isEqualTo(1);
            assertThat(((Number) increments.get("activities.chat.event")).intValue()).isEqualTo(1);
        });
    }

    @Test
    void openingFirstMessagePageClearsTheWholePersistedUnreadCount() {
        Chat viewerChat = chat("chat-1", "viewer", 4, "2026-05-26T08:00:00Z", "groupSubEvent");
        Chat senderChat = chat("chat-1", "sender", 0);
        ChatMessage unreadMessage = message("m1", "sender", "someone-else", "2026-05-26T08:00:01Z");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(chatMessagesRepository.countByChatId("chat-1")).thenReturn(1L);
        when(chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class)))
                .thenReturn(List.of(unreadMessage));
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));
        Users viewer = user("viewer", "Viewer User", "VU");
        viewer.setImages(List.of("/images/profiles/viewer/small.webp"));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(viewer));
        when(mongoTemplate.updateMulti(any(Query.class), any(), eq(ChatMessage.class)))
                .thenReturn(UpdateResult.acknowledged(4L, 4L, null));
        when(chatsRepository.save(any(Chat.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.queryMessagesPage("chat-1", "viewer", 10, null);

        assertThat(result.read()).isNotNull();
        assertThat(result.read().unread()).isZero();
        assertThat(result.read().messageIds()).containsExactly("m1");
        assertThat(result.read().userImageUrl()).isEqualTo("/images/profiles/viewer/small.webp");
        verify(chatStreamPublisher).publish(org.mockito.ArgumentMatchers.argThat(event ->
                event != null
                        && "read".equals(event.type())
                        && "chat-1".equals(event.chatId())
                        && "viewer".equals(event.senderId())
                        && event.messageIds().equals(List.of("m1"))));
        verify(chatsRepository).save(org.mockito.ArgumentMatchers.argThat(chat ->
                chat.getUnread() == 0 && chat.getRevision() > viewerChat.getRevision()));
        verify(mongoTemplate).updateMulti(any(Query.class), any(), eq(ChatMessage.class));
    }

    @Test
    void notificationTargetReadsOnlyItsMessageAndKeepsOtherNotificationsUnread() {
        Chat viewerChat = chat("chat-1", "viewer", 2, "2026-05-26T08:00:00Z", "groupSubEvent");
        Chat senderChat = chat("chat-1", "sender", 0);
        ChatMessage target = message("target", "sender", "someone-else", "2026-05-26T08:00:02Z");
        ChatMessage previous = message("previous", "sender", "someone-else", "2026-05-26T08:00:01Z");
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(chatMessagesRepository.findByChatIdAndMessageId("chat-1", "target")).thenReturn(Optional.of(target));
        when(chatMessagesRepository.countByChatId("chat-1")).thenReturn(2L);
        when(chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class)))
                .thenReturn(List.of(target, previous));
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer User", "VU")));
        when(mongoTemplate.updateFirst(any(Query.class), any(Update.class), eq(ChatMessage.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(chatsRepository.save(any(Chat.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.queryMessagesPage("chat-1", "viewer", 15, null, "target");

        assertThat(result.read().messageIds()).containsExactly("target");
        assertThat(result.read().unread()).isEqualTo(1);
        verify(userNotificationService).markChatMessagesRead("viewer", "chat-1", List.of("target"));
        verify(userNotificationService, never()).markChatRead(anyString(), anyString());
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(ChatMessage.class));
    }

    @Test
    void openingOlderMessagePageAddsReaderWithAtomicMongoUpdate() {
        Chat viewerChat = chat("chat-1", "viewer", 1, "2026-05-26T08:00:00Z", "groupSubEvent");
        Chat senderChat = chat("chat-1", "sender", 0);
        ChatMessage unreadMessage = message("m1", "sender", "someone-else", "2026-05-26T08:00:01Z");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(chatMessagesRepository.countByChatId("chat-1")).thenReturn(16L);
        when(chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class)))
                .thenReturn(List.of(unreadMessage));
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user("viewer", "Viewer User", "VU")));
        when(mongoTemplate.updateFirst(any(Query.class), any(Update.class), eq(ChatMessage.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(chatsRepository.save(any(Chat.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.queryMessagesPage("chat-1", "viewer", 15, "15");

        assertThat(result.read()).isNotNull();
        assertThat(result.read().messageIds()).containsExactly("m1");
        assertThat(result.items().getFirst().readBy())
                .extracting(reader -> reader.id())
                .contains("viewer", "someone-else");
        verify(mongoTemplate).updateFirst(any(Query.class), any(Update.class), eq(ChatMessage.class));
        verify(chatMessagesRepository, never()).saveAll(anyList());
    }

    @Test
    void reopeningDeletedMessageDoesNotRecreateReadReceipts() {
        Chat viewerChat = chat("chat-1", "viewer", 0, "2026-05-26T08:00:00Z", "groupSubEvent");
        Chat senderChat = chat("chat-1", "sender", 0);
        ChatMessage deletedMessage = message("m1", "sender", "someone-else", "2026-05-26T08:00:01Z");
        deletedMessage.setDeletedAtIso("2026-05-26T08:01:00Z");
        deletedMessage.setReadBy(List.of());
        deletedMessage.refreshMessageSearchFields();

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat, senderChat));
        when(chatMessagesRepository.countByChatId("chat-1")).thenReturn(1L);
        when(chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(anyString(), any(Pageable.class)))
                .thenReturn(List.of(deletedMessage));
        when(usersRepository.findByUserId("sender")).thenReturn(Optional.of(user("sender", "Sender User", "SU")));

        var result = service.queryMessagesPage("chat-1", "viewer", 10, null);

        assertThat(result.read()).isNull();
        assertThat(result.items().getFirst().readBy()).isEmpty();
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(ChatMessage.class));
        verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq(ChatMessage.class));
        verify(chatMessagesRepository, never()).saveAll(anyList());
    }

    @Test
    void queryMembersPageUsesLogicalChatIdAndPaginatesTheMongoUsersQuery() {
        Chat viewerChat = chat("chat-1", "viewer", 0);
        Chat otherOwnerChat = chat("chat-1", "sender", 0);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(otherOwnerChat, viewerChat));
        when(mongoTemplate.count(any(Query.class), eq(Users.class))).thenReturn(2L);
        when(mongoTemplate.find(any(Query.class), eq(Users.class)))
                .thenReturn(List.of(user("viewer", "Viewer User", "VU")));

        var result = service.queryMembersPage("chat-1", "viewer", 1, null, false);

        assertThat(result.items())
                .extracting(member -> member.id())
                .containsExactly("viewer");
        assertThat(result.total()).isEqualTo(2);
        assertThat(result.nextCursor()).isEqualTo("1");
        verify(mongoTemplate).count(any(Query.class), eq(Users.class));
        verify(mongoTemplate).find(any(Query.class), eq(Users.class));
        verify(chatsRepository).findByChatId("chat-1");
        verify(usersRepository, never()).findAll();
    }

    @Test
    void queryPendingChatMembersAppliesStatusBeforeMongoUserLookup() {
        Chat viewerChat = chat("chat-1", "viewer", 0, "2026-05-26T08:00:00Z", "mainEvent");
        viewerChat.setOwnerId("event-1");
        ActivityMember pendingMember = new ActivityMember();
        pendingMember.setOwnerType("event");
        pendingMember.setOwnerId("event-1");
        pendingMember.setUserId("sender");
        pendingMember.setStatus("pending");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(chatsRepository.findByChatId("chat-1")).thenReturn(List.of(viewerChat));
        when(mongoTemplate.count(any(Query.class), eq(ActivityMember.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(ActivityMember.class)))
                .thenReturn(List.of(pendingMember));
        when(usersRepository.findByUserIdIn(any()))
                .thenReturn(List.of(user("sender", "Sender User", "SU")));

        var result = service.queryMembersPage("chat-1", "viewer", 16, null, true);

        assertThat(result.items())
                .extracting(member -> member.id())
                .containsExactly("sender");
        assertThat(result.total()).isEqualTo(1);
        verify(mongoTemplate).count(any(Query.class), eq(ActivityMember.class));
    }

    @Test
    void queryChatsReadsOwnerCopiesWithoutRepairingMemberCopies() {
        Chat viewerChat = chat("chat-1", "viewer", 0);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        stubEmptyMenuCounters("viewer");
        when(mongoTemplate.count(any(Query.class), eq(Chat.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(Chat.class))).thenReturn(List.of(viewerChat));

        assertThat(service.queryChats("viewer")).hasSize(1);
        assertThat(service.queryChats("viewer")).hasSize(1);

        verify(mongoTemplate, times(2)).find(any(Query.class), eq(Chat.class));
        verify(chatsRepository, never()).findByMemberIdsContaining("viewer");
        verify(chatsRepository, never()).findByChatId(anyString());
        verify(chatsRepository, never()).findByOwnerUserIdAndChatId(anyString(), anyString());
        verify(chatsRepository, never()).saveAll(anyList());
    }

    @Test
    void queryChatPageSortsLocalIsoSeedDatesByRequestedDateOrder() {
        Chat oldChat = chat("zz-old", "viewer", 0, "2026-03-01T07:48:00");
        Chat newChat = chat("aa-new", "viewer", 0, "2026-03-01T14:03:00");
        Chat midChat = chat("mm-mid", "viewer", 0, "2026-02-28T17:48:00");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        stubEmptyMenuCounters("viewer");
        when(mongoTemplate.count(any(Query.class), eq(Chat.class))).thenReturn(3L);
        when(mongoTemplate.find(any(Query.class), eq(Chat.class))).thenReturn(List.of(newChat, oldChat, midChat));

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
        Chat eventChat = chat("chat-event", "viewer", 0, "2026-03-01T07:48:00", "mainEvent");
        Chat subEventChat = chat("chat-sub-event", "viewer", 0, "2026-03-01T08:48:00", "optionalSubEvent");
        Chat groupChat = chat("chat-group", "viewer", 0, "2026-03-01T09:48:00", "groupSubEvent");
        Chat serviceChat = chat("chat-service", "viewer", 0, "2026-03-01T10:48:00", "serviceEvent");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        stubEmptyMenuCounters("viewer");
        when(mongoTemplate.count(any(Query.class), eq(Chat.class))).thenReturn(4L, 1L, 1L);
        when(mongoTemplate.find(any(Query.class), eq(Chat.class))).thenReturn(
                List.of(serviceChat, groupChat, subEventChat, eventChat),
                List.of(serviceChat),
                List.of(subEventChat));

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
    void groupSupportFilterQueriesOnlyTheSelectedProfilesGroupSupportChannel() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        stubEmptyMenuCounters("viewer");
        service.queryChatPage("viewer", "groupSupport", "date", "desc", null, null, 10, null, null, false, null);
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(query.capture(), eq(Chat.class));
        assertThat(query.getValue().getQueryObject().toJson()).contains("groupSupport", "viewer").doesNotContain("appSupport");
    }

    @Test
    void queryChatPageReturnsMongoNavigationContextForGroupedChat() {
        Chat groupChat = chat("chat-group", "viewer", 0, "2026-03-01T09:48:00", "groupSubEvent");
        groupChat.setTitle("Group B · Group Channel");
        groupChat.setOwnerId("event-1:stage-1:stage-1:group:2");
        groupChat.setEventId("event-1");
        groupChat.setOwnerStatus(ActivityEvent.STATUS_DRAFT);
        groupChat.setSubEventId("stage-1");
        groupChat.setGroupId("stage-1:group:2");

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setOwnerUserId("viewer");
        event.setCreatorUserId("viewer");
        event.setStatus(ActivityEvent.STATUS_DRAFT);
        event.setTitle("Tournament");
        event.setPendingMembers(2);
        event.setSubEvents(List.of(subEvent("stage-1", "Qualifiers")));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        stubEmptyMenuCounters("viewer");
        when(mongoTemplate.count(any(Query.class), eq(Chat.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(Chat.class))).thenReturn(List.of(groupChat));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event));
        ActivitySubEventResource parentResource = resource("event-1", "stage-1", "parent-asset");
        ActivitySubEventResource groupResource = resource(
                "event-1:stage-1:stage-1:group:2", "stage-1", "group-asset");
        when(activitySubEventResourcesRepository.findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                any(), any(), eq("D"))).thenReturn(List.of(parentResource, groupResource));
        when(mongoTemplate.find(any(Query.class), eq(Asset.class))).thenReturn(List.of(
                asset("parent-asset", "parent-user", "pending", "event-1"),
                asset("group-asset", "group-user", "accepted", "event-1:stage-1:stage-1:group:2")));

        var result = service.queryChatPage(
                "viewer",
                "group",
                "date",
                "desc",
                null,
                null,
                10,
                null,
                null,
                false,
                null);

        assertThat(result.items()).hasSize(1);
        var item = result.items().getFirst();
        assertThat(item.eventId()).isEqualTo("event-1");
        assertThat(item.subEventId()).isEqualTo("stage-1");
        assertThat(item.groupId()).isEqualTo("stage-1:group:2");
        assertThat(item.ownerStatus()).isEqualTo(ActivityEvent.STATUS_DRAFT);
        assertThat(item.navigationContext()).isNotNull();
        assertThat(item.navigationContext().eventTitle()).isEqualTo("Tournament");
        assertThat(item.navigationContext().eventTarget()).isEqualTo("hosting");
        assertThat(item.navigationContext().subEvent().name()).isEqualTo("Qualifiers");
        assertThat(item.navigationContext().group().name()).isEqualTo("Group B");
        assertThat(item.metrics().transport().accepted()).isEqualTo(1);
        assertThat(item.metrics().transport().pending()).isZero();
        assertThat(item.metrics().transport().capacityMax()).isEqualTo(4);
    }

    @Test
    void sendMessageRejectsDeniedChatBeforeWrite() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(accessControlService.canCurrentActorCreateChatMessage("viewer", "chat-1")).thenReturn(false);

        assertThatThrownBy(() -> service.sendMessage("chat-1", "viewer", "hello"))
                .hasMessageContaining("post in this chat");

        verify(chatMessagesRepository, never()).save(any(ChatMessage.class));
        verify(chatsRepository, never()).findByChatId(anyString());
    }

    @Test
    void workAppAdminUsesSupportCaseChannelAndRejectsTheDatingContext() {
        Users target = user("target", "Target User", "TU");
        target.setWorkspaceGroupId("myscoutee-work");
        Users admin = user("admin", "Admin User", "AU");
        admin.setWorkspaceGroupId("myscoutee-work");
        when(adminMenuCounterService.isAdminUser(admin)).thenReturn(true);
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(admin));
        when(chatsRepository.findByChatId("c-support-admin-target")).thenReturn(List.of());
        when(chatsRepository.saveAll(anyList())).thenAnswer(call -> call.getArgument(0));
        when(chatMessagesRepository.save(any(ChatMessage.class))).thenAnswer(call -> call.getArgument(0));
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class)).thenReturn(bulkOperations);
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class)).thenReturn(userCounterBulkOperations);
        service.sendAdminSupportMessage("target", "admin", "Admin User", "AU", "Warning", "warned");
        ArgumentCaptor<List<Chat>> documents = ArgumentCaptor.forClass(List.class);
        verify(chatsRepository).saveAll(documents.capture());
        assertThat(documents.getValue()).allSatisfy(chat -> {
            assertThat(chat.getChannelType()).isEqualTo("appSupport");
            assertThat(chat.getSupportCase()).isNotNull();
            assertThat(chat.getSupportBaseGroupId()).isEqualTo("myscoutee-work");
        });
        admin.setWorkspaceGroupId(null);
        assertThatThrownBy(() -> service.sendAdminSupportMessage("target", "admin", "Admin", "AU", "Warning", "warned"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }

    @Test
    void adminSupportMessageUsesTheChatMutationSignalsAndOnlyIncrementsTheTargetUnread() {
        String chatId = "c-support-admin-target";
        Users target = user("target", "Target User", "TU");
        Users admin = user("admin", "Admin User", "AU");
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(admin));
        when(chatsRepository.findByChatId(chatId)).thenReturn(List.of());
        when(chatsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(chatMessagesRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class))
                .thenReturn(bulkOperations);
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class))
                .thenReturn(userCounterBulkOperations);

        var result = service.sendAdminSupportMessage(
                "target",
                "admin",
                "Admin User",
                "AU",
                "Please review this warning.",
                "warned");

        assertThat(result.senderName()).isEqualTo("Admin User");
        assertThat(result.text()).isEqualTo("Please review this warning.");
        ArgumentCaptor<List<Chat>> definitionsCaptor = ArgumentCaptor.forClass(List.class);
        verify(chatsRepository).saveAll(definitionsCaptor.capture());
        assertThat(definitionsCaptor.getValue()).hasSize(2);
        assertThat(definitionsCaptor.getValue()).allSatisfy(chat -> {
            assertThat(chat.getChannelType()).isEqualTo("appSupport");
            assertThat(chat.getSupportCase().getStatus()).isEqualTo("warned");
        });
        ArgumentCaptor<Update> counterUpdateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(userCounterBulkOperations).updateOne(any(Query.class), counterUpdateCaptor.capture());
        Document increments = counterUpdateCaptor.getValue().getUpdateObject().get("$inc", Document.class);
        assertThat(((Number) increments.get("activities.chats")).intValue()).isEqualTo(1);
        assertThat(((Number) increments.get("activities.chat.all")).intValue()).isEqualTo(1);
        assertThat(((Number) increments.get("activities.chat.appSupport")).intValue()).isEqualTo(1);
        verify(chatPushNotificationService).notifyRecipients(
                org.mockito.ArgumentMatchers.argThat(chats -> chats.stream().anyMatch(chat ->
                        "target".equals(chat.getOwnerUserId()) && Integer.valueOf(1).equals(chat.getUnread()))
                        && chats.stream().anyMatch(chat ->
                        "admin".equals(chat.getOwnerUserId()) && Integer.valueOf(0).equals(chat.getUnread()))),
                org.mockito.ArgumentMatchers.argThat(event ->
                        event != null
                                && "message".equals(event.type())
                                && chatId.equals(event.chatId())
                                && "admin".equals(event.senderId())));
        verify(chatStreamPublisher, timeout(1000)).publish(org.mockito.ArgumentMatchers.argThat(event ->
                event != null
                        && "message".equals(event.type())
                        && chatId.equals(event.chatId())
                        && "admin".equals(event.senderId())));
        verify(homeUserProfileService).evictUserReadCaches(java.util.Set.of("target", "admin"));
    }

    @Test
    void groupModerationWarningUsesWorkspaceProfilesWithoutAppSupportAccessOrCounters() {
        String chatId = "c-moderation-group-target";
        Users target = user("target", "Target", "TA"), moderator = user("moderator", "Moderator", "MO");
        target.setWorkspaceGroupId("A"); moderator.setWorkspaceGroupId("A");
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserId("moderator")).thenReturn(Optional.of(moderator));
        when(chatsRepository.saveAll(anyList())).thenAnswer(call -> call.getArgument(0));
        when(chatMessagesRepository.save(any(ChatMessage.class))).thenAnswer(call -> call.getArgument(0));
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class)).thenReturn(bulkOperations);
        when(mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class)).thenReturn(userCounterBulkOperations);
        service.sendAdminSupportMessage("target", "moderator", "Moderator", "MO", "Please replace this image.", "warned");
        ArgumentCaptor<List<Chat>> definitions = ArgumentCaptor.forClass(List.class);
        verify(chatsRepository).saveAll(definitions.capture());
        assertThat(definitions.getValue()).allSatisfy(chat -> {
            assertThat(chat.getChatId()).isEqualTo(chatId);
            assertThat(chat.getChannelType()).isEqualTo("groupSupport");
            assertThat(chat.getSupportCase()).isNull();
            assertThat(chat.getOwnerId()).isNull();
            assertThat(chat.getMemberIds()).containsExactly("target", "moderator");
        });
        var access = new com.raxim.myscoutee.domain.access.security.ChatPolicyFacts(new com.raxim.myscoutee.domain.chat.service.ChatDirectoryService(chatsRepository), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository), adminMenuCounterService, new com.raxim.myscoutee.domain.community.service.CaseParticipantsService(org.mockito.Mockito.mock(com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository.class)));
        when(chatsRepository.findByChatId(chatId)).thenReturn(definitions.getValue());
        assertThat(access.canAccessChat(chatId, "app-admin")).isFalse();
        assertThat(access.canAccessChat(chatId, "other-group-profile")).isFalse();
        assertThat(access.canAccessChat(chatId, "target")).isTrue();
        ArgumentCaptor<Update> updates = ArgumentCaptor.forClass(Update.class);
        verify(userCounterBulkOperations).updateOne(any(Query.class), updates.capture());
        assertThat(updates.getValue().getUpdateObject().get("$inc", Document.class))
                .containsKey("activities.chat.all").containsEntry("activities.chat.groupSupport", 1).doesNotContainKey("activities.chat.appSupport");
        verify(userActivityCountersService, never()).refreshSupportCaseCountersForAdmins();
    }

    @Test
    void groupModerationWarningRejectsModeratorFromAnotherWorkspaceBeforeWriting() {
        Users target = user("target", "Target", "TA"), moderator = user("moderator", "Moderator", "MO");
        target.setWorkspaceGroupId("A"); moderator.setWorkspaceGroupId("B");
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserId("moderator")).thenReturn(Optional.of(moderator));
        assertThatThrownBy(() -> service.sendAdminSupportMessage("target", "moderator", "Moderator", "MO", "Warning", "warned"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(chatsRepository, never()).saveAll(anyList());
        verify(chatMessagesRepository, never()).save(any(ChatMessage.class));
    }

    @Test
    void editMessageRejectsDeniedChatBeforeLoadingMessage() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(accessControlService.canCurrentActorEditChatMessage("viewer", "chat-1")).thenReturn(false);

        assertThatThrownBy(() -> service.editMessage("chat-1", "viewer", "m1", "updated"))
                .hasMessageContaining("change messages");

        verify(chatMessagesRepository, never()).findByChatIdAndMessageId(anyString(), anyString());
        verify(chatMessagesRepository, never()).save(any(ChatMessage.class));
    }

    @Test
    void updateSupportCaseRejectsDeniedChatBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.can(AccessPolicyKeys.CHAT_SUPPORT_MANAGE, "admin", "admin", "chat-support")).thenReturn(false);

        assertThatThrownBy(() -> service.updateSupportCase("chat-support", "admin", "pick"))
                .hasMessageContaining("support chat");

        verify(chatsRepository, never()).findByChatId(anyString());
        verify(chatsRepository, never()).saveAll(anyList());
    }

    private Chat chat(String chatId, String ownerUserId, int unread) {
        return chat(chatId, ownerUserId, unread, "2026-05-26T08:00:00Z");
    }

    private void stubEmptyMenuCounters(String userId) {
        when(homeUserProfileService.queryMenuCounters(userId)).thenReturn(new UserMenuCountersDto(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new UserChatCountersDto(0, 0, 0, 0, 0, 0),
                null, null, null, 0, 0, 0));
    }

    private Chat chat(String chatId, String ownerUserId, int unread, String dateIso) {
        return chat(chatId, ownerUserId, unread, dateIso, null);
    }

    private Chat chat(String chatId, String ownerUserId, int unread, String dateIso, String channelType) {
        Chat chat = new Chat();
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

    private ChatMessage message(String messageId, String senderUserId, String readerUserId, String sentAtIso) {
        ChatMessage message = new ChatMessage();
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

    private SubEventItem subEvent(String id, String name) {
        SubEventItem base = new SubEventItem(
                id,
                name,
                "",
                "2026-03-01T09:00:00Z",
                "2026-03-01T10:00:00Z",
                "",
                "viewer",
                2,
                4,
                "Score",
                1,
                false,
                null,
                2,
                8,
                2,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                60);
        return new SubEventItem(
                base.id(), base.name(), base.description(), base.startAt(), base.endAt(), base.location(),
                base.createdByUserId(), base.tournamentGroupCapacityMin(), base.tournamentGroupCapacityMax(),
                base.tournamentLeaderboardType(), base.tournamentAdvancePerGroup(), base.optional(), base.pricing(),
                base.capacityMin(), base.capacityMax(), base.membersAccepted(), base.membersPending(),
                base.carsPending(), base.accommodationPending(), base.suppliesPending(),
                base.carsAccepted(), base.accommodationAccepted(), base.suppliesAccepted(),
                base.carsCapacityMin(), base.carsCapacityMax(),
                base.accommodationCapacityMin(), base.accommodationCapacityMax(),
                base.suppliesCapacityMin(), base.suppliesCapacityMax(),
                base.slotStartOffsetMinutes(), base.slotDurationMinutes(), base.stageStatus(),
                base.stageStatusReason(), base.stageStatusUpdatedAt(), base.stageFinalizedAt(),
                base.stageFinalizedByUserId(),
                List.of(new SubEventGroupItemDto("stage-1:group:2", "Group B", 2, 4, "generated")));
    }

    private ActivitySubEventResource resource(String ownerId, String subEventId, String assetId) {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setId(ownerId + ":" + assetId);
        resource.setRecordId(ownerId + ":" + subEventId + ":viewer");
        resource.setStatus("A");
        resource.setOwnerId(ownerId);
        resource.setSubEventId(subEventId);
        resource.setAssetOwnerUserId("viewer");
        resource.setAssetAssignmentIds(Map.of("Transport", List.of(assetId)));
        resource.setAssetSettingsByType(Map.of("Transport", Map.of(
                assetId,
                new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(0, 4, 1, "viewer", false, List.of()))));
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        return resource;
    }

    private Asset asset(String assetId, String userId, String status, String bookingOwnerId) {
        Asset asset = new Asset();
        asset.setAssetId(assetId);
        asset.setOwnerUserId("viewer");
        asset.setType("Transport");
        asset.setCapacityTotal(4);
        asset.setRequests(List.of(new AssetRequestRecord(
                "request-" + assetId,
                userId,
                userId,
                "U",
                "man",
                status,
                "",
                "borrow",
                "2026-07-22T12:00:00Z",
                new AssetRequestBookingRecord(
                        bookingOwnerId,
                        "Tournament",
                        "stage-1",
                        "Qualifiers",
                        "stage-1",
                        "Qualifiers",
                        "",
                        null,
                        null,
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        null))));
        return asset;
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

    private static ChatService campaignAware(ChatService service, org.springframework.data.mongodb.core.MongoTemplate mongo) {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "campaignCatalog",
                new com.raxim.myscoutee.domain.campaigns.service.CampaignCatalogService(mongo));
        return service;
    }
}
