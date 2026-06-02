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
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;
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
                mock(AccessControlService.class));

        AssetCardDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

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
                accessControlService);

        AssetCardDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

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
                accessControlService);

        AssetCardDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

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
                mock(AccessControlService.class));

        AssetCardDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

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
                mock(AccessControlService.class));

        AssetCardDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

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

        Asset asset = asset();
        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of(asset));
        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
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
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class));

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
                mock(AccessControlService.class));

        AssetCardDto card = service.restore(new AssetDeleteRequestDto("u1", "asset-1"));

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
        Users owner = user("u1", "Owner One", "OO");

        when(assetsRepository.findByOwnerUserId("u1")).thenReturn(List.of());
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);

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
                mock(AccessControlService.class));

        service.replace(new AssetReplaceRequestDto("u1", List.of(assetCard("asset-1"))));

        verify(assetsRepository).saveAll(any());
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
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

    private AssetCardDto assetCard(String assetId) {
        return new AssetCardDto(
                assetId,
                "Supplies",
                "Camp Kit",
                "",
                "Camping",
                "Austin",
                2,
                2,
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
                List.of(),
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
