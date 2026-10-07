package com.raxim.myscoutee.domain.platform.service;

import com.raxim.myscoutee.domain.chat.service.ChatAttachmentLifecycleService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;

@org.junit.jupiter.api.Tag("standard")
class ModelStatusPropagationServiceTest {
    @Test
    void blockedUserSuppressesAssetsAndMovesSharedAdminEventUnderReview() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEventsRepository eventsRepository = mock(ActivityEventsRepository.class);
        ActivityMembersRepository membersRepository = mock(ActivityMembersRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);

        Users blockedUser = user("u1", "blocked", "B");
        Users activeAdmin = user("u2", "public", "A");
        ActivityEvent event = event("event-doc-1", "event-1", "u1", "active", "2026-05-09T10:00:00Z");
        event.setAdmins(List.of("u1", "u2"));
        Asset asset = asset("asset-doc-1", "asset-1", "u1", "active", "2026-05-09T10:00:00Z");

        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(blockedUser));
        when(eventsRepository.findByCreatorUserId("u1")).thenReturn(List.of(event));
        when(eventsRepository.findByAdminsContaining("u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndUserId("event", "u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any())).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(blockedUser, activeAdmin));
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(mongoTemplate.updateFirst(any(), any(), eq(ActivityEvent.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));

        ModelStatusPropagationService service = new ModelStatusPropagationService(
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(eventsRepository, mongoTemplate),
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(membersRepository),
                com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(assetsRepository, mongoTemplate),
                mongoTemplate,
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class));

        ModelStatusPropagationService.ModelStatusPropagationOutcome outcome = service.applyForUser("u1");

        assertThat(outcome.eventSourceIds()).containsExactly("event-1");
        assertThat(outcome.assetIds()).containsExactly("asset-1");
        assertThat(outcome.hasConflicts()).isFalse();

        ArgumentCaptor<Update> eventUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(), eventUpdate.capture(), eq(ActivityEvent.class));
        assertThat(eventUpdate.getValue().getUpdateObject().toJson()).contains("\"status\": \"UR\"");
        assertThat(eventUpdate.getValue().getUpdateObject().toJson()).contains("\"statusBeforeSuppression\": \"A\"");

        ArgumentCaptor<Update> assetUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(), assetUpdate.capture(), eq(Asset.class));
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"status\": \"B\"");
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"statusBeforeSuppression\": \"A\"");

        ArgumentCaptor<NotificationOutboxService.NotificationIntent> notification =
                ArgumentCaptor.forClass(NotificationOutboxService.NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("event-review");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
    }

    @Test
    void activeUserDoesNotRestoreSuppressedFullEvent() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEventsRepository eventsRepository = mock(ActivityEventsRepository.class);
        ActivityMembersRepository membersRepository = mock(ActivityMembersRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users activeUser = user("u1", "public", "A");
        ActivityEvent event = event("event-doc-1", "event-1", "u1", "UR", "2026-05-09T10:00:00Z");
        event.setStatusBeforeSuppression("H");
        event.setAdmins(List.of("u1"));
        event.setCapacityTotal(2);
        event.setAcceptedMembers(2);

        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(activeUser));
        when(eventsRepository.findByCreatorUserId("u1")).thenReturn(List.of(event));
        when(eventsRepository.findByAdminsContaining("u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndUserId("event", "u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any())).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(activeUser));
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of());

        ModelStatusPropagationService service = new ModelStatusPropagationService(
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(eventsRepository, mongoTemplate),
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(membersRepository),
                com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(assetsRepository, mongoTemplate),
                mongoTemplate,
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class));

        ModelStatusPropagationService.ModelStatusPropagationOutcome outcome = service.applyForUser("u1");

        assertThat(outcome.eventSourceIds()).containsExactly("event-1");
        assertThat(outcome.hasConflicts()).isFalse();
        verify(mongoTemplate, never()).updateFirst(any(), any(), eq(ActivityEvent.class));
    }

    @Test
    void blockedOwnerMovesAssetUnderReviewWhenActiveManagerExists() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEventsRepository eventsRepository = mock(ActivityEventsRepository.class);
        ActivityMembersRepository membersRepository = mock(ActivityMembersRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users blockedOwner = user("u1", "blocked", "B");
        Users activeManager = user("u2", "public", "A");
        Asset asset = asset("asset-doc-1", "asset-1", "u1", "active", "2026-05-09T10:00:00Z");
        ActivityMember manager = member("asset", "asset-1", "u2", "Manager", "accepted");

        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(blockedOwner));
        when(eventsRepository.findByCreatorUserId("u1")).thenReturn(List.of());
        when(eventsRepository.findByAdminsContaining("u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndUserId("event", "u1")).thenReturn(List.of());
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(membersRepository.findByOwnerTypeAndUserId("asset", "u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndOwnerIdIn(eq("asset"), any())).thenReturn(List.of(manager));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(blockedOwner, activeManager));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));

        ModelStatusPropagationService service = new ModelStatusPropagationService(
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(eventsRepository, mongoTemplate),
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(membersRepository),
                com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(assetsRepository, mongoTemplate),
                mongoTemplate,
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class));

        ModelStatusPropagationService.ModelStatusPropagationOutcome outcome = service.applyForUser("u1");

        assertThat(outcome.assetIds()).containsExactly("asset-1");

        ArgumentCaptor<Update> assetUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(), assetUpdate.capture(), eq(Asset.class));
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"status\": \"UR\"");
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"statusBeforeSuppression\": \"A\"");
    }

    @Test
    void blockedManagerMovesManagedAssetUnderReview() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEventsRepository eventsRepository = mock(ActivityEventsRepository.class);
        ActivityMembersRepository membersRepository = mock(ActivityMembersRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users blockedManager = user("u1", "blocked", "B");
        Users activeOwner = user("u2", "public", "A");
        Asset asset = asset("asset-doc-1", "asset-1", "u2", "active", "2026-05-09T10:00:00Z");
        ActivityMember manager = member("asset", "asset-1", "u1", "Manager", "accepted");

        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(blockedManager));
        when(eventsRepository.findByCreatorUserId("u1")).thenReturn(List.of());
        when(eventsRepository.findByAdminsContaining("u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndUserId("event", "u1")).thenReturn(List.of());
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of());
        when(membersRepository.findByOwnerTypeAndUserId("asset", "u1")).thenReturn(List.of(manager));
        when(assetsRepository.findByAssetIdIn(List.of("asset-1"))).thenReturn(List.of(asset));
        when(membersRepository.findByOwnerTypeAndOwnerIdIn(eq("asset"), any())).thenReturn(List.of(manager));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(blockedManager, activeOwner));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));

        ModelStatusPropagationService service = new ModelStatusPropagationService(
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(eventsRepository, mongoTemplate),
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(membersRepository),
                com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(assetsRepository, mongoTemplate),
                mongoTemplate,
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class));

        ModelStatusPropagationService.ModelStatusPropagationOutcome outcome = service.applyForUser("u1");

        assertThat(outcome.assetIds()).containsExactly("asset-1");

        ArgumentCaptor<Update> assetUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(), assetUpdate.capture(), eq(Asset.class));
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"status\": \"UR\"");
        assertThat(assetUpdate.getValue().getUpdateObject().toJson()).contains("\"statusBeforeSuppression\": \"A\"");
    }

    private Users user(String userId, String profileStatus, String status) {
        Users user = new Users();
        user.setUserId(userId);
        user.setProfileStatus(profileStatus);
        user.setStatus(status);
        return user;
    }

    private ActivityEvent event(String id, String sourceId, String creatorUserId, String status, String updatedDate) {
        ActivityEvent event = new ActivityEvent();
        event.setId(id);
        event.setSourceId(sourceId);
        event.setCreatorUserId(creatorUserId);
        event.setStatus(status);
        event.setStartAtIso("2099-06-10T10:00:00Z");
        event.setUpdatedDate(updatedDate);
        return event;
    }

    private Asset asset(String id, String assetId, String ownerUserId, String status, String updatedDate) {
        Asset asset = new Asset();
        asset.setId(id);
        asset.setAssetId(assetId);
        asset.setOwnerUserId(ownerUserId);
        asset.setStatus(status);
        asset.setUpdatedDate(updatedDate);
        return asset;
    }

    private ActivityMember member(String ownerType, String ownerId, String userId, String role, String status) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType(ownerType);
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setRole(role);
        member.setStatus(status);
        return member;
    }
}
