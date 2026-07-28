package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.LongConsumer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.OperatorUpdateProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementSnapshotDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorUpdateManifestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateApprovalDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorUpdateDtos.OperatorUpdateJobDto;
import com.raxim.myscoutee.registry.RegistryProtocol;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class OperatorUpdateServiceTest {
    private static final Instant NOW =
            Instant.parse("2026-07-28T19:30:00Z");
    private static final String ANNOUNCEMENT_ID =
            "ann_0123456789abcdef0123456789abcdef";
    private static final String MANIFEST_HASH =
            "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private static final String PACKAGE_KEY_ID =
            "pkey_0123456789abcdef0123456789abcdef";
    private static final String PACKAGE_SIGNATURE =
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                    + "AAAAAAAAAAAAAAAAAAAAAA==";

    @TempDir
    Path temporaryDirectory;

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void stagesVerifiedArtifactPublishesExactRequestAndPrefersWorkerStatus()
            throws Exception {
        byte[] artifact = "signed-debian-package".getBytes(StandardCharsets.UTF_8);
        String artifactHash = "sha256:" + java.util.HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest(artifact));
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorNetworkService networkService = mock(OperatorNetworkService.class);
        OperatorUpdateArtifactDownloader downloader =
                mock(OperatorUpdateArtifactDownloader.class);
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        OperatorAnnouncementPageDto announcements =
                announcementPage(artifact.length, artifactHash, true);
        when(networkService.announcements(
                        "UPDATE",
                        "",
                        "",
                        false,
                        100,
                        ""))
                .thenReturn(announcements);
        doAnswer(invocation -> {
            Path target = invocation.getArgument(1);
            Files.write(
                    target,
                    artifact,
                    StandardOpenOption.CREATE_NEW,
                    StandardOpenOption.WRITE);
            LongConsumer progress = invocation.getArgument(4);
            progress.accept(artifact.length);
            return null;
        }).when(downloader).download(
                any(),
                any(),
                anyLong(),
                anyLong(),
                any());
        ExecutorService executor = Executors.newSingleThreadExecutor();
        OperatorUpdateService service = new OperatorUpdateService(
                networkService,
                downloader,
                properties,
                registryProperties,
                objectMapper,
                executor,
                Clock.fixed(NOW, ZoneOffset.UTC),
                new SecureRandom());
        try {
            OperatorUpdateJobDto initial = service.approve(
                    new OperatorUpdateApprovalDto(ANNOUNCEMENT_ID),
                    "operator-user-1");
            assertThat(initial.phase()).isEqualTo("CHECKING");
            assertThat(initial.jobId()).matches("^upd_[0-9a-f]{32}$");

            Path request = properties.getStateDir()
                    .resolve("requests")
                    .resolve(initial.jobId() + ".json");
            await().atMost(Duration.ofSeconds(5))
                    .untilAsserted(() -> assertThat(request).isRegularFile());

            JsonNode requestJson = objectMapper.readTree(request.toFile());
            assertThat(requestJson.path("schema_version").asInt()).isEqualTo(1);
            assertThat(requestJson.path("job_id").asText())
                    .isEqualTo(initial.jobId());
            assertThat(requestJson.path("requested_by").asText())
                    .isEqualTo("operator-user-1");
            assertThat(requestJson.path("manifest_hash").asText())
                    .isEqualTo(MANIFEST_HASH);
            assertThat(requestJson.path("channel").asText())
                    .isEqualTo("stable.lts_1");
            assertThat(requestJson.path("artifact_size_bytes").asLong())
                    .isEqualTo(artifact.length);
            assertThat(requestJson.path("artifact_sha256").asText())
                    .isEqualTo(artifactHash);
            assertThat(requestJson.path("package_signing_key_id").asText())
                    .isEqualTo(PACKAGE_KEY_ID);
            assertThat(requestJson.path("package_signature").asText())
                    .isEqualTo(PACKAGE_SIGNATURE);
            assertThat(requestJson.has("artifact_url")).isFalse();
            assertThat(requestJson.has("command")).isFalse();
            assertThat(requestJson.path("artifact_name").asText())
                    .isEqualTo("myscoutee.deb");
            assertThat(requestJson.has("artifact_path")).isFalse();
            Path stagedArtifact = properties.getStateDir()
                    .resolve("staging")
                    .resolve(initial.jobId())
                    .resolve(requestJson.path("artifact_name").asText());
            assertThat(stagedArtifact)
                    .hasBinaryContent(artifact);

            await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                    assertThat(service.status(initial.jobId()).phase())
                            .isEqualTo("AWAITING_HOST"));
            assertThat(service.events(initial.jobId(), 0L, 100).items())
                    .extracting(event -> event.status().phase())
                    .containsSubsequence(
                            "CHECKING",
                            "DOWNLOADING",
                            "STAGING",
                            "AWAITING_HOST");

            OperatorUpdateJobDto workerStatus = new OperatorUpdateJobDto(
                    1,
                    initial.jobId(),
                    "VERIFYING",
                    72,
                    "Verifying the staged package.",
                    NOW.plusSeconds(1).toString(),
                    initial.requestedAt(),
                    initial.requestedBy(),
                    initial.manifestHash(),
                    "1.0.0",
                    "1.2.3",
                    "stable.lts_1",
                    artifactHash,
                    null);
            Path workerJob = properties.getStateDir()
                    .resolve("jobs")
                    .resolve(initial.jobId());
            Files.createDirectory(workerJob);
            Files.write(
                    workerJob.resolve("status.json"),
                    objectMapper.writeValueAsBytes(workerStatus));

            assertThat(service.status(initial.jobId()).phase())
                    .isEqualTo("VERIFYING");
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void refusesManifestWithoutPinnedPackageVerificationBeforeDownload() {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorNetworkService networkService = mock(OperatorNetworkService.class);
        OperatorUpdateArtifactDownloader downloader =
                mock(OperatorUpdateArtifactDownloader.class);
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        when(networkService.announcements(
                        "UPDATE",
                        "",
                        "",
                        false,
                        100,
                        ""))
                .thenReturn(announcementPage(
                        10,
                        "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        false));
        ExecutorService executor = Executors.newSingleThreadExecutor();
        OperatorUpdateService service = new OperatorUpdateService(
                networkService,
                downloader,
                properties,
                registryProperties,
                objectMapper,
                executor,
                Clock.fixed(NOW, ZoneOffset.UTC),
                new SecureRandom());
        try {
            assertThatThrownBy(() -> service.approve(
                    new OperatorUpdateApprovalDto(ANNOUNCEMENT_ID),
                    "operator-user-1"))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("pinned release key");
            verify(downloader, never()).download(
                    any(),
                    any(),
                    anyLong(),
                    anyLong(),
                    any());
        } catch (Exception exception) {
            throw new AssertionError(exception);
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void exploreModeCannotStageHostPackageUpdate() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        OperatorNetworkService networkService = mock(OperatorNetworkService.class);
        OperatorUpdateArtifactDownloader downloader =
                mock(OperatorUpdateArtifactDownloader.class);
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        OperatorUpdateService service = new OperatorUpdateService(
                networkService,
                downloader,
                properties,
                registryProperties,
                new JsonConfig().objectMapper());
        try {
            assertThatThrownBy(() -> service.approve(
                    new OperatorUpdateApprovalDto(ANNOUNCEMENT_ID),
                    "demo-operator"))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("Explore mode");
            verify(networkService, never()).announcements(
                    any(),
                    any(),
                    any(),
                    anyBoolean(),
                    anyInt(),
                    any());
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void refusesIncompatibleInstalledVersionBeforeAllocatingJob() {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorNetworkService networkService = mock(OperatorNetworkService.class);
        OperatorUpdateArtifactDownloader downloader =
                mock(OperatorUpdateArtifactDownloader.class);
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        registryProperties.setSoftwareVersion("3.0.0");
        when(networkService.announcements(
                        "UPDATE",
                        "",
                        "",
                        false,
                        100,
                        ""))
                .thenReturn(announcementPage(
                        10,
                        "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        true));
        OperatorUpdateService service = new OperatorUpdateService(
                networkService,
                downloader,
                properties,
                registryProperties,
                objectMapper);
        try {
            assertThatThrownBy(() -> service.approve(
                    new OperatorUpdateApprovalDto(ANNOUNCEMENT_ID),
                    "operator-user-1"))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("incompatible");
            assertThat(properties.getStateDir()).doesNotExist();
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void requiresSignedArtifactSizePlusConfiguredStagingReserve()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorNetworkService networkService = mock(OperatorNetworkService.class);
        OperatorUpdateArtifactDownloader downloader =
                mock(OperatorUpdateArtifactDownloader.class);
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        when(networkService.announcements(
                        "UPDATE",
                        "",
                        "",
                        false,
                        100,
                        ""))
                .thenReturn(announcementPage(
                        10,
                        "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        true));
        Files.createDirectories(properties.getStateDir().resolve("staging"));
        properties.setStagingSafetyReserveBytes(
                Files.getFileStore(properties.getStateDir())
                        .getUsableSpace());
        OperatorUpdateService service = new OperatorUpdateService(
                networkService,
                downloader,
                properties,
                registryProperties,
                objectMapper);
        try {
            assertThatThrownBy(() -> service.approve(
                    new OperatorUpdateApprovalDto(ANNOUNCEMENT_ID),
                    "operator-user-1"))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("staging space");
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void overviewIsReadOnlyWhenStateHasNotBeenCreated() {
        OperatorUpdateProperties properties = updateProperties();
        properties.setEnabled(false);
        OperatorUpdateService service = new OperatorUpdateService(
                mock(OperatorNetworkService.class),
                mock(OperatorUpdateArtifactDownloader.class),
                properties,
                registryProperties(properties),
                new JsonConfig().objectMapper());
        try {
            var overview = service.overview();

            assertThat(overview.enabled()).isFalse();
            assertThat(overview.currentVersion()).isEqualTo("1.0.0");
            assertThat(overview.latestJob()).isNull();
            assertThat(properties.getStateDir()).doesNotExist();
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void overviewReconnectsToLatestDurableJobAndPrefersWorkerStatus()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorUpdateProperties properties = updateProperties();
        RegistryProperties registryProperties = registryProperties(properties);
        String jobId = "upd_0123456789abcdef0123456789abcdef";
        Path stage = properties.getStateDir().resolve("staging").resolve(jobId);
        Path worker = properties.getStateDir().resolve("jobs").resolve(jobId);
        Files.createDirectories(stage);
        Files.createDirectories(worker);
        OperatorUpdateJobDto stageStatus = durableStatus(
                jobId,
                "AWAITING_HOST",
                "2026-07-28T19:31:00Z");
        OperatorUpdateJobDto workerStatus = durableStatus(
                jobId,
                "VERIFYING",
                "2026-07-28T19:30:30Z");
        Files.write(
                stage.resolve("status.json"),
                objectMapper.writeValueAsBytes(stageStatus));
        Files.write(
                worker.resolve("status.json"),
                objectMapper.writeValueAsBytes(workerStatus));
        OperatorUpdateService service = new OperatorUpdateService(
                mock(OperatorNetworkService.class),
                mock(OperatorUpdateArtifactDownloader.class),
                properties,
                registryProperties,
                objectMapper);
        try {
            var overview = service.overview();

            assertThat(overview.enabled()).isTrue();
            assertThat(overview.latestJob()).isNotNull();
            assertThat(overview.latestJob().jobId()).isEqualTo(jobId);
            assertThat(overview.latestJob().phase()).isEqualTo("VERIFYING");
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void statusAndEventsRemainReadOnlyAndReconnectableWhenUpdatesAreDisabled()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        OperatorUpdateProperties properties = updateProperties();
        properties.setEnabled(false);
        String jobId = "upd_fedcba9876543210fedcba9876543210";
        Path worker = properties.getStateDir().resolve("jobs").resolve(jobId);
        Files.createDirectories(worker);
        OperatorUpdateJobDto recovery = durableStatus(
                jobId,
                "RECOVERY_REQUIRED",
                "2026-07-28T19:32:00Z");
        Files.write(
                worker.resolve("status.json"),
                objectMapper.writeValueAsBytes(recovery));
        Files.writeString(
                worker.resolve("events.ndjson"),
                objectMapper.writeValueAsString(recovery) + "\n");
        OperatorUpdateService service = new OperatorUpdateService(
                mock(OperatorNetworkService.class),
                mock(OperatorUpdateArtifactDownloader.class),
                properties,
                registryProperties(properties),
                objectMapper);
        try {
            assertThat(service.status(jobId).phase())
                    .isEqualTo("RECOVERY_REQUIRED");
            assertThat(service.events(jobId, 0L, 10).terminal()).isTrue();
        } finally {
            service.closeExecutor();
        }
    }

    @Test
    void missingStatusLookupDoesNotCreateUpdateState() {
        OperatorUpdateProperties properties = updateProperties();
        properties.setEnabled(false);
        OperatorUpdateService service = new OperatorUpdateService(
                mock(OperatorNetworkService.class),
                mock(OperatorUpdateArtifactDownloader.class),
                properties,
                registryProperties(properties),
                new JsonConfig().objectMapper());
        try {
            assertThatThrownBy(() -> service.status(
                    "upd_fedcba9876543210fedcba9876543210"))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("not found");
            assertThat(properties.getStateDir()).doesNotExist();
        } finally {
            service.closeExecutor();
        }
    }

    private OperatorUpdateJobDto durableStatus(
            String jobId,
            String phase,
            String updatedAt) {
        return new OperatorUpdateJobDto(
                1,
                jobId,
                phase,
                72,
                "Durable status.",
                updatedAt,
                "2026-07-28T19:30:00Z",
                "operator-user-1",
                MANIFEST_HASH,
                "1.0.0",
                "1.2.3",
                "stable",
                "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                null);
    }

    private OperatorUpdateProperties updateProperties() {
        OperatorUpdateProperties properties = new OperatorUpdateProperties();
        properties.setEnabled(true);
        properties.setStateDir(temporaryDirectory.resolve("update-state"));
        properties.setReleasePublicKeyPath(
                temporaryDirectory.resolve("release-public-key.pem"));
        properties.setMaxArtifactBytes(1_048_576L);
        properties.setStagingSafetyReserveBytes(0L);
        return properties;
    }

    private RegistryProperties registryProperties(
            OperatorUpdateProperties properties) {
        RegistryProperties registry = new RegistryProperties();
        registry.setSoftwareVersion("1.0.0");
        registry.setPackageSigningPublicKeyPath(
                properties.getReleasePublicKeyPath());
        return registry;
    }

    private OperatorAnnouncementPageDto announcementPage(
            long artifactSize,
            String artifactHash,
            boolean packageVerified) {
        OperatorUpdateManifestDto manifest = new OperatorUpdateManifestDto(
                RegistryProtocol.UPDATE_MANIFEST_VERSION,
                "1.2.3",
                "stable.lts_1",
                "2026-07-28T19:00:00Z",
                "1.0.0",
                "2.0.0",
                "https://downloads.example.test/myscoutee_1.2.3_amd64.deb",
                artifactSize,
                artifactHash,
                PACKAGE_KEY_ID,
                PACKAGE_SIGNATURE,
                "https://downloads.example.test/releases/1.2.3",
                true,
                90,
                "AVAILABLE",
                null,
                null,
                null,
                true,
                true,
                packageVerified);
        OperatorAnnouncementDto announcement = new OperatorAnnouncementDto(
                1L,
                ANNOUNCEMENT_ID,
                "UPDATE",
                "NOTICE",
                manifest.publishedAt(),
                null,
                null,
                null,
                List.of(),
                List.of(),
                manifest,
                MANIFEST_HASH,
                "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
        return new OperatorAnnouncementPageDto(
                new OperatorAnnouncementSnapshotDto(
                        "annsnap_0123456789abcdef0123456789abcdef",
                        "2026-07-28T19:30:00Z",
                        1L,
                        announcement.announcementHash(),
                        "UPDATE",
                        "",
                        "",
                        false,
                        "2026-07-28T19:30:00Z",
                        "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"),
                List.of(announcement),
                null);
    }
}
