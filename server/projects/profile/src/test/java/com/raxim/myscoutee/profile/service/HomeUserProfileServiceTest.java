package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.common.config.properties.RegionSecurityProperties;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
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
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
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

    private HomeUserProfileService service;
    private final AbsoluteAffinityService absoluteAffinityService = new AbsoluteAffinityService(null, null);

    @BeforeEach
    void setUp() {
        lenient().when(userRatesRepository.findByOwnerUserId("active")).thenReturn(List.of());
        lenient().when(userRatesRepository.findByOwnerUserIdAndMode("active", "pair")).thenReturn(List.of());
        service = new HomeUserProfileService(
                usersRepository,
                userFilterPreferencesRepository,
                userAffinityEdgesRepository,
                userRatesRepository,
                activityChatsRepository,
                activityEventsRepository,
                activityMembersRepository,
                eventParticipationTicketService,
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                userFeedbackSubmissionsRepository,
                userReportSubmissionsRepository,
                userSessionActionsRepository,
                scheduledMessageTaskService,
                countryPartitionService,
                regionSecurityProperties,
                absoluteAffinityService);
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
}
