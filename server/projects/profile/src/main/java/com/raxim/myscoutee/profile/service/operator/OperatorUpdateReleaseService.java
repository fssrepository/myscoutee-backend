package com.raxim.myscoutee.profile.service.operator;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.security.PublicKey;
import java.time.Instant;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.properties.OperatorUpdateProperties;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorUpdateManifestDto;
import com.raxim.myscoutee.registry.RegistryCrypto;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.UpdateManifest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Public GitHub release discovery. No Registry identity, enrollment or service is used. */
@Service
public class OperatorUpdateReleaseService {
    private static final String ASSET_NAME = "myscoutee-update.json";
    private static final int MAX_METADATA_BYTES = 256 * 1024;
    private final OperatorUpdateProperties properties;
    private final ObjectMapper mapper;
    private final HttpClient client;

    @Autowired
    public OperatorUpdateReleaseService(OperatorUpdateProperties properties, ObjectMapper mapper) {
        this(properties, mapper, HttpClient.newBuilder()
                .connectTimeout(properties.getDownloadConnectTimeout())
                .followRedirects(HttpClient.Redirect.NEVER).build());
    }

    OperatorUpdateReleaseService(OperatorUpdateProperties properties, ObjectMapper mapper, HttpClient client) {
        this.properties = properties;
        this.mapper = mapper;
        this.client = client;
    }

    public record ReleasePage(String checkedAt, List<OperatorAnnouncementDto> items) {}

    public ReleasePage releases() {
        String repository = properties.getGithubRepository();
        if (repository == null || !repository.matches("[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+")) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "The release repository is not configured.");
        }
        try {
            JsonNode releases = mapper.readTree(read(URI.create(
                    "https://api.github.com/repos/" + repository + "/releases?per_page=100"), 2 * 1024 * 1024));
            if (!releases.isArray()) {
                throw new IllegalArgumentException("Invalid release list.");
            }
            // GitHub returns releases newest first. Resolve one candidate, not every historical artifact.
            for (JsonNode release : releases) {
                if (release.path("draft").asBoolean()
                        || (release.path("prerelease").asBoolean() && !properties.isIncludePrereleases())) {
                    continue;
                }
                JsonNode metadata = null;
                boolean hasPackage = false;
                for (JsonNode asset : release.path("assets")) {
                    hasPackage |= asset.path("name").asText().endsWith(".deb");
                    if (ASSET_NAME.equals(asset.path("name").asText())) {
                        if (metadata != null) throw new IllegalArgumentException("Duplicate update metadata.");
                        metadata = asset;
                    }
                }
                if (!hasPackage) continue;
                if (metadata == null) {
                    throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED,
                            "The published release has no signed update metadata.");
                }
                String prefix = "https://github.com/" + repository + "/releases/download/";
                URI metadataUri = URI.create(metadata.path("browser_download_url").asText());
                if (!metadataUri.toString().startsWith(prefix)
                        || !metadataUri.getPath().endsWith("/" + ASSET_NAME)) {
                    throw new IllegalArgumentException("Unexpected update metadata origin.");
                }
                OperatorAnnouncementDto candidate = verify(read(metadataUri, MAX_METADATA_BYTES));
                boolean artifactMatches = false;
                for (JsonNode asset : release.path("assets")) {
                    artifactMatches |= candidate.updateManifest().artifactUrl().equals(asset.path("browser_download_url").asText())
                            && candidate.updateManifest().artifactSizeBytes() == asset.path("size").asLong();
                }
                if (!artifactMatches || !candidate.updateManifest().artifactUrl().startsWith(prefix)) {
                    throw new IllegalArgumentException("Signed package is not an asset of the selected release.");
                }
                return new ReleasePage(Instant.now().toString(), List.of(candidate));
            }
            return new ReleasePage(Instant.now().toString(), List.of());
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Release discovery was interrupted.");
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not verify the published release.", exception);
        }
    }

    public OperatorAnnouncementDto find(String id) {
        return releases().items().stream().filter(item -> item.announcementId().equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                        "The selected release has changed. Check for updates again."));
    }

    OperatorAnnouncementDto verify(byte[] envelopeBytes) throws Exception {
        JsonNode envelope = mapper.readTree(envelopeBytes);
        if (envelope.path("schemaVersion").asInt() != 1 || envelope.size() != 3) {
            throw new IllegalArgumentException("Unsupported signed release metadata.");
        }
        byte[] manifestBytes = Base64.getDecoder().decode(envelope.path("manifestBase64").asText());
        PublicKey key = releaseKey();
        if (!RegistryCrypto.verifyBase64(key, signedMessage(manifestBytes), envelope.path("signature").asText())) {
            throw new IllegalArgumentException("Invalid release metadata signature.");
        }
        UpdateManifest manifest = mapper.readValue(manifestBytes, UpdateManifest.class);
        if (!"1".equals(manifest.manifestVersion()) || !"AVAILABLE".equals(manifest.status())
                || !Boolean.TRUE.equals(manifest.backupRequired())
                || manifest.expectedDowntimeSeconds() == null || manifest.expectedDowntimeSeconds() < 0
                || manifest.artifactSizeBytes() == null || manifest.artifactSizeBytes() < 1
                || manifest.artifactSizeBytes() > properties.getMaxArtifactBytes()
                || manifest.channel() == null || !manifest.channel().matches("[a-z][a-z0-9._-]{0,31}")) {
            throw new IllegalArgumentException("Invalid release metadata.");
        }
        RegistryProtocol.requireSemanticVersion(manifest.releaseVersion(), "release version");
        var minimum = RegistryProtocol.requireSemanticVersion(manifest.minimumCompatibleVersion(), "minimum version");
        var maximum = RegistryProtocol.requireSemanticVersion(manifest.maximumCompatibleVersion(), "maximum version");
        if (RegistryProtocol.compareSemanticVersions(minimum, maximum) > 0) {
            throw new IllegalArgumentException("Invalid compatibility range.");
        }
        RegistryProtocol.requireUtcTimestamp(manifest.publishedAt(), "published_at");
        RegistryProtocol.requireHash(manifest.artifactSha256(), "artifact hash");
        OperatorUpdateArtifactDownloader.requireHttpsArtifactUri(manifest.artifactUrl());
        if (!RegistryProtocol.packageSigningKeyId(key.getEncoded()).equals(manifest.packageSigningKeyId())
                || !RegistryCrypto.verifyBase64(key, RegistryProtocol.releasePackage(manifest), manifest.packageSignature())) {
            throw new IllegalArgumentException("Invalid package signature.");
        }
        String hash = RegistryProtocol.sha256(RegistryProtocol.updateManifest(manifest));
        OperatorUpdateManifestDto dto = new OperatorUpdateManifestDto(
                manifest.manifestVersion(), manifest.releaseVersion(), manifest.channel(), manifest.publishedAt(),
                manifest.minimumCompatibleVersion(), manifest.maximumCompatibleVersion(), manifest.artifactUrl(),
                manifest.artifactSizeBytes(), manifest.artifactSha256(), manifest.packageSigningKeyId(),
                manifest.packageSignature(), manifest.releaseNotesUrl(), true, manifest.expectedDowntimeSeconds(),
                manifest.status(), manifest.supersedesVersion(), manifest.supersededByVersion(), manifest.revocationReason(),
                true, true, true);
        // Retain the existing approval wire ID and durable job format. This is a content ID, not Registry enrollment.
        return new OperatorAnnouncementDto(1, "ann_" + hash.substring(7, 39), "UPDATE", "NOTICE",
                manifest.publishedAt(), null, null, null, List.of(), List.of(), dto, hash, hash);
    }

    static byte[] signedMessage(byte[] manifest) {
        byte[] prefix = "myscoutee-update-catalog-v1\n".getBytes(StandardCharsets.UTF_8);
        byte[] result = java.util.Arrays.copyOf(prefix, prefix.length + manifest.length);
        System.arraycopy(manifest, 0, result, prefix.length, manifest.length);
        return result;
    }

    private PublicKey releaseKey() throws Exception {
        var path = properties.getReleasePublicKeyPath();
        if (!Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS) || Files.size(path) > 4096) {
            throw new ResponseStatusException(HttpStatus.PRECONDITION_REQUIRED, "The trusted release key is not configured.");
        }
        return RegistryCrypto.parsePublicKeyPemOrDer(Files.readAllBytes(path), "release public key");
    }

    private byte[] read(URI uri, int maximumBytes) throws Exception {
        List<URI> visited = new ArrayList<>();
        for (int redirects = 0; redirects <= 5; redirects++) {
            String host = uri.getHost();
            if (!"https".equals(uri.getScheme()) || uri.getUserInfo() != null || uri.getFragment() != null
                    || (uri.getPort() != -1 && uri.getPort() != 443)
                    || !(Objects.equals(host, "api.github.com") || Objects.equals(host, "github.com")
                        || Objects.equals(host, "release-assets.githubusercontent.com")
                        || Objects.equals(host, "objects.githubusercontent.com")) || visited.contains(uri)) {
                throw new IllegalArgumentException("Invalid release metadata endpoint.");
            }
            visited.add(uri);
            var response = client.send(HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(30))
                    .header("Accept", "application/octet-stream, application/vnd.github+json")
                    .GET().build(), HttpResponse.BodyHandlers.ofInputStream());
            try (InputStream input = response.body()) {
                if (List.of(301, 302, 303, 307, 308).contains(response.statusCode())) {
                    uri = uri.resolve(response.headers().firstValue("Location").orElseThrow());
                    continue;
                }
                if (response.statusCode() != 200) throw new java.io.IOException("Release metadata request failed.");
                byte[] bytes = input.readNBytes(maximumBytes + 1);
                if (bytes.length > maximumBytes) throw new java.io.IOException("Release metadata exceeds its size limit.");
                return bytes;
            }
        }
        throw new java.io.IOException("Release metadata redirect limit exceeded.");
    }
}
