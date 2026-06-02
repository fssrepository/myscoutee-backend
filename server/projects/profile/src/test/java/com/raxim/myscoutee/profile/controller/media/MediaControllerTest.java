package com.raxim.myscoutee.profile.controller.media;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.MediaImageImportRequestDto;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.MediaStorageService;

@ExtendWith(MockitoExtension.class)
class MediaControllerTest {
    @Mock
    private MediaStorageService mediaStorageService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private MultipartFile multipartFile;

    @Test
    void uploadImageRejectsDeniedOwnerBeforeStorage() {
        MediaController controller = new MediaController(mediaStorageService, accessControlService);
        when(accessControlService.canCurrentActorUploadMedia("owner-1")).thenReturn(false);

        assertThatThrownBy(() -> controller.uploadImage("profile", "owner-1", "slot-0", multipartFile))
                .hasMessageContaining("upload media");

        verifyNoInteractions(mediaStorageService);
    }

    @Test
    void uploadAudioRejectsDeniedOwnerBeforeStorage() {
        MediaController controller = new MediaController(mediaStorageService, accessControlService);
        when(accessControlService.canCurrentActorUploadMedia("owner-1")).thenReturn(false);

        assertThatThrownBy(() -> controller.uploadAudio("chat", "owner-1", "message-1", multipartFile))
                .hasMessageContaining("upload media");

        verifyNoInteractions(mediaStorageService);
    }

    @Test
    void importImageRejectsDeniedOwnerBeforeStorage() {
        MediaController controller = new MediaController(mediaStorageService, accessControlService);
        when(accessControlService.canCurrentActorImportMedia("owner-1")).thenReturn(false);

        assertThatThrownBy(() -> controller.importImage(new MediaImageImportRequestDto(
                "profile",
                "owner-1",
                "slot-0",
                "https://cdn.example.com/avatar.jpg")))
                .hasMessageContaining("import media");

        verifyNoInteractions(mediaStorageService);
    }
}
