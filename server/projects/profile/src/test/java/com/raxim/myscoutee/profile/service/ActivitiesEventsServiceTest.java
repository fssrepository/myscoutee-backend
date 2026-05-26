package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
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
                activitiesEventLeaderboardService);
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
        when(activityEventsRepository.findByOwnerUserIdOrderByStartAtIsoAsc("host")).thenReturn(List.of(hostingDraft, staleEventsOverlay));
        when(activitiesMembersService.findTrackedEventSourceIdsForUser("host")).thenReturn(Set.of());
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());
        when(userAffinityEdgesRepository.findRelevantByUserIds(anyList())).thenReturn(List.of());

        List<EventRecordDto> myEvents = service.queryItemsByFilter(new EventsFilterRequestDto(
                "host", "my-events", "all", null, null, null, null, null, null, null, null, null));
        List<EventRecordDto> allEvents = service.queryItemsByFilter(new EventsFilterRequestDto(
                "host", "all", "all", null, null, null, null, null, null, null, null, null));

        assertThat(myEvents).singleElement().satisfies(record -> {
            assertThat(record.id()).isEqualTo("draft-1");
            assertThat(record.type()).isEqualTo("hosting");
            assertThat(record.status()).isEqualTo("DR");
            assertThat(record.published()).isFalse();
        });
        assertThat(allEvents).extracting(EventRecordDto::id).containsExactly("draft-1");
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
        verify(activityEventsRepository, never()).findByOwnerUserIdOrderByStartAtIsoAsc(anyString());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void slimAttendingPageReturnsLimitedCardsWithoutChangingLegacyList() {
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

        Object response = service.queryAttendingPage("viewer", 2, null, true);

        assertThat(response).isInstanceOf(EventListPageDto.class);
        EventListPageDto page = (EventListPageDto) response;
        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(record -> record.id())
                .containsExactly("event-1", "event-2");
        assertThat(page.nextCursor()).contains("event-2");
        verify(activityEventsRepository, never()).findByOwnerUserIdOrderByStartAtIsoAsc(anyString());
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
    }

    @Test
    void slimDirectBucketPagesReturnCardsWithoutSnapshotFanout() {
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
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("host")).thenReturn(Map.of());

        Object hostingResponse = service.queryHostingPage("host", 2, null, true);
        Object invitationResponse = service.queryInvitationsPage("host", 2, null, true);
        Object trashResponse = service.queryTrashPage("host", 2, null, true);

        assertThat(hostingResponse).isInstanceOf(EventListPageDto.class);
        assertThat(((EventListPageDto) hostingResponse).records()).extracting(record -> record.id())
                .containsExactly("hosting-1");
        assertThat(invitationResponse).isInstanceOf(EventListPageDto.class);
        assertThat(((EventListPageDto) invitationResponse).records()).extracting(record -> record.id())
                .containsExactly("invite-1");
        assertThat(trashResponse).isInstanceOf(EventListPageDto.class);
        assertThat(((EventListPageDto) trashResponse).records()).extracting(record -> record.id())
                .containsExactly("trash-1");
        verify(activityEventsRepository, never()).findByOwnerUserIdOrderByStartAtIsoAsc(anyString());
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
        verify(activitiesMembersService, never()).queryOwnerSnapshot(anyString(), anyString());
    }

    @Test
    void pagedDirectOwnerFilterKeepsFullEventPageContract() {
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
        when(activityEventsRepository.findByOwnerUserIdOrderByStartAtIsoAsc("host"))
                .thenReturn(List.of(first, second, third));
        when(activitiesMembersService.findTrackedEventSourceIdsForUser("host")).thenReturn(Set.of());
        when(activitiesMembersService.buildBatchEventSnapshots(anyMap())).thenReturn(Map.of());

        EventsExplorePageDto page = service.queryActivitiesEventPage(new EventsFilterRequestDto(
                "host", "my-events", "all", "recent", "date", "day", 2, null, null, null, null, null));

        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(EventRecordDto::id).containsExactly("event-1", "event-2");
        assertThat(page.records()).allSatisfy(record -> {
            assertThat(record.type()).isEqualTo("hosting");
            assertThat(record.subEvents()).isNotNull();
        });
        assertThat(page.nextCursor()).contains("event-2");
    }

    @Test
    void slimActivitiesFilterPageReturnsCardsAndSkipsSlotMaterialization() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setName("Viewer User");

        ActivityEvent first = event("event-1", "host", 0d);
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("viewer"))
                .thenReturn(acceptedStatuses("event-1", "event-2", "event-3"));
        doReturn(List.<ActivityEvent>of())
                .doReturn(List.of(first, second, third))
                .when(mongoTemplate).find(any(Query.class), eq(ActivityEvent.class));

        EventListPageDto page = service.queryActivitiesEventListPage(new EventsFilterRequestDto(
                "viewer", "all", "all", "recent", "date", "day", 2, null, null, null, null, true));

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
    void slimUserEventPageReturnsLimitedCardsAndCursor() {
        Users host = new Users();
        host.setId("host");
        host.setName("Host User");

        ActivityEvent first = event("event-1", "host", 0d);
        ActivityEvent second = event("event-2", "host", 0d);
        ActivityEvent third = event("event-3", "host", 0d);

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(first, second, third));
        when(activitiesMembersService.findTrackedEventMembershipStatusesForUser("host")).thenReturn(Map.of());

        Object response = service.queryItemsByUserPage("host", 2, null, true);

        assertThat(response).isInstanceOf(EventListPageDto.class);
        EventListPageDto page = (EventListPageDto) response;
        assertThat(page.total()).isEqualTo(3);
        assertThat(page.records()).extracting(record -> record.id())
                .containsExactly("event-1", "event-2");
        assertThat(page.nextCursor()).contains("event-2");
        verify(activityEventsRepository, never()).findByOwnerUserIdOrderByStartAtIsoAsc(anyString());
        verify(activitiesMembersService, never()).buildBatchEventSnapshots(anyMap());
        verify(activitiesMembersService, never()).queryOwnerSnapshot(anyString(), anyString());
        verify(userAffinityEdgesRepository, never()).findRelevantByUserIds(anyList());
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
        event.setStartAtIso("2026-06-01T10:00:00Z");
        event.setEndAtIso("2026-06-01T12:00:00Z");
        event.setVisibility("Public");
        event.setCapacityTotal(10);
        event.setRating(0d);
        event.setBoost(0d);
        event.setAffinity(affinity);
        return event;
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
