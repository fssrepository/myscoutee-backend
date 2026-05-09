package com.raxim.myscoutee.profile.service;

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
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

class ModelStatusPropagationServiceTest {
    @Test
    void blockedUserSuppressesAssetsAndMovesSharedAdminEventUnderReview() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEventsRepository eventsRepository = mock(ActivityEventsRepository.class);
        ActivityMembersRepository membersRepository = mock(ActivityMembersRepository.class);
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);

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
                usersRepository,
                eventsRepository,
                membersRepository,
                assetsRepository,
                mongoTemplate);

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
                usersRepository,
                eventsRepository,
                membersRepository,
                assetsRepository,
                mongoTemplate);

        ModelStatusPropagationService.ModelStatusPropagationOutcome outcome = service.applyForUser("u1");

        assertThat(outcome.eventSourceIds()).containsExactly("event-1");
        assertThat(outcome.hasConflicts()).isFalse();
        verify(mongoTemplate, never()).updateFirst(any(), any(), eq(ActivityEvent.class));
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
        event.setStartAtIso("2026-05-10T10:00:00Z");
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
}
