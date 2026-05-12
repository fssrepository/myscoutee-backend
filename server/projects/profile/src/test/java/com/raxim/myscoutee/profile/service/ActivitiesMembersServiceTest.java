package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.atLeastOnce;
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

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

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
                activitiesChatService);
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
}
