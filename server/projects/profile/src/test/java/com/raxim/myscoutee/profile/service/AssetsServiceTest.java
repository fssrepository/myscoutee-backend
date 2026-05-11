package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.common.config.properties.AssetSourceRefreshProperties;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;

class AssetsServiceTest {
    @Test
    void makeManagerPersistsRoleAndReturnsRefreshedAssetCard() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);

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
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> invocation.getArgument(0));

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
                notificationOutboxService);

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

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getAffinity()).isEqualTo(42d);
        assertThat(savedAsset.getValue().getBoost()).isEqualTo(7d);
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
        ActivityMember member = new ActivityMember();
        member.setOwnerType("asset");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setRole(role);
        member.setStatus(status);
        return member;
    }
}
