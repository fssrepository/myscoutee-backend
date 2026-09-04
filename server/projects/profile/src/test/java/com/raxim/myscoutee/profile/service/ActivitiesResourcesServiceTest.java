package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.bson.Document;
import org.mockito.Mock;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceReadRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetRequestBookingDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventResourceMetricDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.AccessPolicyTestSupport;
import com.raxim.myscoutee.profile.security.ChatPolicyFacts;
import com.raxim.myscoutee.profile.security.MemberPolicyFacts;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;
import com.mongodb.client.result.UpdateResult;

@ExtendWith(MockitoExtension.class)
class ActivitiesResourcesServiceTest {
    @Mock
    private ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private AssetsService assetsService;
    @Mock
    private ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private EventSlotReadModelService eventSlotReadModelService;
    @Mock
    private ChatsRepository chatsRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private AccessGrantsRepository accessGrantsRepository;
    @Mock
    private AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository;
    @Mock
    private AdminMenuCounterService adminMenuCounterService;
    @Mock
    private ActivityTournamentGroupCounterService tournamentGroupCounterService;
    @Mock
    private ObjectProvider<NotificationOutboxService> notificationOutboxServiceProvider;
    @Mock
    private NotificationOutboxService notificationOutboxService;
    @Mock
    private MongoTemplate mongoTemplate;

    private ActivitiesResourcesService service;
    private AccessControlService accessControlService;

    @BeforeEach
    void setUp() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setFirebaseEnabled(true);
        when(accessGrantsRepository.findAll()).thenReturn(List.of());
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(defaultPolicyDefinitions());
        accessControlService = new AccessControlService(
                accessGrantsRepository,
                accessPolicyDefinitionsRepository,
                configProperties,
                AccessPolicyTestSupport.conditionRegistry(),
                new MemberPolicyFacts(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository),
                new ChatPolicyFacts(chatsRepository, usersRepository, adminMenuCounterService));
        accessControlService.loadAccessControlCacheAtStartup();
        service = new ActivitiesResourcesService(
                activitySubEventResourcesRepository,
                activitySubEventStageRuntimeRepository,
                activityEventsRepository,
                usersRepository,
                assetsService,
                activitiesMembersServiceProvider,
                accessControlService,
                new ActivitySubEventResourceMapper(),
                eventSlotReadModelService,
                tournamentGroupCounterService,
                notificationOutboxServiceProvider,
                mongoTemplate);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void replaceRejectsAuthenticatedActorDifferentFromAssetOwner() {
        authenticateAs("u2");

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verifyNoInteractions(activitiesMembersServiceProvider);
        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceRejectsUnauthenticatedActorWhenFirebaseIsEnabled() {
        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceReturnsNullForBlankAssignmentIds() {
        authenticateAs("u1");

        assertThat(service.replace(request("", "sub-1", "u1"))).isNull();
        assertThat(service.replace(request("event-1", "", "u1"))).isNull();
        assertThat(service.replace(request("event-1", "sub-1", ""))).isNull();

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void queryStateUsesNaturalAssignmentScopeInsteadOfGeneratedRecordId() {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setRecordId("legacy-generated-record-id");
        resource.setStatus("A");
        resource.setOwnerId("event-1");
        resource.setSubEventId("sub-1");
        resource.setAssetOwnerUserId("u1");
        resource.setAssetAssignmentIds(Map.of());
        resource.setAssetSettingsByType(Map.of());
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        resource.setResourceMetricsByType(Map.of(
                "Transport", new SubEventResourceMetricRecord(1, 3, 0, 4)));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.of(resource));

        ActivitySubEventResourceStateDto state = service.queryState("event-1", "sub-1", "u1");

        assertThat(state).isNotNull();
        assertThat(state.ownerId()).isEqualTo("event-1");
        assertThat(state.subEventId()).isEqualTo("sub-1");
        assertThat(state.assetOwnerUserId()).isEqualTo("u1");
        assertThat(state.resourceMetricsByType().get("Transport").pending()).isEqualTo(3);
    }

    @Test
    void queryScopeReturnsEveryParticipantResourceStateWithoutMergingTheViewerWriteState() {
        ActivitySubEventResource first = resourceState("event-1", "sub-1", "u1");
        ActivitySubEventResource second = resourceState("event-1", "sub-1", "u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D"))
                .thenReturn(List.of(second, first));

        var scope = service.queryScope("event-1", "sub-1", "u1");

        assertThat(scope.viewerState().assetOwnerUserId()).isEqualTo("u1");
        assertThat(scope.visibleStates())
                .extracting(ActivitySubEventResourceStateDto::assetOwnerUserId)
                .containsExactly("u1", "u2");
    }

    @Test
    void queryScopeKeepsUnderReviewAssetThatAlreadyBelongsToTheGroupResourceState() {
        ActivitySubEventResource resource = resourceState("event-1", "sub-1", "u1");
        resource.setAssetAssignmentIds(Map.of("Transport", List.of("asset-1")));
        AssetDetailDto releasedAsset = assetDetail("asset-1", "Transport", "u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.of(member("event-1", "u2", "accepted")));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D"))
                .thenReturn(List.of(resource));
        when(assetsService.queryReferencedAssetDetails("u2", Set.of("asset-1")))
                .thenReturn(Map.of("asset-1", releasedAsset));

        var scope = service.queryScope("event-1", "sub-1", "u2");

        assertThat(scope.visibleStates()).singleElement().satisfies(state -> {
            assertThat(state.assetAssignmentIds()).containsEntry("Transport", List.of("asset-1"));
            assertThat(state.fallbackAssetCardsByType()).containsEntry("Transport", List.of(releasedAsset));
        });
    }

    @Test
    void querySupplyContributionsIncludesContributorDisplayFields() {
        ActivitySubEventResource resource = resourceState("event-1", "sub-1", "u1");
        resource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-u2", "u2", 2, "2026-09-04T02:01:00Z"))));
        Users contributor = new Users();
        contributor.setId("u2");
        contributor.setName("Nova Social");
        contributor.setInitials("NS");
        contributor.setGender("woman");
        contributor.setAge(27);
        contributor.setCity("Austin");
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D")).thenReturn(List.of(resource));
        when(usersRepository.findByUserIdIn(Set.of("u2"))).thenReturn(List.of(contributor));

        var page = service.querySupplyContributions(
                "event-1", "sub-1", "u1", "shared-supplies", 0, 12);

        assertThat(page.total()).isEqualTo(1);
        assertThat(page.items()).singleElement().satisfies(item -> {
            assertThat(item.userId()).isEqualTo("u2");
            assertThat(item.name()).isEqualTo("Nova Social");
            assertThat(item.initials()).isEqualTo("NS");
            assertThat(item.gender()).isEqualTo("woman");
            assertThat(item.age()).isEqualTo(27);
            assertThat(item.city()).isEqualTo("Austin");
        });
    }

    @Test
    void queryScopeLetsAcceptedEventMemberReadAnotherGroupsSharedResourceTable() {
        String groupOwnerId = "event-1:sub-1:group-b";
        ActivitySubEventResource groupResource = resourceState(groupOwnerId, "sub-1", "u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                groupOwnerId, "sub-1", "D"))
                .thenReturn(List.of(groupResource));

        var scope = service.queryScope(groupOwnerId, "sub-1", "u1");

        assertThat(scope.viewerState().assetOwnerUserId()).isEqualTo("u1");
        assertThat(scope.visibleStates())
                .extracting(ActivitySubEventResourceStateDto::assetOwnerUserId)
                .containsExactly("u2");
        verify(activitiesMembersService, never()).hasStoredOwnerMembers(anyString(), anyString());
    }

    @Test
    void markResourceTypeReadPersistsOnlyTheSelectedGroupTypeForTheCurrentUser() {
        String ownerId = "event-1:sub-1:sub-1:group:1";
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        allowGroupMember(ownerId, "u1");
        when(mongoTemplate.updateFirst(any(), any(), eq(ActivitySubEventStageRuntime.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));

        var receipt = service.markResourceTypeRead(
                new ActivitySubEventResourceReadRequestDto(ownerId, "sub-1", "Accommodation", "u1"),
                "u1");

        assertThat(receipt.resourceType()).isEqualTo("Accommodation");
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(), updateCaptor.capture(), eq(ActivitySubEventStageRuntime.class));
        Document setFields = updateCaptor.getValue().getUpdateObject().get("$set", Document.class);
        assertThat(setFields)
                .containsEntry(
                        "groupResourceReadAtByUserId.sub-1:group:1.u1.Accommodation",
                        receipt.readAtIso())
                .doesNotContainKey("groupResourceReadAtByUserId.sub-1:group:1.u1.Transport");
    }

    @Test
    void replaceKeepsEventMembershipInvariantAfterActorPolicyPasses() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceAllowsAcceptedAuthenticatedParticipant() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.empty());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo("event-1");
        assertThat(saved.assetOwnerUserId()).isEqualTo("u1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
        verify(activitySubEventResourcesRepository)
                .findByOwnerIdAndSubEventIdAndStatusNot("event-1", "sub-1", "D");
        verify(activitiesMembersService)
                .refreshSubEventParticipationProjection("event-1", "sub-1");
    }

    @Test
    void replaceAuthorizesGeneratedSlotAssignmentAgainstParentEvent() {
        authenticateAs("u1");
        String slotOwnerId = "event-1:slot:slot-1:2026-07-22T13:30:00Z";
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                slotOwnerId, "sub-1", "u1", "D")).thenReturn(Optional.empty());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request(slotOwnerId, "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo(slotOwnerId);
        verify(assetsService).queryAssignableAssetDetails("u1", "event-1", "sub-1", Set.of());
        verify(activitiesMembersService).refreshEventParticipationProjection(slotOwnerId);
    }

    @Test
    void replaceKeepsGeneratedGroupScopeButAuthorizesAgainstParentEvent() {
        authenticateAs("u1");
        String slotOwnerId = "event-1:slot:slot-1:2026-07-22T13:30:00Z";
        String groupOwnerId = slotOwnerId + ":sub-1:sub-1:group:1";
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        allowGroupMember(groupOwnerId, "u1");
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                groupOwnerId, "sub-1", "u1", "D")).thenReturn(Optional.empty());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request(groupOwnerId, "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo(groupOwnerId);
        verify(assetsService).queryAssignableAssetDetails("u1", "event-1", "sub-1", Set.of());
        verify(activitiesMembersService).refreshEventParticipationProjection(groupOwnerId);
    }

    @Test
    void replacePersistsBorrowedAssetAndReturnsCanonicalFallbackCard() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.empty());
        AssetDetailDto borrowedAsset = assetDetail("borrowed-asset", "transport", "owner-2");
        when(assetsService.queryAssignableAssetDetails(
                "u1", "event-1", "sub-1", Set.of("borrowed-asset")))
                .thenReturn(Map.of("borrowed-asset", borrowedAsset));
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event-1",
                "sub-1",
                "u1",
                Map.of("transport", List.of("borrowed-asset")),
                Map.of(),
                Map.of(),
                Map.of());

        ActivitySubEventResourceStateDto saved = service.replace(request);

        assertThat(saved.assetAssignmentIds()).containsEntry("transport", List.of("borrowed-asset"));
        assertThat(saved.fallbackAssetCardsByType()).containsEntry("transport", List.of(borrowedAsset));
    }

    @Test
    void replacePersistsCalculatedMetricsInGroupRuntimeWithinSameServiceCall() {
        authenticateAs("u1");
        String runtimeOwnerId = "event-1:slot:slot-1:2026-07-22T13:30:00Z";
        String groupId = "sub-1:group:1";
        String groupOwnerId = runtimeOwnerId + ":sub-1:" + groupId;
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        allowGroupMember(groupOwnerId, "u1");
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                groupOwnerId, "sub-1", "u1", "D")).thenReturn(Optional.empty());
        AssetDetailDto ownedAsset = assetDetail("owned-asset", "Transport", "u1");
        when(assetsService.queryAssignableAssetDetails(
                "u1", "event-1", "sub-1", Set.of("owned-asset")))
                .thenReturn(Map.of("owned-asset", ownedAsset));
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId(runtimeOwnerId, "sub-1"))
                .thenReturn(Optional.empty());
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                groupOwnerId,
                "sub-1",
                "u1",
                Map.of("Transport", List.of("owned-asset")),
                Map.of("Transport", Map.of("owned-asset", new SubEventAssignedAssetSettingsDto(
                        0, 4, 1, "u1", false, List.of()))),
                Map.of(),
                Map.of());

        ActivitySubEventResourceStateDto saved = service.replace(request);

        assertThat(saved.resourceMetricsByType().get("Transport").capacityMax()).isEqualTo(4);
        ArgumentCaptor<ActivitySubEventResource> resourceCaptor = ArgumentCaptor.forClass(
                ActivitySubEventResource.class);
        verify(activitySubEventResourcesRepository).save(resourceCaptor.capture());
        assertThat(resourceCaptor.getValue().getResourceMetricsByType().get("Transport").capacityMax())
                .isEqualTo(4);
        ArgumentCaptor<ActivitySubEventStageRuntime> runtimeCaptor = ArgumentCaptor.forClass(
                ActivitySubEventStageRuntime.class);
        verify(activitySubEventStageRuntimeRepository).save(runtimeCaptor.capture());
        ActivitySubEventStageRuntime runtime = runtimeCaptor.getValue();
        assertThat(runtime.getOwnerId()).isEqualTo(runtimeOwnerId);
        assertThat(runtime.getSubEventId()).isEqualTo("sub-1");
        assertThat(runtime.getGroupResourceMetricsByAssetOwnerId()
                .get(groupId)
                .get("u1")
                .get("Transport")
                .capacityMax()).isEqualTo(4);
        assertThat(runtime.getGroupResourceMetricsByAssetOwnerId()
                .get(groupId)
                .get("u1")
                .get("Transport")
                .pending()).isZero();
        assertThat(runtime.getGroupResourceReadAtByUserId().get(groupId).get("u1"))
                .containsOnlyKeys("Transport");
        verify(tournamentGroupCounterService).syncParent(runtimeOwnerId, "sub-1");
    }

    @Test
    void replacePersistsParticipantContributionToAnotherMembersAssignedSupplyAsset() {
        authenticateAs("u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.of(member("event-1", "u2", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(notificationOutboxServiceProvider.getIfAvailable()).thenReturn(notificationOutboxService);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("u1"),
                        6));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u2", "D")).thenReturn(Optional.empty());
        when(assetsService.queryAssignableAssetDetails(
                "u2", "event-1", "sub-1", Set.of("shared-supplies")))
                .thenReturn(Map.of());

        ActivitySubEventResource ownerResource = resourceState("event-1", "sub-1", "u1");
        ownerResource.setRecordId("owner-resource");
        ownerResource.setAssetAssignmentIds(Map.of("Supplies", List.of("shared-supplies")));
        ownerResource.setAssetSettingsByType(Map.of(
                "Supplies",
                Map.of("shared-supplies", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                        0, 6, 1, "u1", false, List.of()))));
        ownerResource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-u1", "u1", 3, "2026-09-04T02:00:00Z"))));
        ownerResource.setResourceMetricsByType(Map.of(
                "Supplies", new SubEventResourceMetricRecord(3, 0, 0, 6)));

        ActivitySubEventResource contributorResource = resourceState("event-1", "sub-1", "u2");
        contributorResource.setRecordId("contributor-resource");
        contributorResource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-u2", "u2", 2, "2026-09-04T02:01:00Z"))));
        contributorResource.setResourceMetricsByType(Map.of(
                "Supplies", new SubEventResourceMetricRecord(2, 0, 0, 0)));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D"))
                .thenReturn(List.of(ownerResource, contributorResource));
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ActivityEvent event = event("event-1", "u1", "u1");
        event.setTitle("Assignment Event");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event-1",
                "sub-1",
                "u2",
                Map.of(),
                Map.of(),
                Map.of("shared-supplies", List.of(new SubEventSupplyContributionEntryDto(
                        "entry-u2", "u2", 2, "2026-09-04T02:01:00Z"))),
                Map.of());

        ActivitySubEventResourceStateDto saved = service.replace(request);

        ArgumentCaptor<ActivitySubEventResource> resourceCaptor = ArgumentCaptor.forClass(
                ActivitySubEventResource.class);
        verify(activitySubEventResourcesRepository).save(resourceCaptor.capture());
        ActivitySubEventResource persisted = resourceCaptor.getValue();
        assertThat(persisted.getAssetAssignmentIds()).isEmpty();
        assertThat(persisted.getSupplyContributionEntriesByAssetId().get("shared-supplies"))
                .extracting(SubEventSupplyContributionEntryRecord::quantity)
                .containsExactly(2);
        assertThat(persisted.getResourceMetricsByType().get("Supplies").accepted()).isEqualTo(2);
        assertThat(persisted.getResourceMetricsByType().get("Supplies").capacityMax()).isZero();
        assertThat(saved.resourceMetricsByType().get("Supplies").accepted()).isEqualTo(5);
        assertThat(saved.resourceMetricsByType().get("Supplies").capacityMax()).isEqualTo(6);

        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        NotificationIntent notification = notificationCaptor.getValue();
        assertThat(notification.type()).isEqualTo("event-supplies-contribution-added");
        assertThat(notification.recipientUserIds()).containsExactly("u1", "u3");
        assertThat(notification.createdUser()).isEqualTo("u2");
        assertThat(notification.payload())
                .containsEntry("assetId", "shared-supplies")
                .containsEntry("contributionEntryId", "entry-u2")
                .containsEntry("contributorUserId", "u2")
                .containsEntry("quantity", "2");
    }

    @Test
    void replaceRemovesOwnSupplyContributionAndNotifiesOtherAcceptedParticipants() {
        authenticateAs("u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.of(member("event-1", "u2", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(notificationOutboxServiceProvider.getIfAvailable()).thenReturn(notificationOutboxService);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("u1"),
                        6));

        ActivitySubEventResource ownerResource = resourceState("event-1", "sub-1", "u1");
        ownerResource.setAssetAssignmentIds(Map.of("Supplies", List.of("shared-supplies")));
        ActivitySubEventResource contributorResource = resourceState("event-1", "sub-1", "u2");
        contributorResource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-u2", "u2", 2, "2026-09-04T02:01:00Z"))));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u2", "D")).thenReturn(Optional.of(contributorResource));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D")).thenReturn(List.of(ownerResource, contributorResource));
        when(assetsService.queryAssignableAssetDetails(
                "u2", "event-1", "sub-1", Set.of("shared-supplies")))
                .thenReturn(Map.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ActivityEvent event = event("event-1", "u1", "u1");
        event.setTitle("Assignment Event");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event-1",
                "sub-1",
                "u2",
                Map.of(),
                Map.of(),
                Map.of("shared-supplies", List.of()),
                Map.of());

        service.replace(request);

        ArgumentCaptor<ActivitySubEventResource> resourceCaptor = ArgumentCaptor.forClass(
                ActivitySubEventResource.class);
        verify(activitySubEventResourcesRepository).save(resourceCaptor.capture());
        assertThat(resourceCaptor.getValue().getSupplyContributionEntriesByAssetId()
                .getOrDefault("shared-supplies", List.of())).isEmpty();
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        NotificationIntent notification = notificationCaptor.getValue();
        assertThat(notification.type()).isEqualTo("event-supplies-contribution-removed");
        assertThat(notification.recipientUserIds()).containsExactly("u1", "u3");
        assertThat(notification.createdUser()).isEqualTo("u2");
        assertThat(notification.payload())
                .containsEntry("assetId", "shared-supplies")
                .containsEntry("contributionEntryId", "entry-u2")
                .containsEntry("contributorUserId", "u2")
                .containsEntry("quantity", "2");
    }

    @Test
    void replaceNotifiesOtherAcceptedParticipantsWhenSuppliesAreFirstAssignedAndContributed() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(notificationOutboxServiceProvider.getIfAvailable()).thenReturn(notificationOutboxService);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("u1"),
                        6));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.empty());
        AssetDetailDto supplies = assetDetail("shared-supplies", "Supplies", "u1", 6, List.of());
        when(assetsService.queryAssignableAssetDetails(
                "u1", "event-1", "sub-1", Set.of("shared-supplies")))
                .thenReturn(Map.of("shared-supplies", supplies));
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D")).thenReturn(List.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ActivityEvent event = event("event-1", "u1", "u1");
        event.setTitle("Assignment Event");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event-1",
                "sub-1",
                "u1",
                Map.of("Supplies", List.of("shared-supplies")),
                Map.of("Supplies", Map.of("shared-supplies", new SubEventAssignedAssetSettingsDto(
                        0, 6, 1, "u1", false, List.of()))),
                Map.of("shared-supplies", List.of(new SubEventSupplyContributionEntryDto(
                        "entry-u1", "u1", 2, "2026-09-04T02:00:00Z"))),
                Map.of());

        service.replace(request);

        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(notificationCaptor.capture());
        Map<String, NotificationIntent> notificationsByType = notificationCaptor.getAllValues().stream()
                .collect(java.util.stream.Collectors.toMap(NotificationIntent::type, notification -> notification));
        NotificationIntent openNotification = notificationsByType.get("event-supplies-open");
        assertThat(openNotification.recipientUserIds()).containsExactly("u2", "u3");
        assertThat(openNotification.payload())
                .containsEntry("assetId", "shared-supplies")
                .containsEntry("subEventId", "sub-1");
        NotificationIntent contributionNotification = notificationsByType.get("event-supplies-contribution-added");
        assertThat(contributionNotification.recipientUserIds()).containsExactly("u2", "u3");
        assertThat(contributionNotification.createdUser()).isEqualTo("u1");
        assertThat(contributionNotification.payload())
                .containsEntry("assetId", "shared-supplies")
                .containsEntry("contributionEntryId", "entry-u1")
                .containsEntry("contributorUserId", "u1")
                .containsEntry("quantity", "2");
    }

    @Test
    void refreshGroupRuntimeResourceMetricsPersistsCountAndInvalidatesOnlyChangedTypeReads() {
        String runtimeOwnerId = "event-1:slot:slot-1:2026-07-22T13:30:00Z";
        String groupId = "sub-1:group:1";
        String groupOwnerId = runtimeOwnerId + ":sub-1:" + groupId;
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setRecordId("resource-1");
        resource.setStatus("A");
        resource.setOwnerId(groupOwnerId);
        resource.setSubEventId("sub-1");
        resource.setAssetOwnerUserId("u1");
        resource.setAssetAssignmentIds(Map.of("Transport", List.of("owned-asset")));
        resource.setAssetSettingsByType(Map.of(
                "Transport",
                Map.of("owned-asset", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                        0, 8, 1, "u1", false, List.of()))));
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                groupOwnerId, "sub-1", "u1", "D")).thenReturn(Optional.of(resource));
        AssetRequestBookingDto booking = new AssetRequestBookingDto(
                groupOwnerId,
                "Group A",
                "sub-1",
                "Kickoff",
                null,
                null,
                null,
                null,
                null,
                1,
                null,
                null,
                List.of(),
                null,
                null);
        AssetDetailDto ownedAsset = releasedAssetDetail(
                "owned-asset",
                "Transport",
                "u1",
                List.of(
                        assetRequest("request-1", "member-1", booking),
                        assetRequest("request-2", "member-2", booking)));
        when(assetsService.queryReferencedAssetDetails(
                "admin", Set.of("owned-asset")))
                .thenReturn(Map.of("owned-asset", ownedAsset));
        ActivitySubEventStageRuntime existingRuntime = new ActivitySubEventStageRuntime();
        existingRuntime.setOwnerId(runtimeOwnerId);
        existingRuntime.setSubEventId("sub-1");
        existingRuntime.setGroupResourceMetricsByAssetOwnerId(Map.of(
                groupId,
                Map.of("u1", Map.of("Transport", new GroupResourceMetricRecord(0, 1, 0, 8)))));
        existingRuntime.setGroupResourceReadAtByUserId(Map.of(
                groupId,
                Map.of(
                        "u1", Map.of("Transport", "read-1", "Accommodation", "read-2"),
                        "u2", Map.of("Transport", "read-3"))));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId(runtimeOwnerId, "sub-1"))
                .thenReturn(Optional.of(existingRuntime));
        when(activitySubEventStageRuntimeRepository.save(any(ActivitySubEventStageRuntime.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, SubEventResourceMetricDto> metrics = service.refreshGroupRuntimeResourceMetrics(
                groupOwnerId,
                "sub-1",
                "u1",
                "admin");

        assertThat(metrics.get("Transport").accepted()).isZero();
        assertThat(metrics.get("Transport").pending()).isEqualTo(2);
        ArgumentCaptor<ActivitySubEventResource> resourceCaptor = ArgumentCaptor.forClass(
                ActivitySubEventResource.class);
        verify(activitySubEventResourcesRepository).save(resourceCaptor.capture());
        assertThat(resourceCaptor.getValue().getResourceMetricsByType().get("Transport").pending())
                .isEqualTo(2);
        ArgumentCaptor<ActivitySubEventStageRuntime> runtimeCaptor = ArgumentCaptor.forClass(
                ActivitySubEventStageRuntime.class);
        verify(activitySubEventStageRuntimeRepository).save(runtimeCaptor.capture());
        assertThat(runtimeCaptor.getValue().getGroupResourceMetricsByAssetOwnerId()
                .get(groupId)
                .get("u1")
                .get("Transport")
                .pending()).isEqualTo(2);
        assertThat(runtimeCaptor.getValue().getGroupResourceReadAtByUserId().get(groupId))
                .containsOnlyKeys("u1");
        assertThat(runtimeCaptor.getValue().getGroupResourceReadAtByUserId().get(groupId).get("u1"))
                .containsExactlyEntriesOf(Map.of("Accommodation", "read-2"));
        verify(tournamentGroupCounterService).syncParent(runtimeOwnerId, "sub-1");
    }

    @Test
    void refreshMainEventResourceMetricsAvoidsUnrelatedParticipationReprojection() {
        String eventId = "event-1";
        String subEventId = "main-event:event-1";
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setRecordId("resource-1");
        resource.setStatus("A");
        resource.setOwnerId(eventId);
        resource.setSubEventId(subEventId);
        resource.setAssetOwnerUserId("u1");
        resource.setAssetAssignmentIds(Map.of());
        resource.setAssetSettingsByType(Map.of());
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                eventId, subEventId, "D")).thenReturn(List.of(resource));
        when(assetsService.queryReferencedAssetDetails("u1", Set.of()))
                .thenReturn(Map.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ActivityEvent event = event(eventId, "u1", "u1");
        event.setSubEvents(List.of());
        event.setActivity(0);
        when(activityEventsRepository.findBySourceId(eventId)).thenReturn(List.of(event));

        service.refreshResourceMetricsForScope(eventId, subEventId, "u1");

        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
        verifyNoInteractions(activitiesMembersServiceProvider);
        verifyNoInteractions(activitiesMembersService);
    }

    @Test
    void updateEventCountersPersistsTheSameCommonMetricsForEveryEventViewer() {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setStatus("A");
        resource.setOwnerId("event-1");
        resource.setSubEventId("sub-1");
        resource.setAssetOwnerUserId("u1");
        resource.setAssetAssignmentIds(Map.of(
                "Transport",
                List.of("owned-1", "owned-2", "borrowed-1", "borrowed-2"),
                "Supplies",
                List.of("shared-supplies")));
        resource.setAssetSettingsByType(Map.of(
                "Transport",
                Map.of(
                        "owned-1", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                                0, 4, 1, "u1", false, List.of()),
                        "owned-2", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                                0, 4, 1, "u1", false, List.of()),
                        "borrowed-1", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                                0, 4, 2, "u1", false, List.of()),
                        "borrowed-2", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                                0, 4, 2, "u1", false, List.of())),
                "Supplies",
                Map.of("shared-supplies", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                        0, 6, 1, "u1", false, List.of()))));
        resource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-1", "u1", 2, "2026-09-04T02:00:00Z"))));
        resource.setResourceMetricsByType(Map.of(
                "Transport", new SubEventResourceMetricRecord(2, 2, 0, 24),
                "Supplies", new SubEventResourceMetricRecord(2, 0, 0, 6)));
        ActivitySubEventResource otherResource = new ActivitySubEventResource();
        otherResource.setStatus("A");
        otherResource.setOwnerId("event-1");
        otherResource.setSubEventId("sub-1");
        otherResource.setAssetOwnerUserId("u2");
        otherResource.setAssetAssignmentIds(Map.of());
        otherResource.setAssetSettingsByType(Map.of());
        otherResource.setSupplyContributionEntriesByAssetId(Map.of(
                "shared-supplies", List.of(new SubEventSupplyContributionEntryRecord(
                        "entry-2", "u2", 3, "2026-09-04T02:01:00Z"))));
        otherResource.setResourceMetricsByType(Map.of(
                "Transport", new SubEventResourceMetricRecord(1, 1, 0, 4),
                "Supplies", new SubEventResourceMetricRecord(3, 0, 0, 0)));

        SubEventItem subEvent = new SubEventItem(
                "sub-1",
                "Optional activity",
                "",
                null,
                null,
                "",
                "u1",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                16,
                0,
                16,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                16,
                0,
                0,
                0,
                0,
                null,
                null);
        ActivityEvent firstViewer = event("event-1", "u1", "u1");
        firstViewer.setSubEvents(List.of(subEvent));
        ActivityEvent secondViewer = event("event-1", "u2", "u2");
        secondViewer.setSubEvents(List.of(subEvent));

        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndStatusNot(
                "event-1", "sub-1", "D")).thenReturn(List.of(resource, otherResource));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(firstViewer, secondViewer));
        when(activityEventsRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);

        service.updateEventSubEventResourceCounters("event-1", "sub-1");

        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).hasSize(2).allSatisfy(saved ->
                assertThat(saved.getSubEvents()).singleElement().satisfies(subEvent -> {
                    assertThat(subEvent.carsAccepted()).isEqualTo(3);
                    assertThat(subEvent.carsPending()).isEqualTo(3);
                    assertThat(subEvent.carsCapacityMin()).isZero();
                    assertThat(subEvent.carsCapacityMax()).isEqualTo(28);
                    assertThat(subEvent.suppliesAccepted()).isEqualTo(5);
                    assertThat(subEvent.suppliesPending()).isZero();
                    assertThat(subEvent.suppliesCapacityMax()).isEqualTo(6);
                }));
        assertThat(savedCaptor.getValue()).allSatisfy(saved ->
                assertThat(saved.getActivity()).isEqualTo(19));
        verify(eventSlotReadModelService).refreshForChangedEvents(savedCaptor.getValue());
        verify(activitiesMembersService).refreshSubEventParticipationProjection("event-1", "sub-1");
    }

    @Test
    void replaceAllowsExplicitAssignmentGrantWithoutAcceptedEventParticipation() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "allow")));
        accessControlService.refreshAccessControlCache();
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.empty());
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.empty());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo("event-1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceAllowsEventManagerToAssignForAcceptedParticipant() {
        authenticateAs("manager");
        when(usersRepository.findByUserId("manager")).thenReturn(Optional.of(user("manager")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "host", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "manager"))
                .thenReturn(Optional.of(member("event-1", "manager", "accepted", "Manager")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted", "Member")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                "event-1", "sub-1", "u1", "D")).thenReturn(Optional.empty());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.assetOwnerUserId()).isEqualTo("u1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceRejectsExplicitAssignmentDenyBeforeSaving() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "deny")));
        accessControlService.refreshAccessControlCache();

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void cleanupReturnsEmptyWhenPolicyDeniesBeforeLoadingResources() {
        Set<String> removed = service.removeManagedResourcesForRemovedEventMembers(
                "event-1",
                List.of(member("event-1", "u1", "accepted", "Manager")),
                "manager",
                "2026-06-02T12:00:00Z");

        assertThat(removed).isEmpty();
        verify(activitySubEventResourcesRepository, never()).findByOwnerIdAndStatusNot(anyString(), anyString());
    }

    @Test
    void removingTheFinalAssignedAssetLogicallyDeletesTheResourceAndItsGroupRuntimeBucket() {
        String eventId = "event-1";
        String subEventId = "sub-1";
        String groupId = "group-1";
        String groupOwnerId = eventId + ":" + subEventId + ":" + groupId;
        ActivitySubEventResource resource = resourceState(groupOwnerId, subEventId, "u1");
        resource.setAssetAssignmentIds(Map.of("Transport", List.of("asset-1")));
        resource.setAssetSettingsByType(Map.of(
                "Transport",
                Map.of("asset-1", new ActivitySubEventResource.SubEventAssignedAssetSettingsRecord(
                        0, 4, 1, "u1", false, List.of()))));
        resource.setResourceMetricsByType(Map.of(
                "Transport", new SubEventResourceMetricRecord(1, 0, 0, 4)));

        ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
        runtime.setOwnerId(eventId);
        runtime.setSubEventId(subEventId);
        runtime.setGroupResourceMetricsByAssetOwnerId(Map.of(
                groupId,
                Map.of("u1", Map.of("Transport", new GroupResourceMetricRecord(1, 0, 0, 4)))));
        runtime.setGroupResourceReadAtByUserId(Map.of(
                groupId,
                Map.of("u2", Map.of("Transport", "2026-09-03T10:00:00Z"))));

        when(mongoTemplate.find(any(), eq(ActivitySubEventResource.class))).thenReturn(List.of(resource));
        when(assetsService.queryReferencedAssetDetails("u1", Set.of())).thenReturn(Map.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId(eventId, subEventId))
                .thenReturn(Optional.of(runtime));
        when(activitySubEventStageRuntimeRepository.save(any(ActivitySubEventStageRuntime.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.removeAssetFromResourceAssignments("asset-1", "u1");

        ArgumentCaptor<ActivitySubEventResource> resourceCaptor = ArgumentCaptor.forClass(
                ActivitySubEventResource.class);
        verify(activitySubEventResourcesRepository).save(resourceCaptor.capture());
        assertThat(resourceCaptor.getValue().getStatus()).isEqualTo("D");
        assertThat(resourceCaptor.getValue().getAssetAssignmentIds()).isEmpty();
        assertThat(resourceCaptor.getValue().getAssetSettingsByType()).isEmpty();

        ArgumentCaptor<ActivitySubEventStageRuntime> runtimeCaptor = ArgumentCaptor.forClass(
                ActivitySubEventStageRuntime.class);
        verify(activitySubEventStageRuntimeRepository).save(runtimeCaptor.capture());
        assertThat(runtimeCaptor.getValue().getGroupResourceMetricsByAssetOwnerId()).isEmpty();
        assertThat(runtimeCaptor.getValue().getGroupResourceReadAtByUserId()).isEmpty();
        verify(tournamentGroupCounterService).syncParent(eventId, subEventId);
    }

    private void authenticateAs(String userId) {
        SecurityContextHolder.getContext().setAuthentication(new FirebaseAuthenticationToken(
                new FirebasePrincipal(userId, userId + "@example.test", "U"),
                null,
                List.of(new SimpleGrantedAuthority("U"))));
    }

    private void allowGroupMember(String ownerId, String userId) {
        ActivityMember groupMember = member(ownerId, userId, "accepted");
        groupMember.setOwnerType("group");
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitiesMembersService.hasStoredOwnerMembers("group", ownerId)).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("group", ownerId, userId))
                .thenReturn(Optional.of(groupMember));
    }

    private ActivitySubEventResourceStateDto request(String ownerId, String subEventId, String assetOwnerUserId) {
        return new ActivitySubEventResourceStateDto(ownerId, subEventId, assetOwnerUserId, Map.of(), Map.of(), Map.of(), Map.of());
    }

    private ActivitySubEventResource resourceState(String ownerId, String subEventId, String assetOwnerUserId) {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setStatus("A");
        resource.setOwnerId(ownerId);
        resource.setSubEventId(subEventId);
        resource.setAssetOwnerUserId(assetOwnerUserId);
        resource.setAssetAssignmentIds(Map.of());
        resource.setAssetSettingsByType(Map.of());
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        return resource;
    }

    private ActivityMember member(String ownerId, String userId, String status) {
        return member(ownerId, userId, status, "Member");
    }

    private ActivityMember member(String ownerId, String userId, String status, String role) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus(status);
        member.setRole(role);
        return member;
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String adminUserId) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setCreatorUserId(creatorUserId);
        event.setAdmins(List.of(adminUserId));
        event.setStatus("A");
        return event;
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setUserId(userId);
        user.setStatus("A");
        user.setProfileStatus("public");
        return user;
    }

    private AssetDetailDto assetDetail(String id, String type, String ownerUserId) {
        return assetDetail(id, type, ownerUserId, List.of());
    }

    private AssetDetailDto assetDetail(
            String id,
            String type,
            String ownerUserId,
            List<AssetMemberRequestDto> requests) {
        return assetDetail(id, type, ownerUserId, 4, requests);
    }

    private AssetDetailDto assetDetail(
            String id,
            String type,
            String ownerUserId,
            int capacityTotal,
            List<AssetMemberRequestDto> requests) {
        return new AssetDetailDto(
                id,
                type,
                "Borrowed asset",
                "",
                "",
                "",
                capacityTotal,
                4,
                "",
                "",
                "",
                List.of(),
                false,
                List.of(),
                null,
                "public",
                "A",
                ownerUserId,
                "Other owner",
                requests,
                null,
                List.of());
    }

    private AssetDetailDto releasedAssetDetail(
            String id,
            String type,
            String ownerUserId,
            List<AssetMemberRequestDto> requests) {
        AssetDetailDto detail = assetDetail(id, type, ownerUserId, requests);
        return new AssetDetailDto(
                detail.id(),
                detail.type(),
                detail.title(),
                detail.subtitle(),
                detail.category(),
                detail.city(),
                detail.capacityTotal(),
                detail.quantity(),
                detail.details(),
                detail.imageUrl(),
                detail.sourceLink(),
                detail.routes(),
                detail.policiesEnabled(),
                detail.policies(),
                detail.pricing(),
                detail.visibility(),
                "UR",
                detail.ownerUserId(),
                detail.ownerName(),
                detail.requests(),
                detail.metrics(),
                detail.menuActions(),
                "2026-09-03T08:00:00Z");
    }

    private AssetMemberRequestDto assetRequest(
            String requestId,
            String userId,
            AssetRequestBookingDto booking) {
        return new AssetMemberRequestDto(
                requestId,
                userId,
                userId,
                "M",
                "unknown",
                "pending",
                "",
                "borrow",
                "2026-07-22T23:26:50Z",
                booking,
                List.of());
    }

    private List<AccessPolicyDefinition> defaultPolicyDefinitions() {
        return List.of(
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                        "resource.assign",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of()),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
                        "resource.assign",
                        "event",
                        List.of("noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow")),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                        "resource.assign.manage",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of()),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_CLEANUP,
                        "resource.assign.cleanup",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of()));
    }

    private AccessPolicyDefinition policy(
            String policyKey,
            String permission,
            String resourceType,
            List<String> required,
            List<String> anyOf) {
        AccessPolicyDefinition definition = new AccessPolicyDefinition();
        definition.setPolicyKey(policyKey);
        definition.setPermission(permission);
        definition.setResourceType(resourceType);
        definition.setRequired(required);
        definition.setAnyOf(anyOf);
        return definition;
    }

    private AccessGrant grant(String subjectUserId, String permission, String resourceType, String resourceId, String effect) {
        AccessGrant grant = new AccessGrant();
        grant.setSubjectUserId(subjectUserId);
        grant.setPermission(permission);
        grant.setResourceType(resourceType);
        grant.setResourceId(resourceId);
        grant.setEffect(effect);
        return grant;
    }
}
