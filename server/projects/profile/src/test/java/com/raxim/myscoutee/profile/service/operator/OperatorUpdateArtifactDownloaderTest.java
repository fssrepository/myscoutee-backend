package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class OperatorUpdateArtifactDownloaderTest {
    @Test
    void acceptsOnlyAbsoluteCredentialFreeFragmentFreeHttpsDebianUrl() {
        assertThat(OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(
                "https://downloads.example.test/releases/myscoutee_1.2.3_amd64.deb"))
                .hasScheme("https")
                .hasHost("downloads.example.test");

        assertThatThrownBy(() ->
                OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(
                        "http://downloads.example.test/myscoutee.deb"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("HTTPS");
        assertThatThrownBy(() ->
                OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(
                        "https://user:secret@downloads.example.test/myscoutee.deb"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("HTTPS");
        assertThatThrownBy(() ->
                OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(
                        "https://downloads.example.test/myscoutee.deb#fragment"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("HTTPS");
        assertThatThrownBy(() ->
                OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(
                        "https://downloads.example.test/myscoutee.zip"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Debian");
    }
}
