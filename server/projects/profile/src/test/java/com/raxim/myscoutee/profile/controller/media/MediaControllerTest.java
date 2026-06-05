package com.raxim.myscoutee.profile.controller.media;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.MediaImageImportRequestDto;
import com.raxim.myscoutee.profile.service.MediaStorageService;

@ExtendWith(MockitoExtension.class)
class MediaControllerTest {
    @Mock
    private MediaStorageService mediaStorageService;
    @Mock
    private MultipartFile multipartFile;

    @Test
    void uploadImageReportsUnavailableWhenStorageFails() {
        MediaController controller = new MediaController(mediaStorageService);

        assertThatThrownBy(() -> controller.uploadImage("owner-1", "slot-0", multipartFile))
                .hasMessageContaining("Image upload unavailable");
    }

    @Test
    void uploadAudioReportsUnavailableWhenStorageFails() {
        MediaController controller = new MediaController(mediaStorageService);

        assertThatThrownBy(() -> controller.uploadAudio("owner-1", "message-1", multipartFile))
                .hasMessageContaining("Audio upload unavailable");
    }

    @Test
    void importImageReturnsUnsuccessfulWhenStorageFails() {
        MediaController controller = new MediaController(mediaStorageService);

        var response = controller.importImage(new MediaImageImportRequestDto(
                "owner-1",
                "slot-0",
                "https://cdn.example.com/avatar.jpg"));

        org.assertj.core.api.Assertions.assertThat(response.uploaded()).isFalse();
    }
}
