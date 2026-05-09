package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

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
    private MongoTemplate mongoTemplate;

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
                mongoTemplate);
    }

    @Test
    void mostRelevantExploreUsesKnownViewerHostEdgeBeforeColdStartAffinityGap() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setAffinity(100d);

        ActivityEvent knownHostEvent = event("known-event", "known-host", 900_000d);
        ActivityEvent coldStartEvent = event("cold-event", "cold-host", 100d);

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findAll()).thenReturn(List.of());
        when(activityEventsRepository.findCanonicalExploreCandidates("events"))
                .thenReturn(List.of(coldStartEvent, knownHostEvent));
        when(activityEventsRepository.findByOwnerUserId("viewer")).thenReturn(List.of());
        when(activitiesMembersService.findTrackedEventSourceIdsForUser("viewer")).thenReturn(Set.of());
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
        verify(userAffinityEdgesRepository).findRelevantByUserIds(anyList());
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
