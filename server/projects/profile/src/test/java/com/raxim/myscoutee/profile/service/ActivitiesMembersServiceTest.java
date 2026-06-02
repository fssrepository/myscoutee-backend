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
    private ActivitiesChatService activitiesChatService;
    @Mock
    private EventSlotReadModelService eventSlotReadModelService;
    @Mock
    private AccessControlService accessControlService;

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
                activitiesChatService,
                eventSlotReadModelService,
                accessControlService);
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
        verify(activitiesChatService).postSystemMessage("event-1", "Target User was disqualified from the event.", "member-disqualify");
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
        verify(activitiesChatService).postSystemMessage("event-1", "Target User was reinstated to the event.", "member-reinstate");
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
    void queryMembersReturnsEmptyWhenViewPolicyDenies() {
        when(accessControlService.canCurrentActorViewEventMembers("event-1")).thenReturn(false);

        List<ActivityMemberEntryDto> result = service.queryMembers("event", "event-1");

        assertThat(result).isEmpty();
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
        verify(activitiesChatService).postSystemMessage("event-1", "Target User joined the event.", "member-joined");
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
        verify(activitiesChatService).postSystemMessage("event-1", "Target User left the event.", "member-left");
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
        event.setType("events");
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
                null);
    }
}
