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
                userActivityCountersService);
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
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
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
    void queryMembersReturnsEmptyWhenViewPolicyDenies() {
        when(accessControlService.canCurrentActorViewEventMembers("event-1")).thenReturn(false);

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1");

        assertThat(result).isEmpty();
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
    }

    @Test
    void queryPendingMembersAppliesStatusInMongoRepositoryQuery() {
        ActivityMember pendingMember = member("pending-sync", "event-1", "pending-user", "Member", "pending");
        Users pendingUser = new Users();
        pendingUser.setId("pending-user");
        pendingUser.setName("Pending User");

        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatus("event", "event-1", "pending"))
                .thenReturn(List.of(pendingMember));
        when(usersRepository.findByUserId("pending-user")).thenReturn(Optional.of(pendingUser));

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1", true);

        assertThat(result)
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("pending-user");
        verify(activityMembersRepository).findByOwnerTypeAndOwnerIdAndStatus("event", "event-1", "pending");
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
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
        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        ActivityMemberEntryDto invited = entry("group-member");
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
                "admin",
                "event-1:subevent-1:group-a",
                "subevent-1"));

        verify(assetsService).syncScopedRequestsFromMemberEntries(
                "asset-1",
                "event-1:subevent-1:group-a",
                "subevent-1",
                List.of(invited));
        verify(activitiesResourcesService).refreshGroupRuntimeResourceMetrics(
                "event-1:subevent-1:group-a",
                "subevent-1",
                "asset-owner",
                "admin");
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityMembersRepository, never()).findByOwnerTypeAndOwnerId(anyString(), anyString());
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
    void acceptPendingMemberReturnsCurrentMembersWhenPolicyDenies() {
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "pending");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canAcceptEventMember("event-1", "admin", "target")).thenReturn(false);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
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
