package com.raxim.myscoutee.profile.service;

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

import com.raxim.myscoutee.profile.data.document.AccountPurgeJob;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AccountPurgeJobsRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

class DeletedAccountPurgeServiceTest {
    @Test
    void purgesDeletedUserOwnedEventsAssetsMembershipsAndMedia() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityChatsRepository activityChatsRepository = mock(ActivityChatsRepository.class);
        ActivityChatMessagesRepository activityChatMessagesRepository = mock(ActivityChatMessagesRepository.class);
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
                activityChatsRepository,
                activityChatMessagesRepository,
                activityEventsRepository,
                assetsRepository,
                activityMembersRepository,
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

        service.purgeExpiredDeletedAccounts();

        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/avatar-u1.webp");
        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/event-1.webp");
        verify(mediaStorageService).deletePublicObjectOrThrow("https://cdn.example/asset-1.webp");
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, eventMember)));
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, assetMember)));
        verify(activityMembersRepository).deleteAll(argThat(items -> containsExactly(items, purgedEventMembership, purgedAssetMembership)));
        verify(activityEventsRepository).deleteAll(List.of(event));
        verify(assetsRepository).deleteAll(List.of(asset));
        verify(usersRepository).delete(user);
    }

    @Test
    void keepsPurgeJobRetryableWhenMediaCleanupFails() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityChatsRepository activityChatsRepository = mock(ActivityChatsRepository.class);
        ActivityChatMessagesRepository activityChatMessagesRepository = mock(ActivityChatMessagesRepository.class);
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
                activityChatsRepository,
                activityChatMessagesRepository,
                activityEventsRepository,
                assetsRepository,
                activityMembersRepository,
                accountPurgeJobsRepository,
                mediaStorageService,
                mongoTemplate,
                null);

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
}
