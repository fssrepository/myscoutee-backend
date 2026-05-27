package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.common.config.properties.RegionSecurityProperties;
import com.raxim.myscoutee.profile.repository.ActivityChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserFilterPreferencesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;

@ExtendWith(MockitoExtension.class)
class HomeUserProfileServiceTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserFilterPreferencesRepository userFilterPreferencesRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private ActivityChatsRepository activityChatsRepository;
    @Mock
    private ActivityChatMessagesRepository activityChatMessagesRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private EventParticipationTicketService eventParticipationTicketService;
    @Mock
    private EventFeedbackStatesRepository eventFeedbackStatesRepository;
    @Mock
    private EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    @Mock
    private UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository;
    @Mock
    private UserReportSubmissionsRepository userReportSubmissionsRepository;
    @Mock
    private UserSessionActionsRepository userSessionActionsRepository;
    @Mock
    private ScheduledMessageTaskService scheduledMessageTaskService;
    @Mock
    private CountryPartitionService countryPartitionService;
    @Mock
    private RegionSecurityProperties regionSecurityProperties;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AdminMenuCounterService adminMenuCounterService;

    private HomeUserProfileService service;
    private final AbsoluteAffinityService absoluteAffinityService = new AbsoluteAffinityService(null, null);

    @BeforeEach
    void setUp() {
        lenient().when(userRatesRepository.findByOwnerUserId("active")).thenReturn(List.of());
        lenient().when(userRatesRepository.findByOwnerUserIdAndMode("active", "pair")).thenReturn(List.of());
        lenient().when(activityMembersRepository.findAll()).thenReturn(List.of());
        lenient().when(assetsRepository.findByOwnerUserId("active")).thenReturn(List.of());
        service = new HomeUserProfileService(
                usersRepository,
                userFilterPreferencesRepository,
                userAffinityEdgesRepository,
                userRatesRepository,
                activityChatsRepository,
                activityChatMessagesRepository,
                activityEventsRepository,
                activityMembersRepository,
                assetsRepository,
                eventParticipationTicketService,
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                userFeedbackSubmissionsRepository,
                userReportSubmissionsRepository,
                userSessionActionsRepository,
                scheduledMessageTaskService,
                countryPartitionService,
                regionSecurityProperties,
                absoluteAffinityService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                adminMenuCounterService);
    }

    @Test
    void friendsInCommonUsesKnownEdgeWeightBeforeColdStartAffinityWhenBridgeCountTies() {
        List<Users> users = List.of(
                user("active", 0d),
                user("bridge", 0d),
                user("strong-known", 1d),
                user("cold-popular", 900_000d));
        HomeUserProfileService.ActivitySocialGraph graph = graph(Map.of(
                "active", Set.of("bridge"),
                "bridge", Set.of("active", "strong-known", "cold-popular"),
                "strong-known", Set.of("bridge"),
                "cold-popular", Set.of("bridge")));

        List<HomeUserProfileService.GameSocialCardCandidate> cards = service.queryFriendsInCommonCards(
                "active",
                users,
                graph,
                Map.of(
                        "active:strong-known", 0.95d,
                        "active:cold-popular", 0.05d));

        assertThat(cards).extracting(HomeUserProfileService.GameSocialCardCandidate::userId)
                .containsExactly("strong-known", "cold-popular");
    }

    @Test
    void insideNetworkPairSuggestionsUseKnownCandidateEdgeWeight() {
        List<Users> users = List.of(
                user("active", 0d),
                user("a", 0d),
                user("b", 0d),
                user("c", 0d));
        HomeUserProfileService.ActivitySocialGraph graph = graph(Map.of(
                "active", Set.of("a", "b", "c"),
                "a", Set.of("active"),
                "b", Set.of("active"),
                "c", Set.of("active")));

        List<HomeUserProfileService.GameSocialCardCandidate> cards = service.querySeparatedFriendCards(
                "active",
                users,
                graph,
                Map.of(
                        "a:b", 0.9d,
                        "a:c", 0.1d));

        assertThat(cards.get(0).userId()).isEqualTo("a");
        assertThat(cards.get(0).secondaryUserId()).isEqualTo("b");
    }

    @Test
    void preferencesExcludeFriendsInCommonCandidates() {
        Users active = user("active", 0d);
        Users bridge = user("bridge", 0d);
        bridge.setProfileStatus("friends only");
        Users socialCandidate = user("social-candidate", 900_000d);
        Users outsideCandidate = user("outside-candidate", 1d);

        when(usersRepository.findByProfileStatusIn(List.of("public", "friends only")))
                .thenReturn(List.of(active, bridge, socialCandidate, outsideCandidate));
        when(userRatesRepository.findAll()).thenReturn(List.of(
                metRate("active", "bridge"),
                metRate("bridge", "social-candidate")));
        when(userAffinityEdgesRepository.findRelevantByUserIds(List.of("active"))).thenReturn(List.of());

        List<Users> cards = service.queryGameStackUserRecords("active");

        assertThat(cards).extracting(Users::getId)
                .containsExactly("outside-candidate");
    }

    @Test
    void preferencesUseDistanceAndFreshnessAsSoftLiveRankingModifiers() {
        Users active = user("active", 0d);
        active.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.4979, 19.0402));
        Users nearFresh = user("near-fresh", 10d);
        nearFresh.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.4979, 19.0402));
        Users farStale = user("far-stale", 20d);
        farStale.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.8566, 2.3522));

        when(usersRepository.findByProfileStatusIn(List.of("public", "friends only")))
                .thenReturn(List.of(active, nearFresh, farStale));
        when(userRatesRepository.findAll()).thenReturn(List.of(
                activityRate("near-fresh", "active", java.time.Instant.now().toString())));
        when(userAffinityEdgesRepository.findRelevantByUserIds(List.of("active"))).thenReturn(List.of());

        List<Users> cards = service.queryGameStackUserRecords("active");

        assertThat(cards).extracting(Users::getId)
                .containsExactly("near-fresh", "far-stale");
    }

    @Test
    void gameStackQueryReusesHotGlobalSnapshotButRefreshesUserRatings() {
        Users active = user("active", 0d);
        Users candidate = user("candidate", 10d);
        when(usersRepository.findByProfileStatusIn(List.of("public", "friends only")))
                .thenReturn(List.of(active, candidate));
        when(userRatesRepository.findAll()).thenReturn(List.of());
        when(userAffinityEdgesRepository.findRelevantByUserIds(List.of("active"))).thenReturn(List.of());

        List<Users> firstCards = service.queryGameStackUserRecords("active");
        List<Users> secondCards = service.queryGameStackUserRecords("active");

        assertThat(firstCards).extracting(Users::getId).containsExactly("candidate");
        assertThat(secondCards).extracting(Users::getId).containsExactly("candidate");
        verify(usersRepository, times(1)).findByProfileStatusIn(List.of("public", "friends only"));
        verify(userRatesRepository, times(2)).findAll();
        verify(activityMembersRepository, times(1)).findAll();
        verify(userRatesRepository, times(2)).findByOwnerUserId("active");
        verify(userAffinityEdgesRepository, times(1)).findRelevantByUserIds(List.of("active"));
    }

    @Test
    void demoUserListItemsHonorsRequestedLimit() {
        Users high = user("high", 30d);
        Users medium = user("medium", 20d);
        Users low = user("low", 10d);
        when(usersRepository.findAll()).thenReturn(List.of(low, high, medium));

        assertThat(service.queryDemoUserListItems(2))
                .extracting(item -> item.id())
                .containsExactly("high", "medium");
    }

    @Test
    void profileImageSaveEnqueuesUserRecompute() {
        Users active = user("active", 0d);
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(active));
        when(usersRepository.save(active)).thenReturn(active);

        service.saveUserProfileImage("active", 0, "https://cdn.example.com/avatar.jpg");

        verify(affinityRecomputeTaskService).enqueueUserChanged("active");
    }

    @Test
    void realtimeSnapshotReusesHotReadSnapshotWork() {
        Users active = user("active", 0d);
        active.setActivities(new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(active));
        when(usersRepository.findByProfileStatusIn(List.of("public", "friends only"))).thenReturn(List.of(active));
        when(activityEventsRepository.findByOwnerUserId("active")).thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "active")).thenReturn(List.of());
        when(activityChatsRepository.findByOwnerUserId("active")).thenReturn(List.of());
        when(eventParticipationTicketService.queryTicketRecordsForUser("active")).thenReturn(List.of());
        when(eventFeedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc("active")).thenReturn(List.of());
        when(eventFeedbackAnswersRepository.findByTargetUserIdOrderBySubmittedAtIsoDesc("active")).thenReturn(List.of());
        when(userRatesRepository.findAll()).thenReturn(List.of());
        when(userAffinityEdgesRepository.findRelevantByUserIds(List.of("active"))).thenReturn(List.of());

        service.queryRealtimeSnapshot(new UserRealtimeLongPollRequestDto("active", null));
        service.queryRealtimeSnapshot(new UserRealtimeLongPollRequestDto("active", null));

        verify(activityEventsRepository, times(1)).findByOwnerUserId("active");
        verify(eventFeedbackAnswersRepository, times(1)).findByTargetUserIdOrderBySubmittedAtIsoDesc("active");
    }

    private HomeUserProfileService.ActivitySocialGraph graph(Map<String, Set<String>> neighborsByUserId) {
        Map<String, Set<String>> normalizedNeighbors = new LinkedHashMap<>();
        neighborsByUserId.forEach((userId, neighbors) ->
                normalizedNeighbors.put(userId, new LinkedHashSet<>(neighbors)));
        return new HomeUserProfileService.ActivitySocialGraph(normalizedNeighbors, Map.of());
    }

    private Users user(String userId, double affinity) {
        Users user = new Users();
        user.setId(userId);
        user.setName(userId);
        user.setAffinity(affinity);
        return user;
    }

    private UserRate metRate(String ownerUserId, String relatedUserId) {
        UserRate record = new UserRate();
        record.setOwnerUserId(ownerUserId);
        record.setRelatedUserId(relatedUserId);
        record.setMet(true);
        record.setEventName("Coffee Social");
        return record;
    }

    private UserRate activityRate(String ownerUserId, String relatedUserId, String updatedDate) {
        UserRate record = new UserRate();
        record.setOwnerUserId(ownerUserId);
        record.setRelatedUserId(relatedUserId);
        record.setUpdatedDate(updatedDate);
        return record;
    }
}
