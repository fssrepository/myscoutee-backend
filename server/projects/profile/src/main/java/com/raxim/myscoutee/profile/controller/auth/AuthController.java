package com.raxim.myscoutee.profile.controller.auth;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.DemoUserListItemDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserFilterPreferencesRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLogoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserProfileImageUploadResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.MediaStorageService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final HomeUserProfileService homeUserProfileService;
    private final MediaStorageService mediaStorageService;

    public AuthController(
            HomeUserProfileService homeUserProfileService,
            MediaStorageService mediaStorageService) {
        this.homeUserProfileService = homeUserProfileService;
        this.mediaStorageService = mediaStorageService;
    }

    @GetMapping("/demo-users")
    public List<DemoUserListItemDto> queryDemoUsers(
            @RequestParam(value = "limit", required = false) Integer limit) {
        return homeUserProfileService.queryDemoUserListItems(limit);
    }

    @GetMapping("/me")
    public UserByIdResponseDto queryMe(@RequestParam(value = "userId", required = false) String userId) {
        return homeUserProfileService.queryUserById(userId);
    }

    @GetMapping("/eligibility")
    public UserLocationEligibilityResponseDto queryLocationEligibility(
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude) {
        return homeUserProfileService.queryLocationEligibility(latitude, longitude);
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

    @PostMapping("/me/feedback")
    public UserSubmitActionResponseDto submitFeedback(@RequestBody UserFeedbackSubmitRequestDto request) {
        return homeUserProfileService.submitFeedback(request);
    }

    @PostMapping("/me/report-user")
    public UserSubmitActionResponseDto submitReport(@RequestBody UserReportUserSubmitRequestDto request) {
        return homeUserProfileService.submitReport(request);
    }

    @PostMapping("/me/logout")
    public UserSubmitActionResponseDto logout(@RequestBody(required = false) UserLogoutRequestDto request) {
        return homeUserProfileService.logout(request);
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

    @PostMapping(path = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequiresPolicy(
            key = AccessPolicyKeys.USER_MEDIA_UPLOAD,
            subject = "#userId",
            resourceId = "#userId",
            skipWhenAuthenticationOptional = true)
    public UserProfileImageUploadResponseDto uploadProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("slotIndex") Integer slotIndex,
            @RequestParam("image") MultipartFile image) {
        String imageUrl = mediaStorageService.storeImage("profile", userId, String.valueOf(slotIndex), image);
        if (imageUrl == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Profile image upload unavailable.");
        }
        homeUserProfileService.saveUserProfileImage(userId, slotIndex, imageUrl);
        return new UserProfileImageUploadResponseDto(imageUrl, imageUrl);
    }
}
