package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class UserActivityCountersServiceTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private EventFeedbackStatesRepository eventFeedbackStatesRepository;

    private UserActivityCountersService service;

    @BeforeEach
    void setUp() {
        service = new UserActivityCountersService(
                usersRepository,
                activityEventsRepository,
                activityMembersRepository,
                assetsRepository,
                eventFeedbackStatesRepository);
    }

    @Test
    void refreshAssetCountersForUserStoresActiveOwnedAssetCounts() {
        Users user = user("owner", activitiesWithAssetAndFeedback(0, 0, 0, 5, 2, 1, 3, 4));
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));
        when(assetsRepository.findByOwnerUserId("owner")).thenReturn(List.of(
                asset("Car", "A"),
                asset("Accommodation", "A"),
                asset("Supplies", "A"),
                asset("Supplies", "UR"),
                asset("Car", "D")));

        service.refreshAssetCountersForUser("owner");

        Users saved = savedUser();
        Users.UserActivitiesRecord activities = saved.getActivities();
        assertThat(activities.cars()).isEqualTo(1);
        assertThat(activities.accommodation()).isEqualTo(1);
        assertThat(activities.supplies()).isEqualTo(1);
        assertThat(activities.tickets()).isEqualTo(5);
        assertThat(activities.asset().cars()).isEqualTo(1);
        assertThat(activities.asset().accommodation()).isEqualTo(1);
        assertThat(activities.asset().supplies()).isEqualTo(1);
        assertThat(activities.asset().tickets()).isEqualTo(5);
    }

    @Test
    void applyFeedbackStateTransitionMovesStoredMenuAndPopupBuckets() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(2, 2, 2, 0, 4, 3, 1, 0));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));

        service.applyFeedbackStateTransition("viewer", false, false, true, false);

        Users saved = savedUser();
        Users.UserActivitiesRecord activities = saved.getActivities();
        assertThat(activities.feedback()).isEqualTo(2);
        assertThat(activities.eventFeedback().ownEvents()).isEqualTo(4);
        assertThat(activities.eventFeedback().pending()).isEqualTo(2);
        assertThat(activities.eventFeedback().feedbacked()).isEqualTo(2);
        assertThat(activities.eventFeedback().removed()).isZero();
    }

    @Test
    void refreshFeedbackReceivedCountersForUserCountsOwnedEventsWithExternalFeedback() {
        Users user = user("host", activitiesWithAssetAndFeedback(2, 2, 2, 0, 0, 3, 1, 0));
        when(usersRepository.findByUserId("host")).thenReturn(Optional.of(user));
        when(activityEventsRepository.findByCreatorUserId("host")).thenReturn(List.of(
                event("event-one", "host", "A"),
                event("event-two", "host", "A"),
                event("event-trash", "host", "T")));
        when(activityEventsRepository.findByAdminsContaining("host")).thenReturn(List.of(
                event("event-two", "other-host", "A")));
        when(eventFeedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(any()))
                .thenReturn(List.of(
                        state("event-one", "guest", "2026-03-01T10:00:00.000Z", ""),
                        state("event-one", "host", "2026-03-01T10:00:00.000Z", ""),
                        state("event-two", "guest", "", "Strong hosting.")));

        service.refreshFeedbackReceivedCountersForUser("host");

        Users saved = savedUser();
        Users.UserActivitiesRecord activities = saved.getActivities();
        assertThat(activities.feedback()).isEqualTo(3);
        assertThat(activities.eventFeedback().ownEvents()).isEqualTo(2);
        assertThat(activities.eventFeedback().pending()).isEqualTo(3);
        assertThat(activities.eventFeedback().feedbacked()).isEqualTo(1);
    }

    private Users savedUser() {
        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(captor.capture());
        return captor.getValue();
    }

    private Users user(String userId, Users.UserActivitiesRecord activities) {
        Users user = new Users();
        user.setUserId(userId);
        user.setActivities(activities);
        return user;
    }

    private Users.UserActivitiesRecord activitiesWithAssetAndFeedback(
            int cars,
            int accommodation,
            int supplies,
            int tickets,
            int ownEvents,
            int pending,
            int feedbacked,
            int removed) {
        return new Users.UserActivitiesRecord(
                0,
                0,
                0,
                0,
                0,
                cars,
                accommodation,
                supplies,
                tickets,
                0,
                pending,
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(cars, accommodation, supplies, tickets),
                new Users.UserEventFeedbackCountersRecord(ownEvents, pending, feedbacked, removed),
                0,
                0);
    }

    private Asset asset(String type, String status) {
        Asset asset = new Asset();
        asset.setType(type);
        asset.setStatus(status);
        return asset;
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String status) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setCreatorUserId(creatorUserId);
        event.setStatus(status);
        event.setIsTrashed(false);
        return event;
    }

    private EventFeedbackState state(String eventId, String viewerUserId, String submittedAtIso, String organizerNote) {
        EventFeedbackState state = new EventFeedbackState();
        state.setEventId(eventId);
        state.setViewerUserId(viewerUserId);
        state.setSubmittedAtIso(submittedAtIso);
        state.setOrganizerNote(organizerNote);
        state.setRemoved(false);
        return state;
    }
}
