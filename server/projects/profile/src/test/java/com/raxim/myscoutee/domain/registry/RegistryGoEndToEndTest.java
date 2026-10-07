package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;

import tools.jackson.databind.ObjectMapper;

/**
 * Cross-language protocol check for a separately launched Go registry.
 *
 * <p>Set {@code REGISTRY_E2E_BASE_URL} to opt in. {@code REGISTRY_E2E_KEY_DIR}
 * and {@code REGISTRY_E2E_STATE_DIR} may point at installer-style persistent
 * directories; otherwise disposable test directories are used.
 */
@Tag("qualification")

@org.junit.jupiter.api.Tag("integration")
class RegistryGoEndToEndTest {
    @TempDir
    Path temporaryDirectory;

    @Test
    void synchronizesTwiceAgainstRealGoRegistry() throws Exception {
        String baseUrl = environment("REGISTRY_E2E_BASE_URL");
        assumeTrue(!baseUrl.isBlank(), "Set REGISTRY_E2E_BASE_URL to run the Go registry E2E test.");

        Path keyDirectory = configuredDirectory(
                "REGISTRY_E2E_KEY_DIR",
                temporaryDirectory.resolve("keys"));
        Path stateDirectory = configuredDirectory(
                "REGISTRY_E2E_STATE_DIR",
                temporaryDirectory.resolve("state"));
        Path privateKey = keyDirectory.resolve("deployment-private-key.pem");
        Path publicKey = keyDirectory.resolve("deployment-public-key.der");
        boolean privateKeyExistedBeforePreflight = Files.exists(privateKey);
        boolean publicKeyExistedBeforePreflight = Files.exists(publicKey);
        boolean stateDirectoryExistedBeforePreflight = Files.exists(stateDirectory);
        assertThat(privateKeyExistedBeforePreflight)
                .as("REGISTRY_E2E_KEY_DIR must contain either a complete pair or no identity")
                .isEqualTo(publicKeyExistedBeforePreflight);
        byte[] privateKeyBeforePreflight = privateKeyExistedBeforePreflight
                ? Files.readAllBytes(privateKey)
                : null;
        byte[] publicKeyBeforePreflight = publicKeyExistedBeforePreflight
                ? Files.readAllBytes(publicKey)
                : null;
        String fingerprintBeforePreflight = publicKeyBeforePreflight == null
                ? null
                : RegistryProtocol.publicKeyFingerprint(publicKeyBeforePreflight);
        List<String> stateEntriesBeforePreflight = directoryEntries(stateDirectory);

        RegistryConfiguration properties = new RegistryConfiguration();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setOperatorRegistrationConfirmed(false);
        properties.setBaseUrl(baseUrl);
        String registryScope = environment("REGISTRY_E2E_SCOPE");
        assertThat(registryScope)
                .as("REGISTRY_E2E_SCOPE must explicitly match the independently deployed Go registry")
                .isNotBlank();
        properties.setRegistryScope(registryScope);
        properties.setPrivateKeyPath(privateKey);
        properties.setPublicKeyPath(publicKey);
        properties.setStateDir(stateDirectory);
        properties.setSoftwareVersion("registry-go-e2e");
        properties.setConnectTimeout(Duration.ofSeconds(5));
        properties.setRequestTimeout(Duration.ofSeconds(10));
        properties.setAllowInsecureHttp(
                "http".equalsIgnoreCase(URI.create(baseUrl).getScheme()));

        String expectedFingerprint = environment("REGISTRY_E2E_EXPECTED_KEY_FINGERPRINT");
        if (expectedFingerprint.isBlank()) {
            properties.setTrustOnFirstUse(true);
        } else {
            properties.setExpectedRegistryKeyFingerprint(expectedFingerprint);
        }

        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        com.raxim.myscoutee.domain.registry.dto.RegistryInspection inspection =
                new RegistryPreflightService(properties, objectMapper)
                        .inspectConfiguredRegistry();
        assertThat(inspection.registryScope()).isEqualTo(registryScope);
        assertThat(inspection.registryEndpoint())
                .isEqualTo(baseUrl + RegistryProtocol.REGISTRY_IDENTITY_PATH);
        assertThat(Files.exists(privateKey)).isEqualTo(privateKeyExistedBeforePreflight);
        assertThat(Files.exists(publicKey)).isEqualTo(publicKeyExistedBeforePreflight);
        assertThat(Files.exists(stateDirectory)).isEqualTo(stateDirectoryExistedBeforePreflight);
        assertThat(directoryEntries(stateDirectory)).isEqualTo(stateEntriesBeforePreflight);
        if (privateKeyBeforePreflight != null) {
            assertThat(Files.readAllBytes(privateKey)).isEqualTo(privateKeyBeforePreflight);
        }
        if (publicKeyBeforePreflight != null) {
            assertThat(Files.readAllBytes(publicKey)).isEqualTo(publicKeyBeforePreflight);
        }

        com.raxim.myscoutee.domain.registry.dto.NodeIdentity nodeIdentity =
                new RegistryNodeIdentityService(properties).initializeNodeIdentity();
        assertThat(nodeIdentity.publicKeyFingerprint())
                .isEqualTo(RegistryCrypto.load(properties).deploymentPublicKeyFingerprint());
        if (fingerprintBeforePreflight != null) {
            assertThat(nodeIdentity.publicKeyFingerprint()).isEqualTo(fingerprintBeforePreflight);
            assertThat(Files.readAllBytes(privateKey)).isEqualTo(privateKeyBeforePreflight);
            assertThat(Files.readAllBytes(publicKey)).isEqualTo(publicKeyBeforePreflight);
        }
        Files.createDirectories(stateDirectory);
        properties.setOperatorRegistrationConfirmed(true);

        RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);
        RegistryEnrollmentService service = new RegistryEnrollmentService(
                properties,
                store,
                new RegistryHttpClient(properties, objectMapper),
                Clock.systemUTC(),
                new java.security.SecureRandom());

        RegistryEnrollmentService.SyncResult first = service.synchronizeNow();
        RegistryEnrollmentService.SyncResult second = service.synchronizeNow();

        assertThat(first.active()).isTrue();
        assertThat(first.completed()).isTrue();
        assertThat(first.deploymentId()).startsWith("dep_");
        assertThat(first.batchId()).startsWith("batch_");
        assertThat(first.registrationDuplicate()).isFalse();
        assertThat(second.registrationDuplicate()).isTrue();
        assertThat(second.deploymentId()).isEqualTo(first.deploymentId());
        assertThat(second.batchId()).isEqualTo(first.batchId());
        assertThat(store.load().orElseThrow().registryScope()).isEqualTo(properties.getRegistryScope());
        assertThat(store.load().orElseThrow().deploymentId()).isEqualTo(first.deploymentId());
        assertThat(store.loadInstallationReceipt(first.batchId())).isPresent();
        assertThat(Files.readString(properties.statePath()))
                .contains("\"deployment_id\":\"" + first.deploymentId() + "\"");
    }

    private Path configuredDirectory(String variableName, Path defaultDirectory) {
        String configured = environment(variableName);
        return configured.isBlank()
                ? defaultDirectory
                : Path.of(configured).toAbsolutePath().normalize();
    }

    private List<String> directoryEntries(Path directory) throws Exception {
        if (!Files.exists(directory)) {
            return List.of();
        }
        try (var paths = Files.walk(directory)) {
            return paths
                    .filter(path -> !path.equals(directory))
                    .map(directory::relativize)
                    .map(Path::toString)
                    .sorted()
                    .toList();
        }
    }

    private String environment(String variableName) {
        String value = System.getenv(variableName);
        return value == null ? "" : value.trim();
    }
}
