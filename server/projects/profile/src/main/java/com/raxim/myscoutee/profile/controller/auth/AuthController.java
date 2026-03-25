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

import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserFilterPreferencesRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserProfileImageUploadResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/demo-users")
    public List<UserDto> queryDemoUsers() {
        return List.of(defaultUser());
    }

    @GetMapping("/me")
    public UserByIdResponseDto queryMe() {
        UserDto user = defaultUser();
        return new UserByIdResponseDto(
                user.id(),
                user.name(),
                user.age(),
                user.birthday(),
                user.city(),
                user.height(),
                user.physique(),
                user.languages(),
                user.horoscope(),
                user.initials(),
                user.gender(),
                user.statusText(),
                user.hostTier(),
                user.traitLabel(),
                user.completion(),
                user.headline(),
                user.about(),
                user.affinity(),
                user.locationCoordinates(),
                user.images(),
                user.impressions(),
                user.profileStatus(),
                user.activities(),
                0,
                new UserGameFilterPreferencesDto(
                        null, null, null, null,
                        List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                        List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                        List.of(), List.of(), List.of(), List.of(), List.of()),
                new UserMenuCountersDto(0, 0, 0, 0, 0, 0, 0));
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
        // no-op skeleton; UI contract only
    }

    @PostMapping("/me/profile")
    public UserDto saveProfile(@RequestBody UserDto request) {
        return request;
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

    private UserDto defaultUser() {
        return new UserDto(
                "dev-user",
                "Dev User",
                30,
                "1995-01-01",
                "Bratislava",
                "178 cm",
                "Athletic",
                List.of("English"),
                "Gemini",
                "DU",
                "man",
                "Available for testing",
                "Core",
                "Builder",
                100,
                "Server skeleton baseline",
                "Temporary backend profile used while the real repository layer is rebuilt from the UI contract.",
                null,
                new LocationCoordinatesDto(48.1486, 17.1077),
                List.of(),
                null,
                "public",
                new UserActivitiesDto(0, 0, 0, 0, 0));
    }
}
