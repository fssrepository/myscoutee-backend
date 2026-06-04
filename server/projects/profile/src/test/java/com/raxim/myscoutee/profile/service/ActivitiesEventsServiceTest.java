package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import org.mockito.ArgumentCaptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventListPageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;

@ExtendWith(MockitoExtension.class)
class ActivitiesEventsServiceTest {
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private EventParticipationTicketService eventParticipationTicketService;
    @Mock
    private PaymentService paymentService;
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
    private ObjectProvider<EventScheduler> eventSchedulerProvider;
    @Mock
    private ActivitiesChatService activitiesChatService;
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

    @BeforeEach
    void setUp() {
        service = new ActivitiesEventsService(
                activityEventsRepository,
                usersRepository,
                userAffinityEdgesRepository,
                homeUserProfileService,
                activitiesMembersService,
                eventParticipationTicketService,
                paymentService,
                scheduledMessageTaskService,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                mongoTemplate,
                chatAttachmentLifecycleService,
                notificationOutboxService,
                eventSchedulerProvider,
                activitiesChatService,
                activitiesEventLeaderboardService,
                eventSlotReadModelService,
                accessControlService,
                userActivityCountersService);
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
        when(activityEventsRepository.findByOwnerUserIdOrderByStartAtIsoAsc("viewer")).thenReturn(List.of());
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer")).thenReturn(Map.of());
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
    void publishCreatesExploreOverlayAndEnqueuesEventRecomputeForSavedLifecycleState() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");
        ActivityEvent event = event("event-1", "host", 0d);
        event.setType("hosting");
        event.setStatus("DR");
        event.setPublished(false);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId("host", "events", "event-1"))
                .thenReturn(Optional.empty());
        when(activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId("host", "hosting", "event-1"))
                .thenReturn(Optional.of(event));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.publish(new EventActionRequestDto(
                "host",
                "hosting",
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
        verify(activityEventsRepository, times(2)).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getAllValues().get(0)).singleElement().satisfies(record -> {
            assertThat(record.getSourceId()).isEqualTo("event-1");
            assertThat(record.getType()).isEqualTo("hosting");
            assertThat(record.getStatus()).isEqualTo("H");
            assertThat(record.getPublished()).isTrue();
        });
        assertThat(savedCaptor.getAllValues().get(1)).singleElement().satisfies(record -> {
            assertThat(record.getSourceId()).isEqualTo("event-1");
            assertThat(record.getType()).isEqualTo("events");
            assertThat(record.getStatus()).isEqualTo("A");
            assertThat(record.getPublished()).isTrue();
            assertThat(record.getIsHosting()).isFalse();
        });
        verify(affinityRecomputeTaskService).enqueueEventChanged("event-1", "host");
    }

    @Test
    void publishStopsBeforeSaveWhenPolicyDenies() {
        when(accessControlService.canCurrentActorPublishEvent("event-1")).thenReturn(false);

        service.publish(new EventActionRequestDto(
                "host",
                "hosting",
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
                "hosting",
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
    void organizerTrashStopsBeforeLeaveSideEffectsWhenPolicyDenies() {
        when(accessControlService.canCurrentActorDeleteEvent("event-1")).thenReturn(false);

        service.trash(new EventActionRequestDto(
                "host",
                "hosting",
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
        verify(activitiesChatService, never()).postSystemMessage(anyString(), anyString(), anyString());
    }

    @Test
    void organizerRestoreStopsBeforeSaveWhenPolicyDenies() {
        when(accessControlService.canCurrentActorRestoreEvent("event-1")).thenReturn(false);

        service.restore(new EventActionRequestDto(
                "host",
                "hosting",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                null));

        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(chatAttachmentLifecycleService, never()).markEventAvailable(anyString());
    }

    @Test
    void takeOverStopsBeforeLoadWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(accessControlService.canCurrentActorTakeOverEvent("event-1")).thenReturn(false);

        service.takeOver(new EventActionRequestDto(
                "host",
                "hosting",
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

        EventRecordDto result = service.requestJoin(new EventActionRequestDto(
                "viewer",
                "events",
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
    void stageActionStopsBeforeLoadWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(accessControlService.canCurrentActorApplyEventStageAction("event-1")).thenReturn(false);

        EventRecordDto result = service.applyStageAction(new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto(
                "host",
                "event-1",
                "stage-1",
                null,
                "start-tournament",
                null));

        assertThat(result).isNull();
        verify(activityEventsRepository, never()).findBySourceId(anyString());
        verify(activityEventsRepository, never()).saveAll(anyList());
    }

    @Test
    void eventCreateStopsBeforeSaveWhenPolicyDenies() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId("host", "hosting", "draft-1"))
                .thenReturn(Optional.empty());
        when(accessControlService.canCurrentActorCreateEvent("host", "draft-1")).thenReturn(false);

        EventRecordDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "hosting", "host", false));

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
        existing.setType("hosting");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId("host", "hosting", "draft-1"))
                .thenReturn(Optional.of(existing));
        when(accessControlService.canCurrentActorEditEvent("draft-1")).thenReturn(false);

        EventRecordDto result = service.sync(eventPayload("sync-draft-1", "draft-1", "hosting", "host", false));

        assertThat(result).isNull();
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(affinityRecomputeTaskService, never()).enqueueEventChanged(anyString(), anyString());
    }

    @Test
    void syncHostingDraftDoesNotCreateMemberEventOverlay() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId("host", "hosting", "draft-1"))
                .thenReturn(Optional.empty());
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.sync(new ActivitiesEventSyncPayloadDto(
                "sync-draft-1",
                "draft-1",
                "hosting",
                "Draft Event",
                "Draft short description",
                "May 24, 3:28 AM - 4:28 AM",
                0,
                true,
                "2026-05-24T03:28:00Z",
                "2026-05-24T04:28:00Z",
                0d,
                "",
                0,
                0,
                1,
                null,
                1,
                null,
                false,
                "One-time",
                false,
                null,
                List.of(),
                false,
                List.of(),
                null,
                null,
                false,
                "main",
                null,
                "Public",
                "Open Event",
                false,
                "host",
                "Host User",
                "HU",
                "man",
                "",
                "",
                null,
                "",
                List.of(),
                List.of(),
                "",
                null));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> savedCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(savedCaptor.capture());
        assertThat(savedCaptor.getValue()).singleElement().satisfies(record -> {
            assertThat(record.getSourceId()).isEqualTo("draft-1");
            assertThat(record.getType()).isEqualTo("hosting");
            assertThat(record.getStatus()).isEqualTo("DR");
            assertThat(record.getPublished()).isFalse();
        });
    }

    @Test
    void ownerEventFiltersPreferDraftHostingRecordOverEventOverlay() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent hostingDraft = event("draft-1", "host", 0d);
        hostingDraft.setType("hosting");
        hostingDraft.setStatus("DR");
        hostingDraft.setPublished(false);

        ActivityEvent staleEventsOverlay = event("draft-1", "host", 0d);
        staleEventsOverlay.setId("draft-1-events-overlay");
        staleEventsOverlay.setType("events");
        staleEventsOverlay.setStatus("A");
        staleEventsOverlay.setPublished(true);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(hostingDraft, staleEventsOverlay));

        EventListPageDto myEvents = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "my-events", "all", null, null, null, null, null, null, null, null));
        EventListPageDto allEvents = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "all", "all", null, null, null, null, null, null, null, null));

        assertThat(myEvents.records()).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("draft-1");
            assertThat(record.type()).isEqualTo("hosting");
            assertThat(record.status()).isEqualTo("DR");
            assertThat(record.published()).isFalse();
        });
        assertThat(allEvents.records()).extracting(record -> record.id()).containsExactly("draft-1");
    }

    @Test
    void directOwnerScopesUseBatchedMemberSnapshots() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent hosting = event("hosting-1", "host", 0d);
        hosting.setType("hosting");
        hosting.setStatus("H");
        hosting.setIsHosting(true);

        ActivityEvent invitation = event("invite-1", "other-host", 0d);
        invitation.setOwnerUserId("host");
        invitation.setType("invitations");
        invitation.setStatus("INV");
        invitation.setIsInvitation(true);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findByOwnerUserIdOrderByStartAtIsoAsc("host")).thenReturn(List.of(hosting, invitation));
        when(activitiesMembersService.findTrackedEventSourceIdsForUser("host")).thenReturn(Set.of());
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());

        List<EventRecordDto> hostingRecords = service.queryHosting("host");
        List<EventRecordDto> invitationRecords = service.queryInvitations("host");

        assertThat(hostingRecords).extracting(EventRecordDto::id).containsExactly("hosting-1");
        assertThat(invitationRecords).extracting(EventRecordDto::id).containsExactly("invite-1");
        verify(activitiesMembersService, times(2)).buildBatchEventSnapshots(anyMap());
        verify(activitiesMembersService, never()).queryOwnerSnapshot(anyString(), anyString());
    }

    @Test
    void attendingUsesTrackedMembershipRecordsWithoutDirectOwnerFanout() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent attending = event("event-1", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer"))
                .thenReturn(acceptedStatuses("event-1"));
        when(activityEventsRepository.findBySourceIdIn(anyList())).thenReturn(List.of(attending));
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());

        List<EventRecordDto> records = service.queryAttending("viewer");

        assertThat(records).extracting(EventRecordDto::id).containsExactly("event-1");
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

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer"))
                .thenReturn(acceptedStatuses("event-1", "event-2", "event-3"));
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));
        when(activityEventsRepository.findBySourceIdIn(anyList())).thenReturn(List.of(first, second, third));

        EventsExplorePageDto page = service.queryAttendingPage("viewer", 2, null);

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(EventRecordDto::id)
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
        hosting.setType("hosting");
        hosting.setStatus("H");
        hosting.setIsHosting(true);

        ActivityEvent invitation = event("invite-1", "other-host", 0d);
        invitation.setOwnerUserId("host");
        invitation.setType("invitations");
        invitation.setStatus("INV");
        invitation.setIsInvitation(true);

        ActivityEvent trashed = event("trash-1", "host", 0d);
        trashed.setType("hosting");
        trashed.setStatus("T");
        trashed.setIsTrashed(true);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(hosting, invitation, trashed));
        when(activityEventsRepository.findBySourceIdIn(anyList())).thenReturn(List.of(hosting, invitation, trashed));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("host")).thenReturn(Map.of());

        EventsExplorePageDto hostingResponse = service.queryHostingPage("host", 2, null);
        EventsExplorePageDto invitationResponse = service.queryInvitationsPage("host", 2, null);
        EventsExplorePageDto trashResponse = service.queryTrashPage("host", 2, null);

        assertThat(hostingResponse.records()).extracting(EventRecordDto::id)
                .containsExactly("hosting-1");
        assertThat(invitationResponse.records()).extracting(EventRecordDto::id)
                .containsExactly("invite-1");
        assertThat(trashResponse.records()).extracting(EventRecordDto::id)
                .containsExactly("trash-1");
    }

    @Test
    void pagedDirectOwnerFilterReturnsEventListCardsByDefault() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent first = event("event-1", "host", 0d);
        first.setType("hosting");
        first.setIsHosting(true);
        ActivityEvent second = event("event-2", "host", 0d);
        second.setType("hosting");
        second.setIsHosting(true);
        ActivityEvent third = event("event-3", "host", 0d);
        third.setType("hosting");
        third.setIsHosting(true);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "host", "my-events", "all", "recent", "date", "day", 2, null, null, null, null));

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(record -> record.id()).containsExactly("event-1", "event-2");
        assertThat(page.records()).allSatisfy(record -> assertThat(record.type()).isEqualTo("hosting"));
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
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer"))
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
        assertThat(page.nextCursor()).contains("event-2");
        verify(activityEventsRepository, never()).findAll();
        verify(activityEventsRepository, never()).saveAll(anyList());
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
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
        when(activityEventsRepository.findBySourceIdIn(anyList())).thenReturn(List.of(first, second, third));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("host")).thenReturn(Map.of());

        EventsExplorePageDto page = service.queryItemsByUserPage("host", 2, null);

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(EventRecordDto::id)
                .containsExactly("event-1", "event-2");
        assertThat(page.records().get(0).upcomingSlots()).extracting(EventSlotOccurrenceDto::id)
                .containsExactly("slot-1");
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

    private ActivityEvent event(String sourceId, String creatorUserId, double affinity) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + "-document");
        event.setSourceId(sourceId);
        event.setOwnerUserId(creatorUserId);
        event.setType("events");
        event.setStatus("active");
        event.setPublished(true);
        event.setIsTrashed(false);
        event.setIsInvitation(false);
        event.setGenerated(false);
        event.setCreatorUserId(creatorUserId);
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

    private ActivitiesEventSyncPayloadDto eventPayload(
            String syncKey,
            String id,
            String target,
            String creatorUserId,
            Boolean published) {
        return new ActivitiesEventSyncPayloadDto(
                syncKey,
                id,
                target,
                "Draft Event",
                "Draft short description",
                "May 24, 3:28 AM - 4:28 AM",
                0,
                true,
                "2026-05-24T03:28:00Z",
                "2026-05-24T04:28:00Z",
                0d,
                "",
                0,
                0,
                1,
                null,
                1,
                null,
                false,
                "One-time",
                false,
                null,
                List.of(),
                false,
                List.of(),
                null,
                null,
                false,
                "main",
                null,
                "Public",
                "Open Event",
                published,
                creatorUserId,
                "Host User",
                "HU",
                "man",
                "",
                "",
                null,
                "",
                List.of(),
                List.of(),
                "",
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
