package com.raxim.myscoutee.registry;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.registry.RegistryLocalStore.BindingArchive;
import com.raxim.myscoutee.registry.RegistryLocalStore.BindingArchiveRequest;
import com.raxim.myscoutee.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.registry.RegistryProtocol.MauReceipt;

import tools.jackson.databind.ObjectMapper;

/**
 * Stateless bridge used by the operator workflow.
 *
 * <p>Every call receives a complete per-mode configuration. It never mutates
 * the singleton environment-backed {@link RegistryProperties}, which keeps
 * DEMO and REAL requests from racing or crossing key/state boundaries.</p>
 */
@Component
public class RegistryOperatorOperations {
    private static final Set<PosixFilePermission> DIRECTORY_PERMISSIONS =
            PosixFilePermissions.fromString("rwx------");

    private final ObjectMapper objectMapper;

    public RegistryOperatorOperations(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "Object mapper must not be null.");
    }

    public RegistryPreflightService.RegistryInspection inspect(RegistryProperties properties) {
        return new RegistryPreflightService(properties, objectMapper).inspectConfiguredRegistry();
    }

    public NodeStatus inspectNodeIdentity(RegistryProperties properties) {
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

    public RegistryNodeIdentityService.NodeIdentity initializeNodeIdentity(
            RegistryProperties properties) {
        return new RegistryNodeIdentityService(properties).initializeNodeIdentity();
    }

    public EnrollmentOutcome synchronize(RegistryProperties properties) {
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
            RegistryProperties properties,
            BindingArchiveRequest request) {
        return new RegistryLocalStore(properties, objectMapper)
                .archiveActiveBinding(request);
    }

    public void restoreActiveBinding(
            RegistryProperties properties,
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

    public record NodeStatus(
            String state,
            String publicKeyFingerprint) {
    }

    public record EnrollmentOutcome(
            String deploymentCode,
            String installationTestBatchId,
            String installationTestAcceptedAt,
            Long installationTestLedgerIndex,
            boolean registrationDuplicate) {
    }
}
