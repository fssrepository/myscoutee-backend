package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.util.Base64;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.properties.OperatorUpdateProperties;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.UpdateManifest;
import tools.jackson.databind.ObjectMapper;

class OperatorUpdateReleaseServiceTest {
    @TempDir Path directory;
    private final ObjectMapper mapper = new JsonConfig().objectMapper();

    @Test
    void discoversAndRevalidatesSignedGithubReleaseWithoutAnyRegistry() throws Exception {
        var properties = new OperatorUpdateProperties();
        properties.setReleasePublicKeyPath(directory.resolve("public.der"));
        var key = KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
        Files.write(properties.getReleasePublicKeyPath(), key.getPublic().getEncoded());
        String url = "https://github.com/fssrepository/myscoutee/releases/download/v1.2.3/myscoutee_1.2.3_amd64.deb";
        String metadataUrl = "https://github.com/fssrepository/myscoutee/releases/download/v1.2.3/myscoutee-update.json";
        var manifest = new java.util.LinkedHashMap<String, Object>();
        manifest.put("manifest_version", "1"); manifest.put("release_version", "1.2.3");
        manifest.put("channel", "stable"); manifest.put("published_at", "2026-09-16T12:00:00Z");
        manifest.put("minimum_compatible_version", "1.0.0"); manifest.put("maximum_compatible_version", "1.2.2");
        manifest.put("artifact_url", url); manifest.put("artifact_size_bytes", 123);
        manifest.put("artifact_sha256", "sha256:" + "a".repeat(64));
        manifest.put("package_signing_key_id", RegistryProtocol.packageSigningKeyId(key.getPublic().getEncoded()));
        manifest.put("backup_required", true); manifest.put("expected_downtime_seconds", 300);
        manifest.put("status", "AVAILABLE"); manifest.put("release_notes_url", "https://github.com/fssrepository/myscoutee/releases/tag/v1.2.3");
        var signature = Signature.getInstance("Ed25519");
        signature.initSign(key.getPrivate());
        signature.update(RegistryProtocol.releasePackage(mapper.convertValue(manifest, UpdateManifest.class)));
        manifest.put("package_signature", Base64.getEncoder().encodeToString(signature.sign()));
        byte[] raw = mapper.writeValueAsBytes(manifest);
        signature.initSign(key.getPrivate()); signature.update(OperatorUpdateReleaseService.signedMessage(raw));
        byte[] envelope = mapper.writeValueAsBytes(Map.of("schemaVersion", 1,
                "manifestBase64", Base64.getEncoder().encodeToString(raw),
                "signature", Base64.getEncoder().encodeToString(signature.sign())));
        byte[] list = mapper.writeValueAsBytes(new Object[]{Map.of("draft", false, "prerelease", false,
                "assets", new Object[]{Map.of("name", "myscoutee_1.2.3_amd64.deb", "size", 123, "browser_download_url", url),
                    Map.of("name", "myscoutee-update.json", "browser_download_url", metadataUrl)})});
        HttpClient client = mock(HttpClient.class);
        when(client.send(any(), any(HttpResponse.BodyHandler.class))).thenAnswer(invocation -> {
            java.net.http.HttpRequest request = invocation.getArgument(0);
            HttpResponse<java.io.InputStream> response = mock(HttpResponse.class);
            when(response.statusCode()).thenReturn(200);
            when(response.body()).thenReturn(new ByteArrayInputStream(
                    request.uri().getHost().equals("api.github.com") ? list : envelope));
            return response;
        });
        var service = new OperatorUpdateReleaseService(properties, mapper, client);
        var release = service.releases().items().getFirst();
        assertThat(release.updateManifest().packageSignatureVerified()).isTrue();
        assertThat(service.find(release.announcementId())).isEqualTo(release);
        verify(client, times(4)).send(any(), any(HttpResponse.BodyHandler.class));

        // The release signature covers URL and compatibility as well as package identity.
        manifest.put("minimum_compatible_version", "0.0.0");
        var changed = mapper.readTree(envelope).deepCopy();
        ((tools.jackson.databind.node.ObjectNode) changed).put("manifestBase64",
                Base64.getEncoder().encodeToString(mapper.writeValueAsBytes(manifest)));
        assertThatThrownBy(() -> service.verify(mapper.writeValueAsBytes(changed)))
                .hasMessageContaining("metadata signature");
        Files.write(properties.getReleasePublicKeyPath(), KeyPairGenerator.getInstance("Ed25519").generateKeyPair().getPublic().getEncoded());
        assertThatThrownBy(() -> service.verify(envelope)).hasMessageContaining("metadata signature");
        Files.delete(properties.getReleasePublicKeyPath());
        assertThatThrownBy(() -> service.verify(envelope)).hasMessageContaining("release key");
    }

    @Test
    void unsignedPublishedPackageIsNotReportedAsCurrentOrInstallable() throws Exception {
        HttpClient client = mock(HttpClient.class);
        HttpResponse<java.io.InputStream> response = mock(HttpResponse.class);
        when(response.statusCode()).thenReturn(200);
        when(response.body()).thenReturn(new ByteArrayInputStream(
                "[{\"assets\":[{\"name\":\"myscoutee_1.0.0_amd64.deb\"}]}]".getBytes()));
        when(client.send(any(), any(HttpResponse.BodyHandler.class))).thenReturn(response);
        var service = new OperatorUpdateReleaseService(new OperatorUpdateProperties(), mapper, client);
        assertThatThrownBy(service::releases).hasMessageContaining("412").hasMessageContaining("signed update metadata");
    }
}
