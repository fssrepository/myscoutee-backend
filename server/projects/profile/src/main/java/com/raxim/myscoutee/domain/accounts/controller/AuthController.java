package com.raxim.myscoutee.domain.accounts.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.DemoUserListItemDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFilterPreferencesRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLogoutRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSessionLoginRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSessionLoginResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.access.api.RequiresPolicy;
import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.groups.api.ProfileWorkspaceLoads;
import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;
import jakarta.servlet.http.HttpServletResponse;
import com.raxim.myscoutee.domain.accounts.service.UserLoginSessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final HomeUserProfileService homeUserProfileService;
    private final UserLoginSessionService userLoginSessionService;
    private final ProfileWorkspaceLoads groups;

    public AuthController(
            HomeUserProfileService homeUserProfileService,
            UserLoginSessionService userLoginSessionService,
            ProfileWorkspaceLoads groups) {
        this.groups = groups;
        this.homeUserProfileService = homeUserProfileService;
        this.userLoginSessionService = userLoginSessionService;
    }

    @GetMapping("/demo-users")
    public List<DemoUserListItemDto> queryDemoUsers(
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "role", required = false) String role) {
        return homeUserProfileService.queryDemoUserListItems(limit, role);
    }

    @GetMapping("/me")
    public UserByIdResponseDto queryMe(@RequestParam(value = "userId", required = false) String userId) {
        return homeUserProfileService.queryUserById(userId);
    }

    @GetMapping("/eligibility")
    public UserLocationEligibilityResponseDto queryLocationEligibility(
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude) {
        validateLocationCoordinates(latitude, longitude);
        return homeUserProfileService.queryLocationEligibility(latitude, longitude);
    }

    private void validateLocationCoordinates(Double latitude, Double longitude) {
        if (latitude == null && longitude == null) {
            return;
        }
        if (latitude == null
                || longitude == null
                || !Double.isFinite(latitude)
                || !Double.isFinite(longitude)
                || latitude < -90.0
                || latitude > 90.0
                || longitude < -180.0
                || longitude > 180.0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Latitude and longitude must be a complete, finite coordinate pair within valid ranges.");
        }
    }

    @PostMapping("/me/realtime/long-poll")
    public UserRealtimeLongPollResponseDto queryRealtimeSnapshot(@RequestBody UserRealtimeLongPollRequestDto request) {
        return homeUserProfileService.queryRealtimeSnapshot(request);
    }

    @PostMapping("/me/filter-preferences")
    public void saveFilterPreferences(@RequestBody UserFilterPreferencesRequestDto request) {
        homeUserProfileService.saveUserFilterPreferences(request.userId(), request.filterPreferences());
    }

    @PostMapping("/me/profile")
    @RequiresPolicy(
            key = AccessPolicyKeys.USER_PROFILE_EDIT,
            subject = "#request?.id()",
            resourceId = "#request?.id()",
            skipWhenAuthenticationOptional = true)
    public UserDto saveProfile(@RequestBody UserDto request) {
        return homeUserProfileService.saveUserProfile(request);
    }

    @PostMapping("/me/profile-ext")
    @RequiresPolicy(
            key = AccessPolicyKeys.USER_PROFILE_EDIT,
            subject = "#request?.profile()?.id()",
            resourceId = "#request?.profile()?.id()",
            skipWhenAuthenticationOptional = true)
    public UserDto saveProfileExt(@RequestBody ProfileExtDto request) {
        return homeUserProfileService.saveUserProfileExt(request);
    }

    @GetMapping("/me/profile-ext")
    public ProfileExtByIdResponseDto loadProfileExt(@RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "groupId", required = false) String groupId,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            HttpServletResponse httpResponse) {
        httpResponse.setHeader("Cache-Control", "no-store");
        var response = homeUserProfileService.loadProfileExtById(userId, latitude, longitude);
        if (response == null) return null;
        var actor = homeUserProfileService.resolveCurrentUser(userId);
        if (actor == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        String accountId = actor.getAccountUserId() == null ? actor.getUserId() : actor.getAccountUserId();
        var context = groups.loadProfileWorkspace(accountId, WorkspaceContext.currentGroupId(), groupId);
        return new ProfileExtByIdResponseDto(response.profileExt(), response.filterCount(), response.filterPreferences(),
                response.counterOverrides(), context.workspace(), context.accountProfile());
    }



    @PostMapping("/me/logout")
    public UserSubmitActionResponseDto logout(
            @RequestHeader(
                    value = UserLoginSessionService.SESSION_ID_HEADER,
                    required = false) String sessionId,
            @RequestBody(required = false) UserLogoutRequestDto request) {
        UserSubmitActionResponseDto response = homeUserProfileService.logout(request);
        if (response != null && response.submitted()) {
            userLoginSessionService.revokeCurrentSession(sessionId);
        }
        return response;
    }

    @PostMapping("/session/login")
    public ResponseEntity<UserSessionLoginResponseDto> registerSessionLogin(
            @RequestHeader(UserLoginSessionService.SESSION_ID_HEADER) String sessionId,
            @Valid @RequestBody UserSessionLoginRequestDto request,
            HttpServletRequest servletRequest) {
        UserSessionLoginResponseDto response = userLoginSessionService.registerLogin(
                sessionId,
                request,
                servletRequest);
        return ResponseEntity
                .status(response.accepted() ? HttpStatus.OK : HttpStatus.CONFLICT)
                .body(response);
    }

    @PostMapping("/me/delete")
    @RequiresPolicy(
            key = AccessPolicyKeys.USER_PROFILE_DELETE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.userId() ?: #actorUserId",
            skipWhenAuthenticationOptional = true)
    public UserSubmitActionResponseDto deleteUser(@RequestBody(required = false) UserDeleteRequestDto request) {
        return homeUserProfileService.deleteUser(request);
    }
}
