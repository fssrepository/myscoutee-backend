package com.raxim.myscoutee.profile.controller.notifications;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationPreferenceDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationPreferenceRequestDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationReadResponseDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationsPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationsSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationsSyncResponseDto;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

@RestController
@RequestMapping("/notifications")
public class UserNotificationsController {
    private final UserNotificationService userNotificationService;
    private final HomeUserProfileService homeUserProfileService;

    public UserNotificationsController(
            UserNotificationService userNotificationService,
            HomeUserProfileService homeUserProfileService) {
        this.userNotificationService = userNotificationService;
        this.homeUserProfileService = homeUserProfileService;
    }

    @GetMapping
    public UserNotificationsPageResponseDto queryPage(
            @RequestParam(value = "bucket", required = false) String bucket,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor,
            @RequestParam(value = "userId", required = false) String userId) {
        return userNotificationService.queryPage(resolveCurrentUserId(userId), bucket, limit, cursor);
    }

    @PostMapping("/sync")
    public UserNotificationsSyncResponseDto sync(
            @RequestBody UserNotificationsSyncRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return userNotificationService.sync(resolveCurrentUserId(userId), request);
    }

    @PostMapping("/{notificationId}/read")
    public UserNotificationReadResponseDto markRead(
            @PathVariable("notificationId") String notificationId,
            @RequestParam(value = "userId", required = false) String userId) {
        return userNotificationService.markRead(resolveCurrentUserId(userId), notificationId);
    }

    @PutMapping("/preferences")
    public UserNotificationPreferenceDto updatePreferences(
            @RequestBody UserNotificationPreferenceRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return userNotificationService.updateMutedPreference(
                resolveCurrentUserId(userId),
                request == null ? null : request.muted());
    }

    private String resolveCurrentUserId(String requestedUserId) {
        String resolvedUserId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current user is required.");
        }
        return resolvedUserId;
    }
}
