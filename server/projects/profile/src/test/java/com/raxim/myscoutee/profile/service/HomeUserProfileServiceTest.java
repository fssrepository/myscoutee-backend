package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
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
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
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
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserAssetCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserEventFeedbackCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.security.AccessControlService;

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
    @Mock
    private AccessControlService accessControlService;

    private HomeUserProfileService service;
    private final AbsoluteAffinityService absoluteAffinityService = new AbsoluteAffinityService(null, null);

    @BeforeEach
    void setUp() {
        lenient().when(userRatesRepository.findByOwnerUserId("active")).thenReturn(List.of());
        lenient().when(userRatesRepository.findByOwnerUserIdAndMode("active", "pair")).thenReturn(List.of());
        lenient().when(activityMembersRepository.findAll()).thenReturn(List.of());
        lenient().when(assetsRepository.findByOwnerUserId("active")).thenReturn(List.of());
        lenient().when(accessControlService.canCurrentActorEditProfile(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorDeleteProfile(anyString())).thenReturn(true);
        lenient().when(accessControlService.canCurrentActorUploadMedia(anyString())).thenReturn(true);
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
                adminMenuCounterService,
                accessControlService);
    }

    @Test
    void scheduleUserDeletionByUserIdMarksUserForThirtyDayPurge() {
        Users user = new Users();
        user.setUserId("active");
        user.setName("Active User");
        user.setStatus("A");
        user.setProfileStatus("public");
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(user));
        when(usersRepository.save(user)).thenReturn(user);

        var result = service.scheduleUserDeletionByUserId("active", "facebook-data-deletion");

        assertThat(result.submitted()).isTrue();
        assertThat(user.getStatus()).isEqualTo("D");
        assertThat(user.getProfileStatus()).isEqualTo("deleted");
        assertThat(user.getPreviousProfileStatus()).isEqualTo("public");
        assertThat(user.getDeletedAtIso()).isNotBlank();
        verify(affinityRecomputeTaskService).enqueueAdminStatusChanged("active");
        verify(adminTelemetryService).record("profile.deleted", "profiles", "active", "active");
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
        when(activityMembersRepository.findAll()).thenReturn(List.of(
                acceptedMember("active-bridge", "active"),
                acceptedMember("active-bridge", "bridge"),
                acceptedMember("bridge-candidate", "bridge"),
                acceptedMember("bridge-candidate", "social-candidate")));
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
        verify(userRatesRepository, times(1)).findAll();
        verify(activityMembersRepository, times(2)).findAll();
        verify(userRatesRepository, times(2)).findByOwnerUserId("active");
        verify(userAffinityEdgesRepository, times(1)).findRelevantByUserIds(List.of("active"));
    }

    @Test
    void demoUserListItemsHonorsRequestedLimit() {
        Users setup = user("u-onboarding", 990_000d);
        setup.setName("");
        setup.setStatusText("New");
        setup.setCompletion(0);
        setup.setProfileFormVersion(0);
        setup.setLocationCoordinates(new Users.LocationCoordinatesRecord(30.2672d, -97.7431d));
        Users ava = user("ava", 10d);
        Users mia = user("mia", 20d);
        Users zoe = user("zoe", 30d);
        when(usersRepository.findAllByOrderByNameAscUserIdAsc()).thenReturn(List.of(setup, ava, mia, zoe));

        assertThat(service.queryDemoUserListItems(2))
                .extracting(item -> item.id())
                .containsExactly("u-onboarding", "ava");
        verify(usersRepository, times(1)).findAllByOrderByNameAscUserIdAsc();
        verify(usersRepository, never()).findAll();
    }

    @Test
    void demoUserListItemsFilterBySelectorRole() {
        Users member = user("member", 30d);
        Users admin = user("admin-demo-ava", 20d);
        admin.setHostTier("Admin");
        when(usersRepository.findAllByOrderByNameAscUserIdAsc()).thenReturn(List.of(admin, member));

        assertThat(service.queryDemoUserListItems(null, "member"))
                .extracting(item -> item.id())
                .containsExactly("member");
        assertThat(service.queryDemoUserListItems(null, "admin"))
                .extracting(item -> item.id())
                .containsExactly("admin-demo-ava");
    }

    @Test
    void demoUserListItemsIncludeLifecycleStatuses() {
        Users active = user("active", 30d);
        Users blocked = user("blocked", 20d);
        blocked.setProfileStatus("blocked");
        Users inactive = user("inactive", 10d);
        inactive.setProfileStatus("inactive");
        Users deleted = user("deleted", 5d);
        deleted.setStatus("D");
        deleted.setProfileStatus("deleted");
        deleted.setDeletedAtIso("2026-01-02T03:04:05Z");
        Users onboarding = user("onboarding", 40d);
        onboarding.setProfileStatus("onboarding");
        when(usersRepository.findAllByOrderByNameAscUserIdAsc())
                .thenReturn(List.of(active, blocked, deleted, inactive, onboarding));

        assertThat(service.queryDemoUserListItems())
                .extracting(item -> item.id())
                .containsExactly("active", "blocked", "deleted", "inactive");
        assertThat(service.queryDemoUserListItems())
                .filteredOn(item -> "deleted".equals(item.id()))
                .extracting(item -> item.profileStatus(), item -> item.deletedAtIso())
                .containsExactly(tuple("deleted", "2026-01-02T03:04:05Z"));
    }

    @Test
    void onboardingAutosaveKeepsThirtyDayPurgeTimestamp() {
        Users active = user("active", 0d);
        active.setStatus("A");
        active.setProfileStatus("onboarding");
        active.setDeletedAtIso("2026-05-01T00:00:00Z");
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(active));
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto saved = service.saveUserProfile(onboardingDraftUser("active"));

        assertThat(saved.profileStatus()).isEqualTo("onboarding");
        assertThat(saved.deletedAtIso()).isEqualTo("2026-05-01T00:00:00Z");
    }

    @Test
    void deleteUserRejectsDeniedUserBeforeSchedulingDeletion() {
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(user("active", 0d)));
        when(accessControlService.canCurrentActorDeleteProfile("active")).thenReturn(false);

        assertThatThrownBy(() -> service.deleteUser(new UserDeleteRequestDto("active")))
                .hasMessageContaining("delete this profile");

        verify(usersRepository, never()).save(any(Users.class));
    }

    @Test
    void profileAutosaveRejectsDeniedUserBeforeSaving() {
        when(accessControlService.canCurrentActorEditProfile("active")).thenReturn(false);

        assertThatThrownBy(() -> service.saveUserProfile(onboardingDraftUser("active")))
                .hasMessageContaining("edit this profile");

        verify(usersRepository, never()).save(any(Users.class));
    }

    @Test
    void realtimeSnapshotUsesStoredActivityCountersWithoutRecomputing() {
        Users active = user("active", 0d);
        active.setActivities(storedActivityCounters());
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(active));
        when(eventFeedbackAnswersRepository.findByTargetUserIdOrderBySubmittedAtIsoDesc("active")).thenReturn(List.of());

        var snapshot = service.queryRealtimeSnapshot(new UserRealtimeLongPollRequestDto("active", null));

        assertFlatCounters(snapshot.counters());
        assertNestedCounters(snapshot.counters());
        verifyNoInteractions(activityChatsRepository, activityEventsRepository, eventFeedbackStatesRepository,
                eventParticipationTicketService, assetsRepository);
    }

    @Test
    void queryUserByIdReturnsStoredMenuCounterOverridesWithNestedGroups() {
        Users active = user("active", 0d);
        active.setActivities(storedActivityCounters());
        when(usersRepository.findByUserId("active")).thenReturn(Optional.of(active));

        var response = service.queryUserById("active");

        assertThat(response).isNotNull();
        assertFlatCounters(response.counterOverrides());
        assertNestedCounters(response.counterOverrides());
        assertFlatCounters(response.activities());
        assertNestedCounters(response.activities());
        assertThat(response.filterCount()).isEqualTo(3);
        verifyNoInteractions(activityChatsRepository, activityEventsRepository, eventFeedbackStatesRepository,
                eventParticipationTicketService, assetsRepository);
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

    private Users.UserActivitiesRecord storedActivityCounters() {
        return new Users.UserActivitiesRecord(
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                new Users.UserEventCountersRecord(20, 6, 2, 5, 7, 1, 3),
                new Users.UserAssetCountersRecord(8, 9, 10, 11),
                new Users.UserEventFeedbackCountersRecord(4, 13, 14, 2),
                15,
                16);
    }

    private void assertFlatCounters(UserRealtimeCountersDto counters) {
        assertFlatCounters(
                counters.game(), counters.chat(), counters.invitations(), counters.events(), counters.hosting(),
                counters.cars(), counters.accommodation(), counters.supplies(), counters.tickets(),
                counters.contacts(), counters.feedback(), counters.adminJobs(), counters.adminMetrics());
    }

    private void assertFlatCounters(UserMenuCountersDto counters) {
        assertFlatCounters(
                counters.game(), counters.chat(), counters.invitations(), counters.events(), counters.hosting(),
                counters.cars(), counters.accommodation(), counters.supplies(), counters.tickets(),
                counters.contacts(), counters.feedback(), counters.adminJobs(), counters.adminMetrics());
    }

    private void assertFlatCounters(UserActivitiesDto counters) {
        assertFlatCounters(
                counters.game(), counters.chat(), counters.invitations(), counters.events(), counters.hosting(),
                counters.cars(), counters.accommodation(), counters.supplies(), counters.tickets(),
                counters.contacts(), counters.feedback(), counters.adminJobs(), counters.adminMetrics());
    }

    private void assertFlatCounters(
            Integer game,
            Integer chat,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer contacts,
            Integer feedback,
            Integer adminJobs,
            Integer adminMetrics) {
        assertThat(game).isEqualTo(3);
        assertThat(chat).isEqualTo(4);
        assertThat(invitations).isEqualTo(5);
        assertThat(events).isEqualTo(6);
        assertThat(hosting).isEqualTo(7);
        assertThat(cars).isEqualTo(8);
        assertThat(accommodation).isEqualTo(9);
        assertThat(supplies).isEqualTo(10);
        assertThat(tickets).isEqualTo(11);
        assertThat(contacts).isEqualTo(12);
        assertThat(feedback).isEqualTo(13);
        assertThat(adminJobs).isEqualTo(15);
        assertThat(adminMetrics).isEqualTo(16);
    }

    private void assertNestedCounters(UserRealtimeCountersDto counters) {
        assertNestedCounters(counters.event(), counters.asset(), counters.eventFeedback());
    }

    private void assertNestedCounters(UserMenuCountersDto counters) {
        assertNestedCounters(counters.event(), counters.asset(), counters.eventFeedback());
    }

    private void assertNestedCounters(UserActivitiesDto counters) {
        assertNestedCounters(counters.event(), counters.asset(), counters.eventFeedback());
    }

    private void assertNestedCounters(
            UserEventCountersDto event,
            UserAssetCountersDto asset,
            UserEventFeedbackCountersDto eventFeedback) {
        assertThat(event.all()).isEqualTo(20);
        assertThat(event.active()).isEqualTo(6);
        assertThat(event.pending()).isEqualTo(2);
        assertThat(event.invitations()).isEqualTo(5);
        assertThat(event.hosting()).isEqualTo(7);
        assertThat(event.drafts()).isEqualTo(1);
        assertThat(event.trash()).isEqualTo(3);

        assertThat(asset.cars()).isEqualTo(8);
        assertThat(asset.accommodation()).isEqualTo(9);
        assertThat(asset.supplies()).isEqualTo(10);
        assertThat(asset.tickets()).isEqualTo(11);

        assertThat(eventFeedback.ownEvents()).isEqualTo(4);
        assertThat(eventFeedback.pending()).isEqualTo(13);
        assertThat(eventFeedback.feedbacked()).isEqualTo(14);
        assertThat(eventFeedback.removed()).isEqualTo(2);
    }

    private ActivityMember acceptedMember(String ownerId, String userId) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus("accepted");
        member.setMetWhere("Coffee Social");
        member.setActionAtIso("2026-03-22T18:30:00Z");
        return member;
    }

    private UserRate activityRate(String ownerUserId, String relatedUserId, String updatedDate) {
        UserRate record = new UserRate();
        record.setOwnerUserId(ownerUserId);
        record.setRelatedUserId(relatedUserId);
        record.setUpdatedDate(updatedDate);
        return record;
    }

    private UserDto onboardingDraftUser(String userId) {
        return new UserDto(
                userId,
                "Draft User",
                30,
                "1996-01-01",
                "Budapest",
                "180 cm",
                "Average",
                List.of("English"),
                "Capricorn",
                "DU",
                "",
                "",
                "",
                "",
                55,
                0,
                "Draft headline",
                "Draft about",
                0d,
                null,
                "",
                List.of(),
                List.of(),
                null,
                "onboarding",
                "",
                null,
                false,
                null);
    }
}
