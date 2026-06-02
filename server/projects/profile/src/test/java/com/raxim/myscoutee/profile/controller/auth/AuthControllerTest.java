package com.raxim.myscoutee.profile.controller.auth;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.MediaStorageService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private MediaStorageService mediaStorageService;
    @Mock
    private MultipartFile multipartFile;

    @Test
    void uploadProfileImageDoesNotSaveProfileWhenStorageFails() {
        AuthController controller = new AuthController(homeUserProfileService, mediaStorageService);

        assertThatThrownBy(() -> controller.uploadProfileImage("user-1", 0, multipartFile))
                .hasMessageContaining("Profile image upload unavailable");

        verify(homeUserProfileService, never()).saveUserProfileImage("user-1", 0, null);
    }
}
