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

        service.notifyInvitees(event, List.of("invitee-1"), "actual-inviter");

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.createdUser()).isEqualTo("actual-inviter");
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
}
