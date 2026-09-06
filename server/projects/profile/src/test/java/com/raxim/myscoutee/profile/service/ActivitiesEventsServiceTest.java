package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMainEventRuntime;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardMemberDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventListPageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventGroupsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventDetailMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventSubEventsMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventStageRuntimeMapper;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@ExtendWith(MockitoExtension.class)
class ActivitiesEventsServiceTest {
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivitySubEventGroupsRepository activitySubEventGroupsRepository;
    @Mock
    private ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivitiesResourcesService activitiesResourcesService;
    @Mock
    private EventParticipationTicketService eventParticipationTicketService;
    @Mock
    private PaymentService paymentService;
    @Mock
    private EventCheckoutBasketService eventCheckoutBasketService;
    @Mock
    private EventCheckoutPricingService eventCheckoutPricingService;
    @Mock
    private ScheduledMessageTaskService scheduledMessageTaskService;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private ChatAttachmentLifecycleService chatAttachmentLifecycleService;
    @Mock
    private NotificationOutboxService notificationOutboxService;
    @Mock
    private EventInviteNotificationService eventInviteNotificationService;
    @Mock
    private ObjectProvider<EventScheduler> eventSchedulerProvider;
    @Mock
    private EventScheduler eventScheduler;
    @Mock
    private ChatService chatService;
    @Mock
    private ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    @Mock
    private EventSlotReadModelService eventSlotReadModelService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private UserActivityCountersService userActivityCountersService;

    private ActivitiesEventsService service;
    private final AbsoluteAffinityService absoluteAffinityService = new AbsoluteAffinityService(null, null);
    private final ActivityEventDetailMapper activityEventDetailMapper = new ActivityEventDetailMapper();
    private final ActivityEventMapper activityEventMapper = new ActivityEventMapper();
    private final ActivityEventSubEventsMapper activityEventSubEventsMapper = new ActivityEventSubEventsMapper();
    private final ActivitySubEventResourceMapper activitySubEventResourceMapper = new ActivitySubEventResourceMapper();
    private final ActivitySubEventStageRuntimeMapper activitySubEventStageRuntimeMapper = new ActivitySubEventStageRuntimeMapper();

    @BeforeEach
    void setUp() {
        service = new ActivitiesEventsService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventResourcesRepository,
                activitySubEventStageRuntimeRepository,
                activityMembersRepository,
                usersRepository,
                userAffinityEdgesRepository,
                homeUserProfileService,
                activitiesMembersService,
                activitiesResourcesService,
                eventParticipationTicketService,
                paymentService,
                eventCheckoutBasketService,
                eventCheckoutPricingService,
                scheduledMessageTaskService,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                mongoTemplate,
                chatAttachmentLifecycleService,
                notificationOutboxService,
                eventInviteNotificationService,
                eventSchedulerProvider,
                chatService,
                activitiesEventLeaderboardService,
                eventSlotReadModelService,
                accessControlService,
                userActivityCountersService,
                activityEventDetailMapper,
                activityEventMapper,
                activityEventSubEventsMapper,
                activitySubEventResourceMapper,
                activitySubEventStageRuntimeMapper);
        lenient().when(eventCheckoutPricingService.reprice(any())).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(accessControlService.canCurrentActorCreateEvent(anyString(), anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorEditEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorPublishEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorUnpublishEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorDeleteEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorRestoreEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorTakeOverEvent(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorJoinEvent(anyString(), anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorApplyEventStageAction(anyString())).thenReturn(true);
    }

    @Test
    void mostRelevantExploreUsesKnownViewerHostEdgeBeforeColdStartAffinityGap() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setAffinity(100d);

        ActivityEvent knownHostEvent = event("known-event", "known-host", 900_000d);
        ActivityEvent coldStartEvent = event("cold-event", "cold-host", 100d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(coldStartEvent, knownHostEvent));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", false)).thenReturn(Map.of());
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList()))
                .thenReturn(List.of(edge("viewer", "known-host", 0.92d)));

        EventsExplorePageDto page = service.queryEventExplorePage(new EventsExploreQueryDto(
                "viewer",
                "most-relevant",
                "day",
                false,
                false,
                null,
                10,
                null,
                List.of()));

        assertThat(page.records()).extracting(record -> record.id())
                .containsExactly("known-event", "cold-event");
        verify(activityEventsRepository, never()).findAll();
        verify(userAffinityEdgesRepository).findRelevantByUserIds(anyList());
    }

    @Test
    void subEventReloadKeepsStoredCommonCountersWhenViewerResourceStateDiffers() {
        Users viewer = new Users();
        viewer.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setSubEventsEnabled(true);
        parent.setSlotsEnabled(false);
        parent.setSubEventDefinitions(List.of(new SubEventDefinitionDto(
                "optional-1",
                "Optional activity",
                "",
                "During",
                0,
                60,
                "",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                16,
                null)));
        parent.setSubEvents(List.of(new SubEventItem(
                "optional-1",
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
                0,
                60).withResourceMetrics(
                        3, 1, 0, 4,
                        1, 0, 0, 3,
                        3, 0, 0, 6)));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(parent));
        when(activitySubEventResourcesRepository.findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                Set.of("event-1"),
                Set.of("host"),
                "D"))
                .thenReturn(List.of(resourceState("event-1", "optional-1", "host", 2, 2, 24)));

        EventSubEventsResultDto result = service.loadSubEventsById(new EventSubEventsQueryDto(
                "host",
                "event-1",
                "upcoming",
                "day",
                null,
                null,
                null,
                false));

        assertThat(result.slots()).singleElement().satisfies(slot ->
                assertThat(slot.subEventItems()).singleElement().satisfies(item -> {
                    assertThat(item.membersAccepted()).isEqualTo(1);
                    assertThat(item.membersPending()).isEqualTo(1);
                    assertThat(item.carsAccepted()).isEqualTo(3);
                    assertThat(item.carsPending()).isEqualTo(1);
                    assertThat(item.carsCapacityMin()).isZero();
                    assertThat(item.carsCapacityMax()).isEqualTo(4);
                    assertThat(item.accommodationAccepted()).isEqualTo(1);
                    assertThat(item.accommodationCapacityMax()).isEqualTo(3);
                    assertThat(item.suppliesAccepted()).isEqualTo(3);
                    assertThat(item.suppliesCapacityMax()).isEqualTo(6);
                }));
        verify(activitySubEventResourcesRepository)
                .findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                        Set.of("event-1"), Set.of("host"), "D");
        verify(activitiesResourcesService, never()).queryState(anyString(), anyString(), anyString());
        verify(activitiesMembersService, never())
                .buildBatchOwnerSnapshots(anyString(), anyCollection());
    }

    @Test
    void childlessMainEventReloadUsesItsRuntimeResourceMetricProjection() {
        Users viewer = new Users();
        viewer.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setSubEventsEnabled(false);
        parent.setSlotsEnabled(false);
        parent.setSubEventDefinitions(List.of());

        ActivityMainEventRuntime runtime = new ActivityMainEventRuntime();
        runtime.setRecordId("main-event:event-1");
        runtime.setRuntimeKind("MAIN_EVENT");
        runtime.setStatus(ActivityEvent.STATUS_ACTIVE);
        runtime.setEventId("event-1");
        runtime.setOwnerId("event-1");
        runtime.setTitle("Event event-1");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(parent));
        when(mongoTemplate.findOne(any(Query.class), eq(ActivityMainEventRuntime.class))).thenReturn(runtime);
        when(activitySubEventResourcesRepository.findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                Set.of("event-1"),
                Set.of("host"),
                "D"))
                .thenReturn(List.of(resourceState("event-1", "main-event:event-1", "host", 1, 1, 4)));

        EventSubEventsResultDto result = service.loadSubEventsById(new EventSubEventsQueryDto(
                "host",
                "event-1",
                "upcoming",
                "day",
                null,
                null,
                null,
                false));

        assertThat(result.slots()).singleElement().satisfies(slot ->
                assertThat(slot.subEventItems()).singleElement().satisfies(item -> {
                    assertThat(item.runtimeKind()).isEqualTo("MAIN_EVENT");
                    assertThat(item.id()).isEqualTo("main-event:event-1");
                    assertThat(item.carsAccepted()).isEqualTo(1);
                    assertThat(item.carsPending()).isEqualTo(1);
                    assertThat(item.carsCapacityMin()).isZero();
                    assertThat(item.carsCapacityMax()).isEqualTo(4);
                }));
        verify(activitySubEventResourcesRepository)
                .findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                        Set.of("event-1"), Set.of("host"), "D");
    }

    @Test
    void publishActivatesCanonicalEventAndEnqueuesEventRecomputeForSavedLifecycleState() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent event = event("event-1", "host", 0d);
        event.setStatus(ActivityEvent.STATUS_DRAFT);
        AtomicReference<ActivityEvent> currentEvent = new AtomicReference<>(event);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of("pending-invitee"),
                        List.of("pending-invitee"),
                        List.of(),
                        Set.of("host"),
                        8);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> saved = invocation.getArgument(0);
            currentEvent.set(saved.get(0));
            return saved;
        });
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(membersSnapshot);
        when(activitiesMembersService.buildBatchOwnerSnapshots("event", Set.of("event-1")))
                .thenReturn(Map.of("event-1", membersSnapshot));
        when(chatService.ensurePublishedMainEventChat(any(ActivityEvent.class), eq(List.of("host"))))
                .thenReturn(new ChatService.PublishedMainEventChatResult("event-1", Set.of("host")));

        EventParticipationActionResultDto result = service.publish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        verify(activitiesMembersService).ensureEventCreatorAdminMembership("event-1", "host");
        verify(chatService).updateEventChatOwnerStatus("event-1", ActivityEvent.STATUS_ACTIVE);
        assertThat(savedCaptor.getAllValues().get(0)).singleElement().satisfies(record -> {
            assertThat(record.getSourceId()).isEqualTo("event-1");
            assertThat(record.getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
            assertThat(record.getPublished()).isTrue();
            assertThat(record.getAdmins()).contains("host");
        });
        verify(affinityRecomputeTaskService).enqueueEventChanged("event-1", "host");
        ArgumentCaptor<ActivityEvent> chatEventCaptor = ArgumentCaptor.forClass(ActivityEvent.class);
        verify(chatService).ensurePublishedMainEventChat(chatEventCaptor.capture(), eq(List.of("host")));
        assertThat(chatEventCaptor.getValue().getSourceId()).isEqualTo("event-1");
        assertThat(chatEventCaptor.getValue().getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
        assertThat(chatEventCaptor.getValue().getPublished()).isTrue();
        assertThat(result.counterDelta().chats()).isNull();
        assertThat(result.counterDelta().chat()).isNull();
        assertThat(result.counterDelta().event().drafts()).isEqualTo(-1);
        assertThat(result.counterDelta().hosting()).isNull();
        verify(eventInviteNotificationService).notifyInvitees(
                any(ActivityEvent.class),
                eq(List.of("pending-invitee")),
                eq("host"));
        InOrder ticketCounterOrder = org.mockito.Mockito.inOrder(
                eventParticipationTicketService,
                userActivityCountersService);
        ticketCounterOrder.verify(eventParticipationTicketService)
                .syncParticipationTicketsForEvent("event-1");
        ticketCounterOrder.verify(userActivityCountersService)
                .refreshEventCountersForDocuments(anyList());
    }

    @Test
    void republishNotifiesOtherParticipantsAsModifiedWithoutDuplicatingTheInviteOrChatDelta() {
        ActivityEvent event = event("event-1", "host", 0d);
        event.setStatus(ActivityEvent.STATUS_DRAFT);
        AtomicReference<ActivityEvent> currentEvent = new AtomicReference<>(event);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of("pending-invitee"),
                        List.of("pending-invitee"),
                        List.of(),
                        Set.of("host"),
                        8);

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> saved = invocation.getArgument(0);
            currentEvent.set(saved.get(0));
            return saved;
        });
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(membersSnapshot);
        when(activitiesMembersService.buildBatchOwnerSnapshots("event", Set.of("event-1")))
                .thenReturn(Map.of("event-1", membersSnapshot));
        when(chatService.ensurePublishedMainEventChat(any(ActivityEvent.class), eq(List.of("host"))))
                .thenReturn(new ChatService.PublishedMainEventChatResult("event-1", Set.of()));

        EventParticipationActionResultDto result = service.publish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> audienceCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(scheduledMessageTaskService).scheduleEventLifecycleChanged(
                eq("event-1"),
                eq("event-1"),
                audienceCaptor.capture(),
                eq(List.of("modified")),
                eq("host"));
        assertThat(audienceCaptor.getValue()).containsExactly("pending-invitee");
        verify(eventInviteNotificationService, never())
                .notifyInvitees(any(ActivityEvent.class), anyList(), anyString());
        assertThat(result.counterDelta().chats()).isNull();
        assertThat(result.counterDelta().event().drafts()).isEqualTo(-1);
    }

    @Test
    void republishWithRecreatedActorChatStillNotifiesAcceptedParticipantsAsAvailableAgain() {
        ActivityEvent event = event("event-1", "host", 0d);
        event.setStatus(ActivityEvent.STATUS_DRAFT);
        AtomicReference<ActivityEvent> currentEvent = new AtomicReference<>(event);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "accepted-member"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        8);

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> saved = invocation.getArgument(0);
            currentEvent.set(saved.get(0));
            return saved;
        });
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(membersSnapshot);
        when(activitiesMembersService.buildBatchOwnerSnapshots("event", Set.of("event-1")))
                .thenReturn(Map.of("event-1", membersSnapshot));
        when(chatService.ensurePublishedMainEventChat(
                any(ActivityEvent.class),
                eq(List.of("host", "accepted-member"))))
                .thenReturn(new ChatService.PublishedMainEventChatResult("event-1", Set.of("host")));

        service.publish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> audienceCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(scheduledMessageTaskService).scheduleEventLifecycleChanged(
                eq("event-1"),
                eq("event-1"),
                audienceCaptor.capture(),
                eq(List.of("modified")),
                eq("host"));
        assertThat(audienceCaptor.getValue()).containsExactly("accepted-member");
    }

    @Test
    void publishStopsBeforeSaveWhenPolicyDenies() {
        when(accessControlService.canCurrentActorPublishEvent("event-1")).thenReturn(false);

        service.publish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(scheduledMessageTaskService, never()).scheduleEventStageReminders(any(), anyString());
        verify(chatAttachmentLifecycleService, never()).markEventAvailable(anyString());
    }

    @Test
    void unpublishStopsBeforeSaveWhenPolicyDenies() {
        when(accessControlService.canCurrentActorUnpublishEvent("event-1")).thenReturn(false);

        service.unpublish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(scheduledMessageTaskService, never()).scheduleEventStageReminders(any(), anyString());
        verify(chatAttachmentLifecycleService, never()).markEventUnavailable(anyString(), anyString());
    }

    @Test
    void unpublishExcludesTheActorFromLifecycleNotificationAudience() {
        ActivityEvent event = event("event-1", "host", 0d);
        AtomicReference<ActivityEvent> currentEvent = new AtomicReference<>(event);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "accepted-member"),
                        List.of("pending-invitee"),
                        List.of("pending-invitee"),
                        List.of(),
                        Set.of("host"),
                        8);

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenAnswer(invocation -> List.of(currentEvent.get()));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> saved = invocation.getArgument(0);
            currentEvent.set(saved.get(0));
            return saved;
        });
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(membersSnapshot);

        service.unpublish(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(chatService).updateEventChatOwnerStatus("event-1", ActivityEvent.STATUS_DRAFT);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> audienceCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(scheduledMessageTaskService).scheduleEventLifecycleChanged(
                eq("event-1"),
                eq("event-1"),
                audienceCaptor.capture(),
                eq(List.of("under-review")),
                eq("host"));
        assertThat(audienceCaptor.getValue())
                .containsExactlyInAnyOrder("accepted-member", "pending-invitee");
        InOrder ticketCounterOrder = org.mockito.Mockito.inOrder(
                eventParticipationTicketService,
                userActivityCountersService);
        ticketCounterOrder.verify(eventParticipationTicketService)
                .syncParticipationTicketsForEvent("event-1");
        ticketCounterOrder.verify(userActivityCountersService)
                .refreshEventCountersForDocuments(anyList());
    }

    @Test
    void organizerTrashStopsBeforeLeaveSideEffectsWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent event = event("event-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));
        when(accessControlService.canCurrentActorDeleteEvent("event-1")).thenReturn(false);

        service.trash(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(paymentService, never()).cancelEventBooking(anyString(), anyString(), any(), any());
        verify(chatService, never()).postSystemMessage(anyString(), anyString(), anyString());
    }

    @Test
    void participantLeaveSuppressesTheWholeParticipationTreeOnce() {
        Users viewer = new Users();
        viewer.setId("viewer");
        ActivityEvent event = event("event-1", "host", 0d);
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        10,
                        true);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.suppressEventParticipationTree("event-1", "viewer", "viewer"))
                .thenReturn(members);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));

        EventParticipationActionResultDto result = service.trash(new EventActionRequestDto(
                "viewer",
                "event-1",
                "slot-1",
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null,
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                true,
                null,
                null,
                null));

        assertThat(result).isNotNull();
        assertThat(result.sourceId()).isEqualTo("event-1");
        assertThat(result.slotSourceId()).isEqualTo("slot-1");
        assertThat(result.membershipStatus()).isEqualTo("trashed");
        assertThat(result.changed()).isTrue();
        assertThat(result.acceptedMembers()).isEqualTo(1);
        verify(activitiesMembersService).suppressEventParticipationTree("event-1", "viewer", "viewer");
        verify(activitiesMembersService, never()).removeEventParticipation(anyString(), anyString(), anyString());
        verify(activityEventsRepository, never()).findByParentEventIdIn(anyList());
    }

    @Test
    void participantTrashWithoutExplicitMembershipFlagStillSuppressesParticipation() {
        Users viewer = new Users();
        viewer.setId("viewer");
        ActivityEvent event = event("event-1", "host", 0d);
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        10,
                        true);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.suppressEventParticipationTree("event-1", "viewer", "viewer"))
                .thenReturn(members);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));

        EventParticipationActionResultDto result = service.trash(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        assertThat(result).isNotNull();
        assertThat(result.changed()).isTrue();
        assertThat(result.membershipStatus()).isEqualTo("trashed");
        verify(activitiesMembersService).suppressEventParticipationTree("event-1", "viewer", "viewer");
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void organizerRestoreStopsBeforeSaveWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent event = event("event-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));
        when(accessControlService.canCurrentActorRestoreEvent("event-1")).thenReturn(false);

        EventParticipationActionResultDto result = service.restore(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        assertThat(result).isNotNull();
        assertThat(result.changed()).isFalse();
        assertThat(result.reason()).isEqualTo("forbidden");
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(chatAttachmentLifecycleService, never()).markEventAvailable(anyString());
        verify(activitiesMembersService, never()).restoreEventParticipationTree(anyString(), anyString(), anyString());
    }

    @Test
    void participantRestoreDelegatesToTheParticipationTreeWithoutLifecycleWrites() {
        Users viewer = new Users();
        viewer.setId("viewer");
        ActivityEvent event = event("event-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));
        when(activitiesMembersService.restoreEventParticipationTree("event-1", "viewer", "viewer"))
                .thenReturn(true);

        EventParticipationActionResultDto result = service.restore(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        assertThat(result).isNotNull();
        assertThat(result.changed()).isTrue();
        assertThat(result.action()).isEqualTo("restore");
        verify(activitiesMembersService).restoreEventParticipationTree("event-1", "viewer", "viewer");
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(scheduledMessageTaskService, never()).scheduleEventStageReminders(any(), anyString());
        verify(chatAttachmentLifecycleService, never()).markEventAvailable(anyString());
        verify(userActivityCountersService, never()).refreshEventCountersForDocuments(anyList());
    }

    @Test
    void takeOverStopsBeforeLoadWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(accessControlService.canCurrentActorTakeOverEvent("event-1")).thenReturn(false);

        service.takeOver(new EventActionRequestDto(
                "host",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(activityEventsRepository, never()).findBySourceId(anyString());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void requestJoinStopsBeforeMemberWriteWhenPolicyDenies() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");
        ActivityEvent event = event("event-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));
        when(accessControlService.canCurrentActorJoinEvent("viewer", "event-1")).thenReturn(false);

        EventParticipationActionResultDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        assertThat(result).isNotNull();
        verify(activitiesMembersService, never()).requestJoin(anyString(), any(), any(), any(Boolean.class), any(Boolean.class), any(Boolean.class));
        verify(paymentService, never()).recordEventJoin(anyString(), any(), anyString(), any(), any(), any());
    }

    @Test
    void requestJoinLeavesTheSingleDirtySignalToTheMembershipMutation() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");
        ActivityEvent event = event("event-1", "host", 0d);
        ActivitiesMembersService.OwnerMembersSnapshot before =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        10);
        ActivitiesMembersService.OwnerMembersSnapshot after =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("viewer"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        10,
                        true);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(before);
        when(activitiesMembersService.requestJoin(
                anyString(),
                any(Users.class),
                any(ActivityEvent.class),
                anyBoolean(),
                anyBoolean(),
                anyBoolean())).thenReturn(after);

        EventParticipationActionResultDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                true,
                null));

        assertThat(result).isNotNull();
        assertThat(result.membershipStatus()).isEqualTo("accepted");
        assertThat(result.changed()).isTrue();
        verify(activitiesMembersService).requestJoin(
                anyString(),
                any(Users.class),
                any(ActivityEvent.class),
                anyBoolean(),
                anyBoolean(),
                anyBoolean());
        verify(affinityRecomputeTaskService, never())
                .enqueueEventMembersChanged(anyString(), anyString());
    }

    @Test
    void requestJoinUsesTheActiveSlotWhenAnOlderTrashedCopyHasTheSameSourceId() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");
        ActivityEvent root = event("event-1", "host", 0d);
        ActivityEvent activeSlot = event("slot-1", "host", 0d);
        activeSlot.setId("slot-active-document");
        activeSlot.setGenerated(true);
        activeSlot.setEventType("slot");
        activeSlot.setParentEventId("event-1");
        ActivityEvent trashedSlot = event("slot-1", "host", 0d);
        trashedSlot.setId("slot-trashed-document");
        trashedSlot.setGenerated(true);
        trashedSlot.setEventType("slot");
        trashedSlot.setParentEventId("event-1");
        trashedSlot.setStatus(ActivityEvent.STATUS_TRASHED);
        ActivitiesMembersService.OwnerMembersSnapshot before =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event", "event-1", List.of(), List.of("host"), List.of(), List.of(), List.of(), Set.of("host"), 10);
        ActivitiesMembersService.OwnerMembersSnapshot rootAfter =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event", "event-1", List.of(), List.of("host", "viewer"), List.of(), List.of(), List.of(), Set.of("host"), 10, true);
        ActivitiesMembersService.OwnerMembersSnapshot slotAfter =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event", "slot-1", List.of(), List.of("host", "viewer"), List.of(), List.of(), List.of(), Set.of("host"), 10, true);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(root));
        when(activityEventsRepository.findBySourceIdIn(List.of("slot-1")))
                .thenReturn(List.of(trashedSlot, activeSlot));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(before);
        when(activitiesMembersService.requestJoin("event-1", viewer, root, true, false, false))
                .thenReturn(rootAfter);
        when(activitiesMembersService.requestJoin("slot-1", viewer, activeSlot, true, false, false))
                .thenReturn(slotAfter);

        EventParticipationActionResultDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "event-1",
                "slot-1",
                List.of(),
                List.of(),
                List.of(),
                null,
                true,
                null));

        assertThat(result).isNotNull();
        assertThat(result.membershipStatus()).isEqualTo("accepted");
        verify(activitiesMembersService).requestJoin("slot-1", viewer, activeSlot, true, false, false);
        verify(activitiesMembersService, never()).requestJoin("slot-1", viewer, trashedSlot, true, false, false);
    }

    @Test
    void repeatedAcceptedJoinReportsNoMutation() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");
        ActivityEvent event = event("event-1", "host", 0d);
        ActivitiesMembersService.OwnerMembersSnapshot acceptedSnapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "viewer"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        10);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(acceptedSnapshot);
        when(activitiesMembersService.requestJoin(
                anyString(),
                any(Users.class),
                any(ActivityEvent.class),
                anyBoolean(),
                anyBoolean(),
                anyBoolean())).thenReturn(acceptedSnapshot);

        EventParticipationActionResultDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                true,
                null));

        assertThat(result).isNotNull();
        assertThat(result.membershipStatus()).isEqualTo("accepted");
        assertThat(result.changed()).isFalse();
        assertThat(result.counterDelta()).isNull();
        verify(affinityRecomputeTaskService, never())
                .enqueueEventMembersChanged(anyString(), anyString());
    }

    @Test
    void invitationResponseReturnsInvitationToPendingCounterDirections() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");
        ActivityEvent event = event("event-1", "host", 0d);
        ActivitiesMembersService.OwnerMembersSnapshot before =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of("viewer"),
                        List.of("viewer"),
                        List.of(),
                        Set.of("host"),
                        8);
        ActivitiesMembersService.OwnerMembersSnapshot after =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host"),
                        List.of("viewer"),
                        List.of(),
                        List.of("viewer"),
                        Set.of("host"),
                        8,
                        true);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(event));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(before);
        when(activitiesMembersService.hasPendingInvitation("event-1", "viewer")).thenReturn(true);
        when(activitiesMembersService.pendingInvitationRequiresAdminApproval("event-1", "viewer"))
                .thenReturn(true);
        when(activitiesMembersService.requestJoin(
                "event-1",
                viewer,
                event,
                false,
                false,
                true)).thenReturn(after);

        EventParticipationActionResultDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                true,
                null));

        assertThat(result).isNotNull();
        assertThat(result.membershipStatus()).isEqualTo("pending");
        assertThat(result.pendingReason()).isEqualTo("approval");
        assertThat(result.counterDelta()).isNotNull();
        assertThat(result.counterDelta().invitations()).isEqualTo(-1);
        assertThat(result.counterDelta().event().pending()).isEqualTo(1);
        assertThat(result.counterDelta().event().invitations()).isEqualTo(-1);
    }

    @Test
    void stageActionStopsBeforeLoadWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(accessControlService.canCurrentActorApplyEventStageAction("event-1")).thenReturn(false);

        EventStageActionResultDto result = service.applyStageAction(new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                "host",
                "event-1",
                null,
                "stage-1",
                null,
                "start-tournament",
                null));

        assertThat(result).isNull();
        verify(activityEventsRepository, never()).findBySourceId(anyString());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void generatedSlotFinalizeSignalsParentEventForScheduledRecomputation() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        ActivityEvent slot = event("slot-1", "host", 0d);
        slot.setGenerated(true);
        slot.setEventType("slot");
        slot.setParentEventId("event-1");
        slot.setSubEvents(List.of(stage("stage-1", "SR")));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(activityEventsRepository.findBySourceIdIn(List.of("slot-1"))).thenReturn(List.of(slot));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("slot-1", "stage-1"))
                .thenReturn(Optional.empty());

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        "slot-1",
                        "stage-1",
                        0,
                        "finalize-stage",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.sourceId()).isEqualTo("slot-1");
        assertThat(result.stageStatus()).isEqualTo("F");
        verify(affinityRecomputeTaskService).enqueueEventChanged("event-1", "host");
        verify(userActivityCountersService, never()).refreshEventCountersForDocuments(anyList());
    }

    @Test
    void manualParentStageFinalizeNotifiesOtherParticipantsOnly() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setAcceptedMemberUserIds(List.of("host", "nova", "riley"));
        parent.setSubEvents(List.of(
                stage("stage-1", "SR"),
                stage("stage-2", "RS")));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "stage-1"))
                .thenReturn(Optional.empty());
        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        null,
                        "stage-1",
                        0,
                        "finalize-stage",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.stageStatus()).isEqualTo("F");
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        NotificationIntent notification = notificationCaptor.getValue();
        assertThat(notification.type()).isEqualTo("event-stage-finalized");
        assertThat(notification.title()).isEqualTo("stage-1 finalized");
        assertThat(notification.recipientUserIds()).containsExactly("nova", "riley");
        assertThat(notification.recipientUserIds()).doesNotContain("host");
        assertThat(notification.payload())
                .containsEntry("notification_title_key", "notification.event.stage.finalized.title")
                .containsEntry("notification_message_key", "notification.event.stage.finalized.message")
                .containsEntry("stageIndex", "1")
                .containsEntry("stageTotal", "2")
                .doesNotContainKeys("notification_avatar_tone", "notification_avatar_icon");
    }

    @Test
    void reopenScoresNotifiesOtherStageParticipantsThatScoresAreUnderReview() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setAcceptedMemberUserIds(List.of("host", "nova", "riley"));
        parent.setSubEvents(List.of(
                stage("qualifiers", "F"),
                stage("final", "RS")));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "qualifiers"))
                .thenReturn(Optional.empty());

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        null,
                        "qualifiers",
                        0,
                        "reopen-scores",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.stageStatus()).isEqualTo("SR");
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        NotificationIntent notification = notificationCaptor.getValue();
        assertThat(notification.type()).isEqualTo("event-stage-scores-under-review");
        assertThat(notification.title()).isEqualTo("qualifiers scores under review");
        assertThat(notification.body()).isEqualTo("qualifiers scores were reopened and are under review.");
        assertThat(notification.recipientUserIds()).containsExactly("nova", "riley");
        assertThat(notification.recipientUserIds()).doesNotContain("host");
        assertThat(notification.createdUser()).isEqualTo("host");
        assertThat(notification.payload())
                .containsEntry("notification_title_key", "notification.event.stage.scores-under-review.title")
                .containsEntry("notification_message_key", "notification.event.stage.scores-under-review.message")
                .containsEntry("notification_tone", "info")
                .containsEntry("stageIndex", "1")
                .containsEntry("stageTotal", "2")
                .doesNotContainKeys("notification_avatar_tone", "notification_avatar_icon");
    }

    @Test
    void manualFinalStageFinalizeKeepsHumanAuditSeparateFromSystemResults() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setAcceptedMemberUserIds(List.of("host", "nova", "riley"));
        parent.setSubEvents(List.of(stage("final", "SR")));
        ActivityMember hostFinalMember = acceptedGroupMember("final:group:1", "host");
        ActivityMember rileyFinalMember = acceptedGroupMember("final:group:1", "riley");
        EventLeaderboardStateDto finalState = new EventLeaderboardStateDto(
                "event-1",
                "final",
                "Final",
                "Score",
                List.of(new EventLeaderboardGroupDto(
                        "final:group:1",
                        "Final Group",
                        2,
                        1,
                        List.of("riley"),
                        List.of(
                                new EventLeaderboardMemberDto("host", "Casey Bridge"),
                                new EventLeaderboardMemberDto("riley", "Riley Outside")),
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of())));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerPatternAndStatus(
                "group", "^\\Qfinal\\E:group:", "accepted"))
                .thenReturn(List.of(hostFinalMember, rileyFinalMember));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "final"))
                .thenReturn(Optional.empty());
        when(activitiesEventLeaderboardService.queryState("event-1", "final")).thenReturn(finalState);

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        null,
                        "final",
                        0,
                        "finalize-stage",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.stageStatus()).isEqualTo("F");
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(3)).enqueue(notificationCaptor.capture());
        List<NotificationIntent> notifications = notificationCaptor.getAllValues();
        assertThat(notifications.get(0)).satisfies(notification -> {
            assertThat(notification.type()).isEqualTo("event-stage-finalized");
            assertThat(notification.title()).isEqualTo("final finalized");
            assertThat(notification.recipientUserIds()).containsExactly("riley");
            assertThat(notification.createdUser()).isEqualTo("host");
            assertThat(notification.payload())
                    .containsEntry("notification_title_key", "notification.event.stage.finalized.title")
                    .containsEntry("notification_message_key", "notification.event.stage.finalized.message")
                    .doesNotContainKeys("senderName", "notification_avatar_tone", "notification_avatar_icon");
        });
        assertThat(notifications.get(1)).satisfies(notification -> {
            assertThat(notification.type()).isEqualTo("event-tournament-won");
            assertThat(notification.recipientUserIds()).containsExactly("riley");
            assertThat(notification.createdUser()).isEqualTo("scheduler");
            assertThat(notification.payload())
                    .containsEntry("senderName", "MyScoutee System")
                    .containsEntry("notification_title_key", "notification.event.tournament.won.title")
                    .containsEntry("notification_message_key", "notification.event.tournament.won.message")
                    .containsEntry("notification_tone", "success")
                    .containsEntry("notification_avatar_tone", "stage")
                    .containsEntry("notification_avatar_icon", "emoji_events")
                    .containsEntry("stageIndex", "1")
                    .containsEntry("stageTotal", "1");
        });
        assertThat(notifications.get(2)).satisfies(notification -> {
            assertThat(notification.type()).isEqualTo("event-tournament-not-won");
            assertThat(notification.recipientUserIds()).containsExactly("host");
            assertThat(notification.createdUser()).isEqualTo("scheduler");
            assertThat(notification.payload())
                    .containsEntry("notification_title_key", "notification.event.tournament.not-won.title")
                    .containsEntry("notification_message_key", "notification.event.tournament.not-won.message")
                    .containsEntry("notification_tone", "warning")
                    .containsEntry("notification_avatar_tone", "stage")
                    .containsEntry("notification_avatar_icon", "emoji_events");
        });
        assertThat(notifications)
                .noneMatch(notification -> "event-tournament-finalized".equals(notification.type()));
    }

    @Test
    void manualParentStageStartNotifiesOtherParticipantsBeforeRoomNotifications() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setAcceptedMemberUserIds(List.of("host", "nova", "riley"));
        parent.setSubEvents(List.of(stage("stage-1", "RS")));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(parent), List.of());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "stage-1"))
                .thenReturn(Optional.empty());
        when(eventSchedulerProvider.getIfAvailable()).thenReturn(eventScheduler);
        when(eventScheduler.generateTournamentStagePlansForEvents(
                eq(List.of("event-1")),
                any(Runnable.class)))
                .thenAnswer(invocation -> {
                    Runnable beforeRoomNotifications = invocation.getArgument(1);
                    beforeRoomNotifications.run();
                    return List.of();
                });

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        null,
                        "stage-1",
                        0,
                        "start-tournament",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.stageStatus()).isEqualTo("A");
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        NotificationIntent notification = notificationCaptor.getValue();
        assertThat(notification.type()).isEqualTo("event-tournament-started");
        assertThat(notification.title()).isEqualTo("stage-1 started");
        assertThat(notification.recipientUserIds()).containsExactly("nova", "riley");
        assertThat(notification.recipientUserIds()).doesNotContain("host");
        assertThat(notification.payload())
                .containsEntry("notification_title_key", "notification.event.stage.started.title")
                .containsEntry("notification_message_key", "notification.event.stage.started.message")
                .containsEntry("notification_avatar_tone", "stage")
                .containsEntry("notification_avatar_icon", "emoji_events")
                .containsEntry("stageIndex", "1")
                .containsEntry("stageTotal", "1");
        verify(eventScheduler).generateTournamentStagePlansForEvents(
                eq(List.of("event-1")),
                any(Runnable.class));
        verify(eventScheduler, never()).generateTournamentStagePlansForEvents(anyCollection());
    }

    @Test
    void manualLaterStageStartNotifiesOnlyAcceptedStageGroupMembers() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        parent.setAcceptedMemberUserIds(List.of("host", "nova", "riley"));
        parent.setSubEvents(List.of(
                stage("qualifiers", "F"),
                stage("final", "RS")));
        ActivityMember hostFinalMember = acceptedGroupMember("final:group:1", "host");
        ActivityMember rileyFinalMember = acceptedGroupMember("final:group:1", "riley");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(parent), List.of());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activityMembersRepository.findByOwnerPatternAndStatus(
                "group", "^\\Qfinal\\E:group:", "accepted"))
                .thenReturn(List.of(hostFinalMember, rileyFinalMember));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "final"))
                .thenReturn(Optional.empty());
        when(eventSchedulerProvider.getIfAvailable()).thenReturn(eventScheduler);
        when(eventScheduler.generateTournamentStagePlansForEvents(
                eq(List.of("event-1")),
                any(Runnable.class)))
                .thenAnswer(invocation -> {
                    Runnable beforeRoomNotifications = invocation.getArgument(1);
                    beforeRoomNotifications.run();
                    return List.of();
                });

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        null,
                        "final",
                        1,
                        "start-tournament",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.stageStatus()).isEqualTo("A");
        ArgumentCaptor<NotificationIntent> notificationCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        assertThat(notificationCaptor.getValue().recipientUserIds()).containsExactly("riley");
        assertThat(notificationCaptor.getValue().recipientUserIds()).doesNotContain("host", "nova");
    }

    @Test
    void generatedSlotStartBuildsRandomPlansForSlotParticipantsNotParentTemplate() {
        Users host = new Users();
        host.setId("host");
        ActivityEvent parent = event("event-1", "host", 0d);
        ActivityEvent slot = event("slot-1", "host", 0d);
        slot.setGenerated(true);
        slot.setEventType("slot");
        slot.setParentEventId("event-1");
        slot.setSubEvents(List.of(stage("stage-1", "RS")));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(activityEventsRepository.findBySourceIdIn(List.of("slot-1"))).thenReturn(List.of(slot));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("slot-1", "stage-1"))
                .thenReturn(Optional.empty());
        when(eventSchedulerProvider.getIfAvailable()).thenReturn(eventScheduler);

        EventStageActionResultDto result = service.applyStageAction(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                        "host",
                        "event-1",
                        "slot-1",
                        "stage-1",
                        0,
                        "start-tournament",
                        null));

        assertThat(result).isNotNull();
        assertThat(result.sourceId()).isEqualTo("slot-1");
        assertThat(result.stageStatus()).isEqualTo("A");
        verify(eventScheduler).generateTournamentStagePlansForEvents(
                eq(List.of("slot-1")),
                any(Runnable.class));
        verify(eventScheduler, never()).generateTournamentStagePlansForEvents(
                eq(List.of("event-1")),
                any(Runnable.class));
        verify(eventScheduler, never()).generateTournamentStagePlansForEvents(anyCollection());
        verify(userActivityCountersService, never()).refreshEventCountersForDocuments(anyList());
    }

    @Test
    void eventCreateStopsBeforeSaveWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "draft-1"))
                .thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorCreateEvent("host", "draft-1")).thenReturn(false);

        EventDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "host", false));

        assertThat(result).isNull();
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(affinityRecomputeTaskService, never()).enqueueEventChanged(anyString(), anyString());
    }

    @Test
    void eventEditStopsBeforeSaveWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("draft-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "draft-1"))
                .thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorEditEvent("draft-1")).thenReturn(false);

        EventDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "host", false));

        assertThat(result).isNull();
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(affinityRecomputeTaskService, never()).enqueueEventChanged(anyString(), anyString());
    }

    @Test
    void syncDraftSavesCanonicalDraftEvent() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "draft-1"))
                .thenReturn(Optional.empty());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "host", false));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        verify(activitiesMembersService).ensureEventCreatorAdminMembership("draft-1", "host");
        verify(activityEventsRepository, never()).findByParentEventIdIn(anyList());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(record -> {
            assertThat(record.getSourceId()).isEqualTo("draft-1");
            assertThat(record.getStatus()).isEqualTo(ActivityEvent.STATUS_DRAFT);
            assertThat(record.getPublished()).isFalse();
        });
    }

    @Test
    void visibilityOnlyDraftSaveDoesNotNotifyForEquivalentLegacyDefaults() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("draft-1", "host", 0d);
        existing.setStatus(ActivityEvent.STATUS_DRAFT);
        existing.setTitle("Draft Event");
        existing.setTimeframe("May 24, 3:28 AM - 4:28 AM");
        existing.setStartAtIso("2026-05-24T03:28:00Z");
        existing.setEndAtIso("2026-05-24T04:28:00Z");
        existing.setFrequency(null);
        existing.setSlotsEnabled(null);
        existing.setSubEventsEnabled(true);
        existing.setCapacityMin(1);
        existing.setCapacityMax(1);
        existing.setCapacityTotal(1);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "draft-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload(
                "sync-draft-1",
                "draft-1",
                "host",
                false,
                false,
                "Friends only"));

        assertThat(result).isNotNull();
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved -> {
            assertThat(saved.getVisibility()).isEqualTo("Friends only");
            assertThat(saved.getFrequency()).isEqualTo("One-time");
            assertThat(saved.getSlotsEnabled()).isFalse();
            assertThat(saved.getSubEventsEnabled()).isTrue();
        });
        verify(scheduledMessageTaskService, never()).scheduleEventDefinitionChanged(
                anyString(),
                anyString(),
                anyCollection(),
                anyCollection(),
                anyString());
    }

    @Test
    void publishedCapacityDecreaseNotifiesOtherParticipantsAsDefinitionChange() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("event-1", "host", 0d);
        existing.setTitle("Draft Event");
        existing.setCapacityMin(1);
        existing.setCapacityMax(8);
        existing.setCapacityTotal(8);
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "member-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        8);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(members);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload(
                "sync-event-1",
                "event-1",
                "host",
                true,
                false,
                "Public",
                7));

        assertThat(result).isNotNull();
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved -> {
            assertThat(saved.getCapacityMin()).isEqualTo(1);
            assertThat(saved.getCapacityMax()).isEqualTo(7);
            assertThat(saved.getCapacityTotal()).isEqualTo(7);
        });
        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> audienceCaptor = ArgumentCaptor.forClass(Collection.class);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> reasonsCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(scheduledMessageTaskService).scheduleEventDefinitionChanged(
                eq("event-1"),
                eq("Draft Event"),
                audienceCaptor.capture(),
                reasonsCaptor.capture(),
                eq("host"));
        assertThat(audienceCaptor.getValue()).containsExactly("member-1");
        assertThat(reasonsCaptor.getValue()).containsExactly("details");
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(userActivityCountersService, never()).refreshEventCountersForDocuments(anyList());
    }

    @Test
    void publishedCapacityCanDecreaseToAcceptedCountDespiteOutstandingInvitation() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("event-1", "host", 0d);
        existing.setTitle("Draft Event");
        existing.setCapacityMin(1);
        existing.setCapacityMax(8);
        existing.setCapacityTotal(8);
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "member-1"),
                        List.of("invitee"),
                        List.of("invitee"),
                        List.of(),
                        Set.of("host"),
                        8);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(members);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload(
                "sync-event-1",
                "event-1",
                "host",
                true,
                false,
                "Public",
                2));

        assertThat(result).isNotNull();
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved -> {
            assertThat(saved.getCapacityMax()).isEqualTo(2);
            assertThat(saved.getCapacityTotal()).isEqualTo(2);
        });
    }

    @Test
    void publishedManageNoOpDoesNotWriteNotifyOrEnqueueRecompute() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("event-1", "host", 0d);
        existing.setTitle("Draft Event");
        existing.setCapacityMin(1);
        existing.setCapacityMax(8);
        existing.setCapacityTotal(8);
        existing.setTicketing(false);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.of(existing));

        EventDto result = service.sync(eventPayload(
                "sync-event-1",
                "event-1",
                "host",
                true,
                false,
                "Public",
                8));

        assertThat(result).isNotNull();
        assertThat(result.capacityTotal()).isEqualTo(8);
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(activitiesMembersService, never()).ensureEventCreatorAdminMembership(anyString(), anyString());
        verify(affinityRecomputeTaskService, never()).enqueueEventChanged(anyString(), anyString());
        verify(scheduledMessageTaskService, never()).scheduleEventDefinitionChanged(
                anyString(),
                anyString(),
                anyCollection(),
                anyCollection(),
                anyString());
        verify(eventParticipationTicketService, never()).syncParticipationTicketsForEvent(anyString());
        verify(userActivityCountersService, never()).refreshEventCountersForDocuments(anyList());
    }

    @Test
    void firstCompleteEventSaveMaterializesAndLoadsMainEventRuntime() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        AtomicReference<ActivityEvent> savedEvent = new AtomicReference<>();

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.empty());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<ActivityEvent> documents = invocation.getArgument(0);
            savedEvent.set(documents.get(0));
            return documents;
        });

        EventDto result = service.sync(eventPayload(
                "sync-event-1",
                "event-1",
                "host",
                false,
                false,
                "Public",
                8));

        assertThat(result).isNotNull();
        assertThat(savedEvent.get()).satisfies(event -> {
            assertThat(event.getSourceId()).isEqualTo("event-1");
            assertThat(event.getStatus()).isEqualTo(ActivityEvent.STATUS_DRAFT);
            assertThat(event.getSlotsEnabled()).isFalse();
            assertThat(event.getSlotTemplates()).isEmpty();
            assertThat(event.getSubEventsEnabled()).isFalse();
            assertThat(event.getSubEventDefinitions()).isEmpty();
        });
        verify(accessControlService).canCurrentActorCreateEvent("host", "event-1");
        verify(accessControlService, never()).canCurrentActorEditEvent("event-1");

        ArgumentCaptor<ActivityMainEventRuntime> runtimeCaptor =
                ArgumentCaptor.forClass(ActivityMainEventRuntime.class);
        verify(mongoTemplate).save(runtimeCaptor.capture());
        assertThat(runtimeCaptor.getValue()).satisfies(runtime -> {
            assertThat(runtime.getRecordId()).isEqualTo("main-event:event-1");
            assertThat(runtime.getRuntimeKind()).isEqualTo("MAIN_EVENT");
            assertThat(runtime.getEventId()).isEqualTo("event-1");
            assertThat(runtime.getOwnerId()).isEqualTo("event-1");
            assertThat(runtime.getSubEventId()).isNull();
            assertThat(runtime.getTitle()).isEqualTo("Draft Event");
        });

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenReturn(List.of(savedEvent.get()));
        when(mongoTemplate.findOne(any(Query.class), eq(ActivityMainEventRuntime.class)))
                .thenReturn(runtimeCaptor.getValue());

        EventSubEventsResultDto subEvents = service.loadSubEventsById(new EventSubEventsQueryDto(
                "host",
                "event-1",
                "upcoming",
                "day",
                null,
                null,
                null,
                false));

        assertThat(subEvents).isNotNull();
        assertThat(subEvents.slots()).singleElement().satisfies(slot ->
                assertThat(slot.subEventItems()).singleElement().satisfies(item -> {
                    assertThat(item.runtimeKind()).isEqualTo("MAIN_EVENT");
                    assertThat(item.id()).isEqualTo("main-event:event-1");
                    assertThat(item.eventId()).isEqualTo("event-1");
                }));
    }

    @Test
    void emptyEnabledChildDefinitionsAreCanonicalizedAndReactivateMainEventRuntime() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("event-1", "host", 0d);
        existing.setStatus(ActivityEvent.STATUS_DRAFT);
        existing.setFrequency("Custom");
        existing.setSlotsEnabled(true);
        existing.setSlotTemplates(List.of());
        existing.setSubEventsEnabled(true);
        existing.setSubEventDefinitions(List.of());

        ActivityMainEventRuntime runtime = new ActivityMainEventRuntime();
        runtime.setId("runtime-1");
        runtime.setRecordId("main-event:event-1");
        runtime.setSyncKey("runtime-sync-1");
        runtime.setStatus("D");
        runtime.setRuntimeKind("MAIN_EVENT");
        runtime.setEventId("event-1");
        runtime.setOwnerId("event-1");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(mongoTemplate.findOne(any(Query.class), eq(ActivityMainEventRuntime.class))).thenReturn(runtime);

        EventDto result = service.sync(eventPayload(
                "sync-event-1",
                "event-1",
                "host",
                false,
                false,
                "Public",
                8,
                true,
                true));

        assertThat(result).isNotNull();
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved -> {
            assertThat(saved.getSlotsEnabled()).isFalse();
            assertThat(saved.getSlotTemplates()).isEmpty();
            assertThat(saved.getFrequency()).isEqualTo("One-time");
            assertThat(saved.getSubEventsEnabled()).isFalse();
            assertThat(saved.getSubEventDefinitions()).isEmpty();
        });

        ArgumentCaptor<ActivityMainEventRuntime> runtimeCaptor =
                ArgumentCaptor.forClass(ActivityMainEventRuntime.class);
        verify(mongoTemplate).save(runtimeCaptor.capture());
        assertThat(runtimeCaptor.getValue()).isSameAs(runtime);
        assertThat(runtimeCaptor.getValue().getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
        assertThat(runtimeCaptor.getValue().getRecordId()).isEqualTo("main-event:event-1");
        assertThat(runtimeCaptor.getValue().getSyncKey()).isEqualTo("runtime-sync-1");
    }

    @Test
    void eventEditPersistsExplicitlyClearedImage() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("draft-1", "host", 0d);
        existing.setImageUrl("https://example.test/old-event-image.jpg");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "draft-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "host", false));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(record ->
                assertThat(record.getImageUrl()).isEmpty());
        assertThat(result).isNotNull();
        assertThat(result.imageUrl()).isEmpty();
    }

    @Test
    void enablingTicketingCreatesTicketsUpdatesCountersAndNotifiesAcceptedParticipants() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent existing = event("event-1", "host", 0d);
        existing.setTicketing(false);
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "member-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        10);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(members);
        when(activityEventsRepository.findByOwnerUserIdAndSourceId("host", "event-1"))
                .thenReturn(Optional.of(existing));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        EventDto result = service.sync(eventPayload("sync-event-1", "event-1", "host", true, true));

        assertThat(result).isNotNull();
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(saved ->
                assertThat(saved.getTicketing()).isTrue());
        verify(eventParticipationTicketService).syncParticipationTicketsForEvent("event-1");
        verify(userActivityCountersService).refreshEventCountersForDocuments(anyList());
        ArgumentCaptor<NotificationOutboxService.NotificationIntent> notificationCaptor =
                ArgumentCaptor.forClass(NotificationOutboxService.NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notificationCaptor.capture());
        assertThat(notificationCaptor.getValue()).satisfies(intent -> {
            assertThat(intent.type()).isEqualTo("event-ticketing-enabled");
            assertThat(intent.recipientUserIds()).containsExactly("member-1");
            assertThat(intent.payload()).containsEntry("eventScope", "tickets");
        });
    }

    @Test
    void eventDetailUsesCanonicalEditorDocumentInsteadOfRicherMembershipSnapshot() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent canonical = event("event-1", "host", 0d);
        canonical.setSubEventDefinitions(List.of(new SubEventDefinitionDto(
                "stage-1", "Opening round", "Saved definition", "After previous",
                0, 30, "Arena", 2, 8, "Score", 1, false, null, 2, 8, null)));
        canonical.setSourceLink("https://example.test/event");
        canonical.setImageUrl("");
        ActivityEvent scoped = event("event-1", "host", 0d);
        scoped.setId("event-1-scoped-document");
        scoped.setOwnerUserId("member-1");
        scoped.setAcceptedMembers(99);
        scoped.setSubEventDefinitions(List.of());
        scoped.setSourceLink(null);
        scoped.setImageUrl("https://example.test/stale-event-image.jpg");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenReturn(List.of(scoped, canonical));

        EventDetailDto result = service.loadEventDetailById("host", "event-1");

        assertThat(result).isNotNull();
        assertThat(result.imageUrl()).isEmpty();
        assertThat(result.sourceLink()).isEqualTo("https://example.test/event");
        assertThat(result.subEventDefinitions())
                .extracting(SubEventDefinitionDto::id)
                .containsExactly("stage-1");
    }

    @Test
    void friendsOnlyEventDetailUsesTheSameExternalViewerBoundaryAsExplore() {
        String hostUserId = "650000000000000000000061";
        String friendUserId = "178e8d0cbe164fa3fede5884";
        String nonFriendUserId = "2d520f3c98b0440c1556f4af";
        ActivityEvent friendsOnly = event("event-1", hostUserId, 0d);
        friendsOnly.setVisibility("Friends only");

        Users friend = new Users();
        friend.setId(friendUserId);
        Users nonFriend = new Users();
        nonFriend.setId(nonFriendUserId);
        when(homeUserProfileService.resolveCurrentUser(friendUserId)).thenReturn(friend);
        when(homeUserProfileService.resolveCurrentUser(nonFriendUserId)).thenReturn(nonFriend);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenReturn(List.of(friendsOnly));

        assertThat(service.loadEventDetailById(friendUserId, "event-1")).isNotNull();
        assertThat(service.loadEventDetailById(nonFriendUserId, "event-1")).isNull();
    }

    @Test
    void trackedParticipantCanLoadInvitationOnlyEventDetail() {
        Users member = new Users();
        member.setId("member-1");
        ActivityEvent invitationOnly = event("event-1", "host", 0d);
        invitationOnly.setVisibility("Invitation only");
        ActivitiesMembersService.OwnerMembersSnapshot members =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("host", "member-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        10);

        when(homeUserProfileService.resolveCurrentUser("member-1")).thenReturn(member);
        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenReturn(List.of(invitationOnly));
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1")).thenReturn(members);

        assertThat(service.loadEventDetailById("member-1", "event-1")).isNotNull();
    }

    @Test
    void systemEventDetailDoesNotRequireAUserOwnerOrCreator() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent systemEvent = event("random-room:event-1:stage-1:room-1", "host", 0d);
        systemEvent.setOwnerUserId(null);
        systemEvent.setCreatorUserId(null);
        systemEvent.setCreatorName("MyScoutee System");
        systemEvent.setEventType("random-room");

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceIdIn(List.of(systemEvent.getSourceId())))
                .thenReturn(List.of(systemEvent));

        EventDetailDto result = service.loadEventDetailById("viewer", systemEvent.getSourceId());

        assertThat(result).isNotNull();
        assertThat(result.creatorUserId()).isEmpty();
        assertThat(result.creatorName()).isEqualTo("MyScoutee System");
        assertThat(result.eventType()).isEqualTo("random-room");
    }

    @Test
    void ownerEventFiltersUseCanonicalDraftRecord() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent draft = event("draft-1", "host", 0d);
        draft.setStatus(ActivityEvent.STATUS_DRAFT);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(draft));

        EventListPageDto myEvents = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "my-events", "all", null, null, null, null, null, null, null, null));
        EventListPageDto allEvents = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "all", "all", null, null, null, null, null, null, null, null));

        assertThat(myEvents.records()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("draft-1");
            assertThat(record.status()).isEqualTo(ActivityEvent.STATUS_DRAFT);
        });
        assertThat(allEvents.records()).extracting(record -> record.id()).containsExactly("draft-1");
    }

    @Test
    void directOwnerBucketsUseAdminAndInvitationProjections() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent ownedEvent = event("hosting-1", "host", 0d);
        ownedEvent.setStatus(ActivityEvent.STATUS_ACTIVE);

        ActivityEvent invitation = event("invite-1", "other-host", 0d);
        invitation.setStatus(ActivityEvent.STATUS_ACTIVE);
        invitation.setInvitedMemberUserIds(List.of("host"));

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findAdminVisibleEvents("host")).thenReturn(List.of(ownedEvent));
        when(activityEventsRepository.findActiveInvitationEvents("host")).thenReturn(List.of(invitation));
        when(activitiesMembersService.findTrackedEventSourceIdsForUser("host")).thenReturn(Set.of());
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());

        List<EventDto> hostingRecords = service.queryHosting("host");
        List<EventDto> invitationRecords = service.queryInvitations("host");

        assertThat(hostingRecords).extracting(EventDto::id).containsExactly("hosting-1");
        assertThat(invitationRecords).extracting(EventDto::id).containsExactly("invite-1");
        verify(activitiesMembersService, times(2)).buildBatchEventSnapshots(anyMap());
        verify(activitiesMembersService, never()).queryOwnerSnapshot(anyString(), anyString());
    }

    @Test
    void attendingUsesTrackedMembershipRecordsWithoutDirectOwnerFanout() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent attending = event("event-1", "host", 0d);
        attending.setAcceptedMemberUserIds(List.of("viewer"));

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", false))
                .thenReturn(acceptedStatuses("event-1"));
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(attending));
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());

        List<EventDto> records = service.queryAttending("viewer");

        assertThat(records).extracting(EventDto::id).containsExactly("event-1");
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void attendingPageReturnsLimitedFullRecordsWithoutChangingLegacyList() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent first = event("event-1", "host", 0d);
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);
        first.setAcceptedMemberUserIds(List.of("viewer"));
        second.setAcceptedMemberUserIds(List.of("viewer"));
        third.setAcceptedMemberUserIds(List.of("viewer"));

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", false))
                .thenReturn(acceptedStatuses("event-1", "event-2", "event-3"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));

        EventsExplorePageDto page = service.queryAttendingPage("viewer", 2, null);

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(EventDto::id)
                .containsExactly("event-1", "event-2");
        assertThat(page.nextCursor()).contains("event-2");
        verify(activityEventsRepository, never()).findByOwnerUserIdOrderByStartAtIsoAsc(anyString());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void directBucketPagesReturnLimitedFullRecords() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent hosting = event("hosting-1", "host", 0d);
        hosting.setStatus(ActivityEvent.STATUS_ACTIVE);

        ActivityEvent invitation = event("invite-1", "other-host", 0d);
        invitation.setOwnerUserId("accepted-member");
        invitation.setAdmins(List.of("accepted-member", "other-host"));
        invitation.setStatus(ActivityEvent.STATUS_ACTIVE);
        invitation.setInvitedMemberUserIds(List.of("host"));

        ActivityEvent trashed = event("trash-1", "host", 0d);
        trashed.setStatus(ActivityEvent.STATUS_TRASHED);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(hosting, trashed));
        when(activityEventsRepository.findActiveInvitationEvents("host"))
                .thenReturn(List.of(invitation));
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(hosting, invitation, trashed));
        lenient().when(activitiesMembersService.findTrackedEventMembershipStatusesForUser(eq("host"), anyBoolean()))
                .thenReturn(Map.of());

        EventsExplorePageDto hostingResponse = service.queryHostingPage("host", 2, null);
        EventsExplorePageDto invitationResponse = service.queryInvitationsPage("host", 2, null);
        EventsExplorePageDto trashResponse = service.queryTrashPage("host", 2, null);

        assertThat(hostingResponse.records()).extracting(EventDto::id)
                .containsExactly("hosting-1");
        assertThat(invitationResponse.records()).extracting(EventDto::id)
                .containsExactly("invite-1");
        assertThat(invitationResponse.records()).singleElement().satisfies(record ->
                assertThat(record.adminIds())
                        .containsExactly("accepted-member", "other-host")
                        .doesNotContain("host"));
        assertThat(trashResponse.records()).extracting(EventDto::id)
                .containsExactly("trash-1");
    }

    @Test
    void trashPageIncludesEventLeftByViewerThroughDeletedMembership() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent leftEvent = event("left-event", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", true))
                .thenReturn(Map.of("left-event", "deleted"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(), List.of(leftEvent));

        EventsExplorePageDto trashResponse = service.queryTrashPage("viewer", 12, null);

        assertThat(trashResponse.records()).extracting(EventDto::id)
                .containsExactly("left-event");
    }

    @Test
    void trashPageUsesViewerOwnedSuppressionRecordWithoutDeletedMembershipInference() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent canonical = event("left-event", "host", 0d);
        ActivityEvent suppressed = event("left-event", "host", 0d);
        suppressed.setId("left-event-viewer-suppression");
        suppressed.setOwnerUserId("viewer");
        suppressed.setStatus(ActivityEvent.STATUS_TRASHED);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", true))
                .thenReturn(Map.of("left-event", "suppressed"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(suppressed));
        when(activityEventsRepository.findBySourceIdIn(List.of("left-event")))
                .thenReturn(List.of(canonical, suppressed));

        EventsExplorePageDto trashResponse = service.queryTrashPage("viewer", 12, null);

        assertThat(trashResponse.total()).isEqualTo(1);
        assertThat(trashResponse.records()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("left-event");
            assertThat(record.userId()).isEqualTo("viewer");
            assertThat(record.status()).isEqualTo(ActivityEvent.STATUS_TRASHED);
        });
    }

    @Test
    void pagedDirectOwnerFilterReturnsEventListCardsByDefault() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent first = event("event-1", "host", 0d);
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "my-events", "all", "recent", "date", "day", 2, null, null, null, null));

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(record -> record.id()).containsExactly("event-1", "event-2");
        assertThat(page.items()).extracting(EventDto::id).containsExactly("event-1", "event-2");
        assertThat(page.records()).allSatisfy(record -> assertThat(record.status()).isEqualTo(ActivityEvent.STATUS_ACTIVE));
        assertThat(page.nextCursor()).contains("event-2");
    }

    @Test
    void activitiesFilterPageReturnsCardsAndSkipsSlotMaterialization() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent first = event("event-1", "host", 0d);
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(userActivityCountersService.readStoredEventCounters("viewer"))
                .thenReturn(new UserEventCountersDto(3, 3, 0, 0, 0, 0, 0));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", false))
                .thenReturn(acceptedStatuses("event-1", "event-2", "event-3"));
        AtomicInteger findCalls = new AtomicInteger();
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenAnswer(invocation -> findCalls.getAndIncrement() == 0
                        ? List.<ActivityEvent>of()
                        : List.of(first, second, third));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "viewer", "all", "all", "recent", "date", "day", 2, null, null, null, null));

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(record -> record.id())
                .containsExactly("event-1", "event-2");
        assertThat(page.items()).extracting(EventDto::id)
                .containsExactly("event-1", "event-2");
        assertThat(page.nextCursor()).contains("event-2");
        assertThat(page.eventCounters()).isEqualTo(new UserEventCountersDto(3, 3, 0, 0, 0, 0, 0));
        verify(activityEventsRepository, never()).findAll();
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void activeFilterUsesEmbeddedParentMembershipWithoutSnapshotProjection() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent staleProjection = event("event-1", "host", 0d);
        staleProjection.setOwnerUserId("viewer");
        staleProjection.setAdmins(List.of("host"));
        staleProjection.setAcceptedMemberUserIds(List.of("host", "viewer"));

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer", false))
                .thenReturn(acceptedStatuses("event-1"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(staleProjection));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "viewer", "active-events", "all", "recent", "date", "day", 10, null, null, null, null));

        assertThat(page.total()).isEqualTo(1);
        assertThat(page.records()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("event-1");
            assertThat(record.userId()).isEqualTo("viewer");
            assertThat(record.adminIds()).containsExactly("host");
        });
        assertThat(page.items()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("event-1");
            assertThat(record.userId()).isEqualTo("viewer");
            assertThat(record.adminIds()).containsExactly("host");
        });
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
    }

    @Test
    void tournamentRoomOrganizerProfileDoesNotTurnAcceptedHostIntoRoomAdmin() {
        Users casey = new Users();
        casey.setId("casey");
        casey.setName("Casey Bridge");

        ActivityEvent room = event("tournament-room-1", "casey", 0d);
        room.setOwnerUserId(null);
        room.setCreatorUserId(null);
        room.setOrganizerUserId("casey");
        room.setCreatorName("Casey Bridge");
        room.setAdmins(List.of());
        room.setEventType("tournament-room");
        room.setAcceptedMemberUserIds(List.of("casey", "nova"));

        when(homeUserProfileService.resolveCurrentUser("casey")).thenReturn(casey);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("casey", false))
                .thenReturn(acceptedStatuses("tournament-room-1"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(room));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "casey", "active-events", "all", "recent", "date", "day", 10, null, null, null, null));

        assertThat(page.total()).isEqualTo(1);
        assertThat(page.items()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("tournament-room-1");
            assertThat(record.userId()).isEqualTo("casey");
            assertThat(record.creatorUserId()).isEmpty();
            assertThat(record.organizerUserId()).isEqualTo("casey");
            assertThat(record.adminIds()).isEmpty();
        });
    }

    @Test
    void userEventPageReturnsLimitedFullRecordsAndCursor() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent first = event("event-1", "host", 0d);
        first.setUpcomingSlots(List.of(new EventSlotOccurrenceDto(
                "slot-1",
                "event-1",
                "template-1",
                "Slot 1",
                "2099-06-01 - 10:00",
                "2099-06-01T10:00:00Z",
                "2099-06-01T11:00:00Z",
                10,
                2,
                1)));
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));
        when(activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(first, second, third));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("host", false)).thenReturn(Map.of());

        EventsExplorePageDto page = service.queryItemsByUserPage("host", 2, null);

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(EventDto::id)
                .containsExactly("event-1", "event-2");
        assertThat(page.nextCursor()).contains("event-2");
        verify(activityEventsRepository, never()).findByParentEventIdIn(anyList());
    }

    private Map<String, String> acceptedStatuses(String... sourceIds) {
        Map<String, String> statuses = new java.util.LinkedHashMap<>();
        for (String sourceId : sourceIds) {
            statuses.put(sourceId, "accepted");
        }
        return statuses;
    }

    private ActivitySubEventResource resourceState(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            int accepted,
            int pending,
            int capacityMax) {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setStatus("A");
        resource.setOwnerId(ownerId);
        resource.setSubEventId(subEventId);
        resource.setAssetOwnerUserId(assetOwnerUserId);
        resource.setAssetAssignmentIds(Map.of("Transport", List.of("transport-1")));
        resource.setAssetSettingsByType(Map.of());
        resource.setSupplyContributionEntriesByAssetId(Map.of());
        resource.setResourceMetricsByType(Map.of(
                "Transport", new SubEventResourceMetricRecord(accepted, pending, 0, capacityMax)));
        return resource;
    }

    private ActivityEvent event(String sourceId, String creatorUserId, double affinity) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + "-document");
        event.setSourceId(sourceId);
        event.setOwnerUserId(creatorUserId);
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setGenerated(false);
        event.setCreatorUserId(creatorUserId);
        event.setAdmins(List.of(creatorUserId));
        event.setCreatorName(creatorUserId);
        event.setTitle(sourceId);
        event.setStartAtIso("2099-06-01T10:00:00Z");
        event.setEndAtIso("2099-06-01T12:00:00Z");
        event.setVisibility("Public");
        event.setCapacityTotal(10);
        event.setRating(0d);
        event.setBoost(0d);
        event.setAffinity(affinity);
        return event;
    }

    private SubEventItem stage(String id, String stageStatus) {
        return new SubEventItem(
                id,
                id,
                "",
                "2026-01-01T10:00:00Z",
                "2026-01-01T11:00:00Z",
                "",
                "host",
                null,
                null,
                "Score",
                1,
                false,
                null,
                1,
                10,
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
                0,
                60,
                stageStatus,
                null,
                null,
                null,
                null,
                List.of());
    }

    private ActivityMember acceptedGroupMember(String ownerId, String userId) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("group");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus("accepted");
        return member;
    }

    private EventDetailDto eventPayload(
            String syncKey,
            String id,
            String creatorUserId,
            Boolean published) {
        return eventPayload(syncKey, id, creatorUserId, published, false);
    }

    private EventDetailDto eventPayload(
            String syncKey,
            String id,
            String creatorUserId,
            Boolean published,
            Boolean ticketing) {
        return eventPayload(syncKey, id, creatorUserId, published, ticketing, "Public");
    }

    private EventDetailDto eventPayload(
            String syncKey,
            String id,
            String creatorUserId,
            Boolean published,
            Boolean ticketing,
            String visibility) {
        return eventPayload(syncKey, id, creatorUserId, published, ticketing, visibility, 1);
    }

    private EventDetailDto eventPayload(
            String syncKey,
            String id,
            String creatorUserId,
            Boolean published,
            Boolean ticketing,
            String visibility,
            Integer capacityMax) {
        return eventPayload(
                syncKey,
                id,
                creatorUserId,
                published,
                ticketing,
                visibility,
                capacityMax,
                false,
                false);
    }

    private EventDetailDto eventPayload(
            String syncKey,
            String id,
            String creatorUserId,
            Boolean published,
            Boolean ticketing,
            String visibility,
            Integer capacityMax,
            Boolean slotsEnabled,
            Boolean subEventsEnabled) {
        return new EventDetailDto(
                syncKey,
                id,
                creatorUserId,
                "hosting",
                Boolean.TRUE.equals(published) ? ActivityEvent.STATUS_ACTIVE : ActivityEvent.STATUS_DRAFT,
                null,
                List.of(creatorUserId),
                "HU",
                "Draft Event",
                "Draft short description",
                "May 24, 3:28 AM - 4:28 AM",
                null,
                0,
                0,
                null,
                creatorUserId,
                "Host User",
                "HU",
                "man",
                "",
                visibility,
                "Open Event",
                "2026-05-24T03:28:00Z",
                "2026-05-24T04:28:00Z",
                0d,
                "",
                "",
                "",
                null,
                1,
                capacityMax,
                1,
                1,
                false,
                false,
                "One-time",
                ticketing,
                false,
                null,
                false,
                List.of(),
                slotsEnabled,
                List.of(),
                null,
                null,
                false,
                "main",
                null,
                List.of(),
                0,
                0,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                null,
                List.of(),
                subEventsEnabled,
                List.of(),
                List.of(),
                "",
                null,
                0d,
                0d,
                0d,
                null);
    }

    private UserAffinityEdge edge(String leftUserId, String rightUserId, double edgeWeight) {
        UserAffinityEdge edge = new UserAffinityEdge();
        edge.setLeftUserId(leftUserId);
        edge.setRightUserId(rightUserId);
        edge.setEdgeWeight(edgeWeight);
        edge.setAffinityScore(edgeWeight);
        return edge;
    }
}
