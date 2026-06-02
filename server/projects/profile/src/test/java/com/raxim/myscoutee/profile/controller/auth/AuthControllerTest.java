package com.raxim.myscoutee.profile.controller.auth;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.MediaStorageService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private MediaStorageService mediaStorageService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private MultipartFile multipartFile;

    @Test
    void uploadProfileImageRejectsDeniedOwnerBeforeStorage() {
        AuthController controller = new AuthController(homeUserProfileService, mediaStorageService, accessControlService);
        when(accessControlService.canCurrentActorUploadMedia("user-1")).thenReturn(false);

        assertThatThrownBy(() -> controller.uploadProfileImage("user-1", 0, multipartFile))
                .hasMessageContaining("upload media");

        verifyNoInteractions(homeUserProfileService, mediaStorageService);
    }
}
