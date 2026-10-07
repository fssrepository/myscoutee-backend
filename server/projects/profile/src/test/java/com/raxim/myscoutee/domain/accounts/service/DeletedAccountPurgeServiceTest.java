package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.media.service.MediaStorageService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.UpdateDefinition;

import com.raxim.myscoutee.domain.accounts.document.AccountPurgeJob;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.accounts.repository.AccountPurgeJobsRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@org.junit.jupiter.api.Tag("standard")
class DeletedAccountPurgeServiceTest {
    private void wireGlobalJob(DeletedAccountPurgeService service, MongoTemplate mongoTemplate) {
        var owner = org.springframework.test.util.ReflectionTestUtils.getField(service, "assetsRepository");
        var repository = (AssetsRepository) org.springframework.test.util.ReflectionTestUtils.getField(owner, "assets");
        org.springframework.test.util.ReflectionTestUtils.setField(service, "assetPrivacy", new com.raxim.myscoutee.domain.assets.service.AssetPrivacyService(repository, mongoTemplate,
            (com.raxim.myscoutee.domain.media.api.MediaStorage) org.springframework.test.util.ReflectionTestUtils.getField(service, "mediaStorageService")));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "contentPrivacy", new com.raxim.myscoutee.domain.content.service.ContentPrivacyService(mongoTemplate,
            (com.raxim.myscoutee.domain.media.api.MediaStorage) org.springframework.test.util.ReflectionTestUtils.getField(service, "mediaStorageService")));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "affinityPrivacy", new com.raxim.myscoutee.domain.affinity.service.AffinityPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "emailPrivacy",
                new com.raxim.myscoutee.domain.email.service.EmailPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "helpPrivacy",
                new com.raxim.myscoutee.domain.help.service.HelpPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "notificationPrivacy",
                new com.raxim.myscoutee.domain.notifications.service.NotificationPrivacyService(mongoTemplate));
        var registry = mock(com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService.class);
        org.mockito.Mockito.doAnswer(call -> { com.raxim.myscoutee.domain.platform.service.JobGroupContext.run(null, call.getArgument(1, Runnable.class)); return null; }).when(registry).forEachGroup(anyString(), any(Runnable.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "notificationRuleRegistryService", registry);
        var scope = mock(com.raxim.myscoutee.domain.platform.service.JobGroupScopeService.class);
        when(scope.matchesWorkspace(any())).thenReturn(true);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope", scope);
    }

    @Test
    void purgesDeletedUserOwnedEventsAssetsMembershipsAndMedia() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ChatsRepository chatsRepository = mock(ChatsRepository.class);
        ChatMessagesRepository chatMessagesRepository = mock(ChatMessagesRepository.class);
        ActivityEventsRepository activityEventsRepository = mock(ActivityEventsRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccountPurgeJobsRepository accountPurgeJobsRepository = mock(AccountPurgeJobsRepository.class);
        MediaStorageService mediaStorageService = mock(MediaStorageService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users user = new Users();
        user.setId("u1");
        user.setImages(List.of("https://cdn.example/avatar-u1.webp"));

        ActivityEvent event = new ActivityEvent();
        event.setId("event-doc-1");
        event.setSourceId("event-1");
        event.setCreatorUserId("u1");
        event.setImageUrl("https://cdn.example/event-1.webp");

        Asset asset = new Asset();
        asset.setId("asset-doc-1");
        asset.setOwnerUserId("u1");
        asset.setAssetId("asset-1");
        asset.setImageUrl("https://cdn.example/asset-1.webp");

        ActivityMember eventMember = member("event", "event-1", "u2");
        ActivityMember assetMember = member("asset", "asset-1", "u3");
        ActivityMember purgedEventMembership = member("event", "event-2", "u1");
        ActivityMember purgedAssetMembership = member("asset", "asset-2", "u1");

        when(usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of(user));
        when(activityEventsRepository.findByCreatorUserId("u1")).thenReturn(List.of(event));
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any()))
                .thenReturn(List.of(eventMember));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(eq("asset"), any()))
                .thenReturn(List.of(assetMember));
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "u1"))
                .thenReturn(List.of(purgedEventMembership));
        when(activityMembersRepository.findByOwnerTypeAndUserId("asset", "u1"))
                .thenReturn(List.of(purgedAssetMembership));

        DeletedAccountPurgeService service = new DeletedAccountPurgeService(
                usersRepository,
                chatsRepository,
                chatMessagesRepository,
                activityEventsRepository,
                new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                activityMembersRepository,
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

        wireGlobalJob(service, mongoTemplate);
        service.purgeExpiredDeletedAccounts();

        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/avatar-u1.webp");
        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/event-1.webp");
        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/asset-1.webp");
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, eventMember)));
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, assetMember)));
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, purgedEventMembership, purgedAssetMembership)));
        verify(activityEventsRepository).deleteAll(List.of(event));
        verify(assetsRepository).deleteAll(List.of(asset));
        verify(mongoTemplate).remove(
                argThat(query -> query.getQueryObject().size() == 1
                        && "u1".equals(query.getQueryObject().getString("recipientUserId"))),
                eq("userNotifications"));
        verify(mongoTemplate).updateMulti(
                argThat(query -> query.getQueryObject().toJson().contains("\"senderUserId\": \"u1\"")
                        && query.getQueryObject().toJson().contains("\"payload.senderUserId\": \"u1\"")
                        && query.getQueryObject().toJson().contains("\"payload.actorUserId\": \"u1\"")),
                argThat(this::redactsNotificationSender),
                eq("userNotifications"));
        verify(mongoTemplate).updateMulti(
                argThat(query -> "u1".equals(query.getQueryObject().getString("createdUser"))),
                argThat(update -> updatesFieldToDeletedUser(update, "createdUser")),
                eq("userNotifications"));
        verify(mongoTemplate).updateMulti(
                argThat(query -> "u1".equals(query.getQueryObject().getString("updatedUser"))),
                argThat(update -> updatesFieldToDeletedUser(update, "updatedUser")),
                eq("userNotifications"));
        verify(usersRepository).delete(user);
    }

    @Test
    void keepsPurgeJobRetryableWhenMediaCleanupFails() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ChatsRepository chatsRepository = mock(ChatsRepository.class);
        ChatMessagesRepository chatMessagesRepository = mock(ChatMessagesRepository.class);
        ActivityEventsRepository activityEventsRepository = mock(ActivityEventsRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccountPurgeJobsRepository accountPurgeJobsRepository = mock(AccountPurgeJobsRepository.class);
        MediaStorageService mediaStorageService = mock(MediaStorageService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users user = new Users();
        user.setId("u1");
        user.setImages(List.of("https://cdn.example/avatar-u1.webp"));

        when(usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of(user));
        doThrow(new RuntimeException("minio down"))
                .when(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/avatar-u1.webp");

        DeletedAccountPurgeService service = new DeletedAccountPurgeService(
                usersRepository,
                chatsRepository,
                chatMessagesRepository,
                activityEventsRepository,
                new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                activityMembersRepository,
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

        wireGlobalJob(service, mongoTemplate);
        service.purgeExpiredDeletedAccounts();

        verify(usersRepository, never()).delete(any(Users.class));
        ArgumentCaptor<AccountPurgeJob> captor = ArgumentCaptor.forClass(AccountPurgeJob.class);
        verify(accountPurgeJobsRepository, atLeastOnce()).save(captor.capture());
        AccountPurgeJob latest = captor.getAllValues().get(captor.getAllValues().size() - 1);
        assertEquals(AccountPurgeJob.STATUS_FAILED, latest.getStatus());
        assertEquals("u1", latest.getUserId());
        assertEquals(1, latest.getRetryCount());
        assertNotNull(latest.getNextRetryAtIso());
    }

    @Test
    void purgesExpiredOnboardingUserWithExistingPurgeProcess() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ChatsRepository chatsRepository = mock(ChatsRepository.class);
        ChatMessagesRepository chatMessagesRepository = mock(ChatMessagesRepository.class);
        ActivityEventsRepository activityEventsRepository = mock(ActivityEventsRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccountPurgeJobsRepository accountPurgeJobsRepository = mock(AccountPurgeJobsRepository.class);
        MediaStorageService mediaStorageService = mock(MediaStorageService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

        Users onboardingUser = new Users();
        onboardingUser.setId("firebase-onboarding-user");
        onboardingUser.setProfileStatus("onboarding");
        onboardingUser.setDeletedAtIso("2026-04-01T00:00:00Z");

        when(usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of());
        when(usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("onboarding"), anyString()))
                .thenReturn(List.of(onboardingUser));
        when(activityEventsRepository.findByOwnerUserId("firebase-onboarding-user")).thenReturn(List.of());
        when(activityEventsRepository.findByCreatorUserId("firebase-onboarding-user")).thenReturn(List.of());
        when(assetsRepository.findByOwnerUserId("firebase-onboarding-user")).thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "firebase-onboarding-user")).thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndUserId("asset", "firebase-onboarding-user")).thenReturn(List.of());
        when(activityEventsRepository.findByAdminsContaining("firebase-onboarding-user")).thenReturn(List.of());

        DeletedAccountPurgeService service = new DeletedAccountPurgeService(
                usersRepository,
                chatsRepository,
                chatMessagesRepository,
                activityEventsRepository,
                new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                activityMembersRepository,
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

        wireGlobalJob(service, mongoTemplate);
        service.purgeExpiredDeletedAccounts();

        verify(usersRepository).delete(onboardingUser);
    }

    private ActivityMember member(String ownerType, String ownerId, String userId) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType(ownerType);
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        return member;
    }

    private boolean containsExactly(Iterable<? extends ActivityMember> actual, ActivityMember... expected) {
        if (actual == null) {
            return false;
        }
        List<ActivityMember> list = new java.util.ArrayList<>();
        for (ActivityMember value : actual) {
            list.add(value);
        }
        return list.equals(List.of(expected));
    }

    private boolean updatesFieldToDeletedUser(UpdateDefinition update, String field) {
        org.bson.Document set = update == null
                ? null
                : update.getUpdateObject().get("$set", org.bson.Document.class);
        return set != null && "deleted-user".equals(set.getString(field));
    }

    private boolean redactsNotificationSender(UpdateDefinition update) {
        org.bson.Document set = update == null
                ? null
                : update.getUpdateObject().get("$set", org.bson.Document.class);
        return set != null
                && "deleted-user".equals(set.getString("senderUserId"))
                && "Notification from a deleted user".equals(set.getString("title"))
                && "This notification was sent by a deleted user.".equals(set.getString("message"))
                && set.get("payload") instanceof org.bson.Document payload
                && payload.isEmpty();
    }
}
