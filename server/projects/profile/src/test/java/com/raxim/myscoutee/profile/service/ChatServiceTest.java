package com.raxim.myscoutee.profile.service;

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

import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserChatCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatServiceEnsureRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.ChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.service.mapper.ChatMapper;
import com.raxim.myscoutee.profile.service.mapper.ChatMessageMapper;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

@ExtendWith(MockitoExtension.class)
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
        service = new ChatService(
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
                new ChatMessageMapper(usersRepository));
    }

    @AfterEach
    void tearDown() {
        service.shutdownChatWriteExecutor();
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
        var access = new com.raxim.myscoutee.profile.security.ChatPolicyFacts(chatsRepository, usersRepository, adminMenuCounterService);
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
}
