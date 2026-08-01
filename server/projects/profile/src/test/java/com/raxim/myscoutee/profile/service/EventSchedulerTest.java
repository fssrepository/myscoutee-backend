package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.document.SchedulerPlanMarker;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@ExtendWith(MockitoExtension.class)
class EventSchedulerTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private SchedulerPlanMarkersRepository schedulerPlanMarkersRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    @Mock
    private ActivityTournamentGroupCounterService activityTournamentGroupCounterService;
    @Mock
    private EventInviteNotificationService eventInviteNotificationService;
    @Mock
    private EventCounterExpiryService eventCounterExpiryService;
    @Mock
    private EventCheckoutBasketService eventCheckoutBasketService;
    @Mock
    private ChatService chatService;
    @Mock
    private NotificationRuleRegistryService notificationRuleRegistryService;
    @Mock
    private PlatformParametersService platformParametersService;
    @Mock
    private NotificationOutboxService notificationOutboxService;

    @Test
    void runScheduledWrappersRunsCounterExpiryWhenAdminRuleIsDue() {
        EventScheduler scheduler = createScheduler();
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);
        when(notificationRuleRegistryService.shouldRunScheduledRule(anyString(), any(Instant.class))).thenReturn(false);
        when(notificationRuleRegistryService.shouldRunScheduledRule(eq(NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY), any(Instant.class))).thenReturn(true);

        scheduler.runScheduledWrappers();

        verify(eventCounterExpiryService).runScheduledExpiryPass(any(Instant.class));
    }

    @Test
    void runScheduledWrappersSkipsCounterExpiryWhenAdminRuleIsNotDue() {
        EventScheduler scheduler = createScheduler();
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);

        scheduler.runScheduledWrappers();

        verify(eventCounterExpiryService, never()).runScheduledExpiryPass(any(Instant.class));
    }

    @Test
    void runScheduledWrappersRunsCheckoutPurgeWhenAdminRuleIsDue() {
        EventScheduler scheduler = createScheduler();
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);
        when(notificationRuleRegistryService.shouldRunScheduledRule(anyString(), any(Instant.class))).thenReturn(false);
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE),
                any(Instant.class)))
                .thenReturn(true);

        scheduler.runScheduledWrappers();

        verify(eventCheckoutBasketService).purgeExpiredDraftBasketsScheduled(any(Instant.class));
    }

    @Test
    void runScheduledWrappersSkipsCheckoutPurgeWhenAdminRuleIsNotDue() {
        EventScheduler scheduler = createScheduler();
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);

        scheduler.runScheduledWrappers();

        verify(eventCheckoutBasketService, never())
                .purgeExpiredDraftBasketsScheduled(any(Instant.class));
    }

    @Test
    void scheduledRandomGroupsRecordsAffectedUsersInsteadOfGeneratedRooms() {
        EventScheduler scheduler = spy(createScheduler());
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);
        when(notificationRuleRegistryService.shouldRunScheduledRule(anyString(), any(Instant.class)))
                .thenReturn(false);
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS),
                any(Instant.class)))
                .thenReturn(true);
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS),
                anyString(),
                eq("scheduler"),
                any(Instant.class)))
                .thenReturn(new NotificationRuleConfig());
        doReturn(List.of(
                new GeneratedEventPlan("room-1", List.of("u1", "u2", "u3")),
                new GeneratedEventPlan("room-2", List.of("u4", "u5"))))
                .when(scheduler)
                .generateRandomPlans();

        scheduler.runScheduledWrappers();

        verify(notificationRuleRegistryService).recordRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS),
                eq(5),
                eq("completed"),
                anyString(),
                eq("scheduler"),
                any(Instant.class));
    }

    @Test
    void generatePriorityPlansCountsPendingInvitesAgainstCapacity() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setAutoInviter(true);
        event.setStatus("A");
        event.setCapacityTotal(3);
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");
        event.setLocation("Bratislava");

        when(activityEventsRepository.findByAutoInviterTrue()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("locked-1"),
                        List.of("pending-1", "pending-2"),
                        List.of("pending-1", "pending-2"),
                        List.of(),
                        Set.of("creator-1"),
                        3));

        List<InviteBatchPlan> plans = scheduler.generatePriorityPlans();

        assertThat(plans).isEmpty();
        verify(activitiesMembersService, never()).inviteUsers(anyString(), anyString(), anyList(), any(ActivityEvent.class));
        verify(eventInviteNotificationService, never()).notifyInvitees(any(), anyList(), anyString());
        verify(schedulerPlanMarkersRepository, never()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generatePriorityPlansInvitesOnlyCapacityNotReservedByPendingMembers() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setAutoInviter(true);
        event.setStatus("A");
        event.setCapacityTotal(4);
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");
        event.setLocation("Bratislava");

        when(activityEventsRepository.findByAutoInviterTrue()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("creator-1"),
                user("locked-1"),
                user("pending-1"),
                user("u1"),
                user("u2"),
                user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("locked-1", "u1", 1.0d),
                rate("locked-1", "u2", 0.8d),
                rate("locked-1", "u3", 0.1d)));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("locked-1"),
                        List.of("pending-1"),
                        List.of("pending-1"),
                        List.of(),
                        Set.of("creator-1"),
                        4));
        when(activitiesMembersService.inviteUsers("event-1", "creator-1", List.of("u1", "u2"), event))
                .thenReturn(List.of("u1", "u2"));

        List<InviteBatchPlan> plans = scheduler.generatePriorityPlans();

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.ownerId()).isEqualTo("event-1");
            assertThat(plan.invitedUserIds()).containsExactly("u1", "u2");
        });
        verify(activitiesMembersService).inviteUsers("event-1", "creator-1", List.of("u1", "u2"), event);
        verify(eventInviteNotificationService).notifyInvitees(event, List.of("u1", "u2"), "creator-1");
        InOrder persistenceBeforeNotification = inOrder(
                activitiesMembersService,
                eventInviteNotificationService);
        persistenceBeforeNotification.verify(activitiesMembersService)
                .inviteUsers("event-1", "creator-1", List.of("u1", "u2"), event);
        persistenceBeforeNotification.verify(eventInviteNotificationService)
                .notifyInvitees(event, List.of("u1", "u2"), "creator-1");
    }

    @Test
    void generatePriorityPlansDoesNotReserveCapacityForPendingJoinRequests() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-pending-request");
        event.setAutoInviter(true);
        event.setStatus("A");
        event.setCapacityTotal(2);
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");

        when(activityEventsRepository.findByAutoInviterTrue()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("creator-1"),
                user("accepted-1"),
                user("request-1"),
                user("candidate-1")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("accepted-1", "candidate-1", 1.0d)));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-pending-request"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-pending-request",
                        List.of(),
                        List.of("accepted-1"),
                        List.of("request-1"),
                        List.of(),
                        List.of("request-1"),
                        Set.of("creator-1"),
                        2));
        when(activitiesMembersService.inviteUsers(
                "event-pending-request",
                "creator-1",
                List.of("candidate-1"),
                event))
                .thenReturn(List.of("candidate-1"));

        List<InviteBatchPlan> plans = scheduler.generatePriorityPlans();

        assertThat(plans).singleElement().satisfies(plan ->
                assertThat(plan.invitedUserIds()).containsExactly("candidate-1"));
        verify(activitiesMembersService).inviteUsers(
                "event-pending-request",
                "creator-1",
                List.of("candidate-1"),
                event);
    }

    @Test
    void generateRandomPlansCreatesSystemEventsChatsAndMembersBeforeNotifications() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");
        event.setSubEvents(List.of(subEvent("sub-1", 2, 2, 2)));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3"),
                user("u4")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u3", "u4", 0.95d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-1",
                List.of(),
                List.of("u1", "u2", "u3", "u4"),
                List.of(),
                List.of(),
                List.of(),
                Set.of("creator-1"),
                4);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-1", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("event"), anyCollection()))
                .thenReturn(Map.of());
        when(chatService.ensureMainEventChat(any(ActivityEvent.class), anyCollection()))
                .thenAnswer(invocation -> ((ActivityEvent) invocation.getArgument(0)).getSourceId());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-1"),
                org.mockito.ArgumentMatchers.eq("sub-1"),
                anyList()))
                .thenReturn(List.of(
                        group("sub-1:group:1", "Group A"),
                        group("sub-1:group:2", "Group B")));
        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        String room1Id = "random-room:event-1:sub-1:sub-1:group:1";
        String room2Id = "random-room:event-1:sub-1:sub-1:group:2";
        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId).containsExactly(room1Id, room2Id);
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactly(List.of("u1", "u2"), List.of("u3", "u4"));
        verify(activitiesEventLeaderboardService).materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-1"),
                org.mockito.ArgumentMatchers.eq("sub-1"),
                anyList());
        verify(activitiesMembersService).syncSystemEventMembers(room1Id, "scheduler", List.of("u1", "u2"));
        verify(activitiesMembersService).syncSystemEventMembers(room2Id, "scheduler", List.of("u3", "u4"));
        ArgumentCaptor<ActivityEvent> roomCaptor = ArgumentCaptor.forClass(ActivityEvent.class);
        verify(activityEventsRepository, times(2)).save(roomCaptor.capture());
        assertThat(roomCaptor.getAllValues()).satisfiesExactly(room1 -> {
            assertThat(room1.getSourceId()).isEqualTo(room1Id);
            assertThat(room1.getTitle()).isEqualTo("Random Room R1");
            assertThat(room1.getEventType()).isEqualTo("random-room");
            assertThat(room1.getCreatorName()).isEqualTo("MyScoutee System");
            assertThat(room1.getImageUrl()).isEqualTo("/media/public?key=images/system/random-room-default.png");
        }, room2 -> {
            assertThat(room2.getSourceId()).isEqualTo(room2Id);
            assertThat(room2.getTitle()).isEqualTo("Random Room R2");
            assertThat(room2.getEventType()).isEqualTo("random-room");
        });
        InOrder creationOrder = inOrder(activityEventsRepository, chatService, activitiesMembersService, notificationOutboxService);
        creationOrder.verify(activityEventsRepository).save(any(ActivityEvent.class));
        creationOrder.verify(chatService).ensureMainEventChat(any(ActivityEvent.class), eq(List.of("u1", "u2")));
        creationOrder.verify(activitiesMembersService).syncSystemEventMembers(room1Id, "scheduler", List.of("u1", "u2"));
        creationOrder.verify(chatService).ensureInitialSystemMessage(
                eq(room1Id),
                org.mockito.ArgumentMatchers.contains("created this room automatically"),
                eq("random-room-welcome"));
        creationOrder.verify(activityEventsRepository).save(any(ActivityEvent.class));
        creationOrder.verify(chatService).ensureMainEventChat(any(ActivityEvent.class), eq(List.of("u3", "u4")));
        creationOrder.verify(activitiesMembersService).syncSystemEventMembers(room2Id, "scheduler", List.of("u3", "u4"));
        creationOrder.verify(chatService).ensureInitialSystemMessage(
                eq(room2Id),
                org.mockito.ArgumentMatchers.contains("created this room automatically"),
                eq("random-room-welcome"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(intentCaptor.capture());
        assertThat(intentCaptor.getAllValues()).allSatisfy(intent -> {
            assertThat(intent.type()).isEqualTo(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS);
            assertThat(intent.entityType()).isEqualTo("event");
            assertThat(intent.entityId()).startsWith("random-room:event-1:sub-1:");
            assertThat(intent.title()).matches("Random Room R[12] is ready");
            assertThat(intent.body()).isEqualTo("Your system-generated room for Board Game Night is ready.");
            assertThat(intent.payload()).containsKeys(
                    "eventId",
                    "eventTitle",
                    "eventScope",
                    "assignmentScope",
                    "assignmentFingerprint",
                    "senderName");
            assertThat(intent.payload()).containsEntry("eventScope", "random-room");
            assertThat(intent.payload()).containsEntry("senderName", "MyScoutee System");
        });
    }

    @Test
    void generateRandomPlansExcludesNonPublicUsersFromRoomsAndAffectedUsers() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-public-only");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setTitle("Public room test");
        event.setSubEvents(List.of(subEvent("stage-public-only", 1, 2, 2)));

        Users privateUser = user("private-user");
        privateUser.setProfileStatus("friends only");
        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("public-1"),
                user("public-2"),
                privateUser));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                user("public-1"),
                user("public-2"),
                privateUser));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("public-1", "public-2", 1.0d),
                rate("public-2", "private-user", 0.95d)));
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-public-only", new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-public-only",
                        List.of(),
                        List.of("public-1", "public-2", "private-user"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3)));
        when(activitiesMembersService.buildBatchOwnerSnapshots(eq("event"), anyCollection()))
                .thenReturn(Map.of());
        when(chatService.ensureMainEventChat(any(ActivityEvent.class), anyCollection()))
                .thenAnswer(invocation -> ((ActivityEvent) invocation.getArgument(0)).getSourceId());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                eq("event-public-only"),
                eq("stage-public-only"),
                anyList()))
                .thenReturn(List.of(group("stage-public-only:group:1", "Group A")));

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.memberUserIds()).containsExactlyInAnyOrder("public-1", "public-2");
            assertThat(plan.memberUserIds()).doesNotContain("private-user");
        });
        verify(activitiesMembersService).syncSystemEventMembers(
                anyString(),
                eq("scheduler"),
                argThat(userIds -> userIds.size() == 2 && !userIds.contains("private-user")));
    }

    @Test
    void generateRandomPlansHonorsTheRuleSourceEventScopeWithoutChangingOtherEvents() {
        EventScheduler scheduler = createScheduler();
        NotificationRuleConfig rule = new NotificationRuleConfig();
        NotificationRuleConfig.ParameterField sourceIds = new NotificationRuleConfig.ParameterField();
        sourceIds.setKey("jobs.process.randomGroups.sourceEventIds");
        sourceIds.setTextValue("fixture-event");
        rule.setParameters(List.of(sourceIds));
        when(notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS))
                .thenReturn(Optional.of(rule));

        ActivityEvent unrelated = new ActivityEvent();
        unrelated.setSourceId("unrelated-event");
        unrelated.setStatus("A");
        unrelated.setSubEvents(List.of(subEvent("unrelated-stage", 1, 2, 2)));
        when(activityEventsRepository.findAll()).thenReturn(List.of(unrelated));
        when(activitiesMembersService.buildBatchEventSnapshots(any())).thenReturn(Map.of());

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).isEmpty();
        verify(activitiesMembersService).buildBatchEventSnapshots(argThat(Map::isEmpty));
        verify(activityEventsRepository, never()).save(any(ActivityEvent.class));
        verify(activitiesMembersService, never()).syncSystemEventMembers(
                anyString(), anyString(), anyList());
    }

    @Test
    void generateRandomPlansKeepsValidRoomsWhenTheLastConfiguredRoomCannotReachItsMinimum() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-partial");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setTitle("Partial room test");
        event.setSubEvents(List.of(subEvent("stage-partial", 3, 2, 2)));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("a1"),
                user("a2"),
                user("b1"),
                user("b2"),
                user("outside")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("a1", "a2", 1.0d),
                rate("a1", "outside", 0.01d),
                rate("b1", "b2", 0.95d)));
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of(
                        "event-partial",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "event",
                                "event-partial",
                                List.of(),
                                List.of("a1", "a2", "b1", "b2", "outside"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of("creator-1"),
                                5)));
        when(activitiesMembersService.buildBatchOwnerSnapshots(eq("event"), anyCollection()))
                .thenReturn(Map.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                eq("event-partial"),
                eq("stage-partial"),
                anyList()))
                .thenReturn(List.of(
                        group("stage-partial:group:1", "Group A"),
                        group("stage-partial:group:2", "Group B"),
                        group("stage-partial:group:3", "Group C")));
        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        String room1Id = "random-room:event-partial:stage-partial:stage-partial:group:1";
        String room2Id = "random-room:event-partial:stage-partial:stage-partial:group:2";
        String room3Id = "random-room:event-partial:stage-partial:stage-partial:group:3";
        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId)
                .containsExactly(room1Id, room2Id);
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder("a1", "a2", "b1", "b2")
                .doesNotContain("outside");
        verify(activitiesMembersService, times(2)).syncSystemEventMembers(
                anyString(),
                eq("scheduler"),
                anyList());
        verify(activitiesMembersService, never()).syncSystemEventMembers(
                eq(room3Id),
                anyString(),
                anyList());
        verify(activityTournamentGroupCounterService, never()).syncParent("event-partial", "stage-partial");
    }

    @Test
    void generateScorePlansMaterializesGeneratedGroupsBeforeQueryingState() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStatus("A");
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
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(explicitSubEvent("sub-2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3"),
                user("u4")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u3", "u4", 0.95d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-2",
                List.of(),
                List.of("u1", "u2", "u3", "u4"),
                List.of(),
                List.of(),
                List.of(),
                Set.of("creator-1"),
                4);
        String roomAId = "random-room:event-2:sub-2:group-a";
        String roomBId = "random-room:event-2:sub-2:group-b";
        ActivitiesMembersService.OwnerMembersSnapshot groupASnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                roomAId,
                List.of(),
                List.of("u1"),
                List.of(),
                List.of(),
                List.of(),
                Set.of(),
                2);
        ActivitiesMembersService.OwnerMembersSnapshot groupBSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                roomBId,
                List.of(),
                List.of("u3"),
                List.of(),
                List.of(),
                List.of(),
                Set.of(),
                2);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-2", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("event"), anyCollection()))
                .thenReturn(Map.of(
                        roomAId, groupASnapshot,
                        roomBId, groupBSnapshot));
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-2"),
                org.mockito.ArgumentMatchers.eq("sub-2"),
                anyList()))
                .thenReturn(List.of(
                        group("group-a", "Group A"),
                        group("group-b", "Group B")));
        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId).containsExactly(roomAId, roomBId);
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactly(List.of("u1", "u2"), List.of("u3", "u4"));
        verify(activitiesMembersService).syncSystemEventMembers(roomAId, "scheduler", List.of("u1", "u2"));
        verify(activitiesMembersService).syncSystemEventMembers(roomBId, "scheduler", List.of("u3", "u4"));
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateScorePlansMaterializesAdvancingMembersIntoNextStageGroups() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-3");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("sub-1"), "F"),
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
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u2", "u3", 0.2d)));
        when(activitiesEventLeaderboardService.materializeGeneratedGroups("event-3", "sub-1"))
                .thenReturn(List.of(
                        group("group-a", "Group A"),
                        group("group-b", "Group B")));
        when(activitiesEventLeaderboardService.queryState("event-3", "sub-1")).thenReturn(currentState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups("event-3", "sub-2"))
                .thenReturn(List.of(group("next-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("group"),
                anyCollection()))
                .thenReturn(Map.of(
                        "event-3:sub-2:next-group",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "group",
                                "event-3:sub-2:next-group",
                                List.of(),
                                List.of("u3"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of(),
                                2)));
        when(activitiesMembersService.syncGroupMembers("event-3:sub-2:next-group", "creator-1", List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));

        List<EventLeaderboardStateDto> states = scheduler.generateScorePlans();

        assertThat(states).containsExactly(currentState);
        verify(activitiesMembersService).syncGroupMembers("event-3:sub-2:next-group", "creator-1", List.of("u1", "u2"));
        verify(activityTournamentGroupCounterService).syncParent("event-3", "sub-2");
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateScorePlansFallsBackForDisconnectedWinnersAndRemovesStaleLoser() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-disconnected-winners");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));

        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-disconnected-winners",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(
                        leaderboardGroup("qualifier-a", "u1"),
                        leaderboardGroup("qualifier-b", "u2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-disconnected-winners"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-disconnected-winners",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-disconnected-winners",
                "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "A"), group("qualifier-b", "B")));
        when(activitiesEventLeaderboardService.queryState(
                "event-disconnected-winners",
                "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-disconnected-winners",
                "final"))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("group"),
                anyCollection()))
                .thenReturn(Map.of(
                        "event-disconnected-winners:final:final-group",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "group",
                                "event-disconnected-winners:final:final-group",
                                List.of(),
                                List.of("u3"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of(),
                                2)));
        when(activitiesMembersService.syncGroupMembers(
                "event-disconnected-winners:final:final-group",
                "creator-1",
                List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));

        scheduler.generateScorePlans();

        verify(activitiesMembersService).syncGroupMembers(
                "event-disconnected-winners:final:final-group",
                "creator-1",
                List.of("u1", "u2"));
    }

    @Test
    void generateScorePlansClearsStaleNextStageWhenNoAcceptedUserAdvances() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-no-winners");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));

        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-no-winners",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(new EventLeaderboardGroupDto(
                        "qualifier-a",
                        "A",
                        2,
                        1,
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of())));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-no-winners"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-no-winners",
                        List.of(),
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(user("u1"), user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups("event-no-winners", "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "A")));
        when(activitiesEventLeaderboardService.queryState("event-no-winners", "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups("event-no-winners", "final"))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("group"),
                anyCollection()))
                .thenReturn(Map.of(
                        "event-no-winners:final:final-group",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "group",
                                "event-no-winners:final:final-group",
                                List.of(),
                                List.of("u2"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of(),
                                2)));
        when(activitiesMembersService.syncGroupMembers(
                "event-no-winners:final:final-group",
                "creator-1",
                List.of()))
                .thenReturn(List.of());

        scheduler.generateScorePlans();

        verify(activitiesMembersService).syncGroupMembers(
                "event-no-winners:final:final-group",
                "creator-1",
                List.of());
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
    }

    @Test
    void generateScorePlansSkipsMutationWhenTargetCapacityCannotHoldEveryWinner() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-capacity-overflow");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));
        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-capacity-overflow",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(
                        leaderboardGroup("qualifier-a", "u1"),
                        leaderboardGroup("qualifier-b", "u2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-capacity-overflow"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-capacity-overflow",
                        List.of(),
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(user("u1"), user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-capacity-overflow", "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "A"), group("qualifier-b", "B")));
        when(activitiesEventLeaderboardService.queryState("event-capacity-overflow", "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-capacity-overflow", "final"))
                .thenReturn(List.of(new SubEventGroupItemDto(
                        "final-group", "Final", 1, 1, "generated")));

        assertThatThrownBy(scheduler::generateScorePlans)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("cannot preserve the exact advancing-user set");

        verify(activitiesMembersService, never()).syncGroupMembers(
                anyString(), anyString(), anyList());
    }

    @Test
    void generateScorePlansConsumesFinalizedGeneratedSlotRuntimeState() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent slot = new ActivityEvent();
        slot.setSourceId("event-1:slot:morning");
        slot.setStatus("A");
        slot.setCreatorUserId("creator-1");
        slot.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "SR"),
                singleGroupSubEvent("final", "final-group")));
        ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
        runtime.setOwnerId("event-1:slot:morning");
        runtime.setSubEventId("qualifier");
        runtime.setStageStatus("F");
        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-1:slot:morning",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(
                        leaderboardGroup("qualifier-a", "u1"),
                        leaderboardGroup("qualifier-b", "u2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(slot));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdIn(
                List.of("event-1:slot:morning"))).thenReturn(List.of(runtime));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1:slot:morning"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1:slot:morning",
                        List.of(),
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-1:slot:morning", "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "Qualifier")));
        when(activitiesEventLeaderboardService.queryState(
                "event-1:slot:morning", "qualifier")).thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-1:slot:morning", "final"))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                eq("group"), anyCollection())).thenReturn(Map.of());
        when(activitiesMembersService.syncGroupMembers(
                "event-1:slot:morning:final:final-group",
                "creator-1",
                List.of("u1", "u2"))).thenReturn(List.of("u1", "u2"));

        scheduler.generateScorePlans();

        verify(activitiesMembersService).syncGroupMembers(
                "event-1:slot:morning:final:final-group",
                "creator-1",
                List.of("u1", "u2"));
    }

    @Test
    void generateScorePlansDoesNotRewriteNextStageAfterScoreReviewStarted() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-locked-final");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                withStageStatus(singleGroupSubEvent("final", "final-group"), "SR")));
        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-locked-final",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(leaderboardGroup("qualifier-a", "u1")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-locked-final"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-locked-final",
                        List.of(),
                        List.of("u1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        1));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(user("u1")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.queryState("event-locked-final", "qualifier"))
                .thenReturn(qualifierState);

        scheduler.generateScorePlans();

        verify(activitiesMembersService, never()).syncGroupMembers(
                anyString(), anyString(), anyList());
    }

    @Test
    void generateScorePlansCleansPendingLoserEvenWhenAcceptedWinnersAlreadyMatch() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-pending-loser");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));
        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-pending-loser",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(
                        leaderboardGroup("qualifier-a", "u1"),
                        leaderboardGroup("qualifier-b", "u2")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-pending-loser"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-pending-loser",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"), user("u2"), user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-pending-loser", "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "A"), group("qualifier-b", "B")));
        when(activitiesEventLeaderboardService.queryState("event-pending-loser", "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-pending-loser", "final"))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("group"),
                anyCollection()))
                .thenReturn(Map.of(
                        "event-pending-loser:final:final-group",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "group",
                                "event-pending-loser:final:final-group",
                                List.of(),
                                List.of("u1", "u2"),
                                List.of("u3"),
                                List.of(),
                                List.of("u3"),
                                Set.of(),
                                2)));
        when(activitiesMembersService.syncGroupMembers(
                "event-pending-loser:final:final-group",
                "creator-1",
                List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));

        scheduler.generateScorePlans();

        verify(activitiesMembersService).syncGroupMembers(
                "event-pending-loser:final:final-group",
                "creator-1",
                List.of("u1", "u2"));
    }

    @Test
    void scheduledTournamentReviewRepairsAdvancementAndSecondPassIsNoOp() {
        EventScheduler scheduler = createScheduler();

        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setRuleKey(NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW);
        rule.setEnabled(true);
        when(notificationRuleRegistryService.hasEnabledScheduledEventRule()).thenReturn(true);
        when(notificationRuleRegistryService.findRule(NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW))
                .thenReturn(Optional.of(rule));
        when(notificationRuleRegistryService.shouldRunScheduledRule(anyString(), any(Instant.class)))
                .thenReturn(false);
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW),
                any(Instant.class)))
                .thenReturn(true);
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW),
                anyString(),
                eq("scheduler"),
                any(Instant.class)))
                .thenReturn(rule);

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-scheduled-advancement");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));

        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-scheduled-advancement",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(
                        leaderboardGroup("qualifier-a", "u1"),
                        leaderboardGroup("qualifier-b", "u2")));
        ActivitiesMembersService.OwnerMembersSnapshot staleGroup =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "group",
                        "event-scheduled-advancement:final:final-group",
                        List.of(),
                        List.of("u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        2);
        ActivitiesMembersService.OwnerMembersSnapshot exactGroup =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "group",
                        "event-scheduled-advancement:final:final-group",
                        List.of(),
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        2);

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-scheduled-advancement"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-scheduled-advancement",
                        List.of(),
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-scheduled-advancement",
                "qualifier"))
                .thenReturn(List.of(group("qualifier-a", "A"), group("qualifier-b", "B")));
        when(activitiesEventLeaderboardService.queryState(
                "event-scheduled-advancement",
                "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                "event-scheduled-advancement",
                "final"))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("group"),
                anyCollection()))
                .thenReturn(
                        Map.of("event-scheduled-advancement:final:final-group", staleGroup),
                        Map.of("event-scheduled-advancement:final:final-group", exactGroup));
        when(activitiesMembersService.syncGroupMembers(
                "event-scheduled-advancement:final:final-group",
                "creator-1",
                List.of("u1", "u2")))
                .thenReturn(List.of("u1", "u2"));

        scheduler.runScheduledWrappers();
        scheduler.runScheduledWrappers();

        verify(activitiesMembersService, times(1)).syncGroupMembers(
                "event-scheduled-advancement:final:final-group",
                "creator-1",
                List.of("u1", "u2"));
        ArgumentCaptor<Integer> affectedCount = ArgumentCaptor.forClass(Integer.class);
        verify(notificationRuleRegistryService, times(2)).recordRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW),
                affectedCount.capture(),
                eq("completed"),
                anyString(),
                eq("scheduler"),
                any(Instant.class));
        assertThat(affectedCount.getAllValues()).containsExactly(1, 0);
    }

    @Test
    void generateRandomPlansUsesOnlyPreviousStageAdvancersForLaterStage() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-advancement");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                withStageStatus(explicitSubEvent("qualifier"), "F"),
                singleGroupSubEvent("final", "final-group")));

        EventLeaderboardStateDto qualifierState = new EventLeaderboardStateDto(
                "event-advancement",
                "qualifier",
                "Qualifier",
                "Score",
                List.of(new EventLeaderboardGroupDto(
                        "qualifier-group-a",
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
                                "qualifier-group-b",
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
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2"),
                user("u3")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d),
                rate("u2", "u3", 0.9d)));
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of(
                        "event-advancement",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "event",
                                "event-advancement",
                                List.of(),
                                List.of("u1", "u2", "u3"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of("creator-1"),
                                3)));
        when(activitiesEventLeaderboardService.queryState("event-advancement", "qualifier"))
                .thenReturn(qualifierState);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-advancement"),
                org.mockito.ArgumentMatchers.eq("final"),
                anyList()))
                .thenReturn(List.of(group("final-group", "Final")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("event"),
                anyCollection()))
                .thenReturn(Map.of());

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.seedId()).isEqualTo("random-room:event-advancement:final:final-group");
            assertThat(plan.memberUserIds()).containsExactly("u1", "u2");
        });
        verify(activitiesMembersService).syncSystemEventMembers(
                "random-room:event-advancement:final:final-group",
                "scheduler",
                List.of("u1", "u2"));
    }

    @Test
    void generateRandomPlansKeepsAllAcceptedUsersForNonTournamentLaterStage() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-non-tournament");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(
                nonTournamentSubEvent("first", "F"),
                nonTournamentSubEvent("second", "A")));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d)));
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of(
                        "event-non-tournament",
                        new ActivitiesMembersService.OwnerMembersSnapshot(
                                "event",
                                "event-non-tournament",
                                List.of(),
                                List.of("u1", "u2"),
                                List.of(),
                                List.of(),
                                List.of(),
                                Set.of("creator-1"),
                                2)));
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-non-tournament"),
                org.mockito.ArgumentMatchers.eq("second"),
                anyList()))
                .thenReturn(List.of(group("second-group", "Second")));
        when(activitiesMembersService.buildBatchOwnerSnapshots(
                org.mockito.ArgumentMatchers.eq("event"),
                anyCollection()))
                .thenReturn(Map.of());

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.seedId()).isEqualTo("random-room:event-non-tournament:second:second-group");
            assertThat(plan.memberUserIds()).containsExactly("u1", "u2");
        });
        verify(activitiesEventLeaderboardService, never()).queryState("event-non-tournament", "first");
    }

    @Test
    void generateRandomPlansRecordsNoOpMarkerWhenCurrentGroupAlreadyMatchesPlan() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-4");
        event.setStatus("A");
        event.setCreatorUserId("creator-1");
        event.setSubEvents(List.of(subEvent("sub-4", 1, 2, 2)));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAllById(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-4",
                List.of(),
                List.of("u1", "u2"),
                List.of(),
                List.of(),
                List.of(),
                Set.of("creator-1"),
                2);
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                org.mockito.ArgumentMatchers.eq("event-4"),
                org.mockito.ArgumentMatchers.eq("sub-4"),
                anyList()))
                .thenReturn(List.of(group("sub-4:group:1", "Group A")));
        String roomId = "random-room:event-4:sub-4:sub-4:group:1";
        ActivitiesMembersService.OwnerMembersSnapshot groupSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                roomId,
                List.of(),
                List.of("u1", "u2"),
                List.of(),
                List.of(),
                List.of(),
                Set.of(),
                2);
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-4", eventSnapshot));
        when(activitiesMembersService.buildBatchOwnerSnapshots(org.mockito.ArgumentMatchers.eq("event"), anyCollection()))
                .thenReturn(Map.of(roomId, groupSnapshot));

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).isEmpty();
        verify(schedulerPlanMarkersRepository, atLeastOnce()).save(any(SchedulerPlanMarker.class));
        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void closeEndedTournamentStagesMovesOnlyActiveEndedStagesToReview() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setMode("Tournament");
        event.setSubEvents(List.of(
                subEventWithStatus("stage-ended", "2026-05-12T10:00:00Z", null),
                subEventWithStatus("stage-review", "2026-05-12T10:30:00Z", "SR"),
                subEventWithStatus("stage-future", "2026-05-12T13:00:00Z", null)));
        when(activityEventsRepository.findAll()).thenReturn(List.of(event));

        int changed = scheduler.closeEndedTournamentStagesForReview(Instant.parse("2026-05-12T12:00:00Z"));

        assertThat(changed).isEqualTo(1);
        assertThat(event.getSubEvents().get(0).stageStatus()).isEqualTo("SR");
        assertThat(event.getSubEvents().get(0).stageStatusReason()).isEqualTo("stage-ended");
        assertThat(event.getSubEvents().get(1).stageStatus()).isEqualTo("SR");
        assertThat(event.getSubEvents().get(2).stageStatus()).isNull();
        verify(activityEventsRepository).saveAll(List.of(event));
    }

    private EventScheduler createScheduler() {
        lenient().when(usersRepository.findByUserIdIn(anyCollection()))
                .thenAnswer(invocation -> ((java.util.Collection<String>) invocation.getArgument(0))
                        .stream()
                        .map(this::user)
                        .toList());
        lenient().when(schedulerPlanMarkersRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());
        lenient().when(activityEventsRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());
        lenient().when(activityEventsRepository.save(any(ActivityEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(activitiesMembersService.syncSystemEventMembers(
                        anyString(),
                        eq("scheduler"),
                        anyList()))
                .thenAnswer(invocation -> invocation.getArgument(2));
        EventScheduler scheduler = new EventScheduler(
                usersRepository,
                userAffinityEdgesRepository,
                activityEventsRepository,
                schedulerPlanMarkersRepository,
                activitiesMembersService,
                activitiesEventLeaderboardService,
                activityTournamentGroupCounterService,
                eventInviteNotificationService,
                eventCounterExpiryService,
                eventCheckoutBasketService,
                chatService,
                notificationRuleRegistryService,
                platformParametersService,
                notificationOutboxService);
        scheduler.setActivitySubEventStageRuntimeRepository(activitySubEventStageRuntimeRepository);
        return scheduler;
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setId(userId);
        user.setName(userId);
        user.setProfileStatus("public");
        return user;
    }

    private UserAffinityEdge rate(String leftUserId, String rightUserId, double edgeWeight) {
        UserAffinityEdge edge = new UserAffinityEdge();
        edge.setLeftUserId(leftUserId);
        edge.setRightUserId(rightUserId);
        edge.setPairKey(leftUserId + ":" + rightUserId);
        edge.setAffinityScore(edgeWeight);
        edge.setEdgeWeight(edgeWeight);
        return edge;
    }

    private SubEventItem subEvent(String id, Integer groupCount, Integer groupCapacityMin, Integer groupCapacityMax) {
        return new SubEventItem(
                id,
                "Round 1",
                null,
                null,
                null,
                null,
                null,
                groupCapacityMin,
                groupCapacityMax,
                "Score",
                1,
                false,
                null,
                null,
                groupCount == null || groupCapacityMax == null ? null : groupCount * groupCapacityMax,
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

    private SubEventItem subEventWithStatus(String id, String endAt, String stageStatus) {
        return new SubEventItem(
                id,
                "Stage",
                null,
                "2026-05-12T09:00:00Z",
                endAt,
                null,
                null,
                2,
                2,
                "Score",
                1,
                false,
                null,
                2,
                2,
                2,
                0,
                0,
                0,
                0,
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
                stageStatus,
                null,
                null,
                null,
                null);
    }

    private SubEventGroupItemDto group(String id, String name) {
        return new SubEventGroupItemDto(id, name, 2, 2, "generated");
    }

    private EventLeaderboardGroupDto leaderboardGroup(String groupId, String advancingUserId) {
        return new EventLeaderboardGroupDto(
                groupId,
                groupId,
                2,
                1,
                List.of(advancingUserId),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of());
    }

    private SubEventItem nonTournamentSubEvent(String id, String stageStatus) {
        return new SubEventItem(
                id,
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                2,
                2,
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
                stageStatus,
                null,
                null,
                null,
                null,
                List.of());
    }

    private SubEventItem explicitSubEvent(String id) {
        return new SubEventItem(
                id,
                "Round 2",
                null,
                null,
                null,
                null,
                null,
                2,
                2,
                "Score",
                1,
                false,
                null,
                null,
                4,
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

    private SubEventItem singleGroupSubEvent(String id, String groupId) {
        return new SubEventItem(
                id,
                "Final",
                null,
                null,
                null,
                null,
                null,
                2,
                2,
                "Score",
                1,
                false,
                null,
                null,
                2,
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

    private SubEventItem withStageStatus(SubEventItem item, String stageStatus) {
        return new SubEventItem(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                item.membersAccepted(),
                item.membersPending(),
                item.carsPending(),
                item.accommodationPending(),
                item.suppliesPending(),
                item.carsAccepted(),
                item.accommodationAccepted(),
                item.suppliesAccepted(),
                item.carsCapacityMin(),
                item.carsCapacityMax(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
                stageStatus,
                item.stageStatusReason(),
                item.stageStatusUpdatedAt(),
                item.stageFinalizedAt(),
                item.stageFinalizedByUserId());
    }
}
