package com.raxim.myscoutee.domain.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.registry.config.RegistryProperties;
import com.raxim.myscoutee.domain.registry.RegistryLocalStore.BindingArchiveRequest;
import com.raxim.myscoutee.domain.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.OperatorActionReceipt;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.OperatorActionRequest;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.RegistrationResponse;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class RegistryLocalStoreTest {
    private static final Instant NOW =
            Instant.parse("2026-07-28T10:15:30Z");
    private static final String REGISTRY_SCOPE =
            "demo:local-registry";
    private static final String DEPLOYMENT_ID =
            "dep_0123456789abcdef0123456789abcdef";
    private static final String ACTION_ID =
            "opa_0123456789abcdef0123456789abcdef";
    private static final String NODE_FINGERPRINT =
            "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private static final String REGISTRY_FINGERPRINT =
            "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    private static final String REGISTRY_KEY_ID =
            "rkey_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

    @TempDir
    Path temporaryDirectory;

    @Test
    void signedBindingArchivePreservesHistoryAndStartsTheNextScopeFresh()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = properties();
        Files.createDirectory(properties.getStateDir());
        Files.createDirectories(
                properties.getPrivateKeyPath().getParent());
        Files.writeString(
                properties.getPrivateKeyPath(),
                "preserved-private-key");
        Files.writeString(
                properties.getPublicKeyPath(),
                "preserved-public-key");
        RegistryLocalStore store =
                new RegistryLocalStore(properties, objectMapper);
        LocalState previous = registeredState(store);
        OperatorActionReceipt deactivation =
                durableDeactivation(store);

        var archive = store.archiveActiveBinding(
                archiveRequest(deactivation));

        assertThat(properties.statePath()).doesNotExist();
        assertThat(properties.receiptDirectory()).isDirectory();
        try (var receipts =
                Files.list(properties.receiptDirectory())) {
            assertThat(receipts.toList()).isEmpty();
        }
        assertThat(properties.getPrivateKeyPath())
                .hasContent("preserved-private-key");
        assertThat(properties.getPublicKeyPath())
                .hasContent("preserved-public-key");
        assertThat(archive.archiveDirectory()
                        .resolve("deployment-state.json"))
                .exists();
        assertThat(archive.archiveDirectory()
                        .resolve("archive-manifest.json"))
                .exists();
        assertThat(archive.archiveDirectory()
                        .resolve("receipts")
                        .resolve(
                                "operator-action-"
                                        + ACTION_ID
                                        + ".json"))
                .exists();

        LocalState next = store.createInitial(
                NODE_FINGERPRINT,
                "demo:second-registry",
                "backend-v2",
                new SecureRandom(),
                NOW.plusSeconds(30));

        assertThat(next.registryScope())
                .isEqualTo("demo:second-registry");
        assertThat(next.publicKeyFingerprint())
                .isEqualTo(previous.publicKeyFingerprint());
        assertThat(next.registration()).isNull();
        assertThat(next.installationBatch()).isNull();
        assertThat(next.registrationIdempotencyKey())
                .isNotEqualTo(previous.registrationIdempotencyKey());
        assertThat(store.loadOperatorActionJournal()).isEmpty();
    }

    @Test
    void archiveRequiresTheDurableSignedDeactivationReceipt() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = properties();
        Files.createDirectory(properties.getStateDir());
        RegistryLocalStore store =
                new RegistryLocalStore(properties, objectMapper);
        registeredState(store);
        OperatorActionReceipt deactivation =
                deactivationReceipt();

        assertThatThrownBy(() -> store.archiveActiveBinding(
                archiveRequest(deactivation)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(
                        "deactivation receipt is not durably stored");

        assertThat(properties.statePath()).exists();
        assertThat(store.load().orElseThrow().deploymentId())
                .isEqualTo(DEPLOYMENT_ID);
    }

    @Test
    void compensationRestoreReinstatesTheExactBindingWithoutTouchingKeys()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = properties();
        Files.createDirectory(properties.getStateDir());
        Files.createDirectories(
                properties.getPrivateKeyPath().getParent());
        Files.writeString(
                properties.getPrivateKeyPath(),
                "preserved-private-key");
        Files.writeString(
                properties.getPublicKeyPath(),
                "preserved-public-key");
        RegistryLocalStore store =
                new RegistryLocalStore(properties, objectMapper);
        LocalState previous = registeredState(store);
        OperatorActionReceipt deactivation =
                durableDeactivation(store);
        var archive = store.archiveActiveBinding(
                archiveRequest(deactivation));

        store.restoreActiveBinding(archive.archiveId());
        store.restoreActiveBinding(archive.archiveId());

        assertThat(store.load().orElseThrow()).isEqualTo(previous);
        assertThat(store.loadOperatorActionJournal())
                .singleElement()
                .satisfies(entry -> assertThat(
                        entry.receipt().actionId())
                        .isEqualTo(ACTION_ID));
        assertThat(archive.archiveDirectory()
                        .resolve("archive-manifest.json"))
                .exists();
        assertThat(properties.getPrivateKeyPath())
                .hasContent("preserved-private-key");
        assertThat(properties.getPublicKeyPath())
                .hasContent("preserved-public-key");
    }

    private RegistryProperties properties() {
        RegistryProperties properties = new RegistryProperties();
        properties.setStateDir(
                temporaryDirectory.resolve("state"));
        properties.setPrivateKeyPath(
                temporaryDirectory.resolve("keys/private.pem"));
        properties.setPublicKeyPath(
                temporaryDirectory.resolve("keys/public.der"));
        return properties;
    }

    private LocalState registeredState(
            RegistryLocalStore store) {
        LocalState initial = store.createInitial(
                NODE_FINGERPRINT,
                REGISTRY_SCOPE,
                "backend-v1",
                new SecureRandom(),
                NOW);
        RegistrationResponse registration =
                new RegistrationResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        REGISTRY_SCOPE,
                        DEPLOYMENT_ID,
                        NOW.toString(),
                        NODE_FINGERPRINT,
                        REGISTRY_KEY_ID,
                        "registry-public-key",
                        "registry-signature",
                        false);
        LocalState registered = initial.withRegistration(
                registration,
                REGISTRY_FINGERPRINT,
                NOW.plusSeconds(1));
        store.save(registered);
        return registered;
    }

    private OperatorActionReceipt durableDeactivation(
            RegistryLocalStore store) {
        OperatorActionReceipt receipt =
                deactivationReceipt();
        String payloadHash = RegistryProtocol.sha256(
                RegistryProtocol.operatorActionPayload(
                        RegistryProtocol
                                .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                        null,
                        null,
                        "",
                        0L,
                        null,
                        null));
        OperatorActionRequest request =
                new OperatorActionRequest(
                        RegistryProtocol.PROTOCOL_VERSION,
                        REGISTRY_SCOPE,
                        DEPLOYMENT_ID,
                        NOW.plusSeconds(2).toString(),
                        "nonce_0123456789abcdef",
                        "deactivate_0123456789abcdef",
                        RegistryProtocol
                                .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        payloadHash,
                        "request-signature");
        store.saveOperatorActionReceipt(
                request,
                "",
                receipt);
        return receipt;
    }

    private OperatorActionReceipt deactivationReceipt() {
        return new OperatorActionReceipt(
                2L,
                "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
                ACTION_ID,
                DEPLOYMENT_ID,
                DEPLOYMENT_ID,
                null,
                RegistryProtocol
                        .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                NOW.plusSeconds(3).toString(),
                RegistryProtocol.OPERATOR_CLAIM_STATE_WITHDRAWN,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                REGISTRY_SCOPE,
                REGISTRY_KEY_ID,
                "receipt-signature");
    }

    private BindingArchiveRequest archiveRequest(
            OperatorActionReceipt receipt) {
        return new BindingArchiveRequest(
                "http://registry:8080",
                REGISTRY_SCOPE,
                REGISTRY_KEY_ID,
                REGISTRY_FINGERPRINT,
                DEPLOYMENT_ID,
                receipt,
                NOW.plusSeconds(4).toString(),
                "operator-demo-dev");
    }
}
