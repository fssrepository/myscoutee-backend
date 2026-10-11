package com.raxim.myscoutee.domain.notifications.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.notifications.document.UserNotification;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository.UserNotificationCursor;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository.UserNotificationSlice;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class UserNotificationPageRepositoryTest {
    @Mock
    private MongoTemplate mongoTemplate;

    private UserNotificationPageRepository repository;

    @BeforeEach
    void setUp() {
        repository = new UserNotificationPageRepository(mongoTemplate,
                List.of(new com.raxim.myscoutee.domain.events.service.MemberAttentionService(mongoTemplate)));
    }

    @Test
    void communityDeliveryRetryDoesNotIncrementTwiceOrRecountNotifications() {
        UserNotification notification = notification("community-change", "2026-09-26T17:00:00Z");
        notification.setSourceType("community"); notification.setSourceId("group");
        notification.setPayload(java.util.Map.of("communityAttention", "members"));
        when(mongoTemplate.insert(notification)).thenReturn(notification)
                .thenThrow(new org.springframework.dao.DuplicateKeyException("already delivered"));
        assertThat(repository.insertIfAbsent(notification)).isTrue();
        assertThat(repository.insertIfAbsent(notification)).isFalse();
        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(query.capture(), update.capture(), eq("activityMembers"));
        assertThat(query.getValue().getQueryObject().getString("ownerId")).isEqualTo("group");
        assertThat(update.getValue().getUpdateObject().get("$inc", Document.class).getInteger("communityUpdates")).isEqualTo(1);
        verify(mongoTemplate, org.mockito.Mockito.never()).count(any(Query.class), eq(UserNotification.class));
    }

    @Test
    void inboxStartsWithoutCommunityAndStillInsertsReadsAndListsItsNotifications() {
        try (var context = new org.springframework.context.annotation.AnnotationConfigApplicationContext()) {
            context.registerBean(MongoTemplate.class, () -> mongoTemplate);
            context.register(UserNotificationPageRepository.class);
            context.refresh();
            var inbox = context.getBean(UserNotificationPageRepository.class);
            UserNotification item = notification("existing-community-item", "2026-10-11T10:00:00Z");
            item.setSourceType("community");
            item.setPayload(java.util.Map.of("communityAttention", "members"));
            when(mongoTemplate.insert(item)).thenReturn(item);
            when(mongoTemplate.count(any(Query.class), eq(UserNotification.class))).thenReturn(1L);
            when(mongoTemplate.find(any(Query.class), eq(UserNotification.class))).thenReturn(List.of(item));
            when(mongoTemplate.findAndModify(any(Query.class), any(Update.class),
                    any(FindAndModifyOptions.class), eq(UserNotification.class))).thenReturn(item);

            assertThat(inbox.insertIfAbsent(item)).isTrue();
            assertThat(inbox.findPage("viewer-1", false, 20, null).records()).containsExactly(item);
            assertThat(inbox.markRead(item.getId(), "viewer-1", "2026-10-11T11:00:00Z")).contains(item);
            verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq("activityMembers"));
        }
    }

    @Test
    void communityFirstReadDecrementsTheExistingCounterOnceWithItsLowerBound() {
        UserNotification item = notification("community-change", "2026-10-11T10:00:00Z");
        item.setSourceType("community"); item.setSourceId("group");
        item.setPayload(java.util.Map.of("communityAttention", "members"));
        when(mongoTemplate.findAndModify(any(Query.class), any(Update.class),
                any(FindAndModifyOptions.class), eq(UserNotification.class))).thenReturn(item, null);

        assertThat(repository.markRead(item.getId(), "viewer-1", "2026-10-11T11:00:00Z")).contains(item);
        assertThat(repository.markRead(item.getId(), "viewer-1", "2026-10-11T11:00:00Z")).isEmpty();

        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(query.capture(), update.capture(), eq("activityMembers"));
        assertThat(query.getValue().getQueryObject()).containsEntry("ownerType", "community")
                .containsEntry("ownerId", "group").containsEntry("userId", "viewer-1")
                .containsEntry("communityUpdates", new Document("$gte", 1));
        assertThat(update.getValue().getUpdateObject().get("$inc", Document.class))
                .containsEntry("communityUpdates", -1);
    }

    @Test
    void ordinaryNotificationAndOtherCommunityAttentionDoNotTouchMemberships() {
        for (String type : List.of("chat", "community")) {
            UserNotification item = notification(type, "2026-10-11T10:00:00Z");
            item.setSourceType(type);
            item.setPayload(java.util.Map.of("communityAttention", "other"));
            assertThat(repository.insertIfAbsent(item)).isTrue();
        }
        verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq("activityMembers"));
    }

    @Test
    void configuredOwnerFailureStillPropagatesToTheDeliveryWorker() {
        UserNotification item = notification("community-change", "2026-10-11T10:00:00Z");
        item.setSourceType("community"); item.setSourceId("group");
        item.setPayload(java.util.Map.of("communityAttention", "members"));
        when(mongoTemplate.updateFirst(any(Query.class), any(Update.class), eq("activityMembers")))
                .thenThrow(new IllegalStateException("owner unavailable"));
        assertThatThrownBy(() -> repository.insertIfAbsent(item))
                .isInstanceOf(IllegalStateException.class).hasMessage("owner unavailable");
    }

    @Test
    void findPageUsesUnreadBucketAndStableCreatedDateIdKeyset() {
        when(mongoTemplate.count(any(Query.class), eq(UserNotification.class))).thenReturn(5L);
        when(mongoTemplate.find(any(Query.class), eq(UserNotification.class))).thenReturn(List.of(
                notification("notification-b", "2026-07-27T18:30:00Z"),
                notification("notification-a", "2026-07-27T18:30:00Z")));

        UserNotificationSlice result = repository.findPage(
                "viewer-1",
                true,
                2,
                new UserNotificationCursor("new", "2026-07-27T19:00:00Z", "notification-c"));

        assertThat(result.records()).hasSize(2);
        assertThat(result.total()).isEqualTo(5L);
        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(UserNotification.class));
        Query query = pageQuery.getValue();
        assertThat(query.getLimit()).isEqualTo(3);
        assertThat(query.getSortObject().toJson()).isEqualTo("{\"createdDate\": -1, \"_id\": -1}");
        assertThat(query.getQueryObject().toJson())
                .contains("\"recipientUserId\": \"viewer-1\"")
                .contains("\"readAtIso\": {\"$exists\": false}")
                .contains("\"readAtIso\": null")
                .contains("\"createdDate\": {\"$lt\": \"2026-07-27T19:00:00Z\"}")
                .contains("\"createdDate\": \"2026-07-27T19:00:00Z\"")
                .contains("\"_id\": {\"$lt\": \"notification-c\"}");
    }

    @Test
    void findPageUsesLimitPlusOneToSignalAnotherPage() {
        when(mongoTemplate.count(any(Query.class), eq(UserNotification.class))).thenReturn(3L);
        when(mongoTemplate.find(any(Query.class), eq(UserNotification.class))).thenReturn(List.of(
                notification("notification-c", "2026-07-27T19:00:00Z"),
                notification("notification-b", "2026-07-27T18:00:00Z"),
                notification("notification-a", "2026-07-27T17:00:00Z")));

        UserNotificationSlice result = repository.findPage("viewer-1", false, 2, null);

        assertThat(result.records()).extracting(UserNotification::getId)
                .containsExactly("notification-c", "notification-b");
        assertThat(result.hasNext()).isTrue();
    }

    @Test
    void markReadOnlyMutatesAnUnreadNotificationOwnedByTheViewer() {
        UserNotification marked = notification("notification-1", "2026-07-27T19:00:00Z");
        marked.setReadAtIso("2026-07-27T20:00:00Z");
        when(mongoTemplate.findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(UserNotification.class))).thenReturn(marked);

        var result = repository.markRead(
                "notification-1",
                "viewer-1",
                "2026-07-27T20:00:00Z");

        assertThat(result).contains(marked);
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                query.capture(),
                update.capture(),
                any(FindAndModifyOptions.class),
                eq(UserNotification.class));
        assertThat(query.getValue().getQueryObject().toJson())
                .contains("\"_id\": \"notification-1\"")
                .contains("\"recipientUserId\": \"viewer-1\"")
                .contains("\"readAtIso\": {\"$exists\": false}")
                .contains("\"readAtIso\": null");
        assertThat(update.getValue().getUpdateObject().toJson())
                .contains("\"readAtIso\": \"2026-07-27T20:00:00Z\"");
    }

    @Test
    void markUnreadBySourceOnlyReadsMatchingInvitationNotifications() {
        when(mongoTemplate.updateMulti(
                any(Query.class),
                any(Update.class),
                eq(UserNotification.class))).thenReturn(UpdateResult.acknowledged(2L, 2L, null));

        long changed = repository.markUnreadBySource(
                "viewer-1",
                "event-invite",
                "event",
                "event-1",
                "2026-07-27T20:00:00Z");

        assertThat(changed).isEqualTo(2L);
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, times(2)).updateMulti(
                query.capture(),
                update.capture(),
                eq(UserNotification.class));
        Query mutationQuery = query.getAllValues().getLast();
        Update mutationUpdate = update.getAllValues().getLast();
        assertThat(mutationQuery.getQueryObject().toJson())
                .contains("\"recipientUserId\": \"viewer-1\"")
                .contains("\"kind\": \"event-invite\"")
                .contains("\"sourceType\": \"event\"")
                .contains("\"sourceId\": \"event-1\"")
                .contains("\"readAtIso\": {\"$exists\": false}")
                .contains("\"readAtIso\": null");
        assertThat(mutationUpdate.getUpdateObject().toJson())
                .contains("\"readAtIso\": \"2026-07-27T20:00:00Z\"")
                .contains("\"revision\": 1");
    }

    @Test
    void markUnreadChatMessagesReadScopesTheMutationToChatAndMessageIds() {
        when(mongoTemplate.updateMulti(
                any(Query.class),
                any(Update.class),
                eq(UserNotification.class))).thenReturn(UpdateResult.acknowledged(2L, 2L, null));

        long changed = repository.markUnreadChatMessagesRead(
                "viewer-1",
                "chat-1",
                List.of("message-1", "message-2"),
                "2026-07-27T20:00:00Z");

        assertThat(changed).isEqualTo(2L);
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate, times(2)).updateMulti(
                query.capture(),
                any(Update.class),
                eq(UserNotification.class));
        assertThat(query.getAllValues().getLast().getQueryObject().toJson())
                .contains("\"recipientUserId\": \"viewer-1\"")
                .contains("\"kind\": \"chat-message\"")
                .contains("\"sourceType\": \"chat\"")
                .contains("\"sourceId\": \"chat-1\"")
                .contains("\"payload.messageId\": {\"$in\": [\"message-1\", \"message-2\"]}");
    }

    @Test
    void aggregatedUpsertLetsIncInitializeRevisionWithoutAConflictingSetOnInsert() {
        UserNotification notification = notification("notification-1", "2026-07-27T19:00:00Z");
        notification.setAggregationKey("viewer-1:event-ticket-replay:ticket-1");
        notification.setSyncKey("warning-1:viewer-1");

        repository.upsertAggregated(notification);

        ArgumentCaptor<Update> update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                any(Query.class),
                update.capture(),
                any(FindAndModifyOptions.class),
                eq(UserNotification.class));
        Document updateDocument = update.getValue().getUpdateObject();
        assertThat((Document) updateDocument.get("$setOnInsert"))
                .doesNotContainKey("revision");
        assertThat((Document) updateDocument.get("$inc"))
                .containsEntry("occurrenceCount", 1)
                .containsEntry("revision", 1L);
    }

    private UserNotification notification(String id, String createdDate) {
        UserNotification notification = new UserNotification();
        notification.setId(id);
        notification.setRecipientUserId("viewer-1");
        notification.setCreatedDate(createdDate);
        return notification;
    }
}
