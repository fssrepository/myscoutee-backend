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
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions.Action;
import com.raxim.myscoutee.domain.events.api.EventPrivacy;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;

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
        org.springframework.test.util.ReflectionTestUtils.setField(service, "integrationPrivacy", new com.raxim.myscoutee.domain.integrations.service.IntegrationPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "emailPrivacy",
                new com.raxim.myscoutee.domain.email.service.EmailPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "helpPrivacy",
                new com.raxim.myscoutee.domain.help.service.HelpPrivacyService(mongoTemplate));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "notificationPrivacy",
                new com.raxim.myscoutee.domain.notifications.service.NotificationPrivacyService(mongoTemplate));
        var registry = mock(com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService.class);
        org.mockito.Mockito.doAnswer(call -> { com.raxim.myscoutee.domain.platform.api.JobGroupContext.run(null, call.getArgument(1, Runnable.class)); return null; }).when(registry).forEachGroup(anyString(), any(Runnable.class));
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
        when(activityEventsRepository.findAllById(List.of("event-doc-1"))).thenReturn(List.of(event));
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(assetsRepository.findByAssetIdIn(List.of("asset-1"))).thenReturn(List.of(asset));
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
                new com.raxim.myscoutee.domain.chat.service.ChatPrivacyService(chatsRepository, chatMessagesRepository, mediaStorageService),
                List.of(
                        new com.raxim.myscoutee.domain.events.service.EventPrivacyService(activityEventsRepository, activityMembersRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                        new com.raxim.myscoutee.domain.assets.service.AssetPrivacyService(assetsRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.content.service.ContentPrivacyService(mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.affinity.service.AffinityPrivacyService(mongoTemplate),
                        new com.raxim.myscoutee.domain.payments.service.PaymentPrivacyService(mongoTemplate)),
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
                new com.raxim.myscoutee.domain.chat.service.ChatPrivacyService(chatsRepository, chatMessagesRepository, mediaStorageService),
                List.of(
                        new com.raxim.myscoutee.domain.events.service.EventPrivacyService(activityEventsRepository, activityMembersRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                        new com.raxim.myscoutee.domain.assets.service.AssetPrivacyService(assetsRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.content.service.ContentPrivacyService(mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.affinity.service.AffinityPrivacyService(mongoTemplate),
                        new com.raxim.myscoutee.domain.payments.service.PaymentPrivacyService(mongoTemplate)),
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
                new com.raxim.myscoutee.domain.chat.service.ChatPrivacyService(chatsRepository, chatMessagesRepository, mediaStorageService),
                List.of(
                        new com.raxim.myscoutee.domain.events.service.EventPrivacyService(activityEventsRepository, activityMembersRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assetsRepository),
                        new com.raxim.myscoutee.domain.assets.service.AssetPrivacyService(assetsRepository, mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.content.service.ContentPrivacyService(mongoTemplate, mediaStorageService),
                        new com.raxim.myscoutee.domain.affinity.service.AffinityPrivacyService(mongoTemplate),
                        new com.raxim.myscoutee.domain.payments.service.PaymentPrivacyService(mongoTemplate)),
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

        wireGlobalJob(service, mongoTemplate);
        service.purgeExpiredDeletedAccounts();

        verify(usersRepository).delete(onboardingUser);
    }

    @Test
    void coreCleanupWorksWithoutProductOwnersAndKeepsIdentityUntilItsLastStage() {
        var users = mock(UsersRepository.class);
        var jobs = mock(AccountPurgeJobsRepository.class);
        var media = mock(MediaStorageService.class);
        var mongo = mock(MongoTemplate.class);
        var chat = mock(com.raxim.myscoutee.domain.chat.api.ChatPrivacy.class);
        Users user = new Users(); user.setId("minimal-user"); user.setImages(List.of("avatar.webp"));
        when(users.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of(user));
        var service = new DeletedAccountPurgeService(users, chat, List.of(), jobs, media, mongo, null);
        wireGlobalJob(service, mongo);

        service.purgeExpiredDeletedAccounts();

        var order = org.mockito.Mockito.inOrder(media, chat, users);
        order.verify(media).deletePublicObjectOrThrow("avatar.webp");
        order.verify(chat).purgeUserChatActivity("minimal-user");
        order.verify(users).delete(user);
        verify(mongo).remove(any(org.springframework.data.mongodb.core.query.Query.class), eq("privacyConsents"));
        verify(mongo).remove(any(org.springframework.data.mongodb.core.query.Query.class), eq("userNotifications"));
        verify(jobs, atLeastOnce()).save(argThat(job -> AccountPurgeJob.STATUS_COMPLETED.equals(job.getStatus())));
    }

    @Test
    void installedProductActionsKeepTheirExistingOrderRegardlessOfRegistrationOrder() {
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var calls = new ArrayList<Action>();
        List<AccountPurgeActions> owners = new ArrayList<>();
        for (Action action : Action.values()) owners.add(() -> Map.of(action, context -> calls.add(action)));
        java.util.Collections.reverse(owners);
        Users user = new Users(); user.setId("ordered-user");
        when(users.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of(user));
        var service = new DeletedAccountPurgeService(users,
                mock(com.raxim.myscoutee.domain.chat.api.ChatPrivacy.class), owners,
                mock(AccountPurgeJobsRepository.class), mock(MediaStorageService.class), mongo, null);
        wireGlobalJob(service, mongo);

        service.purgeExpiredDeletedAccounts();

        org.assertj.core.api.Assertions.assertThat(calls).containsExactly(
                Action.OWNED_EVENTS, Action.DISCOVER_OWNED_ASSETS, Action.OWNED_ASSET_MEDIA,
                Action.ASSET_MEMBERSHIPS, Action.OWNED_ASSET_RECORDS, Action.ACTIVITY_MEMBERSHIPS,
                Action.MANAGED_EVENT_ADMINS, Action.ASSET_REQUESTS, Action.ACTIVITY_RESOURCES,
                Action.IDEA_POSTS, Action.RATINGS, Action.EDGES, Action.CONTENT_FEEDBACK,
                Action.CONTENT_REPORTS, Action.CONTENT_FEED_VIEWS, Action.PAYER_RECORDS,
                Action.TICKET_AUDIT, Action.CONTENT_SHARE_TOKENS, Action.EVENT_FEEDBACK,
                Action.AFFINITY_TASKS, Action.LEADERBOARD, Action.SCHEDULER_MARKERS, Action.AFFINITY_AUTHORS);
        verify(users).delete(user);
    }

    @Test
    void eventIdsArePersistedBeforeOwnerDeletionAndSurviveFailureAndRetry() {
        var users = mock(UsersRepository.class);
        var jobs = mock(AccountPurgeJobsRepository.class);
        var mongo = mock(MongoTemplate.class);
        var events = mock(EventPrivacy.class, org.mockito.Answers.CALLS_REAL_METHODS);
        Users user = new Users(); user.setId("retry-user");
        AccountPurgeJob job = new AccountPurgeJob(); job.setUserId(user.getId());
        job.setStatus(AccountPurgeJob.STATUS_PENDING); job.setOwnedEventIds(List.of("previous-source"));
        when(users.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                .thenReturn(List.of(user));
        when(jobs.findByUserId(user.getId())).thenReturn(Optional.of(job));
        var persisted = new ArrayList<List<String>>();
        when(jobs.save(any())).thenAnswer(call -> {
            AccountPurgeJob value = call.getArgument(0);
            persisted.add(List.copyOf(value.getOwnedEventIds()));
            return value;
        });
        when(events.findOwnedEventsForPurge(user.getId()))
                .thenReturn(List.of(new EventPurgeTargetDto("doc", "new-source")), List.of());
        var deletions = new java.util.concurrent.atomic.AtomicInteger();
        org.mockito.Mockito.doAnswer(call -> {
            assertEquals(List.of("previous-source", "new-source"), persisted.getLast());
            assertEquals(persisted.getLast(), call.getArgument(1));
            if (deletions.getAndIncrement() == 0) throw new IllegalStateException("owner unavailable");
            return null;
        }).when(events).purgeOwnedEvents(any(), any());
        var service = new DeletedAccountPurgeService(users,
                mock(com.raxim.myscoutee.domain.chat.api.ChatPrivacy.class), List.of(events), jobs,
                mock(MediaStorageService.class), mongo, null);
        wireGlobalJob(service, mongo);

        service.purgeExpiredDeletedAccounts();
        assertEquals(AccountPurgeJob.STATUS_FAILED, job.getStatus());
        assertEquals("owned-events", job.getStage());
        verify(users, never()).delete(user);

        job.setNextRetryAtIso("2020-01-01T00:00:00Z");
        service.purgeExpiredDeletedAccounts();
        assertEquals(AccountPurgeJob.STATUS_COMPLETED, job.getStatus());
        verify(events).purgeOwnedEvents(List.of(), List.of("previous-source", "new-source"));
        verify(users).delete(user);
    }

    @Test
    void duplicateCleanupOwnerFailsAtConstructionBeforeAnyPurgeCanStart() {
        AccountPurgeActions owner = () -> Map.of(Action.IDEA_POSTS, context -> {});
        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class,
                () -> new DeletedAccountPurgeService(null, null, List.of(owner, owner), null, null, null, null));
    }

    @Test
    void unfinishedProductCleanupCannotBeSilentlySkippedAfterItsOwnerWasRemoved() {
        for (boolean event : List.of(true, false)) {
            var users = mock(UsersRepository.class);
            var jobs = mock(AccountPurgeJobsRepository.class);
            var media = mock(MediaStorageService.class);
            var mongo = mock(MongoTemplate.class);
            Users user = new Users(); user.setId("unfinished-user"); user.setImages(List.of("avatar.webp"));
            var job = new AccountPurgeJob(); job.setStatus(AccountPurgeJob.STATUS_PENDING);
            if (event) job.setOwnedEventIds(List.of("recorded-event"));
            else job.setOwnedAssetIds(List.of("recorded-asset"));
            when(users.findByProfileStatusAndDeletedAtIsoLessThanEqual(eq("deleted"), anyString()))
                    .thenReturn(List.of(user));
            when(jobs.findByUserId(user.getId())).thenReturn(Optional.of(job));
            var service = new DeletedAccountPurgeService(users,
                    mock(com.raxim.myscoutee.domain.chat.api.ChatPrivacy.class), List.of(), jobs, media, mongo, null);
            wireGlobalJob(service, mongo);

            service.purgeExpiredDeletedAccounts();

            verify(media, never()).deletePublicObjectOrThrow(anyString());
            verify(users, never()).delete(any());
            assertEquals(AccountPurgeJob.STATUS_FAILED, job.getStatus());
            assertNotNull(job.getNextRetryAtIso());
        }
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
