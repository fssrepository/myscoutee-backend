package com.raxim.myscoutee.profile.controller.auth;

import java.time.Instant;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserFilterPreferencesRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserProfileImageUploadResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final HomeUserProfileService homeUserProfileService;

    public AuthController(HomeUserProfileService homeUserProfileService) {
        this.homeUserProfileService = homeUserProfileService;
    }

    @GetMapping("/demo-users")
    public List<UserDto> queryDemoUsers() {
        return List.of();
    }

    @GetMapping("/me")
    public UserByIdResponseDto queryMe(@RequestParam(value = "userId", required = false) String userId) {
        return homeUserProfileService.queryUserById(userId);
    }

    @PostMapping("/me/realtime/long-poll")
    public UserRealtimeLongPollResponseDto queryRealtimeSnapshot(@RequestBody UserRealtimeLongPollRequestDto request) {
        return new UserRealtimeLongPollResponseDto(
                request.userId(),
                new UserRealtimeCountersDto(0, 0, 0, 0, 0, 0, 0, false, false),
                (UserImpressionsDto) null,
                request.cursor(),
                Instant.now().toString());
    }

    @PostMapping("/me/filter-preferences")
    public void saveFilterPreferences(@RequestBody UserFilterPreferencesRequestDto request) {
        homeUserProfileService.saveUserFilterPreferences(request.userId(), request.filterPreferences());
    }

    @PostMapping("/me/profile")
    public UserDto saveProfile(@RequestBody UserDto request) {
        return homeUserProfileService.saveUserProfile(request);
    }

    @PostMapping("/me/feedback")
    public UserSubmitActionResponseDto submitFeedback(@RequestBody UserFeedbackSubmitRequestDto request) {
        return new UserSubmitActionResponseDto(true, null);
    }

    @PostMapping("/me/report-user")
    public UserSubmitActionResponseDto submitReport(@RequestBody UserReportUserSubmitRequestDto request) {
        return new UserSubmitActionResponseDto(true, null);
    }

    @PostMapping(path = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserProfileImageUploadResponseDto uploadProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("slotIndex") Integer slotIndex,
            @RequestParam("image") MultipartFile image) {
        String fileName = image != null && image.getOriginalFilename() != null ? image.getOriginalFilename() : "profile.jpg";
        String imageUrl = "/user/profile/images/" + userId + "/" + slotIndex + "/" + fileName;
        return new UserProfileImageUploadResponseDto(imageUrl, imageUrl);
    }
}
