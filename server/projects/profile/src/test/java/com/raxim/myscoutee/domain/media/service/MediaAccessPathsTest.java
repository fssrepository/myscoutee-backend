package com.raxim.myscoutee.domain.media.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

@org.junit.jupiter.api.Tag("standard")
class MediaAccessPathsTest {
    @Test
    void bundledHelpImagesArePublicWhileUploadedMediaRemainsProtected() {
        assertThat(MediaAccessPaths.isPublicKey("seeded-help/c00cddb3611da2aff481b1c9.svg")).isTrue();
        assertThat(MediaAccessPaths.isPublicKey("images/demo-profiles/user/small.webp")).isTrue();
        assertThat(MediaAccessPaths.isPublicKey("private/images/user/slot/large.webp")).isFalse();
        assertThat(MediaAccessPaths.isPublicKey("images/user/slot/large.webp")).isFalse();
        assertThat(MediaAccessPaths.isPublicKey("seeded-help-private/image.svg")).isFalse();
    }

    @Test
    void publicHelpPrefixDoesNotAllowPathTraversalOrMalformedKeys() {
        for (String key : new String[] {
                "seeded-help/../private/image.svg", "seeded-help/./image.svg",
                "seeded-help//image.svg", "seeded-help/", "/seeded-help/image.svg",
                "seeded-help/..\\private\\image.svg", "seeded-help/image\n.svg"
        }) {
            assertThat(MediaAccessPaths.isPublicKey(key)).as(key).isFalse();
        }
    }
}
