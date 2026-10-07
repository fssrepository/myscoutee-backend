package com.raxim.myscoutee.domain.assets.service;

import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.affinity.service.AbsoluteAffinityService;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.chat.service.ChatAttachmentLifecycleService;
import com.raxim.myscoutee.domain.events.service.ActivitiesResourcesService;
import com.raxim.myscoutee.domain.events.service.EventParticipationTicketService;
import com.raxim.myscoutee.domain.events.service.EventTicketAuditService;
import com.raxim.myscoutee.domain.events.service.EventTicketService;
import com.raxim.myscoutee.domain.payments.service.EventCheckoutBasketService;
import com.raxim.myscoutee.domain.payments.service.PaymentService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.mongodb.client.result.UpdateResult;

import com.raxim.myscoutee.domain.assets.service.AssetCatalog;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.document.Asset.AssetPolicyRecord;
import com.raxim.myscoutee.domain.assets.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.domain.assets.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.domain.assets.document.AssetRequest;
import com.raxim.myscoutee.domain.events.document.EventTicket;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetExplorePageDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetMemberStatusChangeRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketValidationRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketSyncKnownItemDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketSyncRequestDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.common.dto.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.AssetRequestBookingDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingAudienceSettingsDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingDemandRuleDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingQuantityRuleDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingSlotOverrideDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingTimeRuleDto;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.security.FriendshipFacts;
import com.raxim.myscoutee.domain.access.security.AccessControlService;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@org.junit.jupiter.api.Tag("standard")
class AssetsServiceTest {
    @Test
    void assetExploreUsesAccountAcrossGroupsAndDoesNotFilterByEventWorkspace() {
        var assets = mock(AssetsRepository.class);
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var groupViewer = user("group-viewer", "Viewer", "V");
        groupViewer.setAccountUserId("viewer");
        groupViewer.setWorkspaceGroupId("joined-group");
        when(users.findByUserId("group-viewer")).thenReturn(Optional.of(groupViewer));
        var visible = assetWithEventRequest();
        visible.setWorkspaceGroupId("another-group");
        when(mongo.find(any(Query.class), eq(Asset.class))).thenReturn(List.of(visible));
        var service = assetReadService(assets, users, mock(FriendshipFacts.class), mongo, mock(AccessControlService.class));
        assertThat(service.queryVisibleAssets("viewer", AssetCatalog.TYPE_SUPPLIES, null))
                .extracting(AssetDto::id).containsExactly("asset-1");
        assertThat(service.queryVisibleAssets("group-viewer", AssetCatalog.TYPE_SUPPLIES, null))
                .extracting(AssetDto::id).containsExactly("asset-1");
        var queries = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(2)).find(queries.capture(), eq(Asset.class));
        assertThat(queries.getAllValues().get(0).getQueryObject())
                .isEqualTo(queries.getAllValues().get(1).getQueryObject());
        assertThat(queries.getValue().getQueryObject().toJson()).doesNotContain("workspaceGroupId");
    }

    @Test
    void ownerCanSeeContentReviewBadgeWhileAccountSuppressionStaysHidden() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset reviewedAsset = asset();
        reviewedAsset.setStatus("B");
        reviewedAsset.setModerationStatus("under-review");
        when(assetsRepository.findByOwnerUserIdOrderByUpdatedDateDesc("u1")).thenReturn(List.of(reviewedAsset));
        when(mongoTemplate.find(any(Query.class), eq(Asset.class))).thenReturn(List.of());
        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(user("u1", "Owner One", "OO")));
        AssetsService service = assetReadService(assetsRepository, usersRepository, mock(FriendshipFacts.class),
                mongoTemplate, mock(AccessControlService.class));
        assertThat(service.queryAssets("u1")).singleElement().extracting(AssetDto::moderationStatus).isEqualTo("under-review");
        reviewedAsset.setModerationStatus(null);
        assertThat(service.queryAssets("u1")).isEmpty();
    }

    @Test
    void assetReadModelKeepsDistinctRequestsFromTheSameBorrowerAndScope() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset requestedAsset = assetWithEventRequest();
        AssetRequestRecord firstRequest = requestedAsset.getRequests().getFirst();
        AssetRequestRecord secondRequest = new AssetRequestRecord(
                "request-2",
                firstRequest.userId(),
                firstRequest.name(),
                firstRequest.initials(),
                firstRequest.gender(),
                "pending",
                "Awaiting owner confirmation.",
                firstRequest.requestKind(),
                "2026-05-11T10:05:00Z",
                firstRequest.booking());
        requestedAsset.setRequests(List.of(firstRequest, secondRequest));

        when(assetsRepository.findByOwnerUserIdOrderByUpdatedDateDesc("u1"))
                .thenReturn(List.of(requestedAsset));
        when(mongoTemplate.find(any(Query.class), eq(Asset.class))).thenReturn(List.of());
        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(List.of("u1")))
                .thenReturn(List.of(user("u1", "Owner One", "OO")));

        AssetsService service = assetReadService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mongoTemplate,
                mock(AccessControlService.class));

        assertThat(service.queryAssets("u1").getFirst().requests())
                .extracting(AssetMemberRequestDto::id)
                .containsExactly("request-1", "request-2");
    }

    @Test
    void assetReadModelPreservesExplicitZeroQuantity() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset unavailableAsset = asset();
        unavailableAsset.setType(AssetCatalog.TYPE_TRANSPORT);
        unavailableAsset.setQuantity(0);
        unavailableAsset.setRequests(List.of());

        when(assetsRepository.findByOwnerUserIdOrderByUpdatedDateDesc("u1"))
                .thenReturn(List.of(unavailableAsset));
        when(mongoTemplate.find(any(Query.class), eq(Asset.class))).thenReturn(List.of());
        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(List.of("u1")))
                .thenReturn(List.of(user("u1", "Owner One", "OO")));

        AssetsService service = assetReadService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mongoTemplate,
                mock(AccessControlService.class));

        assertThat(service.queryAssets("u1"))
                .singleElement()
                .extracting(AssetDto::quantity)
                .isEqualTo(0);
    }

    @Test
    void visibleAssetPageIncludesCheckoutStatesFromTheSharedBasketRepository() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        MongoConverter converter = mock(MongoConverter.class);
        EventCheckoutBasketService basketService = mock(EventCheckoutBasketService.class);
        Asset visibleAsset = asset();
        visibleAsset.setRequests(List.of(new AssetRequestRecord(
                "request-pending",
                "u2",
                "Member Two",
                "MT",
                "man",
                "pending",
                "Awaiting owner confirmation.",
                "borrow",
                "2030-05-12T08:00:00Z",
                new AssetRequestBookingRecord(
                        "event-1",
                        "Weekend Transport",
                        "subevent-1",
                        "Morning Trip",
                        "slot-1",
                        "Seat",
                        "morning",
                        "2030-05-12T09:00:00Z",
                        "2030-05-12T11:00:00Z",
                        1,
                        0d,
                        "USD",
                        List.of(),
                        null,
                        false))));
        Document facet = new Document("metadata", List.of(new Document("total", 1)))
                .append("items", List.of(new Document("_id", "asset-doc-1")));

        Users owner = user("u1", "Owner One", "OO");
        owner.setImages(List.of("https://media.example.test/owner.webp"));
        when(usersRepository.findAll()).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(List.of("u1")))
                .thenReturn(List.of(owner));
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("assets"), eq(Document.class)))
                .thenReturn(new AggregationResults<>(List.of(facet), new Document()));
        when(mongoTemplate.getConverter()).thenReturn(converter);
        when(converter.read(eq(Asset.class), any(Document.class))).thenReturn(visibleAsset);
        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());
        when(basketService.loadResultStatesByEvent("u2", List.of("asset-1")))
                .thenReturn(Map.of("asset-1", "pending"));

        AssetsService service = assetReadService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mongoTemplate,
                mock(AccessControlService.class));
        service.setEventCheckoutBasketService(basketService);

        AssetExplorePageDto page = service.queryVisibleAssetsPage(
                "u2",
                AssetCatalog.TYPE_SUPPLIES,
                null,
                null,
                null,
                0,
                20,
                null,
                "availability");

        assertThat(page.items()).extracting(AssetDto::id).containsExactly("asset-1");
        assertThat(page.items().getFirst().ownerAvatarUrl()).isEqualTo("https://media.example.test/owner.webp");
        assertThat(page.items().getFirst().metrics().pendingItems()).isEqualTo(1);
        assertThat(page.checkoutResultStates()).containsEntry("asset-1", "pending");
        verify(basketService).loadResultStatesByEvent("u2", List.of("asset-1"));
        verify(mongoTemplate, never()).find(any(Query.class), eq(AssetRequest.class));
    }

    @Test
    void removedEventMemberOnlyStatusDeletesRequestsFromThatEventAssignment() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = assetWithEventRequest();
        AssetRequestRecord original = existing.getRequests().getFirst();
        AssetRequestBookingRecord groupBooking = new AssetRequestBookingRecord(
                "event-1:subevent-1:group-a",
                original.booking().eventTitle(),
                "subevent-1",
                original.booking().subEventTitle(),
                original.booking().slotKey(),
                original.booking().slotLabel(),
                original.booking().timeframe(),
                original.booking().startAtIso(),
                original.booking().endAtIso(),
                original.booking().quantity(),
                original.booking().totalAmount(),
                original.booking().currency(),
                original.booking().acceptedPolicyIds(),
                original.booking().paymentSessionId(),
                original.booking().inventoryApplied());
        AssetRequestRecord removedScopeRequest = new AssetRequestRecord(
                "request-removed",
                "u2",
                original.name(),
                original.initials(),
                original.gender(),
                "accepted",
                original.note(),
                "manual",
                original.requestedAtIso(),
                groupBooking);
        AssetRequestRecord retainedOtherEventRequest = new AssetRequestRecord(
                "request-retained",
                "u2",
                original.name(),
                original.initials(),
                original.gender(),
                "pending",
                original.note(),
                "manual",
                original.requestedAtIso(),
                new AssetRequestBookingRecord(
                        "event-2",
                        original.booking().eventTitle(),
                        "subevent-2",
                        original.booking().subEventTitle(),
                        original.booking().slotKey(),
                        original.booking().slotLabel(),
                        original.booking().timeframe(),
                        original.booking().startAtIso(),
                        original.booking().endAtIso(),
                        original.booking().quantity(),
                        original.booking().totalAmount(),
                        original.booking().currency(),
                        original.booking().acceptedPolicyIds(),
                        original.booking().paymentSessionId(),
                        original.booking().inventoryApplied()));
        existing.setRequests(List.of(removedScopeRequest, retainedOtherEventRequest));

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(existing));
        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));

        service.statusDeleteEventAssignmentRequestsForUsers(
                List.of("asset-1"),
                List.of("u2"),
                "event-1",
                "admin",
                "2026-09-04T08:00:00Z");

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getRequests())
                .extracting(AssetRequestRecord::id, AssetRequestRecord::status)
                .containsExactlyInAnyOrder(
                        tuple("request-removed", "D"),
                        tuple("request-retained", "pending"));
    }

    @Test
    void acceptedAssetMemberCanPersistTheSharedAssetInAnEventAssignment() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        ActivityMember member = member("asset-1", "u2", "Member", "accepted");

        when(mongoTemplate.find(any(Query.class), eq(AssetRequest.class))).thenReturn(List.of());
        when(activityMembersRepository.findAcceptedByOwnerTypeOwnerIdInAndUserId(
                "asset", Set.of("asset-1"), "u2", "accepted")).thenReturn(List.of(member));
        when(assetsRepository.findByAssetIdIn(Set.of("asset-1"))).thenReturn(List.of(asset));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(user("u1", "Owner One", "OO")));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2", "Member Two", "MT")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(member));

        Users groupProfile = user("u2-group", "Member Two", "MT"); groupProfile.setAccountUserId("u2");
        when(usersRepository.findByUserId("u2-group")).thenReturn(Optional.of(groupProfile));
        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));

        Map<String, AssetDetailDto> details = service.queryAssignableAssetDetails(
                "u2-group", "event-1", "sub-1", Set.of("asset-1"));

        assertThat(details).containsKey("asset-1");
        verify(mongoTemplate).find(org.mockito.ArgumentMatchers.argThat((Query query) ->
                "u2-group".equals(query.getQueryObject().get("userId"))
                && "event-1".equals(query.getQueryObject().get("booking.eventId"))), eq(AssetRequest.class));
    }

    @Test
    void acceptedManagerSeesReleasedAssetWithTakeOverAction() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset asset = asset();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        ActivityMember manager = member("asset-1", "u2", "Manager", "accepted");
        Users owner = user("u1", "Owner One", "OO");

        when(assetsRepository.findByOwnerUserId("u2")).thenReturn(List.of());
        when(mongoTemplate.find(any(), eq(Asset.class))).thenReturn(List.of(asset));
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(manager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(manager));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2", "Manager Two", "MT")));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        List<AssetDto> cards = service.queryAssets("u2");

        assertThat(cards).singleElement().satisfies(card -> {
            assertThat(card.id()).isEqualTo("asset-1");
            assertThat(card.status()).isEqualTo("UR");
            assertThat(card.ownerReleasedAtIso()).isNotBlank();
            assertThat(card.menuActions()).contains("takeOver");
        });
    }

    @Test
    void referencedUnderReviewAssetStillBuildsTheExistingGroupResourceCard() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        Users owner = user("u1", "Owner One", "OO");
        Users viewer = user("u2", "Viewer Two", "VT");

        when(assetsRepository.findByAssetIdIn(Set.of("asset-1"))).thenReturn(List.of(asset));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(viewer));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of());
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));

        Map<String, AssetDetailDto> details = service.queryReferencedAssetDetails("u2", Set.of("asset-1"));

        assertThat(details).containsKey("asset-1");
        assertThat(details.get("asset-1").status()).isEqualTo("UR");
        assertThat(details.get("asset-1").ownerReleasedAtIso()).isNotBlank();
    }

    @Test
    void assetDetailUsesAuthenticatedViewerInsteadOfSpoofedOwnerParameter() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset hiddenAsset = asset();
        hiddenAsset.setVisibility("Invitation only");
        hiddenAsset.setDetails("Owner-only detail");
        var authentication = new TestingAuthenticationToken("unrelated-viewer", null);

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("unrelated-viewer");
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(hiddenAsset));

        AssetsService service = assetReadService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mongoTemplate,
                accessControlService);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            assertThat(service.queryAssetDetail("u1", "asset-1")).isNull();
            verify(assetsRepository, never()).findByOwnerUserIdAndAssetId(any(), any());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    void publicAssetDetailIsVisibleToTheRequestingViewer() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset publicAsset = asset();
        publicAsset.setVisibility("Public");

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(publicAsset));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of());
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = assetReadService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mongoTemplate,
                accessControlService);

        AssetDetailDto detail = service.queryAssetDetail("unrelated-viewer", "asset-1");

        assertThat(detail).isNotNull();
        assertThat(detail.id()).isEqualTo("asset-1");
        assertThat(detail.ownerUserId()).isEqualTo("u1");
    }

    @Test
    void ticketSyncIncludesOrganizerAvatarAndUpdatesItsRevisionWhenTheImageChanges() {
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityEvent eventA = ticketListEvent("event-a", "holder-user", "2030-04-18T19:00:00Z");
        ActivityEvent eventB = ticketListEvent("event-b", "holder-user", "2030-04-19T19:00:00Z");
        eventA.setCreatorUserId("organizer");
        eventB.setCreatorUserId("organizer");
        Users organizer = user("organizer", "Casey Bridge", "CB");
        organizer.setImages(List.of("/media/organizer.webp"));
        when(usersRepository.findByUserIdIn(List.of("organizer"))).thenReturn(List.of(organizer));
        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.queryTicketSnapshotRecordsForUser("holder-user")).thenReturn(List.of(
                new EventParticipationTicketService.TicketSnapshotRecord(eventA,
                        activeTicket("ticket-a", "event-a", "holder-user", "TKT-a")),
                new EventParticipationTicketService.TicketSnapshotRecord(eventB,
                        activeTicket("ticket-b", "event-b", "holder-user", "TKT-b"))));
        AssetsService service = ticketValidationService(usersRepository, mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class), ticketService,
                mock(NotificationOutboxService.class), accessControlService);

        var initial = service.syncTickets(new AssetTicketSyncRequestDto(
                "holder-user", "upcoming", 6, List.of(), null));
        assertThat(initial.upserts()).hasSize(2).allSatisfy(row -> {
            assertThat(row.creatorName()).isEqualTo("Casey Bridge");
            assertThat(row.creatorAvatarUrl()).isEqualTo("/media/organizer.webp");
        });
        verify(usersRepository, times(1)).findByUserIdIn(List.of("organizer"));
        var known = initial.upserts().stream()
                .map(row -> new AssetTicketSyncKnownItemDto(row.type() + ":" + row.id(), row.revision()))
                .toList();
        organizer.setImages(List.of("/media/organizer-new.webp"));

        var updated = service.syncTickets(new AssetTicketSyncRequestDto(
                "holder-user", "upcoming", 6, known, null));
        assertThat(updated.upserts()).hasSize(2).allSatisfy(row ->
                assertThat(row.creatorAvatarUrl()).isEqualTo("/media/organizer-new.webp"));
    }

    @Test
    void ticketSyncReportsRemovedRowsAgainstTheKnownSmartListWindow() {
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        ActivityEvent eventA = ticketListEvent("event-a", "holder-user", "2030-04-18T19:00:00Z");
        ActivityEvent eventB = ticketListEvent("event-b", "holder-user", "2030-04-19T19:00:00Z");
        EventTicket ticketA = activeTicket("ticket-a", "event-a", "holder-user", "TKT-a");
        EventTicket ticketB = activeTicket("ticket-b", "event-b", "holder-user", "TKT-b");

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.queryTicketSnapshotRecordsForUser("holder-user"))
                .thenReturn(
                        List.of(
                                new EventParticipationTicketService.TicketSnapshotRecord(eventA, ticketA),
                                new EventParticipationTicketService.TicketSnapshotRecord(eventB, ticketB)),
                        List.of(new EventParticipationTicketService.TicketSnapshotRecord(eventB, ticketB)));
        AssetsService service = ticketValidationService(
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                ticketService,
                mock(NotificationOutboxService.class),
                accessControlService);

        var initial = service.syncTickets(new AssetTicketSyncRequestDto(
                "holder-user",
                "upcoming",
                6,
                List.of(),
                null));
        var known = initial.upserts().stream()
                .map(row -> new AssetTicketSyncKnownItemDto(row.type() + ":" + row.id(), row.revision()))
                .toList();
        var afterRemoval = service.syncTickets(new AssetTicketSyncRequestDto(
                "holder-user",
                "upcoming",
                6,
                known,
                null));

        assertThat(initial.upserts()).extracting(row -> row.id()).containsExactly("event-a", "event-b");
        assertThat(afterRemoval.removedIds()).containsExactly("events:event-a");
        assertThat(afterRemoval.upserts()).isEmpty();
        assertThat(afterRemoval.total()).isEqualTo(1);
    }

    @Test
    void successfulTicketCheckInReturnsCanonicalPayloadWhenHolderLookupFails() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        EventTicket ticket = checkedInTicket();
        ActivityEvent event = ticketEvent();

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.checkIn(eq(ticket.getCode()), eq("scanner-user"), any(Instant.class)))
                .thenReturn(EventTicketService.CheckInResult.checkedIn(ticket, event));
        when(usersRepository.findByUserId(ticket.getHolderUserId()))
                .thenThrow(new IllegalStateException("holder lookup unavailable"));

        AssetsService service = ticketValidationService(
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                ticketService,
                notificationOutboxService,
                accessControlService);

        SecurityContextHolder.clearContext();
        var response = service.validateTicket(new AssetTicketValidationRequestDto(
                ticket.getCode(),
                "scanner-user"));

        assertThat(response.valid()).isTrue();
        assertThat(response.reason()).isEqualTo("valid");
        assertThat(response.ticket()).isNotNull();
        assertThat(response.ticket().code()).isEqualTo(ticket.getCode());
        assertThat(response.ticket().holderUserId()).isEqualTo(ticket.getHolderUserId());
        assertThat(response.ticket().holderName()).isEqualTo(ticket.getHolderUserId());
        assertThat(response.ticket().holderAvatarUrl()).isEmpty();
        assertThat(response.ticket().eventId()).isEqualTo(event.getSourceId());
        assertThat(response.ticket().eventTitle()).isEqualTo(event.getTitle());
        assertThat(response.ticket().usedAtIso()).isEqualTo(ticket.getUsedAtIso());
        verify(notificationOutboxService).enqueue(any(NotificationIntent.class));
    }

    @Test
    void successfulTicketCheckInRemainsSuccessfulWhenNotificationFails() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        EventTicket ticket = checkedInTicket();
        ActivityEvent event = ticketEvent();
        Users holder = user(ticket.getHolderUserId(), "Ticket Holder", "TH");
        holder.setAge(31);
        holder.setCity("Bratislava");
        holder.setImages(List.of("https://media.example.test/holder.webp"));

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.checkIn(eq(ticket.getCode()), eq("scanner-user"), any(Instant.class)))
                .thenReturn(EventTicketService.CheckInResult.checkedIn(ticket, event));
        when(usersRepository.findByUserId(ticket.getHolderUserId())).thenReturn(Optional.of(holder));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event",
                event.getSourceId(),
                ticket.getHolderUserId())).thenReturn(Optional.of(member(
                        "event",
                        event.getSourceId(),
                        ticket.getHolderUserId(),
                        "Manager",
                        "accepted")));
        when(notificationOutboxService.enqueue(any(NotificationIntent.class)))
                .thenThrow(new IllegalStateException("notification outbox unavailable"));

        AssetsService service = ticketValidationService(
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                ticketService,
                notificationOutboxService,
                accessControlService);

        SecurityContextHolder.clearContext();
        var response = service.validateTicket(new AssetTicketValidationRequestDto(
                ticket.getCode(),
                "scanner-user"));

        assertThat(response.valid()).isTrue();
        assertThat(response.reason()).isEqualTo("valid");
        assertThat(response.ticket()).isNotNull();
        assertThat(response.ticket().holderName()).isEqualTo("Ticket Holder");
        assertThat(response.ticket().holderInitials()).isEqualTo("TH");
        assertThat(response.ticket().holderAvatarUrl())
                .isEqualTo("https://media.example.test/holder.webp");
        assertThat(response.ticket().holderRole()).isEqualTo("Manager");
        assertThat(response.ticket().usedAtIso()).isEqualTo(ticket.getUsedAtIso());
        verify(notificationOutboxService).enqueue(any(NotificationIntent.class));
    }

    @Test
    void alreadyUsedTicketAuditsActorAndAggregatesOneHolderWarning() {
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        EventTicketAuditService auditService = mock(EventTicketAuditService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        EventTicket ticket = checkedInTicket();
        ActivityEvent event = ticketEvent();

        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.checkIn(eq(ticket.getCode()), eq("scanner-user"), any(Instant.class)))
                .thenReturn(EventTicketService.CheckInResult.invalid("already_used", ticket, event));

        AssetsService service = ticketValidationService(
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                ticketService,
                notificationOutboxService,
                accessControlService);
        service.setEventTicketAuditService(auditService);

        var response = service.validateTicket(new AssetTicketValidationRequestDto(
                ticket.getCode(),
                "scanner-user"));

        assertThat(response.valid()).isFalse();
        assertThat(response.reason()).isEqualTo("already_used");
        assertThat(response.ticket()).isNull();
        verify(auditService).recordAlreadyUsedAttempt(
                eq(ticket),
                eq(event),
                eq("scanner-user"),
                any(Instant.class));
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("event-ticket-replay-warning");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("holder-user");
        assertThat(notification.getValue().createdUser()).isEqualTo("scanner-user");
        assertThat(notification.getValue().payload())
                .containsEntry("actorUserId", "scanner-user")
                .containsEntry("notification_tone", "warning")
                .containsEntry("notification_aggregation_key", "event-ticket-replay:ticket-document-1")
                .doesNotContainValue(ticket.getCode());
    }

    @Test
    void scannerUsesAuthenticatedEventProfileInsteadOfItsBaseAccountOrBodyActor() {
        EventParticipationTicketService tickets = mock(EventParticipationTicketService.class);
        AccessControlService access = mock(AccessControlService.class);
        UsersRepository users = mock(UsersRepository.class);
        Users profile = user("scanner-group", "Scanner", "SC"); profile.setAccountUserId("scanner-account");
        when(users.findByUserId("scanner-group")).thenReturn(Optional.of(profile));
        when(access.requiresAuthenticatedActor()).thenReturn(true);
        when(access.resolveActorUserId(any())).thenReturn("scanner-group");
        AssetsService service = ticketValidationService(users, mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class), tickets, mock(NotificationOutboxService.class), access);
        service.validateTicket(new AssetTicketValidationRequestDto("code", "forged-user"));
        verify(tickets).checkIn(eq("code"), eq("scanner-group"), any(Instant.class));
    }

    @Test
    void unrelatedTicketRejectionDoesNotAuditOrWarnTheHolder() {
        EventParticipationTicketService ticketService = mock(EventParticipationTicketService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        EventTicketAuditService auditService = mock(EventTicketAuditService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);
        when(ticketService.checkIn(eq("invalid"), eq("scanner-user"), any(Instant.class)))
                .thenReturn(EventTicketService.CheckInResult.invalid("not_found"));
        AssetsService service = ticketValidationService(
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                ticketService,
                notificationOutboxService,
                accessControlService);
        service.setEventTicketAuditService(auditService);

        var response = service.validateTicket(new AssetTicketValidationRequestDto(
                "invalid",
                "scanner-user"));

        assertThat(response.valid()).isFalse();
        assertThat(response.reason()).isEqualTo("not_found");
        verify(auditService, never()).recordAlreadyUsedAttempt(any(), any(), any(), any());
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void resourceMemberActionsReturnOnlyStatusTransitionsAndCounterDeltas() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        asset.setRequests(List.of());
        asset.setPoliciesEnabled(true);
        asset.setPolicies(List.of(new AssetPolicyRecord(
                "policy-1",
                "Required policy",
                "Shown automatically before borrowing.",
                true)));
        AtomicReference<Asset> assetState = new AtomicReference<>(asset);
        when(assetsRepository.findByAssetId("asset-1"))
                .thenAnswer(invocation -> Optional.of(assetState.get()));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> {
            Asset saved = invocation.getArgument(0);
            assetState.set(saved);
            return saved;
        });
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1", "Owner One", "OO")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorRequestAssetBorrow("u2", "event-1")).thenReturn(true);
        when(accessControlService.canCurrentActorCancelAssetBorrow("u2", "asset-1")).thenReturn(true);
        var authentication = new TestingAuthenticationToken("firebase-principal", null);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("firebase-principal");
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());
        stubBorrowWindow(mongoTemplate);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            var rejectedJoin = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                    "asset-1",
                    "event-1",
                    "subevent-1",
                    "u2",
                    "join",
                    borrowRequestDto("request-missing-policy", "u2", "pending", "event-1")));

            assertThat(rejectedJoin).isNull();

            var joined = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                    "asset-1",
                    "event-1",
                    "subevent-1",
                    "u2",
                    "join",
                    borrowRequestDto("request-2", "u2", "pending", "event-1", List.of("policy-1"))));

            assertThat(joined.status()).isEqualTo("pending");
            assertThat(joined.previousStatus()).isNull();
            assertThat(joined.acceptedMemberDelta()).isZero();
            assertThat(joined.pendingMemberDelta()).isEqualTo(1);
            ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
            verify(notificationOutboxService).enqueue(notification.capture());
            assertThat(notification.getValue().type()).isEqualTo("asset-admin-join-request");
            assertThat(notification.getValue().recipientUserIds()).containsExactly("u1");
            assertThat(notification.getValue().payload())
                    .containsEntry("assetId", "asset-1")
                    .containsEntry("eventId", "event-1")
                    .containsEntry("subEventId", "subevent-1")
                    .containsEntry("requestId", "request-2")
                    .containsEntry("memberUserId", "u2")
                    .containsEntry("requestKind", "borrow")
                    .containsEntry("senderUserId", "u2");

            var left = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                    "asset-1",
                    "event-1",
                    "subevent-1",
                    "u2",
                    "leave",
                    null));

            assertThat(left.status()).isEqualTo("deleted");
            assertThat(left.previousStatus()).isEqualTo("pending");
            assertThat(left.acceptedMemberDelta()).isZero();
            assertThat(left.pendingMemberDelta()).isEqualTo(-1);
            assertThat(assetState.get().getRequests()).singleElement().satisfies(request -> {
                assertThat(request.id()).isEqualTo("request-2");
                assertThat(request.status()).isEqualTo("D");
            });

            var rejoined = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                    "asset-1",
                    "event-1",
                    "subevent-1",
                    "u2",
                    "join",
                    borrowRequestDto("request-3", "u2", "pending", "event-1", List.of("policy-1"))));

            assertThat(rejoined.previousStatus()).isNull();
            assertThat(rejoined.status()).isEqualTo("pending");
            assertThat(assetState.get().getRequests())
                    .extracting(AssetRequestRecord::id, AssetRequestRecord::status)
                    .containsExactlyInAnyOrder(
                            tuple("request-2", "D"),
                            tuple("request-3", "pending"));
            verify(notificationOutboxService, times(2)).enqueue(any(NotificationIntent.class));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    void scopedBorrowManagerLeaveKeepsAssignmentAndPublishesReplacementAmount() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        Asset asset = asset();
        asset.setRequests(List.of(
                scopedBorrowRequest("manager-request", "u2", "accepted", 3200d, null, "manager-payment"),
                scopedBorrowRequest("successor-request", "u3", "accepted", 1600d, null, null)));
        AtomicReference<Asset> assetState = new AtomicReference<>(asset);
        when(assetsRepository.findByAssetId("asset-1")).thenAnswer(invocation -> Optional.of(assetState.get()));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> {
            Asset saved = invocation.getArgument(0);
            assetState.set(saved);
            return saved;
        });
        Users previousManager = user("u2", "Manager Two", "MT");
        Users successor = user("u3", "Successor Three", "ST");
        successor.setPaymentSpentTotals(Map.of("HUF", 3200d));
        successor.setPaymentIncomeTotals(Map.of());
        successor.setPaymentAllTotals(Map.of("HUF", 3200d));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(previousManager));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(successor));
        when(accessControlService.canCurrentActorCancelAssetBorrow("u2", "asset-1")).thenReturn(true);
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);
        when(activitiesResourcesService.scopedAssetManagerUserId("event-1", "subevent-1", "asset-1"))
                .thenReturn("u2");

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        var left = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1", "event-1", "subevent-1", "u2", "leave", null));

        assertThat(left.status()).isEqualTo("deleted");
        assertThat(left.resourceAssignmentRemoved()).isFalse();
        assertThat(assetState.get().getRequests())
                .filteredOn(request -> "successor-request".equals(request.id()))
                .singleElement()
                .satisfies(request -> {
                    assertThat(request.status()).isEqualTo("accepted");
                    assertThat(request.booking().totalAmount()).isEqualTo(1600d);
                    assertThat(request.booking().previousTotalAmount()).isEqualTo(3200d);
                    assertThat(request.booking().currency()).isEqualTo("HUF");
                });
        verify(activitiesResourcesService, never()).removeScopedAssetAssignment(any(), any(), any(), any(), any());
        ArgumentCaptor<NotificationIntent> notifications = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(notifications.capture());
        assertThat(notifications.getAllValues())
                .extracting(NotificationIntent::type)
                .contains("asset-assignment-takeover-required");
        assertThat(notifications.getAllValues())
                .filteredOn(notification -> "asset-assignment-takeover-required".equals(notification.type()))
                .singleElement()
                .satisfies(notification -> {
                    assertThat(notification.title()).isEqualTo("notification.asset.takeover.required.title");
                    assertThat(notification.body()).isEqualTo("notification.asset.takeover.required.message");
                    assertThat(notification.payload())
                            .containsEntry("notification_title_key", "notification.asset.takeover.required.title")
                            .containsEntry("notification_message_key", "notification.asset.takeover.required.message");
                });
        verify(accessControlService).canCurrentActorCancelAssetBorrow("u2", "asset-1");
    }

    @Test
    void scopedBorrowLastManagerLeaveRemovesOnlyRuntimeAssignment() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        Asset asset = asset();
        asset.setRequests(List.of(
                scopedBorrowRequest("manager-request", "u2", "accepted", 3200d, null, "manager-payment")));
        AtomicReference<Asset> assetState = new AtomicReference<>(asset);
        when(assetsRepository.findByAssetId("asset-1")).thenAnswer(invocation -> Optional.of(assetState.get()));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> {
            Asset saved = invocation.getArgument(0);
            assetState.set(saved);
            return saved;
        });
        when(accessControlService.canCurrentActorCancelAssetBorrow("u2", "asset-1")).thenReturn(true);
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);
        when(activitiesResourcesService.scopedAssetManagerUserId("event-1", "subevent-1", "asset-1"))
                .thenReturn("u2");
        when(activitiesResourcesService.removeScopedAssetAssignment(
                "event-1", "subevent-1", "asset-1", "u2", "u2"))
                .thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        var left = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1", "event-1", "subevent-1", "u2", "leave", null));

        assertThat(left.status()).isEqualTo("deleted");
        assertThat(left.resourceAssignmentRemoved()).isTrue();
        assertThat(assetState.get().getAssetId()).isEqualTo("asset-1");
        assertThat(assetState.get().getRequests())
                .singleElement()
                .satisfies(request -> assertThat(request.status()).isEqualTo("D"));
        verify(activitiesResourcesService).removeScopedAssetAssignment(
                "event-1", "subevent-1", "asset-1", "u2", "u2");
    }

    @Test
    void scopedBorrowManagerLeaveDoesNotPublishReplacementWithoutCancelPermission() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        Asset asset = asset();
        asset.setRequests(List.of(
                scopedBorrowRequest("manager-request", "u2", "accepted", 3200d, null, "manager-payment"),
                scopedBorrowRequest("successor-request", "u3", "accepted", 0d, null, null)));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);
        when(activitiesResourcesService.scopedAssetManagerUserId("event-1", "subevent-1", "asset-1"))
                .thenReturn("u2");

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        var left = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1", "event-1", "subevent-1", "u2", "leave", null));

        assertThat(left).isNull();
        verify(accessControlService).canCurrentActorCancelAssetBorrow("u2", "asset-1");
        verify(assetsRepository, never()).save(any(Asset.class));
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void scopedBorrowTakeOverTransfersManagerOnlyAfterReplacementPaymentValidation() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        PaymentService paymentService = mock(PaymentService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        Asset asset = asset();
        asset.setPoliciesEnabled(true);
        asset.setPolicies(List.of(new AssetPolicyRecord(
                "policy-1",
                "Required policy",
                "Accept before taking over.",
                true)));
        asset.setRequests(List.of(
                scopedBorrowRequest("manager-request", "u2", "D", 3200d, null, "manager-payment"),
                scopedBorrowRequest("successor-request", "u3", "accepted", 1600d, 3200d, null),
                scopedBorrowRequest("remaining-request", "u4", "accepted", 1600d, null, null)));
        AtomicReference<Asset> assetState = new AtomicReference<>(asset);
        when(assetsRepository.findByAssetId("asset-1")).thenAnswer(invocation -> Optional.of(assetState.get()));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> {
            Asset saved = invocation.getArgument(0);
            assetState.set(saved);
            return saved;
        });
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);
        when(activitiesResourcesService.scopedAssetManagerUserId("event-1", "subevent-1", "asset-1"))
                .thenReturn("u2");
        when(activitiesResourcesService.transferScopedAssetManager(
                "event-1", "subevent-1", "asset-1", "u2", "u3"))
                .thenReturn(true);
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2", "Manager Two", "MT")));
        Users successor = user("u3", "Successor Three", "ST");
        successor.setPaymentSpentTotals(Map.of("HUF", 3200d));
        successor.setPaymentIncomeTotals(Map.of());
        successor.setPaymentAllTotals(Map.of("HUF", 3200d));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(successor));
        when(usersRepository.findByUserId("u4")).thenReturn(Optional.of(user("u4", "Remaining Four", "RF")));
        PaymentService.AssetPaymentReplacement replacement =
                new PaymentService.AssetPaymentReplacement("old-payment", "new-payment", true);
        when(paymentService.validateAssetPaymentReplacement(
                "manager-payment", "successor-payment", "u2", "u3", "asset-1", "event-1", "subevent-1"))
                .thenReturn(replacement);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                paymentService,
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        var rejected = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1",
                "event-1",
                "subevent-1",
                "u3",
                "take-over",
                null,
                "successor-payment",
                "u2"));

        assertThat(rejected).isNull();
        verifyNoInteractions(paymentService);

        var takenOver = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1",
                "event-1",
                "subevent-1",
                "u3",
                "take-over",
                null,
                "successor-payment",
                "u2",
                List.of("policy-1")));

        assertThat(takenOver.status()).isEqualTo("accepted");
        assertThat(takenOver.acceptedMemberDelta()).isZero();
        assertThat(takenOver.paymentTotals().outgoing()).containsEntry("HUF", 3200d);
        assertThat(takenOver.paymentTotals().incoming()).isEmpty();
        assertThat(takenOver.paymentTotals().all()).containsEntry("HUF", 3200d);
        assertThat(assetState.get().getRequests())
                .filteredOn(request -> "successor-request".equals(request.id()))
                .singleElement()
                .satisfies(request -> {
                    assertThat(request.booking().totalAmount()).isEqualTo(3200d);
                    assertThat(request.booking().previousTotalAmount()).isNull();
                    assertThat(request.booking().paymentSessionId()).isEqualTo("successor-payment");
                    assertThat(request.booking().acceptedPolicyIds()).containsExactly("policy-1");
                });
        verify(paymentService).completeAssetPaymentReplacement(
                replacement, "u3", "event-1", "subevent-1");
        verify(activitiesResourcesService).transferScopedAssetManager(
                "event-1", "subevent-1", "asset-1", "u2", "u3");
        ArgumentCaptor<NotificationIntent> notifications = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(notifications.capture());
        assertThat(notifications.getAllValues())
                .extracting(NotificationIntent::type)
                .containsExactlyInAnyOrder("asset-assignment-taken-over", "payment-refund-approved");
        assertThat(notifications.getAllValues())
                .filteredOn(notification -> "asset-assignment-taken-over".equals(notification.type()))
                .singleElement()
                .satisfies(notification -> assertThat(notification.recipientUserIds()).containsExactly("u4"));
        assertThat(notifications.getAllValues())
                .filteredOn(notification -> "payment-refund-approved".equals(notification.type()))
                .singleElement()
                .satisfies(notification -> {
                    assertThat(notification.recipientUserIds()).containsExactly("u2");
                    assertThat(notification.createdUser()).isNull();
                    assertThat(notification.payload())
                            .containsEntry("paymentId", "old-payment")
                            .containsEntry("refundRequestStatus", "approved")
                            .containsEntry("refundStatus", "full")
                            .containsEntry("paymentStatus", "refunded")
                            .containsEntry("refundReason", "asset-manager-takeover")
                            .containsEntry("notification_message_key", "notification.payment.refund.takeover.message")
                            .doesNotContainKeys("previousManagerUserId", "managerUserId");
                });
    }

    @Test
    void releasedFormerOwnerCanCreateANewJoinRequestLikeAnyFreshUser() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        asset.setRequests(List.of());
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of());
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());
        AccessControlService accessControlService = mock(AccessControlService.class);
        when(accessControlService.canCurrentActorRequestAssetBorrow("u1", "event-1")).thenReturn(true);
        stubBorrowWindow(mongoTemplate);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        var joined = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1",
                "event-1",
                "subevent-1",
                "u1",
                "join",
                borrowRequestDto("request-fresh-owner", "u1", "pending", "event-1")));

        assertThat(joined).isNotNull();
        assertThat(joined.previousStatus()).isNull();
        assertThat(joined.status()).isEqualTo("pending");
        ArgumentCaptor<Asset> saved = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(saved.capture());
        assertThat(saved.getValue().getRequests())
                .extracting(AssetRequestRecord::userId)
                .containsExactly("u1");
    }

    @Test
    void scopedAssetMemberManagementAllowsOwnerGlobalManagerOrExactRuntimeManager() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        Asset asset = assetWithEventRequest();
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);
        when(activitiesResourcesService.scopedAssetManagerUserId("event-1", "subevent-1", "asset-1"))
                .thenReturn("runtime-manager");

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        assertThat(service.canManageScopedAssetMembers(
                "asset-1", "event-1", "subevent-1", "u1")).isTrue();
        assertThat(service.canManageScopedAssetMembers(
                "asset-1", "event-1", "subevent-1", "runtime-manager")).isTrue();
        assertThat(service.canManageScopedAssetMembers(
                "asset-1", "event-1", "subevent-1", "u2")).isFalse();

        asset.setRequests(assetWithPendingBorrowRequest().getRequests());
        assertThat(service.canManageScopedAssetMembers(
                "asset-1", "event-1", "subevent-1", "u2")).isFalse();

        AssetRequestRecord acceptedRequest = assetWithEventRequest().getRequests().get(0);
        AssetRequestBookingRecord acceptedBooking = acceptedRequest.booking();
        asset.setRequests(List.of(new AssetRequestRecord(
                acceptedRequest.id(),
                acceptedRequest.userId(),
                acceptedRequest.name(),
                acceptedRequest.initials(),
                acceptedRequest.gender(),
                acceptedRequest.status(),
                acceptedRequest.note(),
                acceptedRequest.requestKind(),
                acceptedRequest.requestedAtIso(),
                new AssetRequestBookingRecord(
                        acceptedBooking.eventId(),
                        acceptedBooking.eventTitle(),
                        "another-subevent",
                        acceptedBooking.subEventTitle(),
                        acceptedBooking.slotKey(),
                        acceptedBooking.slotLabel(),
                        acceptedBooking.timeframe(),
                        acceptedBooking.startAtIso(),
                        acceptedBooking.endAtIso(),
                        acceptedBooking.quantity(),
                        acceptedBooking.totalAmount(),
                        acceptedBooking.previousTotalAmount(),
                        acceptedBooking.currency(),
                        acceptedBooking.acceptedPolicyIds(),
                        acceptedBooking.paymentSessionId(),
                        acceptedBooking.inventoryApplied()))));
        assertThat(service.canManageScopedAssetMembers(
                "asset-1", "event-1", "subevent-1", "u2")).isFalse();
    }

    @Test
    void removingBorrowedRuntimeAssignmentRetiresScopeUnderGlobalAssetOwner() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UserActivityCountersService userActivityCountersService = mock(UserActivityCountersService.class);
        Asset asset = asset();
        asset.setOwnerUserId("global-owner");
        asset.setRequests(List.of(
                scopedBorrowRequest("manager-request", "runtime-manager", "accepted", 3200d, null, "payment-1"),
                scopedBorrowRequest("member-request", "member", "accepted", 3200d, null, "payment-2")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                userActivityCountersService);

        service.statusDeleteAssignmentScopeRequests(
                "runtime-manager",
                List.of("asset-1"),
                "event-1",
                "event-1",
                "subevent-1",
                "runtime-manager",
                "2026-09-07T09:00:00Z");

        ArgumentCaptor<Asset> saved = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(saved.capture());
        assertThat(saved.getValue().getOwnerUserId()).isEqualTo("global-owner");
        assertThat(saved.getValue().getRequests())
                .extracting(AssetRequestRecord::status)
                .containsOnly("D");
        verify(userActivityCountersService).refreshAssetCountersForUser("global-owner");
        verify(assetsRepository, never()).findByOwnerUserIdAndAssetId(anyString(), anyString());
    }

    @Test
    void syncScopedMembersPreserveCurrentOwnerAndOnlyChangeRequestsForTheSelectedGroup() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        AssetRequestBookingRecord groupABooking = new AssetRequestBookingRecord(
                "event-1:subevent-1:group-a", "Event", "subevent-1", "Stage", "subevent-1", "Stage",
                null, null, null, 1, null, null, List.of(), null, null);
        AssetRequestBookingRecord groupBBooking = new AssetRequestBookingRecord(
                "event-1:subevent-1:group-b", "Event", "subevent-1", "Stage", "subevent-1", "Stage",
                null, null, null, 1, null, null, List.of(), null, null);
        asset.setRequests(List.of(
                new AssetRequestRecord(
                        "group-a-owner", "u1", "Owner One", "OO", "man", "accepted", "", "borrow",
                        "2026-05-11T09:00:00Z", groupABooking),
                new AssetRequestRecord(
                        "group-a-old", "u2", "Old Group A", "OA", "man", "accepted", "", "borrow",
                        "2026-05-11T10:00:00Z", groupABooking),
                new AssetRequestRecord(
                        "group-b-kept", "u3", "Group B", "GB", "man", "accepted", "", "borrow",
                        "2026-05-11T10:00:00Z", groupBBooking)));
        Users invitedUser = user("u4", "New Group A", "NA");
        ActivityMemberEntryDto invited = new ActivityMemberEntryDto(
                null, "u4", "New Group A", "NA", "man", "", "Waiting", "Member", "pending",
                "admin", "invite", "u1", true, "2026-05-12T10:00:00Z", "2026-05-12T10:00:00Z",
                "", null, null, List.of(), "2026-05-12T10:00:00Z", null, null, null, null);

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u4")).thenReturn(Optional.of(invitedUser));
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));

        String assetOwnerUserId = service.syncScopedRequestsFromMemberEntries(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                List.of(invited),
                "u1");

        assertThat(assetOwnerUserId).isEqualTo("u1");
        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getRequests())
                .extracting(AssetRequestRecord::id)
                .contains("group-a-owner", "group-a-old", "group-b-kept");
        assertThat(savedAsset.getValue().getRequests())
                .filteredOn(request -> "group-a-old".equals(request.id()))
                .singleElement()
                .satisfies(request -> assertThat(request.status()).isEqualTo("D"));
        assertThat(savedAsset.getValue().getRequests())
                .filteredOn(request -> "u4".equals(request.userId()))
                .singleElement()
                .satisfies(request -> {
                    assertThat(request.status()).isEqualTo("pending");
                    assertThat(request.requestKind()).isEqualTo("invite");
                    assertThat(request.booking().eventId()).isEqualTo("event-1:subevent-1:group-a");
                    assertThat(request.booking().subEventId()).isEqualTo("subevent-1");
                });
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-member-invite");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u4");
        assertThat(notification.getValue().payload())
                .containsEntry("assetId", "asset-1")
                .containsEntry("eventId", "event-1:subevent-1:group-a")
                .containsEntry("subEventId", "subevent-1")
                .containsEntry("memberUserId", "u4")
                .containsEntry("requestKind", "invite")
                .containsEntry("senderUserId", "u1");
    }

    @Test
    void syncScopedJoinRequestNotifiesTheAssetOwnerButNotTheRequester() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset asset = asset();
        asset.setRequests(List.of());
        ActivityMemberEntryDto joining = new ActivityMemberEntryDto(
                null, "u5", "Joining User", "JU", "man", "", "Waiting", "Member", "pending",
                "member", "join", null, true, "2026-05-12T11:00:00Z", "2026-05-12T11:00:00Z",
                "", null, null, List.of(), "2026-05-12T11:00:00Z", null, null, null, null);

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1", "Owner One", "OO")));
        when(usersRepository.findByUserId("u5")).thenReturn(Optional.of(user("u5", "Joining User", "JU")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                mock(AccessControlService.class),
                mock(UserActivityCountersService.class));

        service.syncScopedRequestsFromMemberEntries(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                List.of(joining),
                "u5");

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-admin-join-request");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u1");
        assertThat(notification.getValue().recipientUserIds()).doesNotContain("u5");
        assertThat(notification.getValue().payload())
                .containsEntry("memberUserId", "u5")
                .containsEntry("requestKind", "borrow")
                .containsEntry("senderUserId", "u5");
    }

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
        asset.setRequests(List.of(
                new AssetRequestRecord(
                        "owner-membership",
                        "u1",
                        "Owner One",
                        "OO",
                        "man",
                        "accepted",
                        "Previous delegated manager membership.",
                        "invite",
                        "2026-05-10T10:00:00Z",
                        null),
                asset.getRequests().getFirst()));
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNotNull();
        assertThat(card.requests()).hasSize(2);
        assertThat(card.requests())
                .filteredOn(request -> "request-1".equals(request.id()))
                .singleElement()
                .satisfies(request -> {
                    assertThat(request.status()).isEqualTo("accepted");
                    assertThat(request.note()).isEqualTo("Promoted to asset manager.");
                    assertThat(request.menuActions()).isEmpty();
                });

        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getRole()).isEqualTo("Manager");
        assertThat(savedMember.getValue().getStatus()).isEqualTo("accepted");

        verify(mongoTemplate).updateFirst(any(), any(), eq(Asset.class));
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-manager-promoted");
        assertThat(notification.getValue().tag()).isEqualTo("asset-manager-promoted-asset-1-u2");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
        assertThat(notification.getValue().payload())
                .containsEntry("memberUserId", "u2")
                .containsEntry("targetUserId", "u2");
    }

    @Test
    void makeManagerUsesTheUnmodifiedExistingMemberAsItsAtomicSnapshot() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset asset = assetWithEventRequest();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");
        ActivityMember existingMember = member("asset-1", "u2", "Member", "accepted");
        existingMember.setId("member-2");
        existingMember.setSyncKey("member-sync-2");
        existingMember.setCreatedDate("2026-09-03T07:00:00Z");
        existingMember.setCreatedUser("u1");
        existingMember.setUpdatedDate("2026-09-03T08:00:00Z");
        existingMember.setUpdatedUser("u1");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(existingMember));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(existingMember));
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());
        when(mongoTemplate.updateFirst(any(), any(), eq(ActivityMember.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorPromoteAssetManager("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNotNull();
        assertThat(existingMember.getRole()).isEqualTo("Member");
        assertThat(existingMember.getUpdatedDate()).isEqualTo("2026-09-03T08:00:00Z");
        ArgumentCaptor<Query> memberQuery = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> memberUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(memberQuery.capture(), memberUpdate.capture(), eq(ActivityMember.class));
        assertThat(memberQuery.getValue().getQueryObject())
                .containsEntry("_id", "member-2")
                .containsEntry("role", "Member")
                .containsEntry("status", "accepted")
                .containsEntry("updatedDate", "2026-09-03T08:00:00Z");
        assertThat(memberUpdate.getValue().getUpdateObject().get("$set"))
                .isInstanceOfSatisfying(org.bson.Document.class, set ->
                        assertThat(set)
                                .containsEntry("role", "Manager")
                                .containsEntry("status", "accepted"));
    }

    @Test
    void makeManagerAllowsAcceptedAssetParticipantWithoutChangingEventMembership() {
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
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(member("asset-1", "u2", "Manager", "accepted")));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.makeManager(new AssetMakeManagerRequestDto("u1", "asset-1", "u2"));

        assertThat(card).isNotNull();
        verify(activityMembersRepository).save(any(ActivityMember.class));
        verify(mongoTemplate).updateFirst(any(), any(), eq(Asset.class));
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        verify(accessControlService, never()).canReceiveEventAssetManagerRole(any(), any());
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
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
        assertThat(savedMember.getValue().getManagerGrantedByUserId()).isEqualTo("u1");

        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        verify(affinityRecomputeTaskService, never()).enqueueEventMembersChanged(any(), any());
        verify(accessControlService, never()).canReceiveEventAssetManagerRole(any(), any());
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
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
    void delegatedManagerRevocationPersistsAndNotifiesTargetAndOwner() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        Users owner = user("u1", "Owner One", "OO");
        Users target = user("u2", "Member Two", "MT");
        Users actor = user("u3", "Manager Three", "M3");
        ActivityMember targetManager = member("asset-1", "u2", "Manager", "accepted");
        ActivityMember actorManager = member("asset-1", "u3", "Manager", "accepted");
        targetManager.setManagerGrantedByUserId("u3");
        actorManager.setManagerGrantedByUserId("u1");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(target));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(actor));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(targetManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u3"))
                .thenReturn(Optional.of(actorManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(targetManager, actorManager));
        when(accessControlService.canCurrentActorPromoteAssetManager("u3", "asset-1")).thenReturn(true);
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.revokeManager(new AssetMakeManagerRequestDto("u3", "asset-1", "u2"));

        assertThat(card).isNotNull();
        assertThat(card.requests().getFirst().note()).isEqualTo("Borrow request approved by the owner.");
        verify(activityMembersRepository).delete(targetManager);
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u3");
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-manager-revoked");
        assertThat(notification.getValue().tag()).isEqualTo("asset-manager-revoked-asset-1-u2");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2", "u1");
        assertThat(notification.getValue().payload())
                .containsEntry("memberUserId", "u2")
                .containsEntry("targetUserId", "u2")
                .containsEntry("actorUserId", "u3");
    }

    @Test
    void delegatedManagerCannotRevokeManagerGrantedBySomeoneElse() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        Users actor = user("u3", "Manager Three", "M3");
        ActivityMember targetManager = member("asset-1", "u2", "Manager", "accepted");
        ActivityMember actorManager = member("asset-1", "u3", "Manager", "accepted");
        targetManager.setManagerGrantedByUserId("u1");
        actorManager.setManagerGrantedByUserId("u1");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(actor));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(targetManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u3"))
                .thenReturn(Optional.of(actorManager));
        when(accessControlService.canCurrentActorPromoteAssetManager("u3", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.revokeManager(new AssetMakeManagerRequestDto("u3", "asset-1", "u2"));

        assertThat(card).isNull();
        verify(activityMembersRepository, never()).delete(any(ActivityMember.class));
        verify(mongoTemplate, never()).updateFirst(any(), any(), eq(Asset.class));
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
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        Users manager = user("u2", "Manager Two", "MT");
        ActivityMember managerMember = member("asset-1", "u2", "Manager", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(manager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(managerMember));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(managerMember));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(0L, 0L, null));
        when(accessControlService.canCurrentActorTakeOverAsset("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
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
    void ownerLeavePersistsUnderReviewStateAndNotifiesOnlyManagersWhenPresent() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        ChatAttachmentLifecycleService chatAttachmentLifecycleService = mock(ChatAttachmentLifecycleService.class);
        UserActivityCountersService userActivityCountersService = mock(UserActivityCountersService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = asset();
        Users owner = user("u1", "Owner One", "OO");
        Users member = user("u2", "Member Two", "MT");
        Users manager = user("u3", "Manager Three", "M3");
        ActivityMember ownerManager = member("asset-1", "u1", "Manager", "accepted");
        ActivityMember managerMember = member("asset-1", "u3", "Manager", "accepted");

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(member));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(manager));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u1"))
                .thenReturn(Optional.of(ownerManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(ownerManager, managerMember));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorDeleteAsset("u1", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                chatAttachmentLifecycleService,
                accessControlService,
                userActivityCountersService);

        AssetDto card = service.leaveOwnership(new AssetDeleteRequestDto("u1", "asset-1"));

        assertThat(card).isNotNull();
        assertThat(card.status()).isEqualTo("UR");
        assertThat(card.ownerUserId()).isEqualTo("u1");
        assertThat(card.ownerReleasedAtIso()).isNotBlank();
        assertThat(card.requests()).extracting(AssetMemberRequestDto::userId).doesNotContain("u1");
        assertThat(card.menuActions()).doesNotContain("edit", "delete", "takeOver");
        verify(mongoTemplate).updateFirst(any(), any(), eq(Asset.class));
        verify(activityMembersRepository).delete(ownerManager);
        verify(affinityRecomputeTaskService).enqueueAssetChanged("asset-1", "u1");
        verify(chatAttachmentLifecycleService).markAssetUnavailable("asset-1", "owner-left");
        verify(userActivityCountersService).refreshAssetCountersForUser("u1");
        verify(userActivityCountersService, never()).refreshAssetCountersForUser("u2");
        verify(userActivityCountersService).refreshAssetCountersForUser("u3");
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-owner-left");
        assertThat(notification.getValue().recipientScope()).isEqualTo("asset-active-managers");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u3");
        assertThat(notification.getValue().payload())
                .containsEntry("previousOwnerUserId", "u1")
                .containsEntry("assetStatus", "UR");
    }

    @Test
    void ownerLeaveFallsBackToAcceptedMembersWhenNoManagerExists() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        UserActivityCountersService userActivityCountersService = mock(UserActivityCountersService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset asset = assetWithEventRequest();
        ActivityMember ownerManager = member("asset-1", "u1", "Manager", "accepted");
        ActivityMember member = member("asset-1", "u2", "Member", "accepted");

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1", "Owner One", "OO")));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2", "Member Two", "MT")));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(user("u1", "Owner One", "OO")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u1"))
                .thenReturn(Optional.of(ownerManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(ownerManager, member));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorDeleteAsset("u1", "asset-1")).thenReturn(true);
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                userActivityCountersService);
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        AssetDto card = service.leaveOwnership(new AssetDeleteRequestDto("u1", "asset-1"));

        assertThat(card).isNotNull();
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().recipientScope()).isEqualTo("asset-members");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
        assertThat(notification.getValue().body()).contains("accepted Asset Member");
        verify(userActivityCountersService).refreshAssetCountersForUser("u2");
        verify(activitiesResourcesService).refreshResourceMetricsForScope(
                "event-1",
                "subevent-1",
                "u1");
        verify(activitiesResourcesService, never()).removeAssetFromResourceAssignments(any(), any());
    }

    @Test
    void finalOwnerLeaveRemovesTheAssetFromActivityResourceAssignments() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Asset asset = asset();
        asset.setRequests(List.of());
        ActivityMember ownerManager = member("asset-1", "u1", "Manager", "accepted");
        ActivityMember previouslyRemovedMember = member("asset-1", "u2", "Member", "deleted");

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1", "Owner One", "OO")));
        when(usersRepository.findByUserIdIn(List.of("u1"))).thenReturn(List.of(user("u1", "Owner One", "OO")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u1"))
                .thenReturn(Optional.of(ownerManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(ownerManager, previouslyRemovedMember));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorDeleteAsset("u1", "asset-1")).thenReturn(true);
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        AssetDto card = service.leaveOwnership(new AssetDeleteRequestDto("u1", "asset-1"));

        assertThat(card).isNotNull();
        assertThat(card.status()).isEqualTo("UR");
        verify(activitiesResourcesService).removeAssetFromResourceAssignments("asset-1", "u1");
        verifyNoInteractions(notificationOutboxService);
    }

    @Test
    void firstAcceptedManagerCanTakeOverReleasedAssetAsItsNewOwner() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        ActivitiesResourcesService activitiesResourcesService = mock(ActivitiesResourcesService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider = mock(ObjectProvider.class);

        Asset asset = assetWithEventRequest();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        Users newOwner = user("u2", "Manager Two", "MT");
        ActivityMember managerMember = member("asset-1", "u2", "Manager", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(newOwner));
        when(usersRepository.findByUserIdIn(List.of("u2"))).thenReturn(List.of(newOwner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(managerMember));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(managerMember));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorTakeOverAsset("u2", "asset-1")).thenReturn(true);
        when(activitiesResourcesServiceProvider.getIfAvailable()).thenReturn(activitiesResourcesService);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        service.setActivitiesResourcesServiceProvider(activitiesResourcesServiceProvider);

        AssetDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

        assertThat(card).isNotNull();
        assertThat(card.status()).isEqualTo("A");
        assertThat(card.ownerUserId()).isEqualTo("u2");
        assertThat(card.ownerReleasedAtIso()).isEmpty();
        assertThat(card.menuActions()).contains("edit", "delete");
        verify(mongoTemplate).updateFirst(any(), any(), eq(Asset.class));
        verify(activitiesResourcesService, never()).refreshResourceMetricsForScope(any(), any(), any());
    }

    @Test
    void takeOverNotifiesRemainingMembersWhenTheHandoverHadNoManager() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = assetWithEventRequest();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        AssetRequestRecord existingRequest = asset.getRequests().get(0);
        asset.setRequests(List.of(
                existingRequest,
                new AssetRequestRecord(
                        "request-2",
                        "u3",
                        "Member Three",
                        "M3",
                        "woman",
                        "accepted",
                        "Accepted for this asset.",
                        "borrow",
                        "2026-09-03T07:00:00Z",
                        existingRequest.booking())));
        Users newOwner = user("u2", "Member Two", "MT");
        Users remainingMember = user("u3", "Member Three", "M3");
        ActivityMember newOwnerMember = member("asset-1", "u2", "Member", "accepted");
        ActivityMember remainingMemberRow = member("asset-1", "u3", "Member", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(newOwner));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(remainingMember));
        when(usersRepository.findByUserIdIn(List.of("u2"))).thenReturn(List.of(newOwner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(newOwnerMember));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(newOwnerMember, remainingMemberRow));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorTakeOverAsset("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

        assertThat(card).isNotNull();
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-takeover");
        assertThat(notification.getValue().recipientScope()).isEqualTo("asset-members");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u3");
        assertThat(notification.getValue().body())
                .isEqualTo("Member Two took over responsibility for Camp Kit.");
        assertThat(notification.getValue().payload())
                .containsEntry("previousOwnerUserId", "u1")
                .containsEntry("ownerUserId", "u2")
                .containsEntry("actorUserId", "u2");
    }

    @Test
    void takeOverNotifiesRemainingManagersButNotOrdinaryMembersWhenManagersExist() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AccessControlService accessControlService = mock(AccessControlService.class);

        Asset asset = assetWithEventRequest();
        asset.setStatus("UR");
        asset.setStatusBeforeSuppression("A");
        asset.setOwnerReleasedAtIso("2026-09-03T08:00:00Z");
        AssetRequestRecord existingRequest = asset.getRequests().get(0);
        asset.setRequests(List.of(
                existingRequest,
                new AssetRequestRecord(
                        "request-2", "u3", "Manager Three", "M3", "woman", "accepted",
                        "Accepted for this asset.", "borrow", "2026-09-03T07:00:00Z",
                        existingRequest.booking()),
                new AssetRequestRecord(
                        "request-3", "u4", "Member Four", "M4", "man", "accepted",
                        "Accepted for this asset.", "borrow", "2026-09-03T07:05:00Z",
                        existingRequest.booking())));
        Users newOwner = user("u2", "Manager Two", "M2");
        Users remainingManager = user("u3", "Manager Three", "M3");
        ActivityMember newOwnerManager = member("asset-1", "u2", "Manager", "accepted");
        ActivityMember remainingManagerRow = member("asset-1", "u3", "Manager", "accepted");
        ActivityMember ordinaryMemberRow = member("asset-1", "u4", "Member", "accepted");

        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(newOwner));
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(remainingManager));
        when(usersRepository.findByUserIdIn(List.of("u2"))).thenReturn(List.of(newOwner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(newOwnerManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(newOwnerManager, remainingManagerRow, ordinaryMemberRow));
        when(mongoTemplate.updateFirst(any(), any(), eq(Asset.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        when(accessControlService.canCurrentActorTakeOverAsset("u2", "asset-1")).thenReturn(true);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        AssetDto card = service.takeOver(new AssetDeleteRequestDto("u2", "asset-1"));

        assertThat(card).isNotNull();
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u3");
        assertThat(notification.getValue().recipientUserIds()).doesNotContain("u2", "u4");
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto("u1", assetCard("asset-1")));

        verify(accessControlService).canCurrentActorCreateAsset("u1", "asset-1");
        verify(accessControlService, never()).canCurrentActorEditAsset(any(), any());
        verify(assetsRepository).save(any(Asset.class));
    }

    @Test
    void upsertPersistsTheCompleteAssetPricingConfiguration() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AbsoluteAffinityService absoluteAffinityService = mock(AbsoluteAffinityService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        Users owner = user("u1", "Owner One", "OO");
        PricingConfigDto pricing = new PricingConfigDto(
                "hybrid",
                37.5d,
                "EUR",
                "included",
                "per_attendee",
                true,
                List.of(new PricingQuantityRuleDto(
                        "quantity-1",
                        3,
                        new PricingActionDto("decrease_amount", 2.5d))),
                12d,
                80d,
                "half",
                true,
                List.of(new PricingDemandRuleDto(
                        "demand-1",
                        "lte",
                        65,
                        new PricingActionDto("increase_percent", 7d),
                        "all_slots",
                        List.of())),
                true,
                List.of(new PricingTimeRuleDto(
                        "time-1",
                        "specific_date",
                        null,
                        "2026-08-01",
                        "2026-08-10",
                        new PricingActionDto("decrease_percent", 11d),
                        "selected_slots",
                        List.of("slot-1"))),
                new PricingCancellationPolicyDto(
                        true,
                        List.of(new PricingCancellationRuleDto(
                                "cancel-1",
                                "weeks",
                                2,
                                "fixed_amount",
                                18.25d))),
                true,
                List.of(new PricingSlotOverrideDto(
                        "override-1",
                        "slot-1",
                        "Morning",
                        "2026-08-01T09:00:00",
                        "2026-08-01T11:00:00",
                        29d,
                        "EUR")),
                new PricingAudienceSettingsDto(
                        true,
                        31d,
                        25d,
                        9,
                        List.of(new PricingPromoCodeDto(
                                "promo-1",
                                "SAVE9",
                                new PricingActionDto("decrease_percent", 9d))),
                        "Show \"Waitlist\""),
                true);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorCreateAsset("u1", "asset-1")).thenReturn(true);
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(absoluteAffinityService.resolveAssetAffinity(any(), eq(owner))).thenReturn(42d);
        when(absoluteAffinityService.resolveAssetBoost(any(), eq(owner))).thenReturn(7d);
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                absoluteAffinityService,
                affinityRecomputeTaskService,
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new AssetUpsertRequestDto("u1", assetCardWithPricing("asset-1", pricing)));

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getPricing()).isEqualTo(pricing);
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        service.upsert(new com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto("u1", assetCard("asset-1")));

        verify(accessControlService).canCurrentActorEditAsset("u1", "asset-1");
        verify(assetsRepository, never()).save(any(Asset.class));
    }

    @Test
    void upsertAllowsPendingBorrowRequestWithoutFullAssetEditAndIgnoresAssetFieldChanges() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = asset();
        var authentication = new TestingAuthenticationToken("firebase-principal", null);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1", "Owner One", "OO")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorRequestAssetBorrow("u2", "event-1")).thenReturn(true);
        when(accessControlService.canCurrentActorCancelAssetBorrow("u2", "asset-1")).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("u2");
        stubBorrowWindow(mongoTemplate);

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            service.upsert(new AssetUpsertRequestDto(
                    "u1",
                    assetCard(
                            "asset-1",
                            "Spoofed Title",
                            1,
                            List.of(borrowRequestDto("request-2", "u2", "pending", "event-1")))));
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<Asset> savedAsset = ArgumentCaptor.forClass(Asset.class);
        verify(assetsRepository).save(savedAsset.capture());
        assertThat(savedAsset.getValue().getTitle()).isEqualTo("Camp Kit");
        assertThat(savedAsset.getValue().getQuantity()).isEqualTo(2);
        assertThat(savedAsset.getValue().getRequests()).hasSize(2);
        assertThat(savedAsset.getValue().getRequests())
                .anySatisfy(request -> {
                    assertThat(request.id()).isEqualTo("request-2");
                    assertThat(request.status()).isEqualTo("pending");
                });
        ArgumentCaptor<AssetRequest> projectedRequest = ArgumentCaptor.forClass(AssetRequest.class);
        verify(mongoTemplate, times(2)).save(projectedRequest.capture());
        assertThat(projectedRequest.getAllValues())
                .anySatisfy(request -> {
                    assertThat(request.id()).isEqualTo("asset-1:request:request-2");
                    assertThat(request.assetId()).isEqualTo("asset-1");
                    assertThat(request.ownerUserId()).isEqualTo("u1");
                });
        verify(accessControlService).canCurrentActorEditAsset("u1", "asset-1");
        verify(accessControlService).canCurrentActorRequestAssetBorrow("u2", "event-1");
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(notification.capture());
        assertThat(notification.getAllValues())
                .filteredOn(item -> "asset-admin-join-request".equals(item.type()))
                .singleElement()
                .satisfies(item -> {
                    assertThat(item.recipientUserIds()).containsExactly("u1");
                    assertThat(item.payload())
                            .containsEntry("assetId", "asset-1")
                            .containsEntry("eventId", "event-1")
                            .containsEntry("subEventId", "subevent-1")
                            .containsEntry("requestId", "request-2")
                            .containsEntry("memberUserId", "u2")
                            .containsEntry("requestKind", "borrow")
                            .containsEntry("senderUserId", "u2");
                });
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
        assertThat(savedAsset.getValue().getQuantity()).isEqualTo(2);
        assertThat(savedAsset.getValue().getRequests().get(0).status()).isEqualTo("accepted");
    }

    @Test
    void acceptingOwnAssetInvitationNotifiesTheAssetOwner() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = assetWithEventRequest();
        AssetRequestRecord pending = existing.getRequests().get(0);
        existing.setRequests(List.of(new AssetRequestRecord(
                pending.id(),
                pending.userId(),
                pending.name(),
                pending.initials(),
                pending.gender(),
                "pending",
                "Awaiting invitation response.",
                "invite",
                pending.requestedAtIso(),
                pending.booking())));
        Users owner = user("u1", "Owner One", "OO");
        var authentication = new TestingAuthenticationToken("firebase-principal", null);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("u2");
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        AssetMemberRequestDto accepted = new AssetMemberRequestDto(
                pending.id(),
                pending.userId(),
                pending.name(),
                pending.initials(),
                pending.gender(),
                "accepted",
                "Invitation accepted.",
                "invite",
                pending.requestedAtIso(),
                new AssetRequestBookingDto(
                        pending.booking().eventId(),
                        pending.booking().eventTitle(),
                        pending.booking().subEventId(),
                        pending.booking().subEventTitle(),
                        pending.booking().slotKey(),
                        pending.booking().slotLabel(),
                        pending.booking().timeframe(),
                        pending.booking().startAtIso(),
                        pending.booking().endAtIso(),
                        pending.booking().quantity(),
                        pending.booking().totalAmount(),
                        pending.booking().previousTotalAmount(),
                        pending.booking().currency(),
                        pending.booking().acceptedPolicyIds(),
                        pending.booking().paymentSessionId(),
                        pending.booking().inventoryApplied()),
                List.of());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            service.upsert(new AssetUpsertRequestDto(
                    "u1",
                    assetCard("asset-1", "Camp Kit", 2, List.of(accepted))));
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-invitation-accepted");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u1");
        assertThat(notification.getValue().createdUser()).isEqualTo("u2");
        assertThat(notification.getValue().payload())
                .containsEntry("assetId", "asset-1")
                .containsEntry("eventId", "event-1")
                .containsEntry("subEventId", "subevent-1")
                .containsEntry("requestId", "request-1")
                .containsEntry("requestKind", "invite")
                .containsEntry("memberUserId", "u2")
                .containsEntry("membershipAction", "accepted");
    }

    @Test
    void decliningOwnAssetInvitationNotifiesTheAssetOwner() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = assetWithEventRequest();
        AssetRequestRecord pending = existing.getRequests().get(0);
        existing.setRequests(List.of(new AssetRequestRecord(
                pending.id(),
                pending.userId(),
                pending.name(),
                pending.initials(),
                pending.gender(),
                "pending",
                "Awaiting invitation response.",
                "invite",
                pending.requestedAtIso(),
                pending.booking())));
        Users owner = user("u1", "Owner One", "OO");
        var authentication = new TestingAuthenticationToken("firebase-principal", null);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("u2");
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            service.upsert(new AssetUpsertRequestDto(
                    "u1",
                    assetCard("asset-1", "Camp Kit", 2, List.of())));
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-invitation-declined");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u1");
        assertThat(notification.getValue().createdUser()).isEqualTo("u2");
        assertThat(notification.getValue().payload())
                .containsEntry("assetId", "asset-1")
                .containsEntry("eventId", "event-1")
                .containsEntry("subEventId", "subevent-1")
                .containsEntry("requestId", "request-1")
                .containsEntry("requestKind", "invite")
                .containsEntry("memberUserId", "u2")
                .containsEntry("membershipAction", "declined");
    }

    @Test
    void ownerAcceptingAssetJoinRequestNotifiesTheRequester() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = assetWithPendingBorrowRequest();
        Users owner = user("u1", "Owner One", "OO");
        Users requester = user("u2", "Member Two", "MT");
        var authentication = new TestingAuthenticationToken("firebase-principal", null);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(requester));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(accessControlService.canCurrentActorApproveAssetBorrow("u2", "asset-1")).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("u1");
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            service.upsert(new AssetUpsertRequestDto(
                    "u1",
                    assetCard("asset-1", "Camp Kit", 2,
                            List.of(borrowRequestDto("request-1", "u2", "accepted", "event-1")))));
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-member-request-accepted");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
        assertThat(notification.getValue().payload())
                .containsEntry("memberUserId", "u2")
                .containsEntry("membershipAction", "accepted");
    }

    @Test
    void ownerDecliningAssetJoinRequestNotifiesTheRequester() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        Asset existing = assetWithPendingBorrowRequest();
        Users owner = user("u1", "Owner One", "OO");
        Users requester = user("u2", "Member Two", "MT");
        var authentication = new TestingAuthenticationToken("firebase-principal", null);

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1")).thenReturn(Optional.of(existing));
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(owner));
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(requester));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(owner));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1")).thenReturn(List.of());
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(accessControlService.canCurrentActorRejectAssetBorrow("u2", "asset-1")).thenReturn(true);
        when(accessControlService.resolveActorUserId(authentication)).thenReturn("u1");
        when(mongoTemplate.find(any(), eq(AssetRequest.class))).thenReturn(List.of());

        AssetsService service = new AssetsService(
                assetsRepository,
                usersRepository,
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            service.upsert(new AssetUpsertRequestDto(
                    "u1",
                    assetCard("asset-1", "Camp Kit", 2, List.of())));
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().type()).isEqualTo("asset-member-request-declined");
        assertThat(notification.getValue().recipientUserIds()).containsExactly("u2");
        assertThat(notification.getValue().payload())
                .containsEntry("memberUserId", "u2")
                .containsEntry("membershipAction", "declined");
    }

    @Test
    void acceptedAssetMemberCannotLeaveWithoutManagerRemoval() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        ActivityMembersRepository activityMembersRepository = mock(ActivityMembersRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        Asset existing = assetWithEventRequest();
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(existing));

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                activityMembersRepository,
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));

        var left = service.applyMemberStatusChange(new AssetMemberStatusChangeRequestDto(
                "asset-1",
                "event-1",
                "subevent-1",
                "u2",
                "leave",
                null));

        assertThat(left).isNull();
        verify(assetsRepository, never()).save(any(Asset.class));
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
        assertThat(savedAsset.getValue().getRequests()).singleElement()
                .satisfies(request -> assertThat(request.status()).isEqualTo("D"));
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
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mock(MongoTemplate.class),
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
        assertThat(savedAsset.getValue().getRequests()).singleElement()
                .satisfies(request -> assertThat(request.status()).isEqualTo("D"));
        verify(accessControlService).canCurrentActorCancelAssetBorrow("u2", "asset-1");
    }

    @Test
    void upsertUsesCalculatedPreviousTotalWhenLegacyBookingAggregateIsZero() {
        AssetsRepository assetsRepository = mock(AssetsRepository.class);
        AccessControlService accessControlService = mock(AccessControlService.class);
        PaymentService paymentService = mock(PaymentService.class);
        Asset existing = assetWithEventRequest();
        AssetRequestRecord previousRequest = existing.getRequests().get(0);
        existing.setRequests(List.of(new AssetRequestRecord(
                previousRequest.id(),
                previousRequest.userId(),
                previousRequest.name(),
                previousRequest.initials(),
                previousRequest.gender(),
                previousRequest.status(),
                previousRequest.note(),
                previousRequest.requestKind(),
                previousRequest.requestedAtIso(),
                new AssetRequestBookingRecord(
                        "event-1",
                        "Weekend Transport",
                        "subevent-1",
                        "Morning Trip",
                        "slot-1",
                        "Seat",
                        "morning",
                        "2026-05-12T09:00:00Z",
                        "2026-05-12T11:00:00Z",
                        2,
                        0d,
                        "USD",
                        List.of(),
                        "checkout-root",
                        true))));

        when(assetsRepository.findByOwnerUserIdAndAssetId("u1", "asset-1"))
                .thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorEditAsset("u1", "asset-1")).thenReturn(true);
        when(assetsRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssetsService service = new AssetsService(
                assetsRepository,
                mock(UsersRepository.class),
                mock(FriendshipFacts.class),
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                paymentService,
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
        AssetMemberRequestDto updatedRequest = new AssetMemberRequestDto(
                "request-1",
                "u2",
                "Member Two",
                "MT",
                "man",
                "accepted",
                "Accepted for this asset.",
                "borrow",
                "2026-05-11T10:00:00Z",
                new AssetRequestBookingDto(
                        "event-1",
                        "Weekend Transport",
                        "subevent-1",
                        "Morning Trip",
                        "slot-1",
                        "Seat",
                        "morning",
                        "2026-05-12T09:00:00Z",
                        "2026-05-12T11:00:00Z",
                        3,
                        36d,
                        24d,
                        "USD",
                        List.of(),
                        "checkout-root",
                        true),
                List.of());

        service.upsert(new AssetUpsertRequestDto(
                "u1",
                assetCard("asset-1", "Camp Kit", 0, List.of(updatedRequest))));

        verify(paymentService).recordAssetBookingPriceRevision(
                "checkout-root",
                "u2",
                "asset-1",
                "Camp Kit",
                "morning",
                2,
                3,
                24d,
                36d,
                "USD");
    }

    private Asset asset() {
        Asset asset = new Asset();
        asset.setId("asset-doc-1");
        asset.setAssetId("asset-1");
        asset.setOwnerUserId("u1");
        asset.setType(AssetCatalog.TYPE_SUPPLIES);
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
                        "Weekend Transport",
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

    private AssetRequestRecord scopedBorrowRequest(
            String requestId,
            String userId,
            String status,
            Double totalAmount,
            Double previousTotalAmount,
            String paymentSessionId) {
        return new AssetRequestRecord(
                requestId,
                userId,
                userId,
                userId.toUpperCase(),
                "man",
                status,
                "Scoped borrow request.",
                "borrow",
                "2026-09-07T06:00:00Z",
                new AssetRequestBookingRecord(
                        "event-1",
                        "QA Event",
                        "subevent-1",
                        "QA Borrow Stage",
                        "subevent-1",
                        "QA Borrow Stage",
                        "Sep 9",
                        "2026-09-09T02:24:00Z",
                        "2026-09-09T04:24:00Z",
                        1,
                        totalAmount,
                        previousTotalAmount,
                        "HUF",
                        List.of("policy-1"),
                        paymentSessionId,
                        true));
    }

    private AssetDetailDto assetCard(String assetId) {
        return assetCard(assetId, "Camp Kit", 2, List.of());
    }

    private AssetDetailDto assetCardWithPricing(String assetId, PricingConfigDto pricing) {
        AssetDetailDto card = assetCard(assetId);
        return new AssetDetailDto(
                card.id(),
                card.type(),
                card.title(),
                card.subtitle(),
                card.category(),
                card.city(),
                card.capacityTotal(),
                card.quantity(),
                card.details(),
                card.imageUrl(),
                card.sourceLink(),
                card.routes(),
                card.policiesEnabled(),
                card.policies(),
                pricing,
                card.visibility(),
                card.status(),
                card.ownerUserId(),
                card.ownerName(),
                card.requests(),
                card.menuActions());
    }

    private AssetDetailDto assetCard(
            String assetId,
            String title,
            Integer quantity,
            List<AssetMemberRequestDto> requests) {
        return new AssetDetailDto(
                assetId,
                AssetCatalog.TYPE_SUPPLIES,
                title,
                "",
                AssetCatalog.CATEGORY_CAMPING,
                "Austin",
                2,
                quantity,
                "Shared camping kit.",
                "",
                "",
                List.of(),
                false,
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
        return borrowRequestDto(requestId, userId, status, eventId, List.of());
    }

    private AssetMemberRequestDto borrowRequestDto(
            String requestId,
            String userId,
            String status,
            String eventId,
            List<String> acceptedPolicyIds) {
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
                        "Weekend Transport",
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
                        acceptedPolicyIds,
                        null,
                        null),
                List.of());
    }

    private void stubBorrowWindow(MongoTemplate mongoTemplate) {
        SubEventItem subEvent = mock(SubEventItem.class);
        when(subEvent.id()).thenReturn("subevent-1");
        when(subEvent.startAt()).thenReturn("2026-05-12T08:00:00Z");
        when(subEvent.endAt()).thenReturn("2026-05-12T12:00:00Z");
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setSubEvents(List.of(subEvent));
        when(mongoTemplate.findOne(any(Query.class), eq(ActivityEvent.class))).thenReturn(event);
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

    private AssetsService ticketValidationService(
            UsersRepository usersRepository,
            FriendshipFacts friendshipFacts,
            ActivityMembersRepository activityMembersRepository,
            EventParticipationTicketService ticketService,
            NotificationOutboxService notificationOutboxService,
            AccessControlService accessControlService) {
        return new AssetsService(
                mock(AssetsRepository.class),
                usersRepository,
                friendshipFacts,
                activityMembersRepository,
                ticketService,
                mock(PaymentService.class),
                mock(MongoTemplate.class),
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                notificationOutboxService,
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
    }

    private AssetsService assetReadService(
            AssetsRepository assetsRepository,
            UsersRepository usersRepository,
            FriendshipFacts friendshipFacts,
            MongoTemplate mongoTemplate,
            AccessControlService accessControlService) {
        return new AssetsService(
                assetsRepository,
                usersRepository,
                friendshipFacts,
                mock(ActivityMembersRepository.class),
                mock(EventParticipationTicketService.class),
                mock(PaymentService.class),
                mongoTemplate,
                mock(AbsoluteAffinityService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class),
                mock(NotificationOutboxService.class),
                mock(ChatAttachmentLifecycleService.class),
                accessControlService,
                mock(UserActivityCountersService.class));
    }

    private EventTicket checkedInTicket() {
        EventTicket ticket = new EventTicket();
        ticket.setId("ticket-document-1");
        ticket.setCode("TKT-123e4567-e89b-42d3-a456-426614174000");
        ticket.setEventId("event-1");
        ticket.setHolderUserId("holder-user");
        ticket.setStatus(EventTicket.STATUS_ACTIVE);
        ticket.setIssuedAtIso("2026-07-31T08:45:00Z");
        ticket.setUsedAtIso("2026-07-31T09:00:00Z");
        ticket.setUsedByUserId("scanner-user");
        return ticket;
    }

    private EventTicket activeTicket(String id, String eventId, String holderUserId, String code) {
        EventTicket ticket = new EventTicket();
        ticket.setId(id);
        ticket.setCode(code);
        ticket.setEventId(eventId);
        ticket.setHolderUserId(holderUserId);
        ticket.setStatus(EventTicket.STATUS_ACTIVE);
        ticket.setIssuedAtIso("2026-08-13T09:37:19Z");
        return ticket;
    }

    private ActivityEvent ticketListEvent(String eventId, String holderUserId, String startAtIso) {
        ActivityEvent event = new ActivityEvent();
        event.setId(eventId + ":overlay:" + holderUserId);
        event.setSourceId(eventId);
        event.setOwnerUserId(holderUserId);
        event.setCreatorUserId("host-user");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTicketing(true);
        event.setTitle(eventId);
        event.setSubtitle("Ticket sync");
        event.setTimeframe("Future");
        event.setStartAtIso(startAtIso);
        event.setEndAtIso("2030-04-20T19:00:00Z");
        return event;
    }

    private ActivityEvent ticketEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setId("event-document-1");
        event.setSourceId("event-1");
        event.setOwnerUserId("host-user");
        event.setCreatorUserId("host-user");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTicketing(true);
        event.setTitle("Community Hike");
        event.setSubtitle("Morning route");
        event.setTimeframe("31 July");
        event.setStartAtIso("2026-07-31T09:00:00Z");
        event.setEndAtIso("2026-07-31T12:00:00Z");
        return event;
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
