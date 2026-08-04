package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

class EventInviteNotificationServiceTest {
    @Test
    void attributesInviteToTheActorRatherThanTheEventsLastUpdater() {
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        UserNotificationService userNotificationService = mock(UserNotificationService.class);
        EventInviteNotificationService service = new EventInviteNotificationService(
                notificationOutboxService,
                userNotificationService);
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Weekend hike");
        event.setUpdatedUser("stale-event-editor");

        service.notifyInvitees(event, List.of("actual-inviter", "invitee-1"), "actual-inviter");

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.createdUser()).isEqualTo("actual-inviter");
        assertThat(intent.recipientUserIds()).containsExactly("invitee-1");
        assertThat(intent.payload()).containsEntry("senderUserId", "actual-inviter");
    }

    @Test
    void resolvesTheRecipientsStoredInvitationNotificationByEvent() {
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        UserNotificationService userNotificationService = mock(UserNotificationService.class);
        EventInviteNotificationService service = new EventInviteNotificationService(
                notificationOutboxService,
                userNotificationService);

        service.markInvitationResolved(" event-1 ", " invitee-1 ");

        verify(userNotificationService).markEventInvitationResolved("invitee-1", "event-1");
    }

    @Test
    void reinvitingCreatesANewNotificationOccurrence() {
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        UserNotificationService userNotificationService = mock(UserNotificationService.class);
        EventInviteNotificationService service = new EventInviteNotificationService(
                notificationOutboxService,
                userNotificationService);
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Weekend hike");

        service.notifyInvitees(event, List.of("invitee-1"), "inviter-1");
        service.notifyInvitees(event, List.of("invitee-1"), "inviter-1");

        ArgumentCaptor<NotificationIntent> intent = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService, times(2)).enqueue(intent.capture());
        assertThat(intent.getAllValues())
                .extracting(value -> value.payload().get("invitationOccurrenceId"))
                .doesNotContainNull()
                .doesNotHaveDuplicates();
    }

    @Test
    void notifiesEventAdminsWhenAnInviteeAccepts() {
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        UserNotificationService userNotificationService = mock(UserNotificationService.class);
        EventInviteNotificationService service = new EventInviteNotificationService(
                notificationOutboxService,
                userNotificationService);
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Weekend hike");
        event.setLocation("Austin");

        service.notifyInvitationAccepted(
                event,
                "invitee-1",
                "Riley Outside",
                "2026-08-04T13:49:00Z",
                List.of("admin-1", "invitee-1", "admin-1"));

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.type()).isEqualTo("event-invitation-accepted");
        assertThat(intent.recipientScope()).isEqualTo("event-admins");
        assertThat(intent.recipientUserIds()).containsExactly("admin-1");
        assertThat(intent.title()).isEqualTo("Event invitation accepted");
        assertThat(intent.body()).isEqualTo("Riley Outside accepted the invitation to Weekend hike.");
        assertThat(intent.createdUser()).isEqualTo("invitee-1");
        assertThat(intent.payload())
                .containsEntry("eventId", "event-1")
                .containsEntry("memberUserId", "invitee-1")
                .containsEntry("memberName", "Riley Outside")
                .containsEntry("membershipAction", "accepted")
                .containsEntry("acceptedAtIso", "2026-08-04T13:49:00Z");
    }
}
