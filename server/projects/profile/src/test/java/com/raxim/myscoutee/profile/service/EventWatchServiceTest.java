package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventWatchSubscription;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventWatchSubscriptionsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;

class EventWatchServiceTest {
    @Test
    void outsiderCannotWatchAnEventThatIsNotPubliclyVisible() {
        Fixture fixture = fixture();
        Users watcher = new Users();
        watcher.setId("watcher");
        ActivityEvent event = visibleEvent();
        event.setVisibility("Invitation only");
        when(fixture.homeUserProfileService.resolveCurrentUser("watcher")).thenReturn(watcher);
        when(fixture.activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        assertThatThrownBy(() -> fixture.service.watch("watcher", "event-1"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        error -> assertThat(error.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(fixture.eventWatchSubscriptionsRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void availabilityChangeDoesNotNotifyAWatcherWhoCanNoLongerSeeTheEvent() {
        Fixture fixture = fixture();
        EventWatchSubscription subscription = new EventWatchSubscription();
        subscription.setUserId("watcher");
        subscription.setEventId("event-1");
        subscription.setLastObservedFull(true);
        subscription.setLastObservedAvailableCapacity(0);
        ActivityEvent event = visibleEvent();
        event.setVisibility("Invitation only");
        event.setCapacityTotal(2);
        event.setAcceptedMembers(1);
        var scope = mock(JobGroupScopeService.class);
        when(scope.findEventOwned(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(EventWatchSubscription.class), org.mockito.ArgumentMatchers.eq("eventId"))).thenReturn(List.of(subscription));
        org.springframework.test.util.ReflectionTestUtils.setField(fixture.service, "jobGroupScope", scope);
        when(fixture.activityEventsRepository.findBySourceIdIn(anyCollection())).thenReturn(List.of(event));

        org.springframework.test.util.ReflectionTestUtils.invokeMethod(fixture.service, "notifyWhenEventBecomesAvailableInGroup");

        verify(fixture.notificationOutboxService, never()).enqueue(org.mockito.ArgumentMatchers.any());
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<EventWatchSubscription>> changedCaptor = ArgumentCaptor.forClass(List.class);
        verify(fixture.eventWatchSubscriptionsRepository).saveAll(changedCaptor.capture());
        assertThat(changedCaptor.getValue()).singleElement().satisfies(changed -> {
            assertThat(changed.getLastObservedFull()).isFalse();
            assertThat(changed.getLastObservedAvailableCapacity()).isEqualTo(1);
        });
    }

    private ActivityEvent visibleEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setId("event-1-document");
        event.setSourceId("event-1");
        event.setOwnerUserId("host");
        event.setCreatorUserId("host");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setGenerated(false);
        event.setVisibility("Public");
        event.setCapacityTotal(1);
        event.setAcceptedMembers(1);
        return event;
    }

    private Fixture fixture() {
        EventWatchSubscriptionsRepository subscriptions = mock(EventWatchSubscriptionsRepository.class);
        ActivityEventsRepository events = mock(ActivityEventsRepository.class);
        HomeUserProfileService profiles = mock(HomeUserProfileService.class);
        UserActivityCountersService counters = mock(UserActivityCountersService.class);
        NotificationOutboxService outbox = mock(NotificationOutboxService.class);
        return new Fixture(
                new EventWatchService(subscriptions, events, profiles, mock(com.raxim.myscoutee.profile.security.FriendshipFacts.class), counters, outbox),
                subscriptions,
                events,
                profiles,
                outbox);
    }

    private record Fixture(
            EventWatchService service,
            EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository,
            ActivityEventsRepository activityEventsRepository,
            HomeUserProfileService homeUserProfileService,
            NotificationOutboxService notificationOutboxService) {
    }
}
