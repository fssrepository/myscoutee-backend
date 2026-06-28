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

import com.mongodb.client.result.UpdateResult;

import com.raxim.myscoutee.common.config.properties.AssetSourceRefreshProperties;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetRequestBookingDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class AssetsServiceTest {
    @Test
    void makeManagerPersistsRoleAndReturnsRefreshedAssetCard() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");
        ActivityMember promotedMember = member("asset-1", "u2", "Manager", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.empty());
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(promotedMember));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accessControlService.canCurrentActorPromoteAssetManager("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNotNull();
        assertThat(card.requests()).hasSize(1);
        assertThat(card.requests().get(0).status()).isEqualTo("accepted");
        assertThat(card.requests().get(0).note()).isEqualTo("Promoted to asset manager.");
        assertThat(card.requests().get(0).menuActions()).isEmpty();

        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getRole()).isEqualTo("Manager");
        assertThat(savedMember.getValue().getStatus()).isEqualTo("accepted");

        verify(mongoTemplate).updateFirst(any(), any(), eq(Asset.class));
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
    }

    @Test
    void makeManagerRejectsEventBorrowWhenRequesterIsNotEventMember() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = assetWithEventRequest();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorPromoteAssetManager("u1", "asset-1")).thenReturn(true);
        when(accessControlService.canReceiveEventAssetManagerRole("event-1", "u2")).thenReturn(false);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNull();
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
        verify(mongoTemplate, never()).updateFirst(any(), any(), eq(Asset.class));
        verify(affinityRecomputeTaskService, never()).enqueueAssetChanged(any(), any());
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
        verify(accessControlService).canReceiveEventAssetManagerRole("event-1", "u2");
    }

    @Test
    void makeManagerKeepsAcceptedEventMemberRoleSeparateFromAssetManagerRole() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = assetWithEventRequest();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");
        ActivityMember eventMember = member("event", "event-1", "u2", "Member", "accepted");
        ActivityMember promotedMember = member("asset-1", "u2", "Manager", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorPromoteAssetManager("u1", "asset-1")).thenReturn(true);
        when(accessControlService.canReceiveEventAssetManagerRole("event-1", "u2")).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(promotedMember));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNotNull();
        assertThat(eventMember.getRole()).isEqualTo("Member");

        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getOwnerType()).isEqualTo("asset");
        assertThat(savedMember.getValue().getOwnerId()).isEqualTo("asset-1");
        assertThat(savedMember.getValue().getRole()).isEqualTo("Manager");

        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        verify(affinityRecomputeTaskService, never()).enqueueEventMembersChanged(any(), any());
        verify(accessControlService).canReceiveEventAssetManagerRole("event-1", "u2");
    }

    @Test
    void makeManagerDoesNotPublishSideEffectsWhenAssetSnapshotChanged() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.empty());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(0L, 0L, null));
        when(accessControlService.canCurrentActorPromoteAssetManager("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNull();
        verify(affinityRecomputeTaskService, never()).enqueueAssetChanged(any(), any());
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void takeOverDoesNotPublishSideEffectsWhenAssetSnapshotChanged() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        asset.setOwnerUserId("u1");
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        Users manager = user("u2", "Manager Two", "MT");
        ActivityMember managerMember = member("asset-1", "u2", "Manager", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(manager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(managerMember));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(0L, 0L, null));
        when(accessControlService.canCurrentActorTakeOverAsset("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

        assertThat(card).isNull();
        verify(assetsRepository, never()).save(any(Asset.class));
        verify(affinityRecomputeTaskService, never()).enqueueAssetChanged(any(), any());
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void deleteMarksAssetTrashedInsteadOfPhysicallyDeleting() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accessControlService.canCurrentActorDeleteAsset("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.delete(new AssetDeleteRequestDto("u1", "asset-1"));

        verify(assetsRepository, never()).delete(any(Asset.class));
        verify(assetsRepository, never()).deleteAll(org.mockito.ArgumentMatchers.<Iterable<Asset>>any());

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getStatus()).isEqualTo("T");
        assertThat(savedAsset.getValue().getStatusBeforeSuppression()).isNull();
        assertThat(savedAsset.getValue().getTrashedAtIso()).isNotBlank();
        assertThat(savedAsset.getValue().getUpdatedUser()).isEqualTo("u1");

        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-unavailable");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
    }

    @Test
    void restoreClearsAssetTrashStatus() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        asset.setStatus("T");
        asset.setTrashedAtIso("2026-05-01T10:00:00Z");
        Users owner = user("u1", "Owner One", "OO");

        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accessControlService.canCurrentActorRestoreAsset("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.restore(new AssetDeleteRequestDto("u1", "asset-1"));

        assertThat(card).isNotNull();
        assertThat(card.status()).isEqualTo("A");
        assertThat(card.menuActions()).contains("delete");

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getStatus()).isEqualTo("A");
        assertThat(savedAsset.getValue().getTrashedAtIso()).isNull();
        assertThat(savedAsset.getValue().getAffinity()).isEqualTo(42d);
        assertThat(savedAsset.getValue().getBoost()).isEqualTo(7d);
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
    }

    @Test
    void replaceEnqueuesRecomputeForSavedAssets() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Users owner = user("u1", "Owner One", "OO");

        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of());
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(accessControlService.canCurrentActorReplaceAssets("u1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.replace(new AssetReplaceRequestDto("u1", List.of(assetCard("asset-1").toAssetDto())));

        verify(assetsRepository).saveAll(any());
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
    }

    @Test
    void deleteDoesNotLoadOrSaveAssetWhenPolicyDenies() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.delete(new AssetDeleteRequestDto("u1", "asset-1"));

        verify(assetsRepository, never()).findByOwnerUserIdAndAssetId(any(), any());
        verify(assetsRepository, never()).save(any(Asset.class));
    }

    @Test
    void takeOverDoesNotLoadAssetWhenPolicyDenies() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

        assertThat(card).isNull();
        verify(assetsRepository, never()).findByAssetId(any());
    }

    @Test
    void makeManagerDoesNotLoadAssetWhenActorPolicyDenies() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNull();
        verify(assetsRepository, never()).findByAssetId(any());
    }

    @Test
    void upsertUsesCreatePolicyForNewAsset() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Users owner = user("u1", "Owner One", "OO");

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorCreateAsset("u1", "asset-1")).thenReturn(true);
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto("u1", assetCard("asset-1")));

        verify(accessControlService).canCurrentActorCreateAsset("u1", "asset-1");
        verify(accessControlService, never()).canCurrentActorEditAsset(any(), any());
        verify(assetsRepository).save(any(Asset.class));
    }

    @Test
    void upsertUsesEditPolicyForExistingAssetAndStopsWhenDenied() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = asset();

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto("u1", assetCard("asset-1")));

        verify(accessControlService).canCurrentActorEditAsset("u1", "asset-1");
        verify(assetsRepository, never()).save(any(Asset.class));
    }

    @Test
    void upsertAllowsPendingBorrowRequestWithoutFullAssetEditAndIgnoresAssetFieldChanges() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = asset();
        existing.setRequests(List.of());

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorRequestAssetBorrow("u2", "event-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto(
                "u1",
                assetCard(
                        "asset-1",
                        "Spoofed Title",
                        1,
                        List.of(borrowRequestDto("request-2", "u2", "pending", "event-1")))));

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getTitle()).isEqualTo("Camp Kit");
        assertThat(savedAsset.getValue().getQuantity()).isEqualTo(1);
        assertThat(savedAsset.getValue().getRequests()).hasSize(1);
        assertThat(savedAsset.getValue().getRequests().get(0).status()).isEqualTo("pending");
        verify(accessControlService).canCurrentActorEditAsset("u1", "asset-1");
        verify(accessControlService).canCurrentActorRequestAssetBorrow("u2", "event-1");
    }

    @Test
    void upsertRejectsPendingBorrowRequestWhenRequesterPolicyDenies() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = asset();
        existing.setRequests(List.of());

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto(
                "u1",
                assetCard(
                        "asset-1",
                        "Camp Kit",
                        2,
                        List.of(borrowRequestDto("request-2", "u2", "pending", "event-1")))));

        verify(accessControlService).canCurrentActorRequestAssetBorrow("u2", "event-1");
        verify(assetsRepository, never()).save(any(Asset.class));
    }

    @Test
    void upsertRequiresBorrowApprovePolicyEvenWhenFullAssetEditIsAllowed() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = assetWithPendingBorrowRequest();

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto(
                "u1",
                assetCard(
                        "asset-1",
                        "Camp Kit",
                        2,
                        List.of(borrowRequestDto("request-1", "u2", "accepted", "event-1")))));

        verify(accessControlService).canCurrentActorApproveAssetBorrow("u2", "asset-1");
        verify(assetsRepository, never()).save(any(Asset.class));
    }

    @Test
    void upsertAllowsBorrowApproveWhenApprovePolicyAllows() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = assetWithPendingBorrowRequest();

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(accessControlService.canCurrentActorApproveAssetBorrow("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto(
                "u1",
                assetCard(
                        "asset-1",
                        "Camp Kit",
                        2,
                        List.of(borrowRequestDto("request-1", "u2", "accepted", "event-1")))));

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getRequests().get(0).status()).isEqualTo("accepted");
    }

    @Test
    void upsertAllowsBorrowRejectWithoutFullAssetEdit() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = assetWithPendingBorrowRequest();

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorRejectAssetBorrow("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto("u1", assetCard("asset-1", "Spoofed Title", 2, List.of())));

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getTitle()).isEqualTo("Camp Kit");
        assertThat(savedAsset.getValue().getRequests()).isEmpty();
        verify(accessControlService).canCurrentActorRejectAssetBorrow("u2", "asset-1");
    }

    @Test
    void upsertAllowsBorrowCancelWithoutFullAssetEdit() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset existing = assetWithEventRequest();

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorCancelAssetBorrow("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AssetSourceRefreshProperties.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto("u1", assetCard("asset-1", "Spoofed Title", 2, List.of())));

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getTitle()).isEqualTo("Camp Kit");
        assertThat(savedAsset.getValue().getRequests()).isEmpty();
        verify(accessControlService).canCurrentActorCancelAssetBorrow("u2", "asset-1");
    }

    @Test
    void refreshFromSourceStopsBeforeHostValidationWhenPolicyDenies() {
        AssetSourceRefreshProperties refreshProperties = mock(AssetSourceRefreshProperties.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        when(refreshProperties.isEnabled()).thenReturn(true);
        when(accessControlService.canCurrentActorRefreshAssetSource("u1", "asset-1")).thenReturn(false);

        AssetsService service = new AssetsService(
                mock(AssetsRepository.class),
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                refreshProperties,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetSourceRefreshResponseDto response = service.refreshFromSource(
                new AssetSourceRefreshRequestDto("u1", "asset-1", "Car", "https://example.com/car"));

        assertThat(response.enabled()).isTrue();
        assertThat(response.supported()).isFalse();
        assertThat(response.normalizedUrl()).isEqualTo("https://example.com/car");
        verify(accessControlService).canCurrentActorRefreshAssetSource("u1", "asset-1");
        verify(refreshProperties, never()).getAllowedHosts();
    }

    @Test
    void refreshFromSourceUsesOwnerContextWhenAssetIdIsMissing() {
        AssetSourceRefreshProperties refreshProperties = mock(AssetSourceRefreshProperties.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        when(refreshProperties.isEnabled()).thenReturn(true);
        when(refreshProperties.getAllowedHosts()).thenReturn(List.of("booking.com"));
        when(accessControlService.canCurrentActorRefreshAssetSource("u1", null)).thenReturn(true);

        AssetsService service = new AssetsService(
                mock(AssetsRepository.class),
                mock(UsersRepository.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                refreshProperties,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetSourceRefreshResponseDto response = service.refreshFromSource(
                new AssetSourceRefreshRequestDto("u1", "Car", "https://example.com/car"));

        assertThat(response.enabled()).isTrue();
        assertThat(response.supported()).isFalse();
        verify(accessControlService).canCurrentActorRefreshAssetSource("u1", null);
    }

    private Asset asset() {
        Asset asset = new Asset();
        asset.setId("asset-doc-1");
        asset.setAssetId("asset-1");
        asset.setOwnerUserId("u1");
        asset.setType("Supplies");
        asset.setTitle("Camp Kit");
        asset.setCity("Austin");
        asset.setCapacityTotal(2);
        asset.setQuantity(2);
        asset.setStatus("A");
        asset.setRequests(List.of(new AssetRequestRecord(
                "request-1",
                "u2",
                "Member Two",
                "MT",
                "man",
                "accepted",
                "Accepted for this asset.",
                "borrow",
                "2026-05-11T10:00:00Z",
                null)));
        return asset;
    }

    private Asset assetWithEventRequest() {
        Asset asset = asset();
        asset.setRequests(List.of(new AssetRequestRecord(
                "request-1",
                "u2",
                "Member Two",
                "MT",
                "man",
                "accepted",
                "Accepted for this asset.",
                "borrow",
                "2026-05-11T10:00:00Z",
                new AssetRequestBookingRecord(
                        "event-1",
                        "Weekend Ride",
                        "subevent-1",
                        "Morning Trip",
                        "slot-1",
                        "Seat",
                        "morning",
                        "2026-05-12T09:00:00Z",
                        "2026-05-12T11:00:00Z",
                        1,
                        0d,
                        "USD",
                        List.of(),
                        null,
                        false))));
        return asset;
    }

    private Asset assetWithPendingBorrowRequest() {
        Asset asset = assetWithEventRequest();
        AssetRequestRecord request = asset.getRequests().get(0);
        asset.setRequests(List.of(new AssetRequestRecord(
                request.id(),
                request.userId(),
                request.name(),
                request.initials(),
                request.gender(),
                "pending",
                "Awaiting owner confirmation.",
                request.requestKind(),
                request.requestedAtIso(),
                request.booking())));
        return asset;
    }

    private AssetDetailDto assetCard(String assetId) {
        return assetCard(assetId, "Camp Kit", 2, List.of());
    }

    private AssetDetailDto assetCard(
            String assetId,
            String title,
            Integer quantity,
            List<AssetMemberRequestDto> requests) {
        return new AssetDetailDto(
                assetId,
                "Supplies",
                title,
                "",
                "Camping",
                "Austin",
                2,
                quantity,
                "Shared camping kit.",
                "",
                "",
                List.of(),
                List.of(),
                null,
                "Public",
                "A",
                "u1",
                "Owner One",
                requests,
                List.of());
    }

    private AssetMemberRequestDto borrowRequestDto(String requestId, String userId, String status, String eventId) {
        return new AssetMemberRequestDto(
                requestId,
                userId,
                "Member Two",
                "MT",
                "man",
                status,
                "Borrow request.",
                "borrow",
                "2026-05-11T10:00:00Z",
                new AssetRequestBookingDto(
                        eventId,
                        "Weekend Ride",
                        "subevent-1",
                        "Morning Trip",
                        "slot-1",
                        "Seat",
                        "morning",
                        "2026-05-12T09:00:00Z",
                        "2026-05-12T11:00:00Z",
                        1,
                        0d,
                        "USD",
                        List.of(),
                        null,
                        null),
                List.of());
    }

    private Users user(String userId, String name, String initials) {
        Users user = new Users();
        user.setUserId(userId);
        user.setName(name);
        user.setInitials(initials);
        user.setGender("man");
        user.setProfileStatus("public");
        user.setStatus("A");
        return user;
    }

    private ActivityMember member(String ownerId, String userId, String role, String status) {
        return member("asset", ownerId, userId, role, status);
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
