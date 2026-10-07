package com.raxim.myscoutee.domain.registry;
import java.security.PublicKey;
import com.raxim.myscoutee.domain.registry.dto.RegistryExpectation;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.registry.api.RegistryTransport;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistrationResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.dto.RegistryEnrollmentValues.NodeStatus;
import com.raxim.myscoutee.domain.registry.dto.RegistryEnrollmentValues.EnrollmentOutcome;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.BindingArchive;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.BindingArchiveRequest;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.MauReceipt;

import tools.jackson.databind.ObjectMapper;

/**
 * Stateless bridge used by the operator workflow.
 *
 * <p>Every call receives a complete per-mode configuration. It never mutates
 * the singleton environment-backed {@link RegistryConfiguration}, which keeps
 * DEMO and REAL requests from racing or crossing key/state boundaries.</p>
 */
@Component
public class RegistryOperatorOperations implements com.raxim.myscoutee.domain.registry.api.RegistryOperations {
    private static final Set<PosixFilePermission> DIRECTORY_PERMISSIONS =
            PosixFilePermissions.fromString("rwx------");

    private final ObjectMapper objectMapper;

    public RegistryOperatorOperations(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "Object mapper must not be null.");
    }

    public com.raxim.myscoutee.domain.registry.dto.RegistryInspection inspect(RegistryConfiguration properties) {
        return new RegistryPreflightService(properties, objectMapper).inspectConfiguredRegistry();
    }

    public NodeStatus inspectNodeIdentity(RegistryConfiguration properties) {
        Path privateKey = properties.getPrivateKeyPath().toAbsolutePath().normalize();
        Path publicKey = properties.getPublicKeyPath().toAbsolutePath().normalize();
        boolean privateExists = Files.exists(privateKey, LinkOption.NOFOLLOW_LINKS);
        boolean publicExists = Files.exists(publicKey, LinkOption.NOFOLLOW_LINKS);
        if (!privateExists && !publicExists) {
            return new NodeStatus("MISSING", null);
        }
        if (!privateExists || !publicExists
                || Files.isSymbolicLink(privateKey)
                || Files.isSymbolicLink(publicKey)
                || !Files.isRegularFile(privateKey, LinkOption.NOFOLLOW_LINKS)
                || !Files.isRegularFile(publicKey, LinkOption.NOFOLLOW_LINKS)) {
            return new NodeStatus("INCOMPLETE", null);
        }
        try {
            return new NodeStatus(
                    "READY",
                    RegistryCrypto.load(properties).deploymentPublicKeyFingerprint());
        } catch (RuntimeException exception) {
            return new NodeStatus("INCOMPLETE", null);
        }
    }

    public com.raxim.myscoutee.domain.registry.dto.NodeIdentity initializeNodeIdentity(
            RegistryConfiguration properties) {
        return new RegistryNodeIdentityService(properties).initializeNodeIdentity();
    }

    public EnrollmentOutcome synchronize(RegistryConfiguration properties) {
        prepareStateDirectory(properties.getStateDir());
        RegistryEnrollmentService.SyncResult result =
                new RegistryEnrollmentService(properties, objectMapper).synchronizeNow();
        if (!result.completed()) {
            throw new IllegalStateException("Registry enrollment did not complete.");
        }
        LocalState state = new RegistryLocalStore(properties, objectMapper)
                .load()
                .orElseThrow(() -> new IllegalStateException(
                        "Registry enrollment completed without durable local state."));
        if (state.installationBatch() == null || state.installationBatch().receipt() == null) {
            throw new IllegalStateException(
                    "Registry enrollment completed without an installation-test receipt.");
        }
        new RegistryOperatorNetworkService(properties, objectMapper)
                .activateReconnectedDeployment();
        MauReceipt receipt = state.installationBatch().receipt();
        return new EnrollmentOutcome(
                result.deploymentId(),
                result.batchId(),
                receipt.acceptedAt(),
                receipt.ledgerIndex(),
                result.registrationDuplicate());
    }

    public BindingArchive archiveActiveBinding(
            RegistryConfiguration properties,
            BindingArchiveRequest request) {
        return new RegistryLocalStore(properties, objectMapper)
                .archiveActiveBinding(request);
    }

    public void restoreActiveBinding(
            RegistryConfiguration properties,
            String archiveId) {
        new RegistryLocalStore(properties, objectMapper)
                .restoreActiveBinding(archiveId);
    }

    private static void prepareStateDirectory(Path configuredDirectory) {
        Path directory = Objects.requireNonNull(
                        configuredDirectory,
                        "Registry state directory must not be null.")
                .toAbsolutePath()
                .normalize();
        Path current = directory.getRoot();
        if (current == null) {
            throw new IllegalStateException("Registry state directory must be absolute.");
        }
        for (Path component : directory) {
            current = current.resolve(component);
            try {
                if (!Files.exists(current, LinkOption.NOFOLLOW_LINKS)) {
                    Files.createDirectory(current);
                }
                if (Files.isSymbolicLink(current)
                        || !Files.isDirectory(current, LinkOption.NOFOLLOW_LINKS)) {
                    throw new IllegalStateException(
                            "Registry state path contains a non-directory or symbolic link: " + current);
                }
            } catch (IOException exception) {
                throw new IllegalStateException(
                        "Unable to prepare registry state directory " + current + ".",
                        exception);
            }
        }
        try {
            Files.setPosixFilePermissions(directory, DIRECTORY_PERMISSIONS);
        } catch (UnsupportedOperationException | IOException ignored) {
            // Linux package targets enforce POSIX permissions; tests may use another file system.
        }
    }




    public RegistryTransport openTransport(RegistryConfiguration properties) {
        return new RegistryHttpClient(properties, objectMapper);
    }
    public RegisteredRuntime registeredEvidence(RegistryConfiguration runtime, String requiredEndpointPath,
            RegistryExpectation expectation) {
        new RegistryHttpClient(runtime, objectMapper).endpoint(requiredEndpointPath);
        RegistryCrypto crypto = RegistryCrypto.load(runtime);
        RegistryLocalStore localStore = new RegistryLocalStore(runtime, objectMapper);
        LocalState state = localStore.load().orElseThrow(() -> new IllegalStateException("Signed registry state is missing."));
        return verifyRegisteredEvidence(expectation, runtime, crypto, localStore, state);
    }
    private RegisteredRuntime verifyRegisteredEvidence(
            RegistryExpectation expectation,
            RegistryConfiguration runtime,
            RegistryCrypto crypto,
            RegistryLocalStore localStore,
            LocalState state) {
        String deploymentId = RegistryProtocol.requireDeploymentId(
                expectation.deploymentId());
        String registryScope = RegistryProtocol.requireRegistryScope(
                expectation.registryScope());
        String selectedFingerprint = RegistryProtocol.requireHash(
                expectation.registryPublicKeyFingerprint(),
                "selected registry public-key fingerprint");
        String selectedKeyId = RegistryProtocol.requireRegistryKeyId(
                expectation.registryKeyId());
        String nodeFingerprint = RegistryProtocol.requireHash(
                expectation.nodePublicKeyFingerprint(),
                "persisted node public-key fingerprint");

        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    expectation.protocolVersion())
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        state.protocolVersion())
                || !registryScope.equals(state.registryScope())
                || !deploymentId.equals(state.deploymentId())
                || !nodeFingerprint.equals(state.publicKeyFingerprint())
                || !nodeFingerprint.equals(
                        crypto.deploymentPublicKeyFingerprint())) {
            throw new IllegalStateException(
                    "Operator registry settings do not match the durable node identity.");
        }

        RegistrationResponse registration =
                state.registration() == null
                        ? null
                        : state.registration().receipt();
        if (registration == null) {
            throw new IllegalStateException(
                    "Signed deployment registration receipt is missing.");
        }
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    registration.protocolVersion())
                || !registryScope.equals(registration.registryScope())
                || !deploymentId.equals(registration.deploymentId())
                || !nodeFingerprint.equals(
                        registration.publicKeyFingerprint())) {
            throw new IllegalStateException(
                    "Signed deployment registration receipt does not match local state.");
        }
        RegistryProtocol.requireUtcTimestamp(
                registration.registeredAt(),
                "registered_at");
        PublicKey registryPublicKey = com.raxim.myscoutee.domain.registry.api.RegistrySignatures.parseRegistryPublicKey(
                registration.registryPublicKey());
        String registryFingerprint = RegistryProtocol.publicKeyFingerprint(
                registryPublicKey.getEncoded());
        String registryKeyId = RegistryProtocol.registryKeyId(
                registryFingerprint);
        if (!selectedFingerprint.equals(registryFingerprint)
                || !selectedKeyId.equals(registryKeyId)
                || !registryKeyId.equals(registration.registryKeyId())
                || !registryFingerprint.equals(
                        state.trustedRegistryKeyFingerprint())
                || !com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                        registryPublicKey,
                        RegistryProtocol.registrationReceipt(registration),
                        registration.receiptSignature())) {
            throw new IllegalStateException(
                    "Signed registry identity does not match the operator-selected trust anchor.");
        }

        BatchResponse installation = state.installationBatch();
        if (installation == null || installation.receipt() == null) {
            throw new IllegalStateException(
                    "Signed installation receipt is missing.");
        }
        verifyInstallationReceipt(
                state,
                installation,
                registryPublicKey,
                registration.registryPublicKey(),
                registryKeyId);
        BatchResponse storedInstallation = localStore
                .loadInstallationReceipt(installation.batchId())
                .orElseThrow(() -> new IllegalStateException(
                        "Durable installation receipt file is missing."));
        if (!storedInstallation.equals(installation)) {
            throw new IllegalStateException(
                    "Installation receipt file differs from durable registry state.");
        }
        if (!Objects.equals(
                    expectation.installationBatchId(),
                    installation.batchId())) {
            throw new IllegalStateException(
                    "Operator enrollment summary does not match the signed installation receipt.");
        }

        return new RegisteredRuntime(
                runtime,
                state,
                crypto,
                registryPublicKey,
                registration.registryPublicKey(),
                registryFingerprint,
                registryKeyId);
    }
    private void verifyInstallationReceipt(
            LocalState state,
            BatchResponse response,
            PublicKey registryPublicKey,
            String registryPublicKeyBase64,
            String registryKeyId) {
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    response.protocolVersion())
                || !state.registryScope().equals(response.registryScope())
                || !state.deploymentId().equals(response.deploymentId())
                || !state.installationIdempotencyKey().equals(
                        response.idempotencyKey())
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Installation response does not match durable deployment state.");
        }
        RegistryProtocol.requireBatchId(response.batchId());
        MauReceipt receipt = response.receipt();
        if (!state.registryScope().equals(receipt.registryScope())
                || !RegistryProtocol.INSTALLATION_KIND.equals(receipt.kind())
                || !RegistryProtocol.INSTALLATION_RULESET.equals(
                        receipt.rulesetVersion())
                || !state.installationPeriod().equals(receipt.period())
                || receipt.qualifiedMauCount() == null
                || receipt.qualifiedMauCount()
                        != RegistryProtocol.INSTALLATION_MAU_COUNT
                || receipt.ledgerIndex() == null
                || receipt.ledgerIndex() <= 0L
                || !registryKeyId.equals(receipt.registryKeyId())
                || !registryPublicKeyBase64.equals(
                        receipt.registryPublicKey())) {
            throw new IllegalStateException(
                    "Installation receipt is not the registered deployment's signed installation test.");
        }
        RegistryProtocol.requireHash(receipt.batchHash(), "batch_hash");
        RegistryProtocol.requireHash(receipt.entryHash(), "entry_hash");
        RegistryProtocol.requireHash(
                receipt.previousEntryHash(),
                "previous_entry_hash");
        RegistryProtocol.requirePeriod(receipt.period());
        String commitmentHash = RegistryProtocol.sha256(
                RegistryProtocol.installationCommitment(
                        state.deploymentId(),
                        state.installationIdempotencyKey()));
        String expectedBatchHash = RegistryProtocol.sha256(
                RegistryProtocol.mauBatchPayload(
                        RegistryProtocol.INSTALLATION_KIND,
                        state.installationPeriod(),
                        RegistryProtocol.INSTALLATION_RULESET,
                        RegistryProtocol.INSTALLATION_MAU_COUNT,
                        commitmentHash));
        var acceptedAt = RegistryProtocol.requireUtcTimestamp(
                receipt.acceptedAt(),
                "accepted_at");
        RegistryProtocol.requireCheckpointDate(receipt.checkpointDate());
        String expectedEntryHash = RegistryProtocol.sha256(
                RegistryProtocol.ledgerEntry(
                        RegistryProtocol.PROTOCOL_VERSION,
                        state.registryScope(),
                        receipt.ledgerIndex(),
                        RegistryProtocol.INSTALLATION_ENTRY_TYPE,
                        state.deploymentId(),
                        response.batchId(),
                        receipt.kind(),
                        receipt.period(),
                        receipt.rulesetVersion(),
                        receipt.qualifiedMauCount(),
                        receipt.batchHash(),
                        receipt.previousEntryHash(),
                        receipt.acceptedAt()));
        if (!RegistryProtocol.hashEquals(
                    expectedBatchHash,
                    receipt.batchHash())
                || !RegistryProtocol.hashEquals(
                        expectedEntryHash,
                        receipt.entryHash())
                || !RegistryProtocol.checkpointDateAt(acceptedAt).equals(
                    receipt.checkpointDate())
                || !com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                        registryPublicKey,
                        RegistryProtocol.mauReceipt(response),
                        receipt.signature())) {
            throw new IllegalStateException(
                    "Installation receipt signature or checkpoint is invalid.");
        }
    }
}
