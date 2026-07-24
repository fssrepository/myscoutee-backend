package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
class ActivitiesMembersServiceTest {
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private AssetsService assetsService;
    @Mock
    private ActivitiesResourcesService activitiesResourcesService;
    @Mock
    private EventParticipationTicketService eventParticipationTicketService;
    @Mock
    private EventInviteNotificationService eventInviteNotificationService;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private ChatService chatService;
    @Mock
    private EventSlotReadModelService eventSlotReadModelService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private UserActivityCountersService userActivityCountersService;
    @Mock
    private ActivityTournamentGroupCounterService tournamentGroupCounterService;

    private ActivitiesMembersService service;

    @BeforeEach
    void setUp() {
        service = new ActivitiesMembersService(
                activityMembersRepository,
                activityEventsRepository,
                activitySubEventResourcesRepository,
                usersRepository,
                homeUserProfileService,
                assetsService,
                activitiesResourcesService,
                eventParticipationTicketService,
                eventInviteNotificationService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                chatService,
                eventSlotReadModelService,
                accessControlService,
                userActivityCountersService,
                tournamentGroupCounterService);
        lenient().when(accessControlService.canCurrentActorViewEventMembers(anyString())).thenReturn(true);
        lenient().when(accessControlService.canInviteEventMembers(anyString(), anyString())).thenReturn(true);
    }

    @Test
    void disqualifyMemberKeepsVisibleRecordButRemovesAcceptedParticipation() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "accepted");
        AtomicReference<ActivityMember> storedMember = new AtomicReference<>(member);
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");
        targetUser.setInitials("TU");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canDisqualifyEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMember.set(saved);
            return saved;
        });
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(targetUser));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "disqualify",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(entry -> entry.status())
                .isEqualTo("disqualified");

        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getStatus()).isEqualTo("disqualified");
        assertThat(savedMember.getValue().getPendingSource()).isNull();
        assertThat(savedMember.getValue().getRequestKind()).isNull();

        verify(affinityRecomputeTaskService, atLeastOnce()).enqueueEventMembersChanged("event-1", "admin");
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
        verify(chatService).postSystemMessage("event-1", "Target User was disqualified from the event.", "member-disqualify");
    }

    @Test
    void disqualifyReturnsCurrentMembersWhenPolicyDenies() {
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "accepted");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canDisqualifyEventMember("event-1", "admin", "target")).thenReturn(false);
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("admin");
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(member));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "disqualify",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("accepted");
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void reinstateMemberUsesPolicyAndRestoresAcceptedParticipation() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "disqualified");
        AtomicReference<ActivityMember> storedMember = new AtomicReference<>(member);
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");
        targetUser.setInitials("TU");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canReinstateEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMember.set(saved);
            return saved;
        });
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(targetUser));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "reinstate",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("accepted");

        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getStatus()).isEqualTo("accepted");
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
        verify(chatService).postSystemMessage("event-1", "Target User was reinstated to the event.", "member-reinstate");
    }

    @Test
    void replaceEventMembersThrowsForbiddenWhenPolicyDenies() {
        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canManageEventMembers("event-1", "admin")).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.replace(new ActivityMembersReplaceRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                List.of(entry("target")),
                10,
                "admin")));

        assertThat(exception.getStatusCode().value()).isEqualTo(403);
        verify(activityMembersRepository, never()).saveAll(anyList());
    }

    @Test
    void replaceEventMembersUsesRequestActorAndPersistsAcceptedMembership() {
        ActivityEvent event = event("event-1", "admin", "admin");
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canManageEventMembers("event-1", "admin")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1")).thenReturn(List.of());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(targetUser));

        service.replace(new ActivityMembersReplaceRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                List.of(entry("target")),
                10,
                "admin"));

        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .filteredOn(member -> "target".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getOwnerType()).isEqualTo("event");
                    assertThat(member.getOwnerId()).isEqualTo("event-1");
                    assertThat(member.getStatus()).isEqualTo("accepted");
                });
    }

    @Test
    void replaceSubEventMembersRefreshesEmbeddedEventCounts() {
        String eventId = "event-1";
        String subEventId = "subevent-1";
        String ownerId = eventId + ":" + subEventId;
        ActivityEvent event = event(eventId, "admin", "admin");
        event.setSubEvents(List.of(new SubEventItem(
                subEventId,
                "Kickoff",
                "",
                "2026-07-23T13:30:00Z",
                "2026-07-23T14:15:00Z",
                "Seattle",
                "admin",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                6,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null)));
        AtomicReference<List<ActivityMember>> storedMembers = new AtomicReference<>(List.of());

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedMembers.set(saved);
            return saved;
        });
        when(activityEventsRepository.findBySourceId(eventId)).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.replace(new ActivityMembersReplaceRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                List.of(entry("target")),
                6,
                "admin",
                eventId,
                subEventId));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedEvents = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedEvents.capture());
        assertThat(savedEvents.getValue())
                .singleElement()
                .satisfies(savedEvent -> assertThat(savedEvent.getSubEvents())
                        .singleElement()
                        .satisfies(savedSubEvent -> {
                            assertThat(savedSubEvent.membersAccepted()).isEqualTo(2);
                            assertThat(savedSubEvent.membersPending()).isZero();
                        }));
        assertThat(storedMembers.get())
                .extracting(ActivityMember::getUserId)
                .containsExactlyInAnyOrder("admin", "target");
        verify(eventSlotReadModelService).refreshForChangedEvents(anyList());
    }

    @Test
    void replaceSubEventMembersCannotDirectlyRemoveItsAdmin() {
        String eventId = "event-1";
        String subEventId = "subevent-1";
        String ownerId = eventId + ":" + subEventId;
        ActivityMember admin = member("admin-sync", ownerId, "admin", "Admin", "accepted");
        admin.setOwnerType("subEvent");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenReturn(List.of(admin));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                service.replace(new ActivityMembersReplaceRequestDto(
                        new ActivityMemberOwnerRefDto("subEvent", ownerId),
                        List.of(),
                        6,
                        "admin",
                        eventId,
                        subEventId)));

        assertThat(exception.getStatusCode().value()).isEqualTo(403);
        assertThat(exception.getReason()).contains("managed step-down");
        verify(activityMembersRepository, never()).saveAll(anyList());
    }

    @Test
    void queryMembersReturnsEmptyWhenViewPolicyDenies() {
        when(accessControlService.canCurrentActorViewEventMembers("event-1")).thenReturn(false);

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1");

        assertThat(result).isEmpty();
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
        verify(activityMembersRepository, never()).findManagementOrderedByOwner(anyString(), anyString());
    }

    @Test
    void queryPendingMembersAppliesStatusInMongoRepositoryQuery() {
        ActivityMember pendingMember = member("pending-sync", "event-1", "pending-user", "Member", "pending");
        Users pendingUser = new Users();
        pendingUser.setId("pending-user");
        pendingUser.setName("Pending User");

        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatusOrderByActionAtIsoDescUserIdAsc(
                "event",
                "event-1",
                "pending"))
                .thenReturn(List.of(pendingMember));
        when(usersRepository.findByUserId("pending-user")).thenReturn(Optional.of(pendingUser));

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1", true);

        assertThat(result)
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("pending-user");
        verify(activityMembersRepository).findByOwnerTypeAndOwnerIdAndStatusOrderByActionAtIsoDescUserIdAsc(
                "event",
                "event-1",
                "pending");
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
    }

    @Test
    void queryMembersOrdersPendingFirstThenManagersThenMembersByLatestAction() {
        ActivityMember olderPending = member("pending-old", "event-1", "pending-old", "Member", "pending");
        olderPending.setActionAtIso("2026-07-23T08:00:00Z");
        ActivityMember newerPending = member("pending-new", "event-1", "pending-new", "Member", "pending");
        newerPending.setActionAtIso("2026-07-23T09:00:00Z");
        ActivityMember admin = member("admin", "event-1", "admin", "Admin", "accepted");
        admin.setActionAtIso("2026-07-23T07:00:00Z");
        ActivityMember manager = member("manager", "event-1", "manager", "Manager", "accepted");
        manager.setActionAtIso("2026-07-23T10:00:00Z");
        ActivityMember member = member("member", "event-1", "member", "Member", "accepted");
        member.setActionAtIso("2026-07-23T11:00:00Z");

        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(newerPending, olderPending, manager, admin, member));

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1");

        assertThat(result)
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("pending-new", "pending-old", "manager", "admin", "member");
        verify(activityMembersRepository).findManagementOrderedByOwner("event", "event-1");
    }

    @Test
    void queryScopedAssetPendingMembersUsesBookingScopeInsteadOfGlobalAssetMembers() {
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("owner-1");
        scopedAsset.setTitle("Scoped vehicle");
        scopedAsset.setRequests(List.of());

        when(assetsService.findAssetByAssetIdWithScopedRequests(
                "asset-1",
                "event-1",
                "subevent-1",
                "pending"))
                .thenReturn(Optional.of(scopedAsset));

        List<ActivityMemberEntryDto> result = service.queryMembers(
                "asset",
                "asset-1",
                true,
                "event-1",
                "subevent-1");

        assertThat(result).isEmpty();
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerIdAndStatus(anyString(), anyString(), anyString());
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
    }

    @Test
    void queryScopedAssetInvitationUsesMembershipStatusInsteadOfProfileStatus() {
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("owner-1");
        scopedAsset.setTitle("City-to-Lake SUV");
        scopedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "invitee-1",
                "Lucas Lane",
                "LL",
                "man",
                "pending",
                "",
                "invite",
                "2026-07-23T00:00:00Z",
                new Asset.AssetRequestBookingRecord(
                        "event-1",
                        "Seattle Wildflower Meetup",
                        "subevent-1",
                        "Kickoff",
                        "city-to-lake-suv:1",
                        "City-to-Lake SUV",
                        "Jul 23",
                        "2026-07-23T13:30:00Z",
                        "2026-07-23T14:15:00Z",
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        false))));

        Users invitee = new Users();
        invitee.setId("invitee-1");
        invitee.setUserId("invitee-1");
        invitee.setName("Lucas Lane");
        invitee.setStatusText("Waiting for admin approval.");

        when(assetsService.findAssetByAssetIdWithScopedRequests(
                "asset-1",
                "event-1",
                "subevent-1",
                null))
                .thenReturn(Optional.of(scopedAsset));
        when(usersRepository.findByUserId("owner-1")).thenReturn(Optional.empty());
        when(usersRepository.findByUserId("invitee-1")).thenReturn(Optional.of(invitee));

        List<ActivityMemberEntryDto> result = service.queryMembers(
                "asset",
                "asset-1",
                false,
                "event-1",
                "subevent-1");

        assertThat(result)
                .filteredOn(entry -> "invitee-1".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("pending");
                    assertThat(entry.pendingSource()).isEqualTo("admin");
                    assertThat(entry.requestKind()).isEqualTo("invite");
                    assertThat(entry.statusText()).isEqualTo("Invitation pending.");
                });
    }

    @Test
    void queryScopedAssetBorrowRequestShowsPendingBorrowerInsteadOfInvitation() {
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("owner-1");
        scopedAsset.setTitle("City-to-Lake SUV");
        scopedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "borrower-1",
                "Nagy Eszter",
                "NE",
                "woman",
                "pending",
                "",
                "borrow",
                "2026-07-23T18:37:00Z",
                new Asset.AssetRequestBookingRecord(
                        "event-1",
                        "Creative Nights Series",
                        "subevent-1",
                        "Kickoff",
                        "city-to-lake-suv:1",
                        "City-to-Lake SUV",
                        "Jul 23",
                        "2026-07-23T06:30:00Z",
                        "2026-07-23T07:15:00Z",
                        2,
                        40.0,
                        "USD",
                        List.of(),
                        "payment-session-1",
                        true))));

        when(assetsService.findAssetByAssetIdWithScopedRequests(
                "asset-1",
                "event-1:slot:slot-1:2026-07-23T06:30:00Z",
                "subevent-1",
                null))
                .thenReturn(Optional.of(scopedAsset));
        when(usersRepository.findByUserId("owner-1")).thenReturn(Optional.empty());
        when(usersRepository.findByUserId("borrower-1")).thenReturn(Optional.empty());

        List<ActivityMemberEntryDto> result = service.queryMembers(
                "asset",
                "asset-1",
                false,
                "event-1:slot:slot-1:2026-07-23T06:30:00Z",
                "subevent-1");

        assertThat(result)
                .filteredOn(entry -> "borrower-1".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("pending");
                    assertThat(entry.pendingSource()).isEqualTo("member");
                    assertThat(entry.requestKind()).isEqualTo("join");
                    assertThat(entry.statusText()).isEqualTo("Waiting for admin approval.");
                });
    }

    @Test
    void replaceScopedAssetMembersDelegatesOneScopedAssetMutationWithoutReplacingGlobalMembers() {
        when(homeUserProfileService.resolveSelectedUserId("borrower")).thenReturn("borrower");
        ActivityMemberEntryDto invited = entry("group-member");
        when(assetsService.canManageScopedAssetMembers(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                "borrower"))
                .thenReturn(true);
        when(assetsService.syncScopedRequestsFromMemberEntries(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                List.of(invited)))
                .thenReturn("asset-owner");

        service.replace(new ActivityMembersReplaceRequestDto(
                new ActivityMemberOwnerRefDto("asset", "asset-1"),
                List.of(invited),
                4,
                "borrower",
                "event-1:subevent-1:group-a",
                "subevent-1"));

        verify(assetsService).canManageScopedAssetMembers(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                "borrower");
        verify(assetsService).syncScopedRequestsFromMemberEntries(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                List.of(invited));
        verify(activitiesResourcesService).refreshGroupRuntimeResourceMetrics(
                "event-1:subevent-1:group-a",
                "subevent-1",
                "asset-owner",
                "borrower");
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
    }

    @Test
    void replaceScopedAssetMembersRejectsPendingBorrowerBeforeMutation() {
        when(homeUserProfileService.resolveSelectedUserId("pending-borrower")).thenReturn("pending-borrower");
        when(assetsService.canManageScopedAssetMembers(
                "asset-1",
                "event-1",
                "subevent-1",
                "pending-borrower"))
                .thenReturn(false);

        ResponseStatusException error = assertThrows(
                ResponseStatusException.class,
                () -> service.replace(new ActivityMembersReplaceRequestDto(
                        new ActivityMemberOwnerRefDto("asset", "asset-1"),
                        List.of(entry("group-member")),
                        4,
                        "pending-borrower",
                        "event-1",
                        "subevent-1")));

        assertThat(error.getStatusCode().value()).isEqualTo(403);
        verify(assetsService, never()).syncScopedRequestsFromMemberEntries(
                anyString(),
                anyString(),
                anyString(),
                anyList());
    }

    @Test
    void acceptPendingMemberUsesPolicyAndSavesAcceptedMember() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "pending");
        AtomicReference<ActivityMember> storedMember = new AtomicReference<>(member);
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canAcceptEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMember.set(saved);
            return saved;
        });
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(targetUser));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "accept",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("accepted");
        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getPendingSource()).isNull();
        assertThat(savedMember.getValue().getRequestKind()).isNull();
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
        verify(chatService).postSystemMessage("event-1", "Target User joined the event.", "member-joined");
    }

    @Test
    void acceptPendingSubEventMemberUpdatesEmbeddedCountersOnTheMutation() {
        String ownerId = "event-1:sub-1";
        ActivityMember admin = member("admin-sync", ownerId, "admin", "Admin", "accepted");
        admin.setOwnerType("subEvent");
        ActivityMember pending = member("member-sync", ownerId, "target", "Member", "pending");
        pending.setOwnerType("subEvent");
        pending.setPendingSource("member");
        pending.setRequestKind("join");
        AtomicReference<ActivityMember> storedTarget = new AtomicReference<>(pending);
        ActivityEvent event = event("event-1", "host", "admin");
        event.setSubEvents(List.of(new SubEventItem(
                "sub-1",
                "Optional activity",
                "",
                null,
                null,
                "",
                "host",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                16,
                1,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null)));

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenAnswer(invocation -> List.of(admin, storedTarget.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedTarget.set(saved);
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "admin",
                "target",
                "accept",
                null));

        assertThat(event.getSubEvents()).singleElement().satisfies(subEvent -> {
            assertThat(subEvent.membersAccepted()).isEqualTo(2);
            assertThat(subEvent.membersPending()).isZero();
        });
        verify(activityEventsRepository).saveAll(anyList());
    }

    @Test
    void invitedMemberCanAcceptOwnPendingSubEventInvitation() {
        String ownerId = "event-1:sub-1";
        ActivityMember invitation = member("invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("subEvent");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("admin");
        AtomicReference<ActivityMember> storedInvitation = new AtomicReference<>(invitation);
        ActivityEvent event = event("event-1", "admin", "admin");
        event.setSubEvents(List.of(new SubEventItem(
                "sub-1",
                "Optional activity",
                "",
                null,
                null,
                "",
                "admin",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                16,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null)));

        when(homeUserProfileService.resolveSelectedUserId("target")).thenReturn("target");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("subEvent", ownerId))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedInvitation.set(saved);
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "target",
                "target",
                "accept",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("accepted");
                    assertThat(entry.pendingSource()).isNull();
                    assertThat(entry.requestKind()).isNull();
                });
        assertThat(event.getSubEvents()).singleElement().satisfies(subEvent -> {
            assertThat(subEvent.membersAccepted()).isEqualTo(1);
            assertThat(subEvent.membersPending()).isZero();
        });
        verify(activityMembersRepository).save(any(ActivityMember.class));
        verify(activityEventsRepository).saveAll(anyList());
    }

    @Test
    void invitedMemberCanAcceptOwnPendingAssetInvitation() {
        String ownerId = "car-1";
        ActivityMember invitation = member("asset-invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("asset");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("manager");
        AtomicReference<ActivityMember> storedInvitation = new AtomicReference<>(invitation);

        when(homeUserProfileService.resolveSelectedUserId("target")).thenReturn("target");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", ownerId))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("asset", ownerId))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedInvitation.set(saved);
            return saved;
        });

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("asset", ownerId),
                "target",
                "target",
                "accept",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("accepted");
                    assertThat(entry.pendingSource()).isNull();
                    assertThat(entry.requestKind()).isNull();
                });
        verify(activityMembersRepository).save(any(ActivityMember.class));
        verify(assetsService).syncRequestsFromMembers(anyString(), anyList());
    }

    @Test
    void subEventAdminCanStepDownAndLeaveAfterAnotherManagerExists() {
        String ownerId = "event-1:sub-1";
        ActivityMember currentAdmin = member("admin-sync", ownerId, "admin", "Admin", "accepted");
        currentAdmin.setOwnerType("subEvent");
        ActivityMember successor = member("successor-sync", ownerId, "successor", "Manager", "accepted");
        successor.setOwnerType("subEvent");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(currentAdmin, successor));

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.findManagementOrderedByOwner("subEvent", ownerId))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> member.getUserId().equals(saved.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "admin",
                "admin",
                "step-down-admin",
                null));

        assertThat(storedMembers.get())
                .filteredOn(member -> "admin".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("accepted");
                    assertThat(member.getRole()).isEqualTo("Member");
                });

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "admin",
                "admin",
                "remove",
                null));

        assertThat(storedMembers.get())
                .filteredOn(member -> "admin".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("deleted");
    }

    @Test
    void acceptPendingMemberReturnsCurrentMembersWhenPolicyDenies() {
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "pending");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canAcceptEventMember("event-1", "admin", "target")).thenReturn(false);
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(member));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "accept",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("pending");
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void adminCannotAcceptInvitationBeforeInvitedMemberResponds() {
        ActivityMember invitation = member("member-sync", "event-1", "target", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canAcceptEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(invitation));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(invitation));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "accept",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("pending");
                    assertThat(entry.requestKind()).isEqualTo("invite");
                });
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void memberInvitationRequiresAdminApprovalAfterInviteeAccepts() {
        ActivityMember invitation = member("invite-sync", "event-1", "target", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        ActivityMember inviter = member("inviter-sync", "event-1", "member-inviter", "Member", "accepted");

        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(invitation));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "owner", "owner")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "member-inviter"))
                .thenReturn(Optional.of(inviter));

        assertThat(service.pendingInvitationRequiresAdminApproval("event-1", "target")).isTrue();
    }

    @Test
    void promotedAdminInvitationDoesNotRequireAnotherAdminApproval() {
        ActivityMember invitation = member("invite-sync", "event-1", "target", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("promoted-admin");
        ActivityMember inviter = member("inviter-sync", "event-1", "promoted-admin", "Admin", "accepted");

        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(invitation));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "owner", "owner")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "promoted-admin"))
                .thenReturn(Optional.of(inviter));

        assertThat(service.pendingInvitationRequiresAdminApproval("event-1", "target")).isFalse();
    }

    @Test
    void removeMemberUsesPolicyAndRunsCleanupBeforeReturningMembers() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "accepted");
        AtomicReference<ActivityMember> storedMember = new AtomicReference<>(member);
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canRemoveEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMember.set(saved);
            return saved;
        });
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(targetUser));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "remove",
                null));

        assertThat(result).isEmpty();
        ArgumentCaptor<ActivityMember> savedMember = ArgumentCaptor.forClass(ActivityMember.class);
        verify(activityMembersRepository).save(savedMember.capture());
        assertThat(savedMember.getValue().getStatus()).isEqualTo("deleted");
        verify(activitiesResourcesService).removeManagedResourcesForRemovedEventMembers(
                org.mockito.ArgumentMatchers.eq("event-1"),
                anyList(),
                org.mockito.ArgumentMatchers.eq("admin"),
                anyString());
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
        verify(chatService).postSystemMessage("event-1", "Target User left the event.", "member-left");
    }

    @Test
    void eventOwnerCannotLeaveWhenNoOtherAcceptedAdminRemains() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(owner));

        var result = service.removeEventParticipation("event-1", "owner", "owner");

        assertThat(result.acceptedMemberUserIds()).contains("owner");
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void eventOwnerCanLeaveFromMemberCardAndTransfersOwnershipToAnotherAcceptedAdmin() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        owner.setCreatedDate("2026-01-01T08:00:00Z");
        ActivityMember successor = member("successor-sync", "event-1", "successor", "Admin", "accepted");
        successor.setCreatedDate("2026-02-01T08:00:00Z");
        AtomicReference<List<ActivityMember>> storedMembers = new AtomicReference<>(List.of(owner, successor));
        Users successorUser = new Users();
        successorUser.setId("successor");
        successorUser.setName("Successor Admin");
        successorUser.setInitials("SA");
        successorUser.setGender("man");
        successorUser.setCity("Seattle");

        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> member.getUserId().equals(saved.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });
        when(usersRepository.findByUserId("successor")).thenReturn(Optional.of(successorUser));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "owner",
                "owner",
                "remove",
                null));

        assertThat(result)
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("successor");
        assertThat(event.getOwnerUserId()).isEqualTo("successor");
        assertThat(event.getCreatorUserId()).isEqualTo("successor");
        assertThat(event.getCreatorName()).isEqualTo("Successor Admin");
        assertThat(event.getAdmins()).containsExactly("successor");
        assertThat(storedMembers.get())
                .filteredOn(member -> "owner".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("deleted");
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
    }

    @Test
    void promotedAdminCanLeaveWhileTheOwnerRemainsAdmin() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember promotedAdmin = member("admin-sync", "event-1", "promoted-admin", "Admin", "accepted");
        AtomicReference<List<ActivityMember>> storedMembers = new AtomicReference<>(List.of(owner, promotedAdmin));

        when(homeUserProfileService.resolveSelectedUserId("promoted-admin")).thenReturn("promoted-admin");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> member.getUserId().equals(saved.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "promoted-admin",
                "promoted-admin",
                "remove",
                null));

        assertThat(event.getCreatorUserId()).isEqualTo("owner");
        assertThat(storedMembers.get())
                .filteredOn(member -> "promoted-admin".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("deleted");
    }

    @Test
    void eventOwnerCanRemoveAPromotedAdminEvenWhenNormalRemovalPolicyProtectsAdmins() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember admin = member("admin-sync", "event-1", "promoted-admin", "Admin", "accepted");
        AtomicReference<ActivityMember> storedAdmin = new AtomicReference<>(admin);
        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        when(accessControlService.canRemoveEventMember("event-1", "owner", "promoted-admin")).thenReturn(false);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event", "event-1", "promoted-admin")).thenReturn(Optional.of(admin));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedAdmin.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedAdmin.set(saved);
            return saved;
        });

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "owner",
                "promoted-admin",
                "remove",
                null));

        assertThat(storedAdmin.get().getStatus()).isEqualTo("deleted");
        verify(activityMembersRepository).save(any(ActivityMember.class));
    }

    @Test
    void promotedAdminCanStepDownWithoutLeavingTheEvent() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember admin = member("admin-sync", "event-1", "promoted-admin", "Admin", "accepted");
        AtomicReference<ActivityMember> storedAdmin = new AtomicReference<>(admin);
        when(homeUserProfileService.resolveSelectedUserId("promoted-admin")).thenReturn("promoted-admin");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event", "event-1", "promoted-admin")).thenReturn(Optional.of(admin));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedAdmin.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedAdmin.set(saved);
            return saved;
        });

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "promoted-admin",
                "promoted-admin",
                "step-down-admin",
                null));

        assertThat(storedAdmin.get().getStatus()).isEqualTo("accepted");
        assertThat(storedAdmin.get().getRole()).isEqualTo("Member");
    }

    @Test
    void inviteUsersReturnsEmptyWhenPolicyDenies() {
        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canInviteEventMembers("event-1", "admin")).thenReturn(false);

        List<String> result = service.inviteUsers("event-1", "admin", List.of("target"), event("event-1", "host", "admin"));

        assertThat(result).isEmpty();
        verify(activityMembersRepository, never()).saveAll(anyList());
    }

    @Test
    void inviteUsersUsesPolicyAndSavesPendingInvites() {
        ActivityEvent event = event("event-1", "host", "admin");
        event.setLocation("Bratislava");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canInviteEventMembers("event-1", "admin")).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1")).thenReturn(List.of());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<String> result = service.inviteUsers("event-1", "admin", List.of("target"), event);

        assertThat(result).containsExactly("target");
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved -> {
            assertThat(saved.getStatus()).isEqualTo("pending");
            assertThat(saved.getPendingSource()).isEqualTo("admin");
            assertThat(saved.getRequestKind()).isEqualTo("invite");
            assertThat(saved.getInvitedByUserId()).isEqualTo("admin");
        });
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String adminUserId) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + "-document");
        event.setSourceId(sourceId);
        event.setOwnerUserId(creatorUserId);
        event.setCreatorUserId(creatorUserId);
        event.setStatus("A");
        event.setAdmins(List.of(adminUserId));
        event.setCapacityTotal(10);
        return event;
    }

    private ActivityMember member(String syncKey, String ownerId, String userId, String role, String status) {
        ActivityMember member = new ActivityMember();
        member.setId(syncKey + "-document");
        member.setSyncKey(syncKey);
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setRole(role);
        member.setStatus(status);
        member.setActionAtIso("2026-05-12T10:00:00Z");
        member.setMetAtIso("2026-05-12T10:00:00Z");
        member.setCreatedDate("2026-05-12T10:00:00Z");
        member.setCreatedUser("host");
        member.setUpdatedDate("2026-05-12T10:00:00Z");
        member.setUpdatedUser("host");
        return member;
    }

    private ActivityMemberEntryDto entry(String userId) {
        return new ActivityMemberEntryDto(
                null,
                userId,
                userId,
                "TU",
                "man",
                "",
                "",
                "Member",
                "accepted",
                null,
                null,
                null,
                false,
                "2026-05-12T10:00:00Z",
                "2026-05-12T10:00:00Z",
                "",
                null,
                null,
                List.of());
    }
}
