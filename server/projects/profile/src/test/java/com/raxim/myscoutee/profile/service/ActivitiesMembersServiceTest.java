package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersInviteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivityMemberMapper;

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
    private EventCheckoutBasketService eventCheckoutBasketService;
    @Mock
    private PaymentService paymentService;
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
    private final ActivityMemberMapper activityMemberMapper = new ActivityMemberMapper();

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
                eventCheckoutBasketService,
                paymentService,
                eventInviteNotificationService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                chatService,
                eventSlotReadModelService,
                accessControlService,
                userActivityCountersService,
                tournamentGroupCounterService,
                activityMemberMapper);
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
    void ensureEventCreatorAdminMembershipMaterializesCanonicalOwnerWithoutChangingPendingInvites() {
        ActivityEvent event = event("event-1", "host", "host");
        ActivityMember nova = member("nova-sync", "event-1", "nova", "Member", "pending");
        nova.setPendingSource("admin");
        nova.setRequestKind("invite");
        nova.setInvitedByUserId("host");
        ActivityMember riley = member("riley-sync", "event-1", "riley", "Member", "pending");
        riley.setPendingSource("admin");
        riley.setRequestKind("invite");
        riley.setInvitedByUserId("host");
        AtomicReference<List<ActivityMember>> storedMembers = new AtomicReference<>(List.of(nova, riley));

        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            @SuppressWarnings("unchecked")
            List<ActivityMember> saved = invocation.getArgument(0);
            Map<String, ActivityMember> nextByUserId = new LinkedHashMap<>();
            storedMembers.get().forEach(member -> nextByUserId.put(member.getUserId(), member));
            saved.forEach(member -> nextByUserId.put(member.getUserId(), member));
            storedMembers.set(List.copyOf(nextByUserId.values()));
            return saved;
        });
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        ActivitiesMembersService.OwnerMembersSnapshot first =
                service.ensureEventCreatorAdminMembership("event-1", "host");
        ActivitiesMembersService.OwnerMembersSnapshot second =
                service.ensureEventCreatorAdminMembership("event-1", "host");

        assertThat(first.mutationApplied()).isTrue();
        assertThat(second.mutationApplied()).isFalse();
        assertThat(second.acceptedMemberUserIds()).containsExactly("host");
        assertThat(second.pendingMemberUserIds()).containsExactly("nova", "riley");
        assertThat(second.adminUserIds()).containsExactly("host");
        assertThat(storedMembers.get()).hasSize(3);
        assertThat(storedMembers.get()).filteredOn(member -> "host".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getRole()).isEqualTo("Admin");
                    assertThat(member.getStatus()).isEqualTo("accepted");
                    assertThat(member.getPendingSource()).isNull();
                    assertThat(member.getRequestKind()).isNull();
                    assertThat(member.getInvitedByUserId()).isNull();
                });
        verify(activityMembersRepository, times(1)).saveAll(anyList());
        verify(activityEventsRepository, times(1)).saveAll(anyList());
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
    void actionContextReturnsCanonicalCountersForTheResolvedActor() {
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "accepted");
        UserMenuCountersDto counters = mock(UserMenuCountersDto.class);

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canDisqualifyEventMember("event-1", "admin", "target")).thenReturn(false);
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(member));
        when(homeUserProfileService.queryMenuCounters("admin")).thenReturn(counters);

        var result = service.applyActionWithContext(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "admin",
                "target",
                "disqualify",
                null));

        assertThat(result.members())
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("accepted");
        assertThat(result.counterOverrides()).isSameAs(counters);
        verify(homeUserProfileService).queryMenuCounters("admin");
    }

    @Test
    void approvingAJoinRequestCannotConsumeReservedOrFullCapacity() {
        ActivityEvent event = event("event-1", "host", "admin");
        event.setCapacityTotal(2);
        ActivityMember accepted =
                member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember reserved =
                member("reserved-sync", "event-1", "reserved-user", "Member", "pending");
        reserved.setPendingSource("admin");
        reserved.setRequestKind("invite");
        ActivityMember joinRequest =
                member("join-sync", "event-1", "target", "Member", "pending");
        joinRequest.setPendingSource("member");
        joinRequest.setRequestKind("join");
        List<ActivityMember> stored = List.of(accepted, reserved, joinRequest);

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canAcceptEventMember("event-1", "admin", "target"))
                .thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(stored);
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(stored);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

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
        verify(affinityRecomputeTaskService, never())
                .enqueueEventMembersChanged(anyString(), anyString());
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
    void acceptedEventMemberCanOnlyAddPendingInvitations() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember inviter = member("inviter-sync", "event-1", "member-inviter", "Member", "accepted");

        when(homeUserProfileService.resolveSelectedUserId("member-inviter")).thenReturn("member-inviter");
        when(accessControlService.canManageEventMembers("event-1", "member-inviter")).thenReturn(false);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(inviter));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.replace(new ActivityMembersReplaceRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                List.of(
                        entry("member-inviter"),
                        invitationEntry("target", "member-inviter")),
                10,
                "member-inviter"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .filteredOn(member -> "target".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("pending");
                    assertThat(member.getPendingSource()).isEqualTo("admin");
                    assertThat(member.getRequestKind()).isEqualTo("invite");
                    assertThat(member.getInvitedByUserId()).isEqualTo("member-inviter");
                });
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
    void replaceEventMembersRejectsAcceptedMembershipBeyondCapacity() {
        ActivityEvent event = event("event-1", "admin", "admin");
        event.setCapacityTotal(2);

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canManageEventMembers("event-1", "admin")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.replace(new ActivityMembersReplaceRequestDto(
                        new ActivityMemberOwnerRefDto("event", "event-1"),
                        List.of(entry("target-1"), entry("target-2")),
                        10,
                        "admin")));

        assertThat(exception.getStatusCode().value()).isEqualTo(409);
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(affinityRecomputeTaskService, never())
                .enqueueEventMembersChanged(anyString(), anyString());
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
    void parentEventViewerCanReadMaterializedTournamentRoomMembers() {
        String parentEventId = "event-1";
        String subEventId = "stage-1";
        String roomId = "random-room:event-1:stage-1:stage-1:group:1";
        ActivityEvent room = event(roomId, "system", "system");
        room.setEventType("tournament-room");
        ActivityMember roomMember = member("room-member-sync", roomId, "member-1", "Member", "accepted");
        when(accessControlService.canCurrentActorViewEventMembers(roomId)).thenReturn(false);
        when(accessControlService.canCurrentActorViewEventMembers(parentEventId)).thenReturn(true);
        when(activityEventsRepository.findBySourceId(roomId)).thenReturn(List.of(room));
        when(activityMembersRepository.findManagementOrderedByOwner("event", roomId))
                .thenReturn(List.of(roomMember));

        List<ActivityMemberEntryDto> result = service.queryMembers(
                "event",
                roomId,
                false,
                parentEventId,
                subEventId);

        assertThat(result).extracting(ActivityMemberEntryDto::userId).containsExactly("member-1");
    }

    @Test
    void memberQueriesAndSnapshotsHideSuppressedParticipationRows() {
        ActivityMember visible = member("visible-sync", "event-1", "visible", "Member", "accepted");
        ActivityMember suppressed = suppressedMember(
                member("suppressed-sync", "event-1", "suppressed", "Member", "accepted"),
                "accepted",
                "event-1");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("visible");
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(visible, suppressed));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(visible, suppressed));

        assertThat(service.queryMembers("event", "event-1"))
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("visible");
        assertThat(service.queryOwnerSnapshot("event", "event-1").acceptedMemberUserIds())
                .containsExactly("visible");
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
    void queryScopedAssetMemberUsesPersistedAssetManagerRole() {
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("owner-1");
        scopedAsset.setTitle("City-to-Lake SUV");
        scopedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "manager-1",
                "Asset Manager",
                "AM",
                "woman",
                "accepted",
                "Promoted to asset manager.",
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
        ActivityMember storedManager = member("asset-manager-sync", "asset-1", "manager-1", "Manager", "accepted");
        storedManager.setActionAtIso("2026-07-23T01:00:00Z");
        storedManager.setUpdatedDate("2026-07-23T01:00:00Z");
        storedManager.setManagerGrantedByUserId("manager-grantor");

        when(assetsService.findAssetByAssetIdWithScopedRequests(
                "asset-1",
                "event-1",
                "subevent-1",
                null))
                .thenReturn(Optional.of(scopedAsset));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(storedManager));
        when(usersRepository.findByUserId("owner-1")).thenReturn(Optional.empty());
        when(usersRepository.findByUserId("manager-1")).thenReturn(Optional.empty());

        List<ActivityMemberEntryDto> result = service.queryMembers(
                "asset",
                "asset-1",
                false,
                "event-1",
                "subevent-1");

        assertThat(result)
                .filteredOn(entry -> "manager-1".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.role()).isEqualTo("Manager");
                    assertThat(entry.status()).isEqualTo("accepted");
                    assertThat(entry.revision()).isEqualTo("2026-07-23T01:00:00Z");
                    assertThat(entry.managerGrantedByUserId()).isEqualTo("manager-grantor");
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
                List.of(invited),
                "borrower"))
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
                List.of(invited),
                "borrower");
        verifyNoInteractions(activitiesResourcesService);
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
                anyList(),
                anyString());
    }

    @Test
    void assetOwnerCanDeleteScopedInvitationAfterReloadWithoutPersistedInviterMetadata() {
        String eventId = "event-1";
        String subEventId = "main-event:event-1";
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("asset-owner");
        scopedAsset.setTitle("Owner transport");
        scopedAsset.setStatus("A");
        scopedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "target",
                "Target User",
                "TU",
                "woman",
                "pending",
                "Awaiting invitation response.",
                "invite",
                "2026-09-01T08:00:00Z",
                new Asset.AssetRequestBookingRecord(
                        eventId,
                        "Event",
                        subEventId,
                        "Event",
                        subEventId,
                        "Event",
                        null,
                        null,
                        null,
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        null))));
        Asset clearedAsset = new Asset();
        clearedAsset.setAssetId("asset-1");
        clearedAsset.setOwnerUserId("asset-owner");
        clearedAsset.setTitle("Owner transport");
        clearedAsset.setStatus("A");
        clearedAsset.setRequests(List.of());

        when(homeUserProfileService.resolveSelectedUserId("asset-owner")).thenReturn("asset-owner");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("asset-owner");
        when(assetsService.findAssetByAssetId("asset-1")).thenReturn(Optional.of(scopedAsset));
        when(assetsService.findAssetByAssetIdWithScopedRequests("asset-1", eventId, subEventId, null))
                .thenReturn(Optional.of(scopedAsset), Optional.of(clearedAsset));
        when(assetsService.syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                anyList(),
                eq("asset-owner")))
                .thenReturn("asset-owner");

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("asset", "asset-1"),
                "asset-owner",
                "target",
                "remove",
                null,
                eventId,
                subEventId));

        assertThat(result).noneMatch(entry -> "target".equals(entry.userId()));
        verify(assetsService).syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                argThat(entries -> entries.stream().noneMatch(entry -> "target".equals(entry.userId()))),
                eq("asset-owner"));
        verify(affinityRecomputeTaskService, never())
                .enqueueAssetRequestsChanged(anyString(), anyString());
    }

    @Test
    void assetOwnerCanRemoveAcceptedScopedAssetManager() {
        String eventId = "event-1";
        String subEventId = "subevent-1";
        Asset scopedAsset = new Asset();
        scopedAsset.setAssetId("asset-1");
        scopedAsset.setOwnerUserId("asset-owner");
        scopedAsset.setTitle("Owner transport");
        scopedAsset.setStatus("A");
        scopedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "manager-1",
                "Asset Manager",
                "AM",
                "woman",
                "accepted",
                "Promoted to asset manager.",
                "invite",
                "2026-09-03T08:00:00Z",
                new Asset.AssetRequestBookingRecord(
                        eventId,
                        "Event",
                        subEventId,
                        "Stage",
                        subEventId,
                        "Stage",
                        null,
                        null,
                        null,
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        null))));
        Asset clearedAsset = new Asset();
        clearedAsset.setAssetId("asset-1");
        clearedAsset.setOwnerUserId("asset-owner");
        clearedAsset.setTitle("Owner transport");
        clearedAsset.setStatus("A");
        clearedAsset.setRequests(List.of());
        ActivityMember storedManager = member(
                "asset-manager-sync",
                "asset-1",
                "manager-1",
                "Manager",
                "accepted");

        when(homeUserProfileService.resolveSelectedUserId("asset-owner")).thenReturn("asset-owner");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("asset-owner");
        when(assetsService.findAssetByAssetId("asset-1")).thenReturn(Optional.of(scopedAsset));
        when(assetsService.findAssetByAssetIdWithScopedRequests("asset-1", eventId, subEventId, null))
                .thenReturn(Optional.of(scopedAsset), Optional.of(clearedAsset));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", "asset-1"))
                .thenReturn(List.of(storedManager));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "manager-1"))
                .thenReturn(Optional.of(storedManager));
        when(assetsService.syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                anyList(),
                eq("asset-owner")))
                .thenReturn("asset-owner");

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("asset", "asset-1"),
                "asset-owner",
                "manager-1",
                "remove",
                null,
                eventId,
                subEventId));

        assertThat(result).noneMatch(entry -> "manager-1".equals(entry.userId()));
        verify(assetsService).syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                argThat(entries -> entries.stream().noneMatch(entry -> "manager-1".equals(entry.userId()))),
                eq("asset-owner"));
        verify(activityMembersRepository).delete(storedManager);
    }

    @Test
    void inviteeCanAcceptScopedAssetInvitationAfterReloadWithoutPersistedInviterMetadata() {
        String eventId = "event-1:subevent-1:group-a";
        String subEventId = "subevent-1";
        Asset pendingAsset = new Asset();
        pendingAsset.setAssetId("asset-1");
        pendingAsset.setOwnerUserId("asset-owner");
        pendingAsset.setTitle("Group transport");
        pendingAsset.setStatus("A");
        pendingAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "invitee",
                "Invited User",
                "IU",
                "woman",
                "pending",
                "Awaiting invitation response.",
                "invite",
                "2026-09-03T08:00:00Z",
                new Asset.AssetRequestBookingRecord(
                        eventId,
                        "Tournament",
                        subEventId,
                        "Group stage",
                        "group-a",
                        "Group A",
                        null,
                        null,
                        null,
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        null))));
        Asset acceptedAsset = new Asset();
        acceptedAsset.setAssetId("asset-1");
        acceptedAsset.setOwnerUserId("asset-owner");
        acceptedAsset.setTitle("Group transport");
        acceptedAsset.setStatus("A");
        acceptedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "invitee",
                "Invited User",
                "IU",
                "woman",
                "accepted",
                "Approved and synced with the plan.",
                "invite",
                "2026-09-03T08:00:00Z",
                pendingAsset.getRequests().getFirst().booking())));

        when(homeUserProfileService.resolveSelectedUserId("invitee")).thenReturn("invitee");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("invitee");
        when(assetsService.findAssetByAssetId("asset-1")).thenReturn(Optional.of(pendingAsset));
        when(assetsService.findAssetByAssetIdWithScopedRequests("asset-1", eventId, subEventId, null))
                .thenReturn(Optional.of(pendingAsset), Optional.of(acceptedAsset));
        when(assetsService.syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                anyList(),
                eq("invitee")))
                .thenReturn("asset-owner");

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("asset", "asset-1"),
                "invitee",
                "invitee",
                "accept",
                null,
                eventId,
                subEventId));

        assertThat(result)
                .filteredOn(entry -> "invitee".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("accepted");
                    assertThat(entry.pendingSource()).isNull();
                    assertThat(entry.requestKind()).isNull();
                });
        verify(assetsService).syncScopedRequestsFromMemberEntries(
                eq("asset-1"),
                eq(eventId),
                eq(subEventId),
                argThat(entries -> entries.stream().anyMatch(entry ->
                        "invitee".equals(entry.userId())
                                && "accepted".equals(entry.status())
                                && entry.pendingSource() == null
                                && entry.requestKind() == null)),
                eq("invitee"));
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void acceptedScopedAssetMemberCannotRemoveSelf() {
        String eventId = "event-1:subevent-1:group-a";
        String subEventId = "subevent-1";
        Asset acceptedAsset = new Asset();
        acceptedAsset.setAssetId("asset-1");
        acceptedAsset.setOwnerUserId("asset-owner");
        acceptedAsset.setTitle("Group transport");
        acceptedAsset.setStatus("A");
        acceptedAsset.setRequests(List.of(new Asset.AssetRequestRecord(
                "request-1",
                "member-1",
                "Accepted Member",
                "AM",
                "man",
                "accepted",
                "Approved and synced with the plan.",
                "borrow",
                "2026-09-03T08:00:00Z",
                new Asset.AssetRequestBookingRecord(
                        eventId,
                        "Tournament",
                        subEventId,
                        "Group stage",
                        "group-a",
                        "Group A",
                        null,
                        null,
                        null,
                        1,
                        null,
                        null,
                        List.of(),
                        null,
                        null))));

        when(homeUserProfileService.resolveSelectedUserId("member-1")).thenReturn("member-1");
        when(assetsService.findAssetByAssetId("asset-1")).thenReturn(Optional.of(acceptedAsset));
        when(assetsService.findAssetByAssetIdWithScopedRequests("asset-1", eventId, subEventId, null))
                .thenReturn(Optional.of(acceptedAsset));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("asset", "asset-1"),
                "member-1",
                "member-1",
                "remove",
                null,
                eventId,
                subEventId));

        assertThat(result)
                .filteredOn(entry -> "member-1".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("accepted");
        verify(assetsService, never()).syncScopedRequestsFromMemberEntries(
                anyString(),
                anyString(),
                anyString(),
                anyList(),
                anyString());
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
        InOrder terminalAcceptance = inOrder(
                eventCheckoutBasketService,
                paymentService,
                eventParticipationTicketService);
        terminalAcceptance.verify(eventCheckoutBasketService)
                .finalizeAcceptedReservation("target", "event-1");
        terminalAcceptance.verify(paymentService)
                .finalizePendingEventJoin("target", "event-1");
        terminalAcceptance.verify(eventParticipationTicketService)
                .syncParticipationTicketsForEvent("event-1");
        verify(chatService).ensureMainEventChat(event, List.of("target"));
        verify(chatService).postSystemMessage("event-1", "Target User joined the event.", "member-joined");
        verify(eventInviteNotificationService).notifyMemberApproved(
                eq(event),
                eq("target"),
                anyString(),
                eq("admin"));
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
    void memberInvitationRequiresChildManagerApprovalAfterInviteeAccepts() {
        String eventId = "event-1";
        String subEventId = "sub-1";
        String ownerId = eventId + ":" + subEventId;
        ActivityMember invitation = member("invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("subEvent");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        ActivityMember inviter = member("inviter-sync", ownerId, "member-inviter", "Member", "accepted");
        inviter.setOwnerType("subEvent");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(invitation, inviter));
        ActivityEvent event = event(eventId, "owner", "owner");

        when(homeUserProfileService.resolveSelectedUserId(any())).thenAnswer(invocation -> invocation.getArgument(0));
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
        when(activityEventsRepository.findBySourceId(eventId)).thenReturn(List.of(event));

        var inviteeResult = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "target",
                "target",
                "accept",
                null,
                eventId,
                subEventId));

        assertThat(inviteeResult)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("pending");
                    assertThat(entry.pendingSource()).isEqualTo("member");
                    assertThat(entry.requestKind()).isEqualTo("approval");
                    assertThat(entry.invitedByUserId()).isEqualTo("member-inviter");
                });

        var managerResult = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "owner",
                "target",
                "accept",
                null,
                eventId,
                subEventId));

        assertThat(managerResult)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .satisfies(entry -> {
                    assertThat(entry.status()).isEqualTo("accepted");
                    assertThat(entry.pendingSource()).isNull();
                    assertThat(entry.requestKind()).isNull();
                });
    }

    @Test
    void childMemberCanWithdrawOwnPendingApprovalRequest() {
        String ownerId = "event-1:sub-1";
        ActivityMember approval = member("approval-sync", ownerId, "target", "Member", "pending");
        approval.setOwnerType("subEvent");
        approval.setPendingSource("member");
        approval.setRequestKind("approval");
        approval.setInvitedByUserId("member-inviter");
        AtomicReference<ActivityMember> storedApproval = new AtomicReference<>(approval);

        when(homeUserProfileService.resolveSelectedUserId("target")).thenReturn("target");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenAnswer(invocation -> List.of(storedApproval.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("subEvent", ownerId))
                .thenAnswer(invocation -> List.of(storedApproval.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedApproval.set(saved);
            return saved;
        });

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "target",
                "target",
                "remove",
                null));

        assertThat(result).noneMatch(entry -> "target".equals(entry.userId()));
        assertThat(storedApproval.get().getStatus()).isEqualTo("deleted");
    }

    @Test
    void unrelatedChildMemberCannotDeleteAnotherMembersInvitation() {
        String ownerId = "event-1:sub-1";
        ActivityMember invitation = member("invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("subEvent");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        ActivityMember unrelatedMember = member("other-sync", ownerId, "other-member", "Member", "accepted");
        unrelatedMember.setOwnerType("subEvent");

        when(homeUserProfileService.resolveSelectedUserId("other-member")).thenReturn("other-member");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("subEvent", ownerId))
                .thenReturn(List.of(invitation, unrelatedMember));
        when(activityMembersRepository.findManagementOrderedByOwner("subEvent", ownerId))
                .thenReturn(List.of(invitation, unrelatedMember));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "other-member",
                "target",
                "remove",
                null));

        assertThat(result)
                .filteredOn(entry -> "target".equals(entry.userId()))
                .singleElement()
                .extracting(ActivityMemberEntryDto::status)
                .isEqualTo("pending");
        verify(activityMembersRepository, never()).save(any(ActivityMember.class));
    }

    @Test
    void inviteeCanRejectChildInvitationAndItDisappearsFromMemberQuery() {
        String ownerId = "event-1:sub-1";
        ActivityMember invitation = member("invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("subEvent");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        AtomicReference<ActivityMember> storedInvitation = new AtomicReference<>(invitation);

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

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "target",
                "target",
                "remove",
                null));

        assertThat(result).noneMatch(entry -> "target".equals(entry.userId()));
        assertThat(storedInvitation.get().getStatus()).isEqualTo("deleted");
    }

    @Test
    void onlyInviterCanCancelUnansweredChildInvitation() {
        String ownerId = "event-1:sub-1";
        ActivityMember invitation = member("invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("subEvent");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        ActivityMember inviter = member("inviter-sync", ownerId, "member-inviter", "Member", "accepted");
        inviter.setOwnerType("subEvent");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(invitation, inviter));

        when(homeUserProfileService.resolveSelectedUserId("member-inviter")).thenReturn("member-inviter");
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

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("subEvent", ownerId),
                "member-inviter",
                "target",
                "remove",
                null));

        assertThat(result).noneMatch(entry -> "target".equals(entry.userId()));
        assertThat(storedMembers.get())
                .filteredOn(member -> "target".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("deleted");
    }

    @Test
    void invitedMemberCanAcceptOwnPendingAssetInvitation() {
        String ownerId = "car-1";
        ActivityMember invitation = member("asset-invite-sync", ownerId, "target", "Member", "pending");
        invitation.setOwnerType("asset");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("manager");
        ActivityMember manager = member("asset-manager-sync", ownerId, "manager", "Manager", "accepted");
        manager.setOwnerType("asset");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(invitation, manager));

        when(homeUserProfileService.resolveSelectedUserId("target")).thenReturn("target");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("asset", ownerId))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.findManagementOrderedByOwner("asset", ownerId))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> member.getUserId().equals(saved.getUserId()) ? saved : member)
                    .toList());
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
    void eventMemberCanCancelInvitationTheySentAndRefreshDependentModelsWithoutTickets() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember invitation = member("invite-sync", "event-1", "target", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        AtomicReference<ActivityMember> storedInvitation = new AtomicReference<>(invitation);

        when(homeUserProfileService.resolveSelectedUserId("member-inviter")).thenReturn("member-inviter");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("member-inviter");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenAnswer(invocation -> Optional.of(storedInvitation.get()));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedInvitation.get()));
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedInvitation.set(saved);
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "member-inviter",
                "target",
                "remove",
                null));

        assertThat(result).isEmpty();
        assertThat(storedInvitation.get().getStatus()).isEqualTo("deleted");
        verify(accessControlService, never()).canRemoveEventMember("event-1", "member-inviter", "target");
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(eventParticipationTicketService, never()).syncParticipationTicketForUser(anyString(), anyString());
        verify(eventSlotReadModelService).refreshForChangedEvents(anyList());
        verify(affinityRecomputeTaskService).enqueueEventMembersChanged("event-1", "system");
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("target"));
        InOrder cancellationOrder = inOrder(
                userActivityCountersService,
                eventInviteNotificationService);
        cancellationOrder.verify(userActivityCountersService)
                .refreshEventCountersForUsers(List.of("target"));
        cancellationOrder.verify(eventInviteNotificationService)
                .markInvitationResolved("event-1", "target");
    }

    @Test
    void cancellingPendingEventInvitationPromotesTheOldestWaitlistMemberIntoTheReleasedSeat() {
        ActivityEvent event = event("event-1", "owner", "owner");
        event.setCapacityTotal(3);
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember accepted = member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember invitation = member("invite-sync", "event-1", "target", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("owner");
        ActivityMember waiting = waitlistMember("wait-sync", "waiting-user");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(owner, accepted, invitation, waiting));

        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("owner");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event", "event-1", "target"))
                .thenAnswer(invocation -> storedMembers.get().stream()
                        .filter(member -> "target".equals(member.getUserId()))
                        .findFirst());
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> saved.getUserId().equals(member.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getUserId().equals(next.getUserId()))
                            .findFirst()
                            .orElse(member))
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "owner",
                "target",
                "remove",
                null));

        assertThat(storedMembers.get())
                .filteredOn(member -> "target".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("deleted");
        assertThat(storedMembers.get())
                .filteredOn(member -> "waiting-user".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("pending");
                    assertThat(member.getPendingSource()).isEqualTo("admin");
                    assertThat(member.getRequestKind()).isEqualTo("waitlist-invite");
                    assertThat(member.getInvitedByUserId()).isEqualTo("owner");
                });
        verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("waiting-user"),
                "owner");
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("waiting-user"));
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("target"));
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(eventParticipationTicketService, never()).syncParticipationTicketForUser(anyString(), anyString());
    }

    @Test
    void removeMemberUsesPolicyAndRunsCleanupBeforeReturningMembers() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityEvent room = event("room-1", "system", "system");
        room.setParentEventId("event-1");
        room.setGenerated(true);
        room.setEventType("tournament-room");
        ActivityEvent unaffectedRoom = event("room-2", "system", "system");
        unaffectedRoom.setParentEventId("event-1");
        unaffectedRoom.setGenerated(true);
        unaffectedRoom.setEventType("tournament-room");
        ActivityMember member = member("member-sync", "event-1", "target", "Member", "accepted");
        ActivityMember roomTarget = member("room-target-sync", "room-1", "target", "Member", "accepted");
        ActivityMember roomParticipant = member(
                "room-participant-sync",
                "room-1",
                "room-participant",
                "Member",
                "accepted");
        ActivityMember unaffectedRoomParticipant = member(
                "unaffected-room-participant-sync",
                "room-2",
                "unaffected-room-participant",
                "Member",
                "accepted");
        AtomicReference<ActivityMember> storedMember = new AtomicReference<>(member);
        AtomicReference<List<ActivityMember>> storedRoomMembers =
                new AtomicReference<>(List.of(roomTarget, roomParticipant, unaffectedRoomParticipant));
        Users targetUser = new Users();
        targetUser.setId("target");
        targetUser.setName("Target User");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canRemoveEventMember("event-1", "admin", "target")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.findByParentEventIdIn(List.of("event-1")))
                .thenReturn(List.of(room, unaffectedRoom));
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(room, unaffectedRoom));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> List.of(storedMember.get()));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "room-1"))
                .thenAnswer(invocation -> storedRoomMembers.get().stream()
                        .filter(stored -> "room-1".equals(stored.getOwnerId()))
                        .toList());
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "room-2"))
                .thenAnswer(invocation -> storedRoomMembers.get().stream()
                        .filter(stored -> "room-2".equals(stored.getOwnerId()))
                        .toList());
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any()))
                .thenAnswer(invocation -> storedRoomMembers.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            storedMember.set(saved);
            return saved;
        });
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedRoomMembers.set(storedRoomMembers.get().stream()
                    .map(existing -> saved.stream()
                            .filter(next -> existing.getUserId().equals(next.getUserId()))
                            .findFirst()
                            .orElse(existing))
                    .toList());
            return saved;
        });
        when(activitySubEventResourcesRepository.findByOwnerIdInAndStatusNot(any(), anyString()))
                .thenReturn(List.of());
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
        verify(chatService).postSystemMessage(
                "event-1",
                "Target User was removed from the event.",
                "member-removed");
        verify(chatService).ensureMainEventChat(room, List.of("room-participant"));
        verify(chatService).postSystemMessage(
                "room-1",
                "Target User was removed from the tournament group.",
                "member-removed");
        verify(chatService).ensureMainEventChat(unaffectedRoom, List.of("unaffected-room-participant"));
        verify(chatService, never()).postSystemMessage(
                eq("room-2"),
                anyString(),
                anyString());
        verify(eventInviteNotificationService).notifyEventMemberRemoved(
                eq(event),
                eq("target"),
                eq("Target User"),
                anyString(),
                eq("admin"),
                eq(List.of()));
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
        verify(activityMembersRepository, never()).saveAll(anyList());
    }

    @Test
    void acceptedEventManagerCanLeaveWithoutMemberModerationPermission() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember manager = member("manager-sync", "event-1", "manager", "Manager", "accepted");
        AtomicReference<List<ActivityMember>> storedMembers =
                new AtomicReference<>(List.of(owner, manager));

        when(homeUserProfileService.resolveSelectedUserId("manager")).thenReturn("manager");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("manager");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getUserId().equals(next.getUserId()))
                            .findFirst()
                            .orElse(member))
                    .toList());
            return saved;
        });

        var result = service.applyAction(new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                "manager",
                "manager",
                "remove",
                null));

        assertThat(result)
                .extracting(ActivityMemberEntryDto::userId)
                .containsExactly("owner");
        assertThat(storedMembers.get())
                .filteredOn(member -> "manager".equals(member.getUserId()))
                .singleElement()
                .extracting(ActivityMember::getStatus)
                .isEqualTo("suppressed");
        assertThat(storedMembers.get())
                .filteredOn(member -> "manager".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatusBeforeSuppression()).isEqualTo("accepted");
                    assertThat(member.getSuppressionRootOwnerId()).isEqualTo("event-1");
                    assertThat(member.getSuppressedAtIso()).isNotBlank();
                });
        verify(accessControlService, never()).canRemoveEventMember(anyString(), anyString(), anyString());
        verify(eventParticipationTicketService).syncParticipationTicketForUser("event-1", "manager");
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("manager"));
    }

    @Test
    void selfLeaveSuppressesTheParticipationTreeAndCreatesViewerTrashOverlays() {
        ActivityEvent rootEvent = event("event-1", "owner", "owner");
        ActivityEvent slotEvent = event("event-1:slot:morning", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember root = member("root-sync", "event-1", "viewer", "Member", "accepted");
        ActivityMember slot = member(
                "slot-sync",
                "event-1:slot:morning",
                "viewer",
                "Member",
                "accepted");
        ActivityMember subEvent = member(
                "sub-sync",
                "event-1:slot:morning:sub-1",
                "viewer",
                "Member",
                "pending");
        subEvent.setOwnerType("subEvent");
        subEvent.setPendingSource("member");
        subEvent.setRequestKind("join");
        ActivityMember group = member(
                "accepted-group-sync",
                "event-1:slot:morning:sub-1:group:1",
                "viewer",
                "Member",
                "accepted");
        group.setOwnerType("group");
        ActivityMember disqualifiedGroup = member(
                "group-sync",
                "event-1:slot:morning:sub-1:group:2",
                "viewer",
                "Member",
                "disqualified");
        disqualifiedGroup.setOwnerType("group");
        ActivityMember deletedGroup = member(
                "deleted-group-sync",
                "event-1:slot:morning:sub-1:group:3",
                "viewer",
                "Member",
                "deleted");
        deletedGroup.setOwnerType("group");
        AtomicReference<List<ActivityMember>> rootMembers =
                new AtomicReference<>(List.of(owner, root));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> rootMembers.get());
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(
                        List.of(root, slot, subEvent, group, disqualifiedGroup, deletedGroup));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            rootMembers.set(rootMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getId().equals(next.getId()))
                            .findFirst()
                            .orElse(member))
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(rootEvent));
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(rootEvent, slotEvent));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.suppressEventParticipationTree("event-1", "viewer", "viewer");

        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .extracting(ActivityMember::getId)
                .containsExactlyInAnyOrder(
                        root.getId(),
                        slot.getId(),
                        subEvent.getId(),
                        group.getId(),
                        disqualifiedGroup.getId());
        assertThat(savedMembers.getValue()).allSatisfy(member -> {
            assertThat(member.getStatus()).isEqualTo("suppressed");
            assertThat(member.getSuppressionRootOwnerId()).isEqualTo("event-1");
            assertThat(member.getSuppressedAtIso()).isNotBlank();
        });
        assertThat(savedMembers.getValue())
                .filteredOn(member -> subEvent.getId().equals(member.getId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatusBeforeSuppression()).isEqualTo("pending");
                    assertThat(member.getPendingSource()).isEqualTo("member");
                    assertThat(member.getRequestKind()).isEqualTo("join");
        });
        assertThat(savedMembers.getValue())
                .filteredOn(member -> disqualifiedGroup.getId().equals(member.getId()))
                .singleElement()
                .extracting(ActivityMember::getStatusBeforeSuppression)
                .isEqualTo("disqualified");
        assertThat(deletedGroup.getStatus()).isEqualTo("deleted");

        ArgumentCaptor<List<ActivityEvent>> savedEvents = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository, atLeastOnce()).saveAll(savedEvents.capture());
        assertThat(savedEvents.getAllValues()).anySatisfy(batch ->
                assertThat(batch)
                        .filteredOn(document -> "viewer".equals(document.getOwnerUserId())
                                && ActivityEvent.STATUS_TRASHED.equals(document.getStatus()))
                        .extracting(ActivityEvent::getSourceId)
                        .containsExactlyInAnyOrder("event-1", "event-1:slot:morning"));
        verify(eventParticipationTicketService).syncParticipationTicketForUser("event-1", "viewer");
        verify(eventParticipationTicketService).syncParticipationTicketForUser(
                "event-1:slot:morning",
                "viewer");
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("viewer"));
        verify(tournamentGroupCounterService).syncParent("event-1:slot:morning", "sub-1");
    }

    @Test
    void rejectingOwnEventInvitationMarksItsNotificationResolved() {
        ActivityEvent rootEvent = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember invitation = member(
                "invite-sync",
                "event-1",
                "viewer",
                "Member",
                "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("owner");
        AtomicReference<List<ActivityMember>> rootMembers =
                new AtomicReference<>(List.of(owner, invitation));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> rootMembers.get());
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(invitation));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            rootMembers.set(rootMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getId().equals(next.getId()))
                            .findFirst()
                            .orElse(member))
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(rootEvent));
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(rootEvent));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.suppressEventParticipationTree("event-1", "viewer", "viewer");

        InOrder resolutionOrder = inOrder(
                userActivityCountersService,
                eventInviteNotificationService);
        resolutionOrder.verify(userActivityCountersService)
                .refreshEventCountersForUsers(List.of("viewer"));
        resolutionOrder.verify(eventInviteNotificationService)
                .markInvitationResolved("event-1", "viewer");
    }

    @Test
    void restoreParticipationTreeRestoresOnlyMatchingSuppressionAndViewerTrashOverlays() {
        ActivityEvent rootCanonical = event("event-1", "owner", "owner");
        ActivityEvent slotCanonical = event("event-1:slot:morning", "owner", "owner");
        ActivityEvent rootOverlay = event("event-1", "owner", "owner");
        rootOverlay.setId("event-1-viewer-overlay");
        rootOverlay.setOwnerUserId("viewer");
        rootOverlay.setStatus(ActivityEvent.STATUS_TRASHED);
        rootOverlay.setStatusBeforeSuppression(ActivityEvent.STATUS_ACTIVE);
        ActivityEvent slotOverlay = event("event-1:slot:morning", "owner", "owner");
        slotOverlay.setId("event-1-slot-viewer-overlay");
        slotOverlay.setOwnerUserId("viewer");
        slotOverlay.setStatus(ActivityEvent.STATUS_TRASHED);
        slotOverlay.setStatusBeforeSuppression(ActivityEvent.STATUS_ACTIVE);
        AtomicReference<List<ActivityEvent>> eventDocuments = new AtomicReference<>(
                List.of(rootCanonical, rootOverlay, slotCanonical, slotOverlay));

        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember root = suppressedMember(
                member("root-sync", "event-1", "viewer", "Member", "accepted"),
                "accepted",
                "event-1");
        ActivityMember slot = suppressedMember(
                member("slot-sync", "event-1:slot:morning", "viewer", "Member", "accepted"),
                "I",
                "event-1");
        ActivityMember subEvent = suppressedMember(
                member("sub-sync", "event-1:slot:morning:sub-1", "viewer", "Member", "accepted"),
                "pending",
                "event-1");
        subEvent.setOwnerType("subEvent");
        subEvent.setPendingSource("member");
        subEvent.setRequestKind("join");
        ActivityMember disqualifiedGroup = suppressedMember(
                member(
                        "group-sync",
                        "event-1:slot:morning:sub-1:group-1",
                        "viewer",
                        "Member",
                        "accepted"),
                "disqualified",
                "event-1");
        disqualifiedGroup.setOwnerType("group");
        ActivityMember differentRoot = suppressedMember(
                member("other-sync", "event-1:other", "viewer", "Member", "accepted"),
                "accepted",
                "other-event");
        differentRoot.setOwnerType("group");
        AtomicReference<List<ActivityMember>> rootMembers =
                new AtomicReference<>(List.of(owner, root));

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> rootMembers.get());
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(root, slot, subEvent, disqualifiedGroup, differentRoot));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            rootMembers.set(rootMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getId().equals(next.getId()))
                            .findFirst()
                            .orElse(member))
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceIdIn(any())).thenAnswer(invocation -> eventDocuments.get());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> saved = invocation.getArgument(0);
            Map<String, ActivityEvent> merged = eventDocuments.get().stream()
                    .collect(java.util.stream.Collectors.toMap(
                            ActivityEvent::getId,
                            document -> document,
                            (left, right) -> right,
                            LinkedHashMap::new));
            saved.forEach(document -> merged.put(document.getId(), document));
            eventDocuments.set(List.copyOf(merged.values()));
            return saved;
        });

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isTrue();
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .extracting(ActivityMember::getStatus)
                .containsExactlyInAnyOrder("accepted", "I", "pending", "disqualified");
        assertThat(savedMembers.getValue()).allSatisfy(member -> {
            assertThat(member.getStatusBeforeSuppression()).isNull();
            assertThat(member.getSuppressionRootOwnerId()).isNull();
            assertThat(member.getSuppressedAtIso()).isNull();
        });
        assertThat(differentRoot.getStatus()).isEqualTo("suppressed");

        ArgumentCaptor<List<ActivityEvent>> savedEvents = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository, atLeastOnce()).saveAll(savedEvents.capture());
        assertThat(savedEvents.getAllValues()).anySatisfy(batch ->
                assertThat(batch)
                        .filteredOn(document -> "viewer".equals(document.getOwnerUserId())
                                && ActivityEvent.STATUS_ACTIVE.equals(document.getStatus()))
                        .extracting(ActivityEvent::getSourceId)
                        .containsExactlyInAnyOrder("event-1", "event-1:slot:morning"));
        assertThat(eventDocuments.get())
                .filteredOn(document -> "viewer".equals(document.getOwnerUserId()))
                .allSatisfy(document -> assertThat(document.getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE));
        verify(eventParticipationTicketService).syncParticipationTicketForUser("event-1", "viewer");
        verify(eventParticipationTicketService).syncParticipationTicketForUser(
                "event-1:slot:morning",
                "viewer");
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("viewer"));
    }

    @Test
    void restoreDoesNotReviveLegacyDeletedMembershipWithoutViewerTrashOverlay() {
        ActivityMember legacyDeleted = member(
                "legacy-sync",
                "event-1",
                "viewer",
                "Member",
                "deleted");
        legacyDeleted.setUpdatedUser("viewer");
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(legacyDeleted));

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isFalse();
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void restoreDoesNotReactivateViewerTrashOverlayWithoutSuppressedRoot() {
        ActivityMember activeRoot =
                member("root-sync", "event-1", "viewer", "Member", "accepted");
        ActivityEvent canonical = event("event-1", "owner", "owner");
        ActivityEvent viewerOverlay = event("event-1", "owner", "owner");
        viewerOverlay.setId("event-1-viewer-overlay");
        viewerOverlay.setOwnerUserId("viewer");
        viewerOverlay.setStatus(ActivityEvent.STATUS_TRASHED);
        viewerOverlay.setStatusBeforeSuppression(ActivityEvent.STATUS_ACTIVE);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(activeRoot));
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(activeRoot));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(canonical, viewerOverlay));

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isFalse();
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void restoreRepairsLegacyInvitationTrashOverlayWithoutChangingMembership() {
        ActivityMember invitedRoot =
                member("root-sync", "event-1", "viewer", "Member", "pending");
        invitedRoot.setPendingSource("admin");
        invitedRoot.setRequestKind("invite");
        ActivityEvent canonical = event("event-1", "owner", "owner");
        ActivityEvent viewerOverlay = event("event-1", "owner", "owner");
        viewerOverlay.setId("event-1-viewer-overlay");
        viewerOverlay.setOwnerUserId("viewer");
        viewerOverlay.setStatus(ActivityEvent.STATUS_TRASHED);
        viewerOverlay.setStatusBeforeSuppression(null);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(invitedRoot));
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(invitedRoot));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(canonical, viewerOverlay));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isTrue();
        assertThat(invitedRoot.getStatus()).isEqualTo("pending");
        verify(activityMembersRepository, never()).saveAll(anyList());
        ArgumentCaptor<List<ActivityEvent>> savedEvents = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository, atLeastOnce()).saveAll(savedEvents.capture());
        assertThat(savedEvents.getAllValues()).anySatisfy(batch ->
                assertThat(batch).anySatisfy(savedOverlay -> {
                    assertThat(savedOverlay.getId()).isEqualTo(viewerOverlay.getId());
                    assertThat(savedOverlay.getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
                    assertThat(savedOverlay.getStatusBeforeSuppression()).isNull();
                }));
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("viewer"));
    }

    @Test
    void restoreDoesNotReviveParticipationWhileCanonicalEventIsTrashed() {
        ActivityMember suppressedRoot = suppressedMember(
                member("root-sync", "event-1", "viewer", "Member", "accepted"),
                "accepted",
                "event-1");
        ActivityEvent canonical = event("event-1", "owner", "owner");
        canonical.setStatus(ActivityEvent.STATUS_TRASHED);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(suppressedRoot));
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(suppressedRoot));
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(canonical));

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isFalse();
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void restoreDoesNotOverbookAnAcceptedParticipationAfterSeatWasFilled() {
        ActivityMember owner =
                member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember suppressedRoot = suppressedMember(
                member("root-sync", "event-1", "viewer", "Member", "accepted"),
                "accepted",
                "event-1");
        ActivityEvent canonical = event("event-1", "owner", "owner");
        canonical.setCapacityTotal(1);

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(owner, suppressedRoot));
        when(activityMembersRepository.findParticipationTreeForUser(
                org.mockito.ArgumentMatchers.eq("viewer"),
                org.mockito.ArgumentMatchers.eq("event-1"),
                any(),
                anyString())).thenReturn(List.of(suppressedRoot));
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(canonical));

        boolean restored = service.restoreEventParticipationTree("event-1", "viewer", "viewer");

        assertThat(restored).isFalse();
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(activityEventsRepository, never()).saveAll(anyList());
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
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getUserId().equals(next.getUserId()))
                            .findFirst()
                            .orElse(member))
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
                .isEqualTo("suppressed");
        verify(eventParticipationTicketService).syncParticipationTicketForUser("event-1", "owner");
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
    }

    @Test
    void promotedAdminCanLeaveWhileTheOwnerRemainsAdmin() {
        ActivityEvent event = event("event-1", "owner", "owner");
        ActivityMember owner = member("owner-sync", "event-1", "owner", "Admin", "accepted");
        ActivityMember promotedAdmin = member("admin-sync", "event-1", "promoted-admin", "Admin", "accepted");
        AtomicReference<List<ActivityMember>> storedMembers = new AtomicReference<>(List.of(owner, promotedAdmin));

        when(homeUserProfileService.resolveSelectedUserId("promoted-admin")).thenReturn("promoted-admin");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> storedMembers.get());
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityMember> saved = invocation.getArgument(0);
            storedMembers.set(storedMembers.get().stream()
                    .map(member -> saved.stream()
                            .filter(next -> member.getUserId().equals(next.getUserId()))
                            .findFirst()
                            .orElse(member))
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
                .isEqualTo("suppressed");
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
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(eventSlotReadModelService, never()).refreshForChangedEvents(anyList());
        verify(affinityRecomputeTaskService, never()).enqueueEventMembersChanged(anyString(), anyString());
        verify(userActivityCountersService).refreshEventCountersForUsers(List.of("target"));
    }

    @Test
    void inviteUsersDoesNotReserveMoreSeatsThanTheEventCapacity() {
        ActivityEvent event = event("event-1", "host", "admin");
        event.setCapacityTotal(2);
        ActivityMember accepted =
                member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canInviteEventMembers("event-1", "admin")).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(accepted));
        when(activityMembersRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        List<String> result = service.inviteUsers(
                "event-1",
                "admin",
                List.of("first-invite", "second-invite"),
                event);

        assertThat(result).containsExactly("first-invite");
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedCaptor =
                ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue())
                .extracting(ActivityMember::getUserId)
                .containsExactly("first-invite");
    }

    @Test
    void confirmedJoinUsesExistingInvitationsAsReservedCapacity() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(2);
        ActivityMember accepted =
                member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember reserved =
                member("reserved-sync", "event-1", "reserved-user", "Member", "pending");
        reserved.setPendingSource("admin");
        reserved.setRequestKind("invite");
        AtomicReference<List<ActivityMember>> stored =
                new AtomicReference<>(List.of(accepted, reserved));
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer");

        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> stored.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            List<ActivityMember> next = new java.util.ArrayList<>(stored.get());
            next.removeIf(member -> saved.getUserId().equals(member.getUserId()));
            next.add(saved);
            stored.set(List.copyOf(next));
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        service.requestJoin("event-1", viewer, event, true, false, false);

        assertThat(stored.get())
                .filteredOn(member -> "viewer".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("pending");
                    assertThat(member.getPendingSource()).isEqualTo("member");
                    assertThat(member.getRequestKind()).isEqualTo("waitlist");
                });
    }

    @Test
    void inviteeCanAcceptTheSeatAlreadyReservedForThem() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setBlindMode("Blind Event");
        event.setCapacityTotal(2);
        ActivityMember accepted =
                member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember ownInvitation =
                member("invite-sync", "event-1", "viewer", "Member", "pending");
        ownInvitation.setPendingSource("admin");
        ownInvitation.setRequestKind("invite");
        ownInvitation.setInvitedByUserId("host");
        AtomicReference<List<ActivityMember>> stored =
                new AtomicReference<>(List.of(accepted, ownInvitation));
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer");

        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> stored.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            stored.set(stored.get().stream()
                    .map(member -> saved.getUserId().equals(member.getUserId())
                            ? saved
                            : member)
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(viewer));

        service.requestJoin("event-1", viewer, event, true, false, false);

        assertThat(stored.get())
                .filteredOn(member -> "viewer".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("accepted");
                    assertThat(member.getPendingSource()).isNull();
                    assertThat(member.getRequestKind()).isNull();
                });
        verify(chatService).ensureMainEventChat(event, List.of("accepted-user", "viewer"));
        verify(chatService).postSystemMessage("event-1", "Viewer joined the event.", "member-joined");
        verify(eventInviteNotificationService).markInvitationResolved("event-1", "viewer");
        verify(eventInviteNotificationService).notifyInvitationAccepted(
                event,
                "viewer",
                "Viewer",
                stored.get().stream()
                        .filter(member -> "viewer".equals(member.getUserId()))
                        .findFirst()
                        .orElseThrow()
                        .getActionAtIso(),
                List.of("host"));
    }

    @Test
    void inviteeResponseRequiringAdminApprovalReportsTheAppliedMutation() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(8);
        ActivityMember host =
                member("host-sync", "event-1", "host", "Admin", "accepted");
        ActivityMember invitation =
                member("invite-sync", "event-1", "viewer", "Member", "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("member-inviter");
        AtomicReference<List<ActivityMember>> stored =
                new AtomicReference<>(List.of(host, invitation));
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer");

        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenAnswer(invocation -> stored.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            stored.set(stored.get().stream()
                    .map(member -> saved.getUserId().equals(member.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitiesMembersService.OwnerMembersSnapshot result =
                service.requestJoin("event-1", viewer, event, false, false, true);

        assertThat(result.mutationApplied()).isTrue();
        assertThat(result.invitedMemberUserIds()).doesNotContain("viewer");
        assertThat(result.pendingRequestMemberUserIds()).containsExactly("viewer");
        assertThat(stored.get())
                .filteredOn(member -> "viewer".equals(member.getUserId()))
                .singleElement()
                .satisfies(member -> {
                    assertThat(member.getStatus()).isEqualTo("pending");
                    assertThat(member.getPendingSource()).isEqualTo("member");
                    assertThat(member.getRequestKind()).isEqualTo("approval");
                    assertThat(member.getInvitedByUserId()).isNull();
                });
    }

    @Test
    void openEventAcceptanceNotifiesVisibleAcceptedAndPendingMembersButNotTheActor() {
        assertThat(acceptInvitationAndCaptureRecipients("Open Event"))
                .containsExactly("host", "accepted-user", "pending-observer");
    }

    @Test
    void blindEventAcceptanceNotifiesManagersButNotHiddenOrdinaryMembersOrTheActor() {
        assertThat(acceptInvitationAndCaptureRecipients("Blind Event"))
                .containsExactly("host");
    }

    @Test
    void inviteEventMembersNotifiesOnlyNewlyPersistedInvitees() {
        ActivityEvent event = event("event-1", "host", "admin");
        ActivityMember existingInvite = member("existing-sync", "event-1", "existing", "Member", "pending");
        existingInvite.setRequestKind("invite");

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canInviteEventMembers("event-1", "admin")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(List.of(existingInvite));
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(List.of(existingInvite));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.inviteEventMembers(new ActivityMembersInviteRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                List.of("existing", "new-user"),
                "admin"));

        assertThat(result.invitedUserIds()).containsExactly("new-user");
        assertThat(result.rejections())
                .singleElement()
                .satisfies(rejection -> {
                    assertThat(rejection.userId()).isEqualTo("existing");
                    assertThat(rejection.reason()).isEqualTo("already-member");
                });

        verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("new-user"),
                "admin");
        InOrder invitationOrder = inOrder(
                activityMembersRepository,
                userActivityCountersService,
                eventInviteNotificationService);
        invitationOrder.verify(activityMembersRepository).saveAll(anyList());
        invitationOrder.verify(userActivityCountersService)
                .refreshEventCountersForUsers(List.of("new-user"));
        invitationOrder.verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("new-user"),
                "admin");
    }

    @Test
    void inviteEventMembersReportsReservedCapacityRejectionWithoutWriteArtifacts() {
        ActivityEvent event = event("event-1", "host", "admin");
        event.setCapacityTotal(2);
        ActivityMember accepted = member("accepted-sync", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember reservedInvite = member("reserved-sync", "event-1", "reserved-user", "Member", "pending");
        reservedInvite.setPendingSource("admin");
        reservedInvite.setRequestKind("invite");
        List<ActivityMember> existing = List.of(accepted, reservedInvite);

        when(homeUserProfileService.resolveSelectedUserId("admin")).thenReturn("admin");
        when(accessControlService.canInviteEventMembers("event-1", "admin")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(existing);
        when(activityMembersRepository.findManagementOrderedByOwner("event", "event-1"))
                .thenReturn(existing);

        var result = service.inviteEventMembers(new ActivityMembersInviteRequestDto(
                new ActivityMemberOwnerRefDto("event", "event-1"),
                List.of("new-user"),
                "admin"));

        assertThat(result.invitedUserIds()).isEmpty();
        assertThat(result.rejections())
                .singleElement()
                .satisfies(rejection -> {
                    assertThat(rejection.userId()).isEqualTo("new-user");
                    assertThat(rejection.reason()).isEqualTo("capacity-full");
                });
        verify(activityMembersRepository, never()).saveAll(anyList());
        verify(userActivityCountersService, never()).refreshEventCountersForUsers(anyList());
        verify(eventInviteNotificationService).notifyInvitees(event, List.of(), "admin");
    }

    @Test
    void waitlistSweepPromotesOnlyCapacityNotReservedByExistingInvitations() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(4);
        ActivityMember accepted = member("accepted", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember reservedInvite = member("reserved", "event-1", "reserved-user", "Member", "pending");
        reservedInvite.setPendingSource("admin");
        reservedInvite.setRequestKind("invite");
        ActivityMember waiting1 = waitlistMember("waiting-1", "wait-1");
        ActivityMember waiting2 = waitlistMember("waiting-2", "wait-2");
        ActivityMember waiting3 = waitlistMember("waiting-3", "wait-3");
        ActivityMember waiting4 = waitlistMember("waiting-4", "wait-4");
        List<ActivityMember> stored = List.of(
                accepted,
                reservedInvite,
                waiting1,
                waiting2,
                waiting3,
                waiting4);

        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist"))
                .thenReturn(List.of(waiting1, waiting2, waiting3, waiting4));
        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist-invite"))
                .thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(stored);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        int promoted = service.sweepEventWaitlists();

        assertThat(promoted).isEqualTo(2);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .extracting(ActivityMember::getUserId)
                .containsExactly("wait-1", "wait-2");
        assertThat(savedMembers.getValue()).allSatisfy(member -> {
            assertThat(member.getStatus()).isEqualTo("pending");
            assertThat(member.getRequestKind()).isEqualTo("waitlist-invite");
        });
        verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("wait-1", "wait-2"),
                "host");
        InOrder invitationOrder = inOrder(
                activityMembersRepository,
                activityEventsRepository,
                userActivityCountersService,
                eventInviteNotificationService);
        invitationOrder.verify(activityMembersRepository).saveAll(anyList());
        invitationOrder.verify(activityEventsRepository).saveAll(anyList());
        invitationOrder.verify(userActivityCountersService)
                .refreshEventCountersForUsers(List.of("wait-1", "wait-2"));
        invitationOrder.verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("wait-1", "wait-2"),
                "host");
    }

    @Test
    void waitlistSweepUsesMembershipIdWhenLegacyRowsHaveEqualDatesAndNoSyncKey() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(3);
        ActivityMember accepted = member(
                "accepted",
                "event-1",
                "accepted-user",
                "Member",
                "accepted");
        ActivityMember waitingA = waitlistMember("legacy-a", "wait-a");
        ActivityMember waitingB = waitlistMember("legacy-b", "wait-b");
        ActivityMember waitingC = waitlistMember("legacy-c", "wait-c");
        waitingA.setId("membership-a");
        waitingB.setId("membership-b");
        waitingC.setId("membership-c");
        waitingA.setSyncKey(null);
        waitingB.setSyncKey(null);
        waitingC.setSyncKey(null);
        List<ActivityMember> stored = List.of(
                accepted,
                waitingC,
                waitingB,
                waitingA);

        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist"))
                .thenReturn(List.of(waitingC, waitingB, waitingA));
        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist-invite"))
                .thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(stored);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        int promoted = service.sweepEventWaitlists();

        assertThat(promoted).isEqualTo(2);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue())
                .extracting(ActivityMember::getUserId)
                .containsExactly("wait-a", "wait-b");
    }

    @Test
    void waitlistSweepDemotesOnlyNewestExcessWaitlistInvitation() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(3);
        ActivityMember accepted = member("accepted", "event-1", "accepted-user", "Member", "accepted");
        ActivityMember reservedInvite = member("reserved", "event-1", "reserved-user", "Member", "pending");
        reservedInvite.setPendingSource("admin");
        reservedInvite.setRequestKind("invite");
        ActivityMember olderWaitlistInvite = waitlistMember("wait-old", "wait-old");
        olderWaitlistInvite.setPendingSource("admin");
        olderWaitlistInvite.setRequestKind("waitlist-invite");
        olderWaitlistInvite.setActionAtIso("2026-05-12T09:00:00Z");
        ActivityMember newerWaitlistInvite = waitlistMember("wait-new", "wait-new");
        newerWaitlistInvite.setPendingSource("admin");
        newerWaitlistInvite.setRequestKind("waitlist-invite");
        newerWaitlistInvite.setActionAtIso("2026-05-12T11:00:00Z");
        List<ActivityMember> stored = List.of(
                accepted,
                reservedInvite,
                olderWaitlistInvite,
                newerWaitlistInvite);

        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist"))
                .thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist-invite"))
                .thenReturn(List.of(olderWaitlistInvite, newerWaitlistInvite));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(stored);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        int changed = service.sweepEventWaitlists();

        assertThat(changed).isEqualTo(1);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue()).singleElement().satisfies(member -> {
            assertThat(member.getUserId()).isEqualTo("wait-new");
            assertThat(member.getStatus()).isEqualTo("pending");
            assertThat(member.getPendingSource()).isEqualTo("member");
            assertThat(member.getRequestKind()).isEqualTo("waitlist");
        });
        verify(eventInviteNotificationService, never()).notifyInvitees(
                any(ActivityEvent.class), anyList(), anyString());
    }

    @Test
    void waitlistDemotionUsesMembershipIdWhenLegacyRowsHaveEqualDatesAndNoSyncKey() {
        ActivityEvent event = event("event-1", "host", "host");
        event.setCapacityTotal(2);
        ActivityMember accepted = member(
                "accepted",
                "event-1",
                "accepted-user",
                "Member",
                "accepted");
        ActivityMember invitationA = waitlistMember("legacy-a", "wait-a");
        ActivityMember invitationC = waitlistMember("legacy-c", "wait-c");
        for (ActivityMember invitation : List.of(invitationA, invitationC)) {
            invitation.setPendingSource("admin");
            invitation.setRequestKind("waitlist-invite");
            invitation.setSyncKey(null);
        }
        invitationA.setId("membership-a");
        invitationC.setId("membership-c");
        List<ActivityMember> stored = List.of(
                accepted,
                invitationA,
                invitationC);

        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist"))
                .thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(
                "event", "pending", "waitlist-invite"))
                .thenReturn(List.of(invitationA, invitationC));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-1"))
                .thenReturn(stored);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(activityEventsRepository.saveAll(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        int changed = service.sweepEventWaitlists();

        assertThat(changed).isEqualTo(1);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityMember>> savedMembers = ArgumentCaptor.forClass(List.class);
        verify(activityMembersRepository).saveAll(savedMembers.capture());
        assertThat(savedMembers.getValue()).singleElement().satisfies(member -> {
            assertThat(member.getUserId()).isEqualTo("wait-c");
            assertThat(member.getPendingSource()).isEqualTo("member");
            assertThat(member.getRequestKind()).isEqualTo("waitlist");
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

    private List<String> acceptInvitationAndCaptureRecipients(String blindMode) {
        ActivityEvent event = event("event-visibility", "host", "host");
        event.setBlindMode(blindMode);
        ActivityMember host = member("host-sync", "event-visibility", "host", "Admin", "accepted");
        ActivityMember accepted = member(
                "accepted-sync",
                "event-visibility",
                "accepted-user",
                "Member",
                "accepted");
        ActivityMember observer = member(
                "observer-sync",
                "event-visibility",
                "pending-observer",
                "Member",
                "pending");
        observer.setPendingSource("admin");
        observer.setRequestKind("invite");
        observer.setInvitedByUserId("host");
        ActivityMember invitation = member(
                "invite-sync",
                "event-visibility",
                "viewer",
                "Member",
                "pending");
        invitation.setPendingSource("admin");
        invitation.setRequestKind("invite");
        invitation.setInvitedByUserId("host");
        AtomicReference<List<ActivityMember>> stored =
                new AtomicReference<>(List.of(host, accepted, observer, invitation));
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer");

        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", "event-visibility"))
                .thenAnswer(invocation -> stored.get());
        when(activityMembersRepository.save(any(ActivityMember.class))).thenAnswer(invocation -> {
            ActivityMember saved = invocation.getArgument(0);
            stored.set(stored.get().stream()
                    .map(member -> saved.getUserId().equals(member.getUserId()) ? saved : member)
                    .toList());
            return saved;
        });
        when(activityEventsRepository.findBySourceId("event-visibility")).thenReturn(List.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(viewer));

        service.requestJoin("event-visibility", viewer, event, true, false, false);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<String>> recipients = ArgumentCaptor.forClass(List.class);
        verify(eventInviteNotificationService).notifyInvitationAccepted(
                eq(event),
                eq("viewer"),
                eq("Viewer"),
                anyString(),
                recipients.capture());
        return recipients.getValue();
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

    private ActivityMember waitlistMember(String syncKey, String userId) {
        ActivityMember member = member(syncKey, "event-1", userId, "Member", "pending");
        member.setPendingSource("member");
        member.setRequestKind("waitlist");
        return member;
    }

    private ActivityMember suppressedMember(
            ActivityMember member,
            String statusBeforeSuppression,
            String suppressionRootOwnerId) {
        member.setStatus("suppressed");
        member.setStatusBeforeSuppression(statusBeforeSuppression);
        member.setSuppressionRootOwnerId(suppressionRootOwnerId);
        member.setSuppressedAtIso("2026-07-25T00:00:00Z");
        member.setUpdatedUser(member.getUserId());
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
                List.of(),
                "2026-05-12T10:00:00Z",
                null,
                null,
                null,
                null);
    }

    private ActivityMemberEntryDto invitationEntry(String userId, String inviterUserId) {
        return new ActivityMemberEntryDto(
                null,
                userId,
                userId,
                "TU",
                "man",
                "",
                "Invitation pending.",
                "Member",
                "pending",
                "admin",
                "invite",
                inviterUserId,
                true,
                "2026-05-12T10:00:00Z",
                "2026-05-12T10:00:00Z",
                "",
                null,
                null,
                List.of(),
                "2026-05-12T10:00:00Z",
                null,
                null,
                null,
                null);
    }
}
