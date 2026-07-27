package com.raxim.myscoutee.profile.controller.notifications;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationPreferenceRequestDto;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

@ExtendWith(MockitoExtension.class)
class UserNotificationsControllerTest {
    @Mock
    private UserNotificationService userNotificationService;
    @Mock
    private HomeUserProfileService homeUserProfileService;

    private UserNotificationsController controller;

    @BeforeEach
    void setUp() {
        controller = new UserNotificationsController(userNotificationService, homeUserProfileService);
    }

    @Test
    void delegatesUsingTheResolvedCurrentUserRatherThanTheRequestedId() {
        when(homeUserProfileService.resolveSelectedUserId("requested-user")).thenReturn("principal-user");

        controller.updatePreferences(
                new UserNotificationPreferenceRequestDto(true),
                "requested-user");

        verify(userNotificationService).updateMutedPreference("principal-user", true);
    }

    @Test
    void rejectsNotificationAccessWithoutAResolvedCurrentOrDemoUser() {
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn(null);

        assertThatThrownBy(() -> controller.queryPage("new", 20, null, null))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("401 UNAUTHORIZED");
    }
}
