package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.SchedulerPlanMarker;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@ExtendWith(MockitoExtension.class)
class EventSchedulerTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private SchedulerPlanMarkersRepository schedulerPlanMarkersRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    @Mock
    private EventInviteNotificationService eventInviteNotificationService;
    @Mock
    private NotificationRuleRegistryService notificationRuleRegistryService;

    @Test
    void generatePriorityPlansPersistsInvitesAndSendsNotifications() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setAutoInviter(true);
        event.setPublished(true);
        event.setCapacityTotal(3);
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");
        event.setLocation("Bratislava");

        when(activityEventsRepository.findByAutoInviterTrue()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("creator-1"),
                user("locked-1"),
                user("u1"),
                user("u2"),
                user("u3")));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("locked-1", "u1", 1.0d),
                rate("locked-1", "u2", 0.8d),
                rate("u1", "u3", 0.95d),
                rate("u2", "u3", 0.1d)));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("locked-1"),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(activitiesMembersService.inviteUsers("event-1", "creator-1", List.of("u1", "u2"), event))
                .thenReturn(List.of("u1", "u2"));

        List<InviteBatchPlan> plans = scheduler.generatePriorityPlans();

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.ownerId()).isEqualTo("event-1");
            assertThat(plan.invitedUserIds()).containsExactly("u1", "u2");
        });
        verify(activitiesMembersService).inviteUsers("event-1", "creator-1", List.of("u1", "u2"), event);
        verify(eventInviteNotificationService).notifyInvitees(event, List.of("u1", "u2"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateRandomPlansMaterializesGeneratedGroupMembers() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setPublished(true);
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(subEvent("sub-1", 2, 2, 2)));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3"),
                user("u4")));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u3", "u4", 0.95d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-1",
                List.of(),
                List.of("u1", "u2", "u3", "u4"),
                List.of(),
                Set.of("creator-1"),
                4);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-1", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("group"), anyCollection()))
                .thenReturn(Map.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-1"),
                org.mockito.ArgumentMatchers.eq("sub-1"),
                anyList()))
                .thenReturn(List.of(
                        group("sub-1:group:1", "Group A"),
                        group("sub-1:group:2", "Group B")));
        when(activitiesMembersService.syncGroupMembers("sub-1:group:1", "creator-1", List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));
        when(activitiesMembersService.syncGroupMembers("sub-1:group:2", "creator-1", List.of("u3", "u4")))
                .thenReturn(List.of("u3", "u4"));

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId).containsExactly("sub-1:group:1", "sub-1:group:2");
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactly(List.of("u1", "u2"), List.of("u3", "u4"));
        verify(activitiesEventLeaderboardService).materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-1"),
                org.mockito.ArgumentMatchers.eq("sub-1"),
                anyList());
        verify(activitiesMembersService).syncGroupMembers("sub-1:group:1", "creator-1", List.of("u1", "u2"));
        verify(activitiesMembersService).syncGroupMembers("sub-1:group:2", "creator-1", List.of("u3", "u4"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateScorePlansMaterializesGeneratedGroupsBeforeQueryingState() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setPublished(true);
        event.setSubEvents(List.of(subEvent("sub-1", 2, 2, 2)));

        EventLeaderboardStateDto state = new EventLeaderboardStateDto(
                "event-1",
                "sub-1",
                "Round 1",
                "Score",
                List.of(new EventLeaderboardGroupDto(
                        "sub-1:group:1",
                        "Group A",
                        2,
                        1,
                        List.of("u1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of())));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesEventLeaderboardService.queryState("event-1", "sub-1")).thenReturn(state);

        List<EventLeaderboardStateDto> states = scheduler.generateScorePlans();

        assertThat(states).containsExactly(state);
        verify(activitiesEventLeaderboardService).materializeGeneratedGroups("event-1", "sub-1");
        verify(activitiesEventLeaderboardService).queryState("event-1", "sub-1");
    }

    @Test
    void generateRandomPlansPreservesAnchoredMembersAndFillsOpenSpots() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-2");
        event.setPublished(true);
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(explicitSubEvent("sub-2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3"),
                user("u4")));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u3", "u4", 0.95d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-2",
                List.of(),
                List.of("u1", "u2", "u3", "u4"),
                List.of(),
                Set.of("creator-1"),
                4);
        ActivitiesMembersService.OwnerMembersSnapshot groupASnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "group",
                "group-a",
                List.of(),
                List.of("u1"),
                List.of(),
                Set.of(),
                2);
        ActivitiesMembersService.OwnerMembersSnapshot groupBSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "group",
                "group-b",
                List.of(),
                List.of("u3"),
                List.of(),
                Set.of(),
                2);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-2", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("group"), anyCollection()))
                .thenReturn(Map.of("group-a", groupASnapshot, "group-b", groupBSnapshot));
        when(activitiesMembersService.syncGroupMembers("group-a", "creator-1", List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));
        when(activitiesMembersService.syncGroupMembers("group-b", "creator-1", List.of("u3", "u4")))
                .thenReturn(List.of("u3", "u4"));

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId).containsExactly("group-a", "group-b");
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactly(List.of("u1", "u2"), List.of("u3", "u4"));
        verify(activitiesMembersService).syncGroupMembers("group-a", "creator-1", List.of("u1", "u2"));
        verify(activitiesMembersService).syncGroupMembers("group-b", "creator-1", List.of("u3", "u4"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateScorePlansMaterializesAdvancingMembersIntoNextStageGroups() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-3");
        event.setPublished(true);
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                explicitSubEvent("sub-1"),
                singleGroupSubEvent("sub-2", "next-group")));

        EventLeaderboardStateDto currentState = new EventLeaderboardStateDto(
                "event-3",
                "sub-1",
                "Round 1",
                "Score",
                List.of(new EventLeaderboardGroupDto(
                        "group-a",
                        "Group A",
                        2,
                        1,
                        List.of("u1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of()),
                        new EventLeaderboardGroupDto(
                                "group-b",
                                "Group B",
                                2,
                                1,
                                List.of("u2"),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of())));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-3"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-3",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3")));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u2", "u3", 0.2d)));
        when(activitiesEventLeaderboardService.queryState("event-3", "sub-1")).thenReturn(currentState);
        when(activitiesMembersService.syncGroupMembers("next-group", "creator-1", List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));

        List<EventLeaderboardStateDto> states = scheduler.generateScorePlans();

        assertThat(states).containsExactly(currentState);
        verify(activitiesMembersService).syncGroupMembers("next-group", "creator-1", List.of("u1", "u2"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateRandomPlansRecordsNoOpMarkerWhenCurrentGroupAlreadyMatchesPlan() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-4");
        event.setPublished(true);
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(subEvent("sub-4", 1, 2, 2)));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2")));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-4",
                List.of(),
                List.of("u1", "u2"),
                List.of(),
                Set.of("creator-1"),
                2);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-4"),
                org.mockito.ArgumentMatchers.eq("sub-4"),
                anyList()))
                .thenReturn(List.of(group("sub-4:group:1", "Group A")));
        ActivitiesMembersService.OwnerMembersSnapshot groupSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "group",
                "sub-4:group:1",
                List.of(),
                List.of("u1", "u2"),
                List.of(),
                Set.of(),
                2);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-4", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("group"), anyCollection()))
                .thenReturn(Map.of("sub-4:group:1", groupSnapshot));

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).isEmpty();
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    private EventScheduler createScheduler() {
        lenient().when(schedulerPlanMarkersRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());
        return new EventScheduler(
                usersRepository,
                userRatesRepository,
                activityEventsRepository,
                schedulerPlanMarkersRepository,
                activitiesMembersService,
                activitiesEventLeaderboardService,
                eventInviteNotificationService,
                notificationRuleRegistryService);
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setId(userId);
        user.setName(userId);
        return user;
    }

    private UserRate rate(String ownerUserId, String relatedUserId, double affinityScore) {
        UserRate rate = new UserRate();
        rate.setMode("single");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setAffinityScore(affinityScore);
        return rate;
    }

    private SubEventFormItemDto subEvent(String id, Integer groupCount, Integer groupCapacityMin, Integer groupCapacityMax) {
        return new SubEventFormItemDto(
                id,
                "Round 1",
                null,
                null,
                null,
                null,
                null,
                List.of(),
                groupCount,
                groupCapacityMin,
                groupCapacityMax,
                "Score",
                1,
                false,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    private SubEventGroupItemDto group(String id, String name) {
        return new SubEventGroupItemDto(id, name, 2, 2, "generated");
    }

    private SubEventFormItemDto explicitSubEvent(String id) {
        return new SubEventFormItemDto(
                id,
                "Round 2",
                null,
                null,
                null,
                null,
                null,
                List.of(
                        new SubEventGroupItemDto("group-a", "Group A", 2, 2, "manual"),
                        new SubEventGroupItemDto("group-b", "Group B", 2, 2, "manual")),
                null,
                null,
                null,
                "Score",
                1,
                false,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    private SubEventFormItemDto singleGroupSubEvent(String id, String groupId) {
        return new SubEventFormItemDto(
                id,
                "Final",
                null,
                null,
                null,
                null,
                null,
                List.of(new SubEventGroupItemDto(groupId, "Final", 2, 2, "manual")),
                null,
                null,
                null,
                "Score",
                1,
                false,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }
}
