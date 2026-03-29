package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class EventSchedulerTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    @Mock
    private EventInviteNotificationService eventInviteNotificationService;

    @Test
    void generatePriorityPlansPersistsInvitesAndSendsNotifications() {
        EventScheduler scheduler = new EventScheduler(
                usersRepository,
                userRatesRepository,
                activityEventsRepository,
                activitiesMembersService,
                activitiesEventLeaderboardService,
                eventInviteNotificationService);

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setAutoInviter(true);
        event.setPublished(true);
        event.setCapacityTotal(3);
        event.setCreatorUserId("creator-1");
        event.setTitle("Board Game Night");
        event.setLocation("Bratislava");

        when(activityEventsRepository.findAll()).thenReturn(List.of(event));
        when(usersRepository.findAll()).thenReturn(List.of(
                user("creator-1"),
                user("locked-1"),
                user("u1"),
                user("u2"),
                user("u3")));
        when(userRatesRepository.findAll()).thenReturn(List.of(
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
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setId(userId);
        user.setName(userId);
        return user;
    }

    private UserRate rate(String ownerUserId, String relatedUserId, double affinityScore) {
        UserRate rate = new UserRate();
        rate.setSource("activity-rate");
        rate.setMode("single");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setAffinityScore(affinityScore);
        return rate;
    }
}
