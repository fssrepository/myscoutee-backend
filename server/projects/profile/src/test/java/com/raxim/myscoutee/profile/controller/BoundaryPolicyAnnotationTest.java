package com.raxim.myscoutee.profile.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.controller.auth.AuthController;
import com.raxim.myscoutee.profile.controller.media.MediaController;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.MediaImageImportRequestDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;

class BoundaryPolicyAnnotationTest {
    @Test
    void authProfileImageUploadDeclaresMediaUploadPolicy() throws Exception {
        Method method = AuthController.class.getDeclaredMethod(
                "uploadProfileImage",
                String.class,
                Integer.class,
                MultipartFile.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_UPLOAD, "#userId", "#userId");
    }

    @Test
    void mediaUploadImageDeclaresMediaUploadPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod(
                "uploadImage",
                String.class,
                String.class,
                String.class,
                MultipartFile.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_UPLOAD, "#ownerId", "#ownerId");
    }

    @Test
    void mediaImportImageDeclaresMediaImportPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod("importImage", MediaImageImportRequestDto.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_IMPORT, "#request?.ownerId()", "#request?.ownerId()");
    }

    @Test
    void mediaUploadAudioDeclaresMediaUploadPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod(
                "uploadAudio",
                String.class,
                String.class,
                String.class,
                MultipartFile.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_UPLOAD, "#ownerId", "#ownerId");
    }

    private void assertPolicy(RequiresPolicy policy, String key, String subject, String resourceId) {
        assertThat(policy).isNotNull();
        assertThat(policy.key()).isEqualTo(key);
        assertThat(policy.subject()).isEqualTo(subject);
        assertThat(policy.resourceId()).isEqualTo(resourceId);
        assertThat(policy.skipWhenAuthenticationOptional()).isTrue();
    }
}
