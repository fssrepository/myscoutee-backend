package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.affinity.service.UserAffinityEdgeService;
import com.raxim.myscoutee.domain.chat.service.ChatService;
import com.raxim.myscoutee.domain.payments.service.EventCheckoutBasketService;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;
import com.raxim.myscoutee.common.config.PlatformParametersService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
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

import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMainEventRuntime;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.events.document.SchedulerPlanMarker;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardMemberDto;
import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMainEventRuntimeRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.domain.events.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class EventSchedulerTest {
    @Mock private com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository userRatesRepository;
    @Mock private UserAffinityEdgeService affinityEdgeService;
    @Mock private com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository groupsRepository;
    private EventJobQueries jobScope() {
        var mongo = org.mockito.Mockito.mock(org.springframework.data.mongodb.core.MongoTemplate.class);
        var directory = new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(groupsRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(directory, "mongo", mongo);
        var scope = new JobGroupScopeService(org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class),
                java.util.Optional.of(directory), java.util.List.of());
        return new EventJobQueries(mongo, scope);
    }
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMainEventRuntimeRepository activityMainEventRuntimeRepository;
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
    void assignmentContractReportsProgressAndCountsDistinctMembersWithoutExposingPlans() {
        EventScheduler scheduler = spy(createScheduler());
        doAnswer(call -> {
            java.util.function.Consumer<EventScheduler.RandomPlanProgress> progress = call.getArgument(0);
            progress.accept(new EventScheduler.RandomPlanProgress(50, 1, 2, 3, 1, "First event assigned"));
            return java.util.Arrays.asList(
                    new GeneratedEventPlan("room-1", java.util.Arrays.asList(" u1 ", "", null)),
                    new GeneratedEventPlan("room-2", List.of("u1", "u2")), null);
        }).when(scheduler).generateRandomPlans(any(java.util.function.Consumer.class));
        var updates = new ArrayList<com.raxim.myscoutee.domain.events.api.RandomGroupAssignment.Progress>();

        var result = scheduler.assignRandomGroups(updates::add);

        assertThat(result.plans()).isEqualTo(3);
        assertThat(result.affectedUsers()).isEqualTo(2);
        assertThat(updates).containsExactly(
                new com.raxim.myscoutee.domain.events.api.RandomGroupAssignment.Progress(50, "First event assigned"));
        verify(scheduler).generateRandomPlans(any(java.util.function.Consumer.class));
    }

    @Test
    void priorityOffEventUsesParticipantsWithoutGlobalOrCampaignAffinity() {
        var scheduler=createScheduler();var event=new ActivityEvent();event.setWorkspaceGroupId("community-private");event.setCampaignId("ignored");
        var a=new com.raxim.myscoutee.domain.events.algorithm.dto.Node("a");var b=new com.raxim.myscoutee.domain.events.algorithm.dto.Node("b");
        var global=new com.raxim.myscoutee.domain.events.algorithm.dto.FGraph(Map.of("a",a,"b",b),List.of(new com.raxim.myscoutee.domain.events.algorithm.dto.Edge(a,b,99d)));
        com.raxim.myscoutee.domain.events.algorithm.dto.FGraph actual=org.springframework.test.util.ReflectionTestUtils.invokeMethod(scheduler,"eventGraph",event,global,Map.of("ignored",global),Set.of("a","b"),Set.of("community-private"));
        assertThat(actual.getNodes().keySet()).containsExactlyInAnyOrder("a","b");assertThat(actual.getEdges()).isEmpty();
        org.mockito.Mockito.verifyNoInteractions(userAffinityEdgesRepository,userRatesRepository);
    }

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
    void generatePriorityPlansUsesCreatorAsAnchorWhenEventHasNoMembers() {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-empty");
        event.setAutoInviter(true);
        event.setStatus("A");
        event.setCapacityTotal(1);
        event.setCreatorUserId("creator-1");
        event.setTitle("Initial auto-invite test");

        when(activityEventsRepository.findBySourceIdIn(argThat(sourceIds ->
                sourceIds.size() == 1 && sourceIds.contains("event-empty"))))
                .thenReturn(List.of(event));
        Users workCandidate = user("work-candidate");
        workCandidate.setWorkspaceGroupId("myscoutee-work");
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                user("creator-1"),
                user("candidate-1"), workCandidate));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("creator-1", "candidate-1", .8d), rate("creator-1", "work-candidate", 1d)));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-empty"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-empty",
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        1));
        when(activitiesMembersService.inviteUsers(
                "event-empty",
                "creator-1",
                List.of("candidate-1"),
                event))
                .thenReturn(List.of("candidate-1"));

        List<InviteBatchPlan> plans = scheduler.generatePriorityPlansForEvents(List.of("event-empty"));

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.ownerId()).isEqualTo("event-empty");
            assertThat(plan.invitedUserIds()).containsExactly("candidate-1");
        });
        verify(activitiesMembersService).inviteUsers(
                "event-empty",
                "creator-1",
                List.of("candidate-1"),
                event);
        verify(eventInviteNotificationService).notifyInvitees(
                event,
                List.of("candidate-1"),
                "creator-1");
        verify(activityEventsRepository, never()).findByAutoInviterTrue();
        verify(activityEventsRepository, never()).findAll();
    }

    @Test
    void campaignEventInvitesOnlyItsOwnCandidatesEvenWhenGlobalPriorityFavorsSomeoneElse() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("work-event"); event.setAutoInviter(true); event.setStatus("A");
        event.setCapacityTotal(1); event.setCreatorUserId("organizer"); event.setCampaignId("campaign-a");
        event.setWorkspaceGroupId("myscoutee-work");
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));
        var candidates = List.of(user("organizer"), user("other-campaign"), user("candidate-a"));
        candidates.forEach(user -> user.setWorkspaceGroupId("myscoutee-work"));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(candidates);
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(rate("organizer", "other-campaign", 1d)));
        when(affinityEdgeService.campaignGraphs(Set.of("campaign-a"))).thenReturn(Map.of("campaign-a",
            new com.raxim.myscoutee.domain.affinity.api.CampaignGraphs.Snapshot(List.of("candidate-a", "organizer"), List.of(rate("organizer", "candidate-a", .8d)))));
        when(activitiesMembersService.inviteUsers("work-event", "organizer", List.of("candidate-a"), event)).thenReturn(List.of("candidate-a"));
        assertThat(scheduler.generatePriorityPlansForEvents(List.of("work-event")))
                .singleElement().satisfies(plan -> assertThat(plan.invitedUserIds()).containsExactly("candidate-a"));
        verify(activitiesMembersService, never()).inviteUsers(anyString(), anyString(), eq(List.of("other-campaign")), any());
    }

    @Test
    void workEventsDoNotRunAutomaticRandomGrouping() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("work-event"); event.setWorkspaceGroupId("myscoutee-work"); event.setStatus("A");
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));
        var group = new com.raxim.myscoutee.domain.groups.document.CommunityGroup("myscoutee-work", "owner", "Work", "", "", "", "public",
                false, null, "", "", 0L, null, 0L, 0L, 0L, 0L, null, null, null, "work");
        when(groupsRepository.findByIdIn(anyCollection())).thenReturn(List.of(group));
        assertThat(scheduler.generateRandomPlansForEvents(List.of("work-event"))).isEmpty();
        verify(activitiesMembersService, never()).inviteUsers(anyString(), anyString(), anyList(), any());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void privateCommunityCannotRunPriorityInvitationsEvenForAnOldEnabledEvent() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("community-event"); event.setWorkspaceGroupId("private-community");
        event.setAutoInviter(true); event.setStatus("A");
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));
        var group = new com.raxim.myscoutee.domain.groups.document.CommunityGroup("private-community", "owner", "Community", "", "", "", "private",
                false, null, "", "", 0L, null, 0L, 0L, 0L, 0L, null, null, null, "community");
        when(groupsRepository.findByIdIn(anyCollection())).thenReturn(List.of(group));
        assertThat(scheduler.generatePriorityPlansForEvents(List.of("community-event"))).isEmpty();
        org.mockito.Mockito.verifyNoInteractions(userAffinityEdgesRepository, userRatesRepository, activitiesMembersService, eventInviteNotificationService);
    }

    @Test
    void targetedRandomTournamentAndScoreRunsLoadOnlyRequestedEventDocuments() {
        EventScheduler scheduler = createScheduler();
        when(activityEventsRepository.findBySourceIdIn(argThat(sourceIds ->
                sourceIds.size() == 1 && sourceIds.contains("event-target"))))
                .thenReturn(List.of());

        assertThat(scheduler.generateRandomPlansForEvents(List.of("event-target"))).isEmpty();
        assertThat(scheduler.generateTournamentStagePlansForEvents(List.of("event-target"))).isEmpty();
        assertThat(scheduler.generateScorePlansForEvents(List.of("event-target"))).isEmpty();

        verify(activityEventsRepository, times(3)).findBySourceIdIn(argThat(sourceIds ->
                sourceIds.size() == 1 && sourceIds.contains("event-target")));
        verify(activityEventsRepository, never()).findAll();
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> room1Id.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u1", "u2")),
                anyList());
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> room2Id.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u3", "u4")),
                anyList());
        ArgumentCaptor<ActivityEvent> roomCaptor = ArgumentCaptor.forClass(ActivityEvent.class);
        verify(activitiesMembersService, times(2)).syncMaterializedSystemEventMembers(
                roomCaptor.capture(),
                eq("scheduler"),
                anyList(),
                anyList());
        assertThat(roomCaptor.getAllValues()).satisfiesExactly(room1 -> {
            assertThat(room1.getSourceId()).isEqualTo(room1Id);
            assertThat(room1.getTitle()).isEqualTo("Random Room R1");
            assertThat(room1.getEventType()).isEqualTo("random-room");
            assertThat(room1.getCreatorUserId()).isNull();
            assertThat(room1.getCreatorName()).isEqualTo("MyScoutee System");
            assertThat(room1.getImageUrl()).isEqualTo("/media/public?key=images/system/random-room-default.png");
        }, room2 -> {
            assertThat(room2.getSourceId()).isEqualTo(room2Id);
            assertThat(room2.getTitle()).isEqualTo("Random Room R2");
            assertThat(room2.getEventType()).isEqualTo("random-room");
        });
        ArgumentCaptor<ActivityMainEventRuntime> runtimeCaptor =
                ArgumentCaptor.forClass(ActivityMainEventRuntime.class);
        verify(activityMainEventRuntimeRepository, times(2)).save(runtimeCaptor.capture());
        assertThat(runtimeCaptor.getAllValues()).satisfiesExactly(runtime1 -> {
            assertThat(runtime1.getRecordId()).isEqualTo("main-event:" + room1Id);
            assertThat(runtime1.getEventId()).isEqualTo(room1Id);
            assertThat(runtime1.getOwnerId()).isEqualTo(room1Id);
            assertThat(runtime1.getRuntimeKind()).isEqualTo(ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT);
            assertThat(runtime1.getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
            assertThat(runtime1.getTitle()).isEqualTo("Random Room R1");
        }, runtime2 -> {
            assertThat(runtime2.getRecordId()).isEqualTo("main-event:" + room2Id);
            assertThat(runtime2.getEventId()).isEqualTo(room2Id);
            assertThat(runtime2.getOwnerId()).isEqualTo(room2Id);
            assertThat(runtime2.getRuntimeKind()).isEqualTo(ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT);
            assertThat(runtime2.getTitle()).isEqualTo("Random Room R2");
        });
        InOrder creationOrder = inOrder(
                activityEventsRepository,
                activityMainEventRuntimeRepository,
                chatService,
                activitiesMembersService,
                notificationOutboxService);
        creationOrder.verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> room1Id.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u1", "u2")),
                anyList());
        creationOrder.verify(activityMainEventRuntimeRepository).save(
                argThat(runtime -> room1Id.equals(runtime.getEventId())));
        creationOrder.verify(chatService).ensureMainEventChat(any(ActivityEvent.class), eq(List.of("u1", "u2")));
        creationOrder.verify(chatService).ensureInitialSystemMessage(
                eq(room1Id),
                eq(ChatService.RANDOM_ROOM_WELCOME_MESSAGE),
                eq(ChatService.RANDOM_ROOM_WELCOME_MESSAGE_TYPE));
        creationOrder.verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> room2Id.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u3", "u4")),
                anyList());
        creationOrder.verify(activityMainEventRuntimeRepository).save(
                argThat(runtime -> room2Id.equals(runtime.getEventId())));
        creationOrder.verify(chatService).ensureMainEventChat(any(ActivityEvent.class), eq(List.of("u3", "u4")));
        creationOrder.verify(chatService).ensureInitialSystemMessage(
                eq(room2Id),
                eq(ChatService.RANDOM_ROOM_WELCOME_MESSAGE),
                eq(ChatService.RANDOM_ROOM_WELCOME_MESSAGE_TYPE));
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                any(ActivityEvent.class),
                eq("scheduler"),
                argThat(userIds -> userIds.size() == 2 && !userIds.contains("private-user")),
                anyList());
    }

    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(booleans = {false, true})
    void tournamentStageStartAssignsEveryAcceptedMemberAcrossAllConfiguredGroups(boolean definitionOnly) {
        EventScheduler scheduler = createScheduler();

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-stage-start");
        event.setStatus("A");
        event.setCreatorUserId("casey");
        event.setTitle("Tournament stage start");
        event.setMode("Tournament");
        event.setSubEvents(List.of(subEvent("stage-start", 2, 1, 2)));
        if (definitionOnly) {
            event.setSubEvents(List.of());
            event.setSubEventsEnabled(true);
            event.setStartAtIso(Instant.now().minusSeconds(60).toString());
            event.setEndAtIso(Instant.now().plusSeconds(3600).toString());
            event.setSubEventDefinitions(List.of(
                    new com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto(
                            "stage-start", "Opening round", "", "After", 0, 60, "Arena",
                            1, 2, "Score", 1, false, null, 1, 4, null)));
            ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
            runtime.setOwnerId("event-stage-start");
            runtime.setSubEventId("stage-start");
            runtime.setStageStatus("A");
            when(activitySubEventStageRuntimeRepository.findByOwnerIdIn(List.of("event-stage-start")))
                    .thenReturn(List.of(runtime));
        }

        Users nonPublicAcceptedUser = user("casey");
        nonPublicAcceptedUser.setProfileStatus("friends only");
        when(activityEventsRepository.findBySourceIdIn(argThat(sourceIds ->
                sourceIds.size() == 1 && sourceIds.contains("event-stage-start"))))
                .thenReturn(List.of(event));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                nonPublicAcceptedUser,
                user("nova"),
                user("riley")));
        when(activitiesMembersService.buildBatchEventSnapshots(any()))
                .thenReturn(Map.of("event-stage-start", new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-stage-start",
                        List.of(),
                        List.of("casey", "nova", "riley"),
                        List.of("casey", "nova", "riley"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("casey"),
                        3)));
        when(activitiesMembersService.buildBatchOwnerSnapshots(eq("event"), anyCollection()))
                .thenReturn(Map.of());
        when(chatService.ensureMainEventChat(any(ActivityEvent.class), anyCollection()))
                .thenAnswer(invocation -> ((ActivityEvent) invocation.getArgument(0)).getSourceId());
        when(activitiesEventLeaderboardService.materializeGeneratedGroups(
                eq("event-stage-start"),
                eq("stage-start"),
                anyList()))
                .thenReturn(List.of(
                        new SubEventGroupItemDto("stage-start:group:1", "Group A", 1, 2, "generated"),
                        new SubEventGroupItemDto("stage-start:group:2", "Group B", 1, 2, "generated")));

        List<String> notificationOrder = new ArrayList<>();
        doAnswer(invocation -> {
            NotificationIntent intent = invocation.getArgument(0);
            notificationOrder.add(intent.title());
            return Optional.empty();
        }).when(notificationOutboxService).enqueue(any(NotificationIntent.class));

        List<GeneratedEventPlan> plans = scheduler.generateTournamentStagePlansForEvents(
                List.of("event-stage-start"),
                () -> notificationOrder.add("Tournament started"));

        assertThat(plans).hasSize(2);
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder("casey", "nova", "riley");
        assertThat(plans).allSatisfy(plan -> assertThat(plan.memberUserIds()).hasSizeBetween(1, 2));
        assertThat(notificationOrder).hasSize(3);
        assertThat(notificationOrder.get(0)).isEqualTo("Tournament started");
        assertThat(notificationOrder.subList(1, notificationOrder.size()))
                .allSatisfy(title -> assertThat(title).matches("Tournament Group R[12] is ready"));
        // One graph batch for all accepted members, without reloading profiles for each generated room.
        verify(usersRepository).findByUserIdIn(argThat(ids -> ids.size() == 3
                && ids.containsAll(List.of("casey", "nova", "riley"))));
        verify(usersRepository, times(1)).findByUserIdIn(anyCollection());
        verify(activityEventsRepository, never()).findAll();
        ArgumentCaptor<ActivityEvent> roomCaptor = ArgumentCaptor.forClass(ActivityEvent.class);
        verify(activitiesMembersService, times(2)).syncMaterializedSystemEventMembers(
                roomCaptor.capture(),
                eq("scheduler"),
                anyList(),
                anyList());
        assertThat(roomCaptor.getAllValues()).allSatisfy(room -> {
            assertThat(room.getTitle()).startsWith("Tournament Group R");
            assertThat(room.getSubtitle()).isEqualTo("Tournament group for Tournament stage start.");
            assertThat(room.getEventType()).isEqualTo("tournament-room");
            assertThat(room.getMode()).isEqualTo("Tournament");
            assertThat(room.getOwnerUserId()).isNull();
            assertThat(room.getCreatorUserId()).isNull();
            assertThat(room.getOrganizerUserId()).isEqualTo("casey");
            assertThat(room.getParentEventId()).isEqualTo("event-stage-start");
            assertThat(room.getGenerated()).isTrue();
            assertThat(room.getAvatar())
                    .isEqualTo("/media/public?key=images/system/tournament-room/v1/large.webp");
            assertThat(room.getImageUrl())
                    .isEqualTo("/media/public?key=images/system/tournament-room/v1/large.webp");
        });
        verify(activityMainEventRuntimeRepository, never()).save(any(ActivityMainEventRuntime.class));
        verify(chatService, times(2)).ensureInitialSystemMessage(
                anyString(),
                eq("Welcome to your tournament group for Tournament stage start. "
                        + "Use this chat to coordinate with your group and follow stage updates."),
                eq(ChatService.TOURNAMENT_ROOM_WELCOME_MESSAGE_TYPE));
        ArgumentCaptor<NotificationIntent> tournamentIntentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(tournamentIntentCaptor.capture());
        assertThat(tournamentIntentCaptor.getAllValues()).allSatisfy(intent -> {
            assertThat(intent.type()).isEqualTo(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS);
            assertThat(intent.title()).matches("Tournament Group R[12] is ready");
            assertThat(intent.body()).isEqualTo("Your tournament group for Tournament stage start is ready.");
            assertThat(intent.iconUrl())
                    .isEqualTo("/media/public?key=images/system/tournament-room/v1/large.webp");
            assertThat(intent.payload()).containsEntry("eventScope", "tournament-room");
            assertThat(intent.payload().get("eventTitle")).startsWith("Tournament Group R");
        });
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
        when(activitiesMembersService.buildBatchEventSnapshots(any())).thenReturn(Map.of());

        List<GeneratedEventPlan> plans = scheduler.generateRandomPlans();

        assertThat(plans).isEmpty();
        verify(activitiesMembersService).buildBatchEventSnapshots(argThat(Map::isEmpty));
        verify(activityEventsRepository, never()).save(any(ActivityEvent.class));
        verify(activitiesMembersService, never()).syncMaterializedSystemEventMembers(
                any(ActivityEvent.class), anyString(), anyList(), anyList());
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        verify(activitiesMembersService, times(2)).syncMaterializedSystemEventMembers(
                any(ActivityEvent.class),
                eq("scheduler"),
                anyList(),
                anyList());
        verify(activitiesMembersService, never()).syncMaterializedSystemEventMembers(
                argThat(room -> room3Id.equals(room.getSourceId())),
                anyString(),
                anyList(),
                anyList());
        verify(activityTournamentGroupCounterService, never()).syncParent("event-partial", "stage-partial");
    }

    @Test
    void generateScorePlansQueriesStateAgainAfterMaterializingGeneratedGroups() {
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
                        List.of(
                                new EventLeaderboardMemberDto("u1", "u1"),
                                new EventLeaderboardMemberDto("u3", "u3")),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of())));

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitiesEventLeaderboardService.queryState("event-1", "sub-1")).thenReturn(state);

        List<EventLeaderboardStateDto> states = scheduler.generateScorePlans();

        assertThat(states).containsExactly(state);
        InOrder leaderboardOrder = inOrder(activitiesEventLeaderboardService);
        leaderboardOrder.verify(activitiesEventLeaderboardService).queryState("event-1", "sub-1");
        leaderboardOrder.verify(activitiesEventLeaderboardService).materializeGeneratedGroups("event-1", "sub-1");
        leaderboardOrder.verify(activitiesEventLeaderboardService).queryState("event-1", "sub-1");
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> roomAId.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u1", "u2")),
                anyList());
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> roomBId.equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u3", "u4")),
                anyList());
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
                withStageResultRevision(withStageStatus(explicitSubEvent("sub-1"), "F"), 1),
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
                        List.of(
                                new EventLeaderboardMemberDto("u1", "u1"),
                                new EventLeaderboardMemberDto("u3", "u3")),
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
                        List.of(new EventLeaderboardMemberDto("u2", "u2")),
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
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(notificationCaptor.capture());
        assertThat(notificationCaptor.getAllValues().get(0)).satisfies(notification -> {
            assertThat(notification.type()).isEqualTo("event-stage-advanced");
            assertThat(notification.recipientUserIds()).containsExactly("u1", "u2");
            assertThat(notification.createdUser()).isEqualTo("scheduler");
            assertThat(notification.payload())
                    .containsEntry("notification_title_key", "notification.event.stage.advanced.title")
                    .containsEntry("notification_message_key", "notification.event.stage.advanced.message")
                    .containsEntry("stageTitle", "Round 2")
                    .containsEntry("nextStageTitle", "Final")
                    .containsEntry("notification_avatar_tone", "stage")
                    .containsEntry("notification_avatar_icon", "emoji_events")
                    .containsEntry("stageIndex", "2")
                    .containsEntry("stageTotal", "2")
                    .containsEntry("notification_tone", "success");
        });
        assertThat(notificationCaptor.getAllValues().get(1)).satisfies(notification -> {
            assertThat(notification.type()).isEqualTo("event-stage-not-advanced");
            assertThat(notification.recipientUserIds()).containsExactly("u3");
            assertThat(notification.createdUser()).isEqualTo("scheduler");
            assertThat(notification.payload())
                    .containsEntry("notification_title_key", "notification.event.stage.not-advanced.title")
                    .containsEntry("notification_message_key", "notification.event.stage.not-advanced.message")
                    .containsEntry("stageTitle", "Round 2")
                    .containsEntry("nextStageTitle", "Final")
                    .containsEntry("notification_avatar_tone", "stage")
                    .containsEntry("notification_avatar_icon", "emoji_events")
                    .containsEntry("stageIndex", "1")
                    .containsEntry("stageTotal", "2")
                    .containsEntry("notification_tone", "warning");
        });
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
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(user("u1"), user("u2")));
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
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(user("u1"), user("u2")));
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
                        List.of("u1", "u2"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        2));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
                        List.of("u1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        1));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(user("u1")));
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
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
                        List.of("u1", "u2", "u3"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("creator-1"),
                        3));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        verify(activitiesMembersService).syncMaterializedSystemEventMembers(
                argThat(room -> "random-room:event-advancement:final:final-group".equals(room.getSourceId())),
                eq("scheduler"),
                eq(List.of("u1", "u2")),
                anyList());
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
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
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                user("u1"),
                user("u2")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of(
                rate("u1", "u2", 1.0d)));
        ActivitiesMembersService.OwnerMembersSnapshot eventSnapshot = new ActivitiesMembersService.OwnerMembersSnapshot(
                "event",
                "event-4",
                List.of(),
                List.of("u1", "u2"),
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

    @Test
    void closesDefinitionOnlyStageInCanonicalRuntimeWithoutEmbeddingItsDefinition() {
        EventScheduler scheduler = createScheduler();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("definition-review");
        event.setStatus("A");
        event.setMode("Tournament");
        event.setSubEventsEnabled(true);
        event.setSubEvents(List.of());
        event.setStartAtIso("2026-05-12T09:00:00Z");
        event.setEndAtIso("2026-05-12T10:00:00Z");
        event.setSubEventDefinitions(List.of(
                new com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto(
                        "opening", "Opening", "", "After", 0, 60, "Arena",
                        1, 2, "Score", 1, false, null, 1, 4, null)));
        ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
        runtime.setOwnerId("definition-review");
        runtime.setSubEventId("opening");
        runtime.setStageStatus("A");
        runtime.setStageStatusUpdatedAt("2026-05-12T09:00:00Z");
        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdIn(List.of("definition-review")))
                .thenReturn(List.of(runtime));

        assertThat(scheduler.closeEndedTournamentStagesForReview(Instant.parse("2026-05-12T12:00:00Z")))
                .isEqualTo(1);
        assertThat(runtime.getStageStatus()).isEqualTo("SR");
        assertThat(runtime.getStageStatusReason()).isEqualTo("stage-ended");
        assertThat(event.getSubEvents()).isEmpty();
        verify(activitySubEventStageRuntimeRepository).saveAll(java.util.Set.of(runtime));
        verify(activityEventsRepository, never()).saveAll(any());
    }

    private EventScheduler createScheduler() {
        org.mockito.Mockito.lenient().doAnswer(call -> {
            JobGroupContext.run(null, call.getArgument(1)); return null;
        }).when(notificationRuleRegistryService).forEachGroup(org.mockito.ArgumentMatchers.<java.util.Set<String>>any(), any(Runnable.class));
        org.mockito.Mockito.lenient().doAnswer(call -> {
            JobGroupContext.run(null, call.getArgument(1)); return null;
        }).when(notificationRuleRegistryService).forEachGroup(anyString(), any(Runnable.class));

        lenient().when(usersRepository.findByUserIdIn(anyCollection()))
                .thenAnswer(invocation -> ((java.util.Collection<String>) invocation.getArgument(0))
                        .stream()
                        .map(this::user)
                        .toList());
        lenient().when(schedulerPlanMarkersRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());
        lenient().when(activityEventsRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());
        lenient().when(activityMainEventRuntimeRepository.findByEventIdAndRuntimeKind(
                anyString(),
                eq(ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT)))
                .thenReturn(Optional.empty());
        lenient().when(activityEventsRepository.save(any(ActivityEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(activitiesMembersService.syncMaterializedSystemEventMembers(
                        any(ActivityEvent.class),
                        eq("scheduler"),
                        anyList(),
                        anyList()))
                .thenAnswer(invocation -> invocation.getArgument(2));
        EventScheduler scheduler = new EventScheduler(
                new com.raxim.myscoutee.domain.affinity.service.RatingDirectoryService(userRatesRepository),
                affinityEdgeService,
                new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(groupsRepository),
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                new com.raxim.myscoutee.domain.affinity.service.EdgeDirectoryService(userAffinityEdgesRepository),
                activityEventsRepository,
                activityMainEventRuntimeRepository,
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
                notificationOutboxService,
                new com.raxim.myscoutee.domain.events.mapper.ActivityEventSubEventsMapper());
        scheduler.setActivitySubEventStageRuntimeRepository(activitySubEventStageRuntimeRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(scheduler, "jobGroupScope", jobScope());
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
        return copyStage(item, stageStatus, item.stageResultRevision());
    }

    private SubEventItem withStageResultRevision(SubEventItem item, Integer stageResultRevision) {
        return copyStage(item, item.stageStatus(), stageResultRevision);
    }

    private SubEventItem copyStage(SubEventItem item, String stageStatus, Integer stageResultRevision) {
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
                item.groupsPending(),
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
                item.stageFinalizedByUserId(),
                stageResultRevision,
                item.groups());
    }
}
