package com.raxim.myscoutee.domain.registry;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.domain.registry.config.RegistryProperties;

import tools.jackson.databind.ObjectMapper;

public final class RegistryLocalStore {
    private static final int STATE_SCHEMA_VERSION = 1;
    private static final int BINDING_ARCHIVE_SCHEMA_VERSION = 1;
    private static final int LEGACY_OPERATOR_CLAIM_STATUS_SCHEMA_VERSION = 1;
    private static final int OPERATOR_CLAIM_STATUS_SCHEMA_VERSION = 2;
    private static final int MAX_STATE_BYTES = 1_048_576;
    private static final Set<PosixFilePermission> DIRECTORY_PERMISSIONS =
            PosixFilePermissions.fromString("rwx------");
    private static final Set<PosixFilePermission> FILE_PERMISSIONS =
            PosixFilePermissions.fromString("rw-------");

    private final ObjectMapper objectMapper;
    private final Path stateDirectory;
    private final Path statePath;
    private final Path receiptDirectory;
    private final Path operatorClaimStatusPath;
    private final Path bindingArchiveDirectory;

    public RegistryLocalStore(RegistryProperties properties, ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "ObjectMapper must not be null.");
        this.stateDirectory = properties.getStateDir().toAbsolutePath().normalize();
        this.statePath = properties.statePath().toAbsolutePath().normalize();
        this.receiptDirectory = properties.receiptDirectory().toAbsolutePath().normalize();
        this.operatorClaimStatusPath = receiptDirectory
                .resolve("operator-claim-status.json")
                .normalize();
        this.bindingArchiveDirectory = stateDirectory
                .resolve("archives")
                .normalize();
    }

    public void requireWritableStateDirectory() {
        if (!Files.exists(stateDirectory, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    "Registry state directory is missing at " + stateDirectory + "; the installer must create it.");
        }
        if (Files.isSymbolicLink(stateDirectory)
                || !Files.isDirectory(stateDirectory, LinkOption.NOFOLLOW_LINKS)
                || !Files.isWritable(stateDirectory)) {
            throw new IllegalStateException(
                    "Registry state path must be a writable non-symlink directory: " + stateDirectory);
        }
        try {
            setPosixPermissions(stateDirectory, DIRECTORY_PERMISSIONS);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to enforce private registry state-directory permissions at "
                            + stateDirectory
                            + ".",
                    exception);
        }
        ensureReceiptDirectory();
    }

    public Optional<LocalState> load() {
        requireWritableStateDirectory();
        if (!Files.exists(statePath, LinkOption.NOFOLLOW_LINKS)) {
            return Optional.empty();
        }
        requireRegularNonSymlink(statePath, "registry state");
        try {
            byte[] bytes = readLimited(statePath, MAX_STATE_BYTES);
            LocalState state = objectMapper.readValue(bytes, LocalState.class);
            validateBasicState(state);
            return Optional.of(state);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read registry state from " + statePath + ".", exception);
        }
    }

    public LocalState createInitial(
            String deploymentPublicKeyFingerprint,
            String registryScope,
            String registrationSoftwareVersion,
            SecureRandom secureRandom,
            Instant now) {
        String stableSoftwareVersion = RegistryProtocol.requireCanonical(
                registrationSoftwareVersion,
                "registration software_version");
        if (stableSoftwareVersion.length() > 128) {
            throw new IllegalArgumentException("registration software_version exceeds 128 characters.");
        }
        LocalState state = new LocalState(
                STATE_SCHEMA_VERSION,
                RegistryProtocol.PROTOCOL_VERSION,
                RegistryProtocol.requireRegistryScope(registryScope),
                RegistryProtocol.requireHash(
                        deploymentPublicKeyFingerprint,
                        "deployment public-key fingerprint"),
                RegistryProtocol.randomToken("registration_", secureRandom),
                stableSoftwareVersion,
                RegistryProtocol.randomToken("installation_", secureRandom),
                RegistryProtocol.periodAt(now),
                null,
                null,
                null,
                null,
                now.toString());
        save(state);
        return state;
    }

    public void save(LocalState state) {
        requireWritableStateDirectory();
        validateBasicState(state);
        try {
            byte[] json = objectMapper.writeValueAsString(state).getBytes(StandardCharsets.UTF_8);
            if (json.length > MAX_STATE_BYTES) {
                throw new IllegalStateException("Registry state exceeds the local size limit.");
            }
            atomicWrite(statePath, json);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to persist registry state to " + statePath + ".", exception);
        }
    }

    public Path saveInstallationReceipt(RegistryProtocol.BatchResponse response) {
        Objects.requireNonNull(response, "Batch response must not be null.");
        String batchId = RegistryProtocol.requireBatchId(response.batchId());
        Path receiptPath = receiptDirectory.resolve("installation-test-" + batchId + ".json").normalize();
        if (!receiptPath.getParent().equals(receiptDirectory)) {
            throw new IllegalArgumentException("Receipt path escaped the registry receipt directory.");
        }
        try {
            byte[] json = objectMapper.writeValueAsString(response).getBytes(StandardCharsets.UTF_8);
            if (json.length > MAX_STATE_BYTES) {
                throw new IllegalStateException("Registry receipt exceeds the local size limit.");
            }
            atomicWrite(receiptPath, json);
            return receiptPath;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to persist registry receipt to " + receiptPath + ".", exception);
        }
    }

    public Optional<RegistryProtocol.BatchResponse> loadInstallationReceipt(String batchId) {
        String normalizedBatchId = RegistryProtocol.requireBatchId(batchId);
        Path receiptPath = receiptDirectory.resolve("installation-test-" + normalizedBatchId + ".json").normalize();
        if (!receiptPath.getParent().equals(receiptDirectory)
                || !Files.exists(receiptPath, LinkOption.NOFOLLOW_LINKS)) {
            return Optional.empty();
        }
        requireRegularNonSymlink(receiptPath, "registry receipt");
        try {
            return Optional.of(objectMapper.readValue(
                    readLimited(receiptPath, MAX_STATE_BYTES),
                    RegistryProtocol.BatchResponse.class));
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read registry receipt from " + receiptPath + ".", exception);
        }
    }

    public synchronized Path saveOperatorActionReceipt(
            RegistryProtocol.OperatorActionReceipt suppliedReceipt) {
        Objects.requireNonNull(suppliedReceipt, "Operator action receipt must not be null.");
        RegistryProtocol.OperatorActionReceipt receipt =
                suppliedReceipt.withoutPlaintextClientToken();
        String actionId = RegistryProtocol.requireOperatorActionId(receipt.actionId());
        return saveOperatorActionDocument(actionId, receipt);
    }

    public synchronized Path saveOperatorActionReceipt(
            RegistryProtocol.OperatorActionRequest request,
            String clientTokenHash,
            RegistryProtocol.OperatorActionReceipt suppliedReceipt) {
        Objects.requireNonNull(request, "Operator action request must not be null.");
        Objects.requireNonNull(suppliedReceipt, "Operator action receipt must not be null.");
        RegistryProtocol.OperatorActionReceipt receipt =
                suppliedReceipt.withoutPlaintextClientToken();
        String actionId = RegistryProtocol.requireOperatorActionId(receipt.actionId());
        OperatorActionJournalEntry entry = new OperatorActionJournalEntry(
                1,
                request.protocolVersion(),
                request.registryScope(),
                request.deploymentId(),
                request.timestamp(),
                request.nonce(),
                request.idempotencyKey(),
                request.action(),
                request.operatorName(),
                request.operatorAvatarUrl(),
                request.legalName(),
                request.registrationNumber(),
                request.jurisdiction(),
                request.registeredAddress(),
                request.website(),
                request.verificationContactName(),
                request.verificationContactRole(),
                request.verificationContactEmail(),
                request.authorityAttested(),
                emptyToNull(clientTokenHash),
                request.tokenTtlSeconds(),
                request.tokenId(),
                request.linkId(),
                request.payloadHash(),
                request.signature(),
                receipt);
        return saveOperatorActionDocument(actionId, entry);
    }

    public List<OperatorActionJournalEntry> loadOperatorActionJournal() {
        requireWritableStateDirectory();
        List<OperatorActionJournalEntry> entries = new ArrayList<>();
        try (var paths = Files.newDirectoryStream(
                receiptDirectory,
                "operator-action-*.json")) {
            for (Path receiptPath : paths) {
                requireRegularNonSymlink(receiptPath, "registry operator receipt");
                OperatorActionJournalEntry entry = objectMapper.readValue(
                        readLimited(receiptPath, MAX_STATE_BYTES),
                        OperatorActionJournalEntry.class);
                if (entry == null || entry.schemaVersion() == null
                        || entry.schemaVersion() != 1 || entry.receipt() == null) {
                    throw new IllegalStateException(
                            "Registry operator receipt journal entry is invalid: " + receiptPath);
                }
                entries.add(entry);
            }
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to read the registry operator receipt journal.",
                    exception);
        }
        entries.sort(Comparator.comparingLong(entry -> {
            Long auditIndex = entry.receipt().auditIndex();
            if (auditIndex == null || auditIndex <= 0L) {
                throw new IllegalStateException(
                        "Registry operator receipt journal contains an invalid audit index.");
            }
            return auditIndex;
        }));
        return List.copyOf(entries);
    }

    public Optional<RegistryProtocol.OperatorClaimStatusReceipt>
            loadOperatorClaimStatusReceipt() {
        return loadOperatorClaimStatusEvidence()
                .map(OperatorClaimStatusEvidence::status);
    }

    public Optional<OperatorClaimStatusEvidence>
            loadOperatorClaimStatusEvidence() {
        requireWritableStateDirectory();
        if (!Files.exists(operatorClaimStatusPath, LinkOption.NOFOLLOW_LINKS)) {
            return Optional.empty();
        }
        requireRegularNonSymlink(
                operatorClaimStatusPath,
                "registry operator claim status");
        try {
            OperatorClaimStatusEvidence evidence = objectMapper.readValue(
                    readLimited(operatorClaimStatusPath, MAX_STATE_BYTES),
                    OperatorClaimStatusEvidence.class);
            if (evidence == null
                    || evidence.schemaVersion() == null
                    || (evidence.schemaVersion()
                                    != LEGACY_OPERATOR_CLAIM_STATUS_SCHEMA_VERSION
                            && evidence.schemaVersion()
                                    != OPERATOR_CLAIM_STATUS_SCHEMA_VERSION)
                    || evidence.status() == null
                    || (evidence.schemaVersion()
                                    == LEGACY_OPERATOR_CLAIM_STATUS_SCHEMA_VERSION
                            && !hasLegacyClaimStatusShape(evidence.status()))
                    || (evidence.schemaVersion()
                                    == OPERATOR_CLAIM_STATUS_SCHEMA_VERSION
                            && !hasVersionTwoClaimStatusShape(
                                    evidence.status()))) {
                throw new IllegalStateException(
                        "Registry operator claim status evidence is invalid.");
            }
            return Optional.of(evidence);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to read registry operator claim status evidence from "
                            + operatorClaimStatusPath
                            + ".",
                    exception);
        }
    }

    public synchronized Path saveOperatorClaimStatusReceipt(
            RegistryProtocol.OperatorClaimStatusReceipt status) {
        Objects.requireNonNull(status, "Operator claim status receipt must not be null.");
        requireWritableStateDirectory();
        if (!hasVersionTwoClaimStatusShape(status)) {
            throw new IllegalArgumentException(
                    "Operator claim status receipt has no version-two eligibility boundary.");
        }
        OperatorClaimStatusEvidence existing =
                loadOperatorClaimStatusEvidence().orElse(null);
        if (existing != null) {
            requireClaimStatusHighWater(existing.status(), status);
        }
        try {
            byte[] json = objectMapper.writeValueAsString(
                            new OperatorClaimStatusEvidence(
                                    OPERATOR_CLAIM_STATUS_SCHEMA_VERSION,
                                    status))
                    .getBytes(StandardCharsets.UTF_8);
            if (json.length > MAX_STATE_BYTES) {
                throw new IllegalStateException(
                        "Registry operator claim status evidence exceeds the local size limit.");
            }
            atomicWrite(operatorClaimStatusPath, json);
            return operatorClaimStatusPath;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to persist registry operator claim status evidence to "
                            + operatorClaimStatusPath
                            + ".",
                    exception);
        }
    }

    private static boolean hasLegacyClaimStatusShape(
            RegistryProtocol.OperatorClaimStatusReceipt status) {
        return status.eligibilityStatus() == null
                && status.eligibilityId() == null
                && status.eligibilityIndex() == null
                && status.eligibilityHash() == null;
    }

    private static boolean hasVersionTwoClaimStatusShape(
            RegistryProtocol.OperatorClaimStatusReceipt status) {
        return status.eligibilityStatus() != null
                && status.eligibilityHash() != null;
    }

    private static void requireClaimStatusHighWater(
            RegistryProtocol.OperatorClaimStatusReceipt previous,
            RegistryProtocol.OperatorClaimStatusReceipt incoming) {
        if (previous.claimAuditIndex() == null
                || incoming.claimAuditIndex() == null
                || incoming.claimAuditIndex() < previous.claimAuditIndex()) {
            throw new IllegalStateException(
                    "Refusing to replace durable operator claim status with an older claim generation.");
        }
        if (incoming.claimAuditIndex().equals(previous.claimAuditIndex())
                && (!Objects.equals(
                                incoming.claimActionId(),
                                previous.claimActionId())
                        || !Objects.equals(
                                incoming.claimAuditHash(),
                                previous.claimAuditHash()))) {
            throw new IllegalStateException(
                    "Refusing to replace durable operator claim status with a conflicting claim generation.");
        }
        if (incoming.claimAuditIndex() > previous.claimAuditIndex()) {
            if (Objects.equals(
                    incoming.claimActionId(),
                    previous.claimActionId())) {
                throw new IllegalStateException(
                        "Refusing a durable operator claim action with a changed audit boundary.");
            }
            return;
        }
        if (hasLegacyClaimStatusShape(previous)) {
            return;
        }
        long previousEligibilityIndex =
                previous.eligibilityIndex() == null
                        ? 0L
                        : previous.eligibilityIndex();
        long incomingEligibilityIndex =
                incoming.eligibilityIndex() == null
                        ? 0L
                        : incoming.eligibilityIndex();
        if (incomingEligibilityIndex < previousEligibilityIndex) {
            throw new IllegalStateException(
                    "Refusing to roll back the durable operator claim eligibility boundary.");
        }
        if (incomingEligibilityIndex == previousEligibilityIndex
                && (!Objects.equals(
                                incoming.eligibilityId(),
                                previous.eligibilityId())
                        || !Objects.equals(
                                incoming.eligibilityHash(),
                                previous.eligibilityHash()))) {
            throw new IllegalStateException(
                    "Refusing a conflicting operator claim eligibility boundary at the durable high-water mark.");
        }
        boolean approvalRemainsCurrent = RegistryProtocol
                        .OPERATOR_VERIFICATION_STATUS_APPROVED
                        .equals(previous.verificationStatus())
                && RegistryProtocol
                        .OPERATOR_VERIFICATION_STATUS_APPROVED
                        .equals(incoming.verificationStatus());
        if (approvalRemainsCurrent
                && incomingEligibilityIndex == previousEligibilityIndex
                && !Objects.equals(
                        incoming.eligibilityStatus(),
                        previous.eligibilityStatus())) {
            throw new IllegalStateException(
                    "Refusing an operator claim eligibility state change without a newer durable decision.");
        }
    }

    private Path saveOperatorActionDocument(String actionId, Object document) {
        Path receiptPath = receiptDirectory.resolve("operator-action-" + actionId + ".json").normalize();
        if (!receiptPath.getParent().equals(receiptDirectory)) {
            throw new IllegalArgumentException("Receipt path escaped the registry receipt directory.");
        }
        requireWritableStateDirectory();
        try {
            byte[] json = objectMapper.writeValueAsString(document).getBytes(StandardCharsets.UTF_8);
            if (json.length > MAX_STATE_BYTES) {
                throw new IllegalStateException("Registry receipt exceeds the local size limit.");
            }
            if (Files.exists(receiptPath, LinkOption.NOFOLLOW_LINKS)) {
                requireRegularNonSymlink(receiptPath, "registry operator receipt");
                byte[] existing = readLimited(receiptPath, MAX_STATE_BYTES);
                if (Arrays.equals(existing, json)) {
                    return receiptPath;
                }
                if (document instanceof OperatorActionJournalEntry supplied) {
                    OperatorActionJournalEntry durable = objectMapper.readValue(
                            existing,
                            OperatorActionJournalEntry.class);
                    if (sameDurableOperatorAction(durable, supplied)) {
                        return receiptPath;
                    }
                }
                throw new IllegalStateException(
                        "A different operator receipt already exists for " + actionId + ".");
            }
            atomicCreate(receiptPath, json);
            return receiptPath;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to persist registry operator receipt to " + receiptPath + ".",
                    exception);
        }
    }

    private static boolean sameDurableOperatorAction(
            OperatorActionJournalEntry durable,
            OperatorActionJournalEntry retry) {
        return durable != null
                && retry != null
                && Objects.equals(durable.schemaVersion(), retry.schemaVersion())
                && Objects.equals(durable.protocolVersion(), retry.protocolVersion())
                && Objects.equals(durable.registryScope(), retry.registryScope())
                && Objects.equals(durable.deploymentId(), retry.deploymentId())
                && Objects.equals(durable.idempotencyKey(), retry.idempotencyKey())
                && Objects.equals(durable.action(), retry.action())
                && Objects.equals(durable.operatorName(), retry.operatorName())
                && Objects.equals(durable.operatorAvatarUrl(), retry.operatorAvatarUrl())
                && Objects.equals(durable.legalName(), retry.legalName())
                && Objects.equals(durable.registrationNumber(), retry.registrationNumber())
                && Objects.equals(durable.jurisdiction(), retry.jurisdiction())
                && Objects.equals(durable.registeredAddress(), retry.registeredAddress())
                && Objects.equals(durable.website(), retry.website())
                && Objects.equals(
                        durable.verificationContactName(),
                        retry.verificationContactName())
                && Objects.equals(
                        durable.verificationContactRole(),
                        retry.verificationContactRole())
                && Objects.equals(
                        durable.verificationContactEmail(),
                        retry.verificationContactEmail())
                && Objects.equals(durable.authorityAttested(), retry.authorityAttested())
                && Objects.equals(durable.clientTokenHash(), retry.clientTokenHash())
                && Objects.equals(durable.tokenTtlSeconds(), retry.tokenTtlSeconds())
                && Objects.equals(durable.tokenId(), retry.tokenId())
                && Objects.equals(durable.linkId(), retry.linkId())
                && Objects.equals(durable.payloadHash(), retry.payloadHash())
                && Objects.equals(durable.receipt(), retry.receipt());
    }

    public Path statePath() {
        return statePath;
    }

    public synchronized boolean hasArchivedBinding(LocalState state) {
        if (!Files.exists(bindingArchiveDirectory, LinkOption.NOFOLLOW_LINKS)) {
            return false;
        }
        requirePrivateDirectory(bindingArchiveDirectory, "registry binding archives");
        try (var entries = Files.newDirectoryStream(bindingArchiveDirectory, "binding-*")) {
            for (Path entry : entries) {
                requirePrivateDirectory(entry, "registry binding archive");
                BindingArchiveManifest manifest = loadArchiveManifest(entry);
                if (Objects.equals(state.deploymentId(), manifest.deploymentId())
                        && Objects.equals(state.registryScope(), manifest.registryScope())
                        && Objects.equals(state.trustedRegistryKeyFingerprint(),
                                manifest.registryPublicKeyFingerprint())) {
                    return true;
                }
            }
            return false;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to inspect archived registry bindings.", exception);
        }
    }

    /**
     * Moves the active registry binding out of the enrollment path after a
     * signed deployment-deactivation receipt has been durably stored.
     *
     * <p>The deployment key pair is deliberately outside this store and is not
     * touched. The signed state and every receipt remain available beneath the
     * private archive directory, while a later enrollment starts with a fresh
     * scope, registration idempotency key, and installation idempotency key.</p>
     */
    public synchronized BindingArchive archiveActiveBinding(
            BindingArchiveRequest request) {
        Objects.requireNonNull(request, "Registry binding archive request must not be null.");
        requireWritableStateDirectory();
        LocalState state = load().orElseThrow(() -> new IllegalStateException(
                "Registered local state is missing; the active registry binding was not archived."));
        BindingArchiveManifest manifest = archiveManifest(request, state);
        requireDurableDeactivation(state, manifest);
        Path archiveRoot = ensurePrivateDirectory(
                bindingArchiveDirectory,
                "registry binding archive");
        Path archivePath = archivePath(archiveRoot, manifest.archiveId());
        if (Files.exists(archivePath, LinkOption.NOFOLLOW_LINKS)) {
            requirePrivateDirectory(archivePath, "registry binding archive entry");
            BindingArchiveManifest existing = loadArchiveManifest(archivePath);
            requireSameArchivedBinding(existing, manifest);
            manifest = existing;
        } else {
            createBindingArchive(archiveRoot, archivePath, manifest);
        }
        clearActiveBindingFiles(archivePath);
        return new BindingArchive(
                manifest.archiveId(),
                manifest.deploymentId(),
                manifest.registryScope(),
                archivePath);
    }

    /**
     * Restores an archived binding without removing its historical copy.
     *
     * <p>This is a narrow compensation hook for a settings persistence failure
     * after the filesystem archive completed. It refuses to overwrite a
     * different active binding.</p>
     */
    public synchronized void restoreActiveBinding(String suppliedArchiveId) {
        requireWritableStateDirectory();
        String archiveId = RegistryProtocol.requireOperatorActionId(
                suppliedArchiveId);
        Path archivePath = archivePath(
                ensurePrivateDirectory(
                        bindingArchiveDirectory,
                        "registry binding archive"),
                archiveId);
        requirePrivateDirectory(archivePath, "registry binding archive entry");
        loadArchiveManifest(archivePath);
        restoreActiveBindingFiles(archivePath);
    }

    private BindingArchiveManifest archiveManifest(
            BindingArchiveRequest request,
            LocalState state) {
        RegistryProtocol.OperatorActionReceipt receipt =
                Objects.requireNonNull(
                        request.deactivationReceipt(),
                        "Signed deployment-deactivation receipt must not be null.");
        String archiveId = RegistryProtocol.requireOperatorActionId(
                receipt.actionId());
        String deploymentId = RegistryProtocol.requireDeploymentId(
                request.deploymentId());
        String registryScope = RegistryProtocol.requireRegistryScope(
                request.registryScope());
        String registryKeyId = RegistryProtocol.requireRegistryKeyId(
                request.registryKeyId());
        String registryFingerprint = RegistryProtocol.requireHash(
                request.registryPublicKeyFingerprint(),
                "archived registry public-key fingerprint");
        RegistryProtocol.requireUtcTimestamp(
                request.archivedAt(),
                "binding archived_at");
        RegistryProtocol.requireUtcTimestamp(
                receipt.acceptedAt(),
                "deployment deactivation accepted_at");
        if (!RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT.equals(
                        receipt.action())
                || !deploymentId.equals(receipt.deploymentId())
                || !deploymentId.equals(receipt.subjectDeploymentId())
                || !registryScope.equals(receipt.registryScope())
                || !registryKeyId.equals(receipt.registryKeyId())
                || !deploymentId.equals(state.deploymentId())
                || !registryScope.equals(state.registryScope())
                || !registryFingerprint.equals(
                        state.trustedRegistryKeyFingerprint())) {
            throw new IllegalStateException(
                    "Signed deployment deactivation does not match the active local registry binding.");
        }
        return new BindingArchiveManifest(
                BINDING_ARCHIVE_SCHEMA_VERSION,
                archiveId,
                requireArchiveText(request.registryBaseUrl(), "registry base URL", 2_048),
                registryScope,
                registryKeyId,
                registryFingerprint,
                deploymentId,
                receipt.auditIndex(),
                RegistryProtocol.requireHash(
                        receipt.auditHash(),
                        "deployment deactivation audit hash"),
                receipt.acceptedAt(),
                request.archivedAt(),
                requireArchiveText(request.archivedBy(), "archive actor", 512));
    }

    private void requireDurableDeactivation(
            LocalState state,
            BindingArchiveManifest manifest) {
        OperatorActionJournalEntry deactivation = loadOperatorActionJournal().stream()
                .filter(entry -> entry.receipt() != null
                        && manifest.archiveId().equals(
                                entry.receipt().actionId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Signed deployment-deactivation receipt is not durably stored."));
        RegistryProtocol.OperatorActionReceipt receipt =
                deactivation.receipt();
        if (!RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT.equals(
                        deactivation.action())
                || !RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT.equals(
                        receipt.action())
                || !state.registryScope().equals(
                        deactivation.registryScope())
                || !state.deploymentId().equals(
                        deactivation.deploymentId())
                || !state.deploymentId().equals(
                        receipt.deploymentId())
                || !state.deploymentId().equals(
                        receipt.subjectDeploymentId())) {
            throw new IllegalStateException(
                    "Durable deployment-deactivation receipt does not match the active binding.");
        }
    }

    private void createBindingArchive(
            Path archiveRoot,
            Path archivePath,
            BindingArchiveManifest manifest) {
        Path staging = null;
        try {
            staging = Files.createTempDirectory(
                    archiveRoot,
                    "." + archivePath.getFileName() + ".");
            setPosixPermissions(staging, DIRECTORY_PERMISSIONS);
            Path archivedReceipts = Files.createDirectory(
                    staging.resolve("receipts"));
            setPosixPermissions(archivedReceipts, DIRECTORY_PERMISSIONS);
            copyPrivateFile(
                    statePath,
                    staging.resolve(statePath.getFileName()));
            for (Path receipt : receiptFiles(receiptDirectory)) {
                copyPrivateFile(
                        receipt,
                        archivedReceipts.resolve(receipt.getFileName()));
            }
            byte[] archiveJson = objectMapper.writeValueAsString(manifest)
                    .getBytes(StandardCharsets.UTF_8);
            atomicCreate(
                    staging.resolve("archive-manifest.json"),
                    archiveJson);
            forceDirectory(archivedReceipts);
            forceDirectory(staging);
            try {
                Files.move(
                        staging,
                        archivePath,
                        StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException exception) {
                throw new IOException(
                        "Atomic registry binding archival is not supported for "
                                + archivePath
                                + ".",
                        exception);
            }
            staging = null;
            forceDirectory(archiveRoot);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to preserve the active registry binding in "
                            + archivePath
                            + ".",
                    exception);
        } finally {
            deleteArchiveStaging(staging, archiveRoot);
        }
    }

    private void clearActiveBindingFiles(Path archivePath) {
        Path archivedState = archivePath.resolve(statePath.getFileName());
        Path archivedReceipts = archivePath.resolve("receipts");
        try {
            requireMatchingFile(
                    statePath,
                    archivedState,
                    "active registry state");
            List<Path> activeReceipts = receiptFiles(receiptDirectory);
            for (Path receipt : activeReceipts) {
                requireMatchingFile(
                        receipt,
                        archivedReceipts.resolve(receipt.getFileName()),
                        "active registry receipt");
            }
            for (Path receipt : activeReceipts) {
                Files.delete(receipt);
            }
            Files.delete(statePath);
            forceDirectory(receiptDirectory);
            forceDirectory(stateDirectory);
        } catch (IOException | RuntimeException exception) {
            try {
                restoreActiveBindingFiles(archivePath);
            } catch (RuntimeException restoreFailure) {
                exception.addSuppressed(restoreFailure);
            }
            throw new IllegalStateException(
                    "Unable to clear the archived active registry binding.",
                    exception);
        }
    }

    private void restoreActiveBindingFiles(Path archivePath) {
        Path archivedState = archivePath.resolve(statePath.getFileName());
        Path archivedReceipts = archivePath.resolve("receipts");
        requireRegularNonSymlink(archivedState, "archived registry state");
        requirePrivateDirectory(archivedReceipts, "archived registry receipts");
        try {
            restorePrivateFile(archivedState, statePath);
            for (Path archivedReceipt : receiptFiles(archivedReceipts)) {
                restorePrivateFile(
                        archivedReceipt,
                        receiptDirectory.resolve(
                                archivedReceipt.getFileName()));
            }
            forceDirectory(receiptDirectory);
            forceDirectory(stateDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to restore the active registry binding from "
                            + archivePath
                            + ".",
                    exception);
        }
    }

    private void restorePrivateFile(Path archived, Path active)
            throws IOException {
        if (Files.exists(active, LinkOption.NOFOLLOW_LINKS)) {
            requireMatchingFile(active, archived, "restored registry file");
            return;
        }
        copyPrivateFile(archived, active);
    }

    private void copyPrivateFile(Path source, Path target)
            throws IOException {
        requireRegularNonSymlink(source, "registry archive source");
        atomicCreate(target, readLimited(source, MAX_STATE_BYTES));
    }

    private void requireMatchingFile(
            Path active,
            Path archived,
            String label) throws IOException {
        requireRegularNonSymlink(active, label);
        requireRegularNonSymlink(archived, "archived " + label);
        if (Files.mismatch(active, archived) != -1L) {
            throw new IllegalStateException(
                    label + " differs from its preserved archive.");
        }
    }

    private List<Path> receiptFiles(Path directory)
            throws IOException {
        requirePrivateDirectory(directory, "registry receipt directory");
        List<Path> files = new ArrayList<>();
        try (var paths = Files.newDirectoryStream(directory)) {
            for (Path path : paths) {
                requireRegularNonSymlink(
                        path,
                        "registry receipt archive source");
                files.add(path);
            }
        }
        files.sort(Comparator.comparing(
                path -> path.getFileName().toString()));
        return List.copyOf(files);
    }

    private Path ensurePrivateDirectory(Path directory, String label) {
        try {
            if (!Files.exists(directory, LinkOption.NOFOLLOW_LINKS)) {
                Files.createDirectory(directory);
            }
            requirePrivateDirectory(directory, label);
            return directory;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to prepare " + label + " at " + directory + ".",
                    exception);
        }
    }

    private void requirePrivateDirectory(Path directory, String label) {
        if (!Files.exists(directory, LinkOption.NOFOLLOW_LINKS)
                || Files.isSymbolicLink(directory)
                || !Files.isDirectory(
                        directory,
                        LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    label + " must be a private non-symlink directory: "
                            + directory);
        }
        try {
            setPosixPermissions(directory, DIRECTORY_PERMISSIONS);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to enforce private permissions for "
                            + label
                            + ": "
                            + directory,
                    exception);
        }
    }

    private Path archivePath(Path archiveRoot, String suppliedArchiveId) {
        String archiveId = RegistryProtocol.requireOperatorActionId(
                suppliedArchiveId);
        Path archivePath = archiveRoot
                .resolve("binding-" + archiveId)
                .normalize();
        if (!archivePath.getParent().equals(archiveRoot)) {
            throw new IllegalArgumentException(
                    "Registry binding archive path escaped its directory.");
        }
        return archivePath;
    }

    private BindingArchiveManifest loadArchiveManifest(Path archivePath) {
        Path manifestPath = archivePath
                .resolve("archive-manifest.json")
                .normalize();
        if (!manifestPath.getParent().equals(archivePath)) {
            throw new IllegalArgumentException(
                    "Registry binding archive manifest escaped its directory.");
        }
        requireRegularNonSymlink(
                manifestPath,
                "registry binding archive manifest");
        try {
            BindingArchiveManifest manifest = objectMapper.readValue(
                    readLimited(manifestPath, MAX_STATE_BYTES),
                    BindingArchiveManifest.class);
            if (manifest == null
                    || manifest.schemaVersion() == null
                    || manifest.schemaVersion()
                            != BINDING_ARCHIVE_SCHEMA_VERSION) {
                throw new IllegalStateException(
                        "Registry binding archive manifest is invalid.");
            }
            return manifest;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to read registry binding archive manifest from "
                            + manifestPath
                            + ".",
                    exception);
        }
    }

    private void requireSameArchivedBinding(
            BindingArchiveManifest existing,
            BindingArchiveManifest supplied) {
        if (!Objects.equals(existing.archiveId(), supplied.archiveId())
                || !Objects.equals(
                        existing.registryBaseUrl(),
                        supplied.registryBaseUrl())
                || !Objects.equals(
                        existing.registryScope(),
                        supplied.registryScope())
                || !Objects.equals(
                        existing.registryKeyId(),
                        supplied.registryKeyId())
                || !Objects.equals(
                        existing.registryPublicKeyFingerprint(),
                        supplied.registryPublicKeyFingerprint())
                || !Objects.equals(
                        existing.deploymentId(),
                        supplied.deploymentId())
                || !Objects.equals(
                        existing.deactivationAuditIndex(),
                        supplied.deactivationAuditIndex())
                || !Objects.equals(
                        existing.deactivationAuditHash(),
                        supplied.deactivationAuditHash())
                || !Objects.equals(
                        existing.deactivatedAt(),
                        supplied.deactivatedAt())) {
            throw new IllegalStateException(
                    "A different registry binding already uses this archive ID.");
        }
    }

    private String requireArchiveText(
            String value,
            String label,
            int maxLength) {
        String normalized = RegistryProtocol.requireCanonical(value, label);
        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException(
                    label + " exceeds " + maxLength + " characters.");
        }
        return normalized;
    }

    private void deleteArchiveStaging(
            Path staging,
            Path archiveRoot) {
        if (staging == null
                || !staging.normalize().getParent().equals(archiveRoot)
                || !Files.exists(staging, LinkOption.NOFOLLOW_LINKS)) {
            return;
        }
        try (Stream<Path> paths = Files.walk(staging)) {
            paths.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                            // A private incomplete staging directory is safer
                            // than deleting outside the resolved archive root.
                        }
                    });
        } catch (IOException ignored) {
            // The completed archive path is never passed to this cleanup.
        }
    }

    private void validateBasicState(LocalState state) {
        if (state == null || state.schemaVersion() == null
                || state.schemaVersion().intValue() != STATE_SCHEMA_VERSION) {
            throw new IllegalArgumentException("Unsupported or missing registry local state schema.");
        }
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(state.protocolVersion())) {
            throw new IllegalArgumentException("Registry local state protocol version is unsupported.");
        }
        RegistryProtocol.requireRegistryScope(state.registryScope());
        RegistryProtocol.requireHash(state.publicKeyFingerprint(), "state public_key_fingerprint");
        RegistryProtocol.requireToken(state.registrationIdempotencyKey(), "state registration_idempotency_key");
        RegistryProtocol.requireCanonical(
                state.registrationSoftwareVersion(),
                "state registration_software_version");
        if (state.registrationSoftwareVersion().length() > 128) {
            throw new IllegalArgumentException("state registration_software_version exceeds 128 characters.");
        }
        RegistryProtocol.requireToken(state.installationIdempotencyKey(), "state installation_idempotency_key");
        RegistryProtocol.requirePeriod(state.installationPeriod());
        RegistryProtocol.requireUtcTimestamp(state.updatedAt(), "state updated_at");
        if (state.trustedRegistryKeyFingerprint() != null) {
            RegistryProtocol.requireHash(
                    state.trustedRegistryKeyFingerprint(),
                    "state trusted_registry_key_fingerprint");
        }
        if (state.deploymentId() != null) {
            RegistryProtocol.requireDeploymentId(state.deploymentId());
        }
        if (state.registration() != null
                && !Objects.equals(state.deploymentId(), state.registration().deploymentId())) {
            throw new IllegalArgumentException("Registry state deployment ID does not match its registration receipt.");
        }
        if (state.registration() != null
                && state.registration().receipt() != null
                && !Objects.equals(state.registryScope(), state.registration().receipt().registryScope())) {
            throw new IllegalArgumentException(
                    "Registry state scope does not match its registration receipt.");
        }
        if (state.installationBatch() != null && state.registration() == null) {
            throw new IllegalArgumentException("Registry state has an installation receipt without registration.");
        }
        if (state.installationBatch() != null
                && (!Objects.equals(state.registryScope(), state.installationBatch().registryScope())
                        || state.installationBatch().receipt() == null
                        || !Objects.equals(
                                state.registryScope(),
                                state.installationBatch().receipt().registryScope()))) {
            throw new IllegalArgumentException(
                    "Registry state scope does not match its installation receipt.");
        }
    }

    private void ensureReceiptDirectory() {
        try {
            if (!Files.exists(receiptDirectory, LinkOption.NOFOLLOW_LINKS)) {
                Files.createDirectory(receiptDirectory);
            }
            if (Files.isSymbolicLink(receiptDirectory)
                    || !Files.isDirectory(receiptDirectory, LinkOption.NOFOLLOW_LINKS)
                    || !Files.isWritable(receiptDirectory)) {
                throw new IllegalStateException(
                        "Registry receipt path must be a writable non-symlink directory: " + receiptDirectory);
            }
            setPosixPermissions(receiptDirectory, DIRECTORY_PERMISSIONS);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to prepare registry receipt directory " + receiptDirectory + ".", exception);
        }
    }

    private void atomicWrite(Path target, byte[] bytes) throws IOException {
        Path parent = Objects.requireNonNull(target.getParent(), "Registry state target must have a parent.");
        Path temporary = Files.createTempFile(parent, "." + target.getFileName() + ".", ".tmp");
        boolean moved = false;
        try {
            setPosixPermissions(temporary, FILE_PERMISSIONS);
            try (FileChannel channel = FileChannel.open(
                    temporary,
                    StandardOpenOption.WRITE,
                    StandardOpenOption.TRUNCATE_EXISTING)) {
                ByteBuffer buffer = ByteBuffer.wrap(bytes);
                while (buffer.hasRemaining()) {
                    channel.write(buffer);
                }
                channel.force(true);
            }
            try {
                Files.move(
                        temporary,
                        target,
                        StandardCopyOption.ATOMIC_MOVE,
                        StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException exception) {
                throw new IOException("Atomic registry state replacement is not supported for " + target + ".", exception);
            }
            moved = true;
            setPosixPermissions(target, FILE_PERMISSIONS);
            forceDirectory(parent);
        } finally {
            if (!moved) {
                Files.deleteIfExists(temporary);
            }
        }
    }

    private void atomicCreate(Path target, byte[] bytes) throws IOException {
        Path parent = Objects.requireNonNull(target.getParent(), "Registry receipt target must have a parent.");
        Path temporary = Files.createTempFile(parent, "." + target.getFileName() + ".", ".tmp");
        boolean moved = false;
        try {
            setPosixPermissions(temporary, FILE_PERMISSIONS);
            try (FileChannel channel = FileChannel.open(
                    temporary,
                    StandardOpenOption.WRITE,
                    StandardOpenOption.TRUNCATE_EXISTING)) {
                ByteBuffer buffer = ByteBuffer.wrap(bytes);
                while (buffer.hasRemaining()) {
                    channel.write(buffer);
                }
                channel.force(true);
            }
            if (Files.exists(target, LinkOption.NOFOLLOW_LINKS)) {
                throw new IOException("Registry receipt already exists: " + target);
            }
            try {
                Files.move(temporary, target, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException exception) {
                throw new IOException("Atomic registry receipt creation is not supported for " + target + ".", exception);
            }
            moved = true;
            setPosixPermissions(target, FILE_PERMISSIONS);
            forceDirectory(parent);
        } finally {
            if (!moved) {
                Files.deleteIfExists(temporary);
            }
        }
    }

    private static void forceDirectory(Path directory) throws IOException {
        try (FileChannel channel = FileChannel.open(directory, StandardOpenOption.READ)) {
            channel.force(true);
        }
    }

    private static byte[] readLimited(Path path, int maxBytes) throws IOException {
        long size = Files.size(path);
        if (size <= 0 || size > maxBytes) {
            throw new IOException("Registry local file has an invalid size: " + path);
        }
        byte[] bytes = Files.readAllBytes(path);
        if (bytes.length > maxBytes) {
            throw new IOException("Registry local file is too large: " + path);
        }
        return bytes;
    }

    private static void requireRegularNonSymlink(Path path, String label) {
        if (Files.isSymbolicLink(path) || !Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(label + " must be a regular non-symlink file: " + path);
        }
        try {
            setPosixPermissions(path, FILE_PERMISSIONS);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to enforce private permissions for " + label + ": " + path,
                    exception);
        }
    }

    private static void setPosixPermissions(
            Path path,
            Set<PosixFilePermission> permissions) throws IOException {
        boolean posixSupported;
        try {
            posixSupported = Files.getFileStore(path)
                    .supportsFileAttributeView("posix");
        } catch (UnsupportedOperationException exception) {
            // Explicitly permit file systems that genuinely expose no POSIX view.
            return;
        }
        if (!posixSupported) {
            // Windows and other non-POSIX development file systems rely on
            // their native ACL model; Linux package targets must pass below.
            return;
        }
        try {
            Files.setPosixFilePermissions(path, permissions);
            Set<PosixFilePermission> actual = Files.getPosixFilePermissions(
                    path,
                    LinkOption.NOFOLLOW_LINKS);
            if (!actual.equals(permissions)) {
                throw new IOException(
                        "POSIX permissions for "
                                + path
                                + " are "
                                + PosixFilePermissions.toString(actual)
                                + ", expected "
                                + PosixFilePermissions.toString(permissions)
                                + ".");
            }
        } catch (UnsupportedOperationException exception) {
            throw new IOException(
                    "File system advertised POSIX permissions but did not enforce them for "
                            + path
                            + ".",
                    exception);
        }
    }

    public record LocalState(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("public_key_fingerprint") String publicKeyFingerprint,
            @JsonProperty("registration_idempotency_key") String registrationIdempotencyKey,
            @JsonProperty("registration_software_version") String registrationSoftwareVersion,
            @JsonProperty("installation_idempotency_key") String installationIdempotencyKey,
            @JsonProperty("installation_period") String installationPeriod,
            @JsonProperty("trusted_registry_key_fingerprint") String trustedRegistryKeyFingerprint,
            @JsonProperty("deployment_id") String deploymentId,
            RegistrationProtocolState registration,
            @JsonProperty("installation_batch") RegistryProtocol.BatchResponse installationBatch,
            @JsonProperty("updated_at") String updatedAt) {

        public LocalState withRegistration(
                RegistryProtocol.RegistrationResponse response,
                String trustedFingerprint,
                Instant now) {
            return new LocalState(
                    schemaVersion,
                    protocolVersion,
                    registryScope,
                    publicKeyFingerprint,
                    registrationIdempotencyKey,
                    registrationSoftwareVersion,
                    installationIdempotencyKey,
                    installationPeriod,
                    trustedFingerprint,
                    response.deploymentId(),
                    new RegistrationProtocolState(response),
                    installationBatch,
                    now.toString());
        }

        public LocalState withInstallationBatch(
                RegistryProtocol.BatchResponse response,
                Instant now) {
            return new LocalState(
                    schemaVersion,
                    protocolVersion,
                    registryScope,
                    publicKeyFingerprint,
                    registrationIdempotencyKey,
                    registrationSoftwareVersion,
                    installationIdempotencyKey,
                    installationPeriod,
                    trustedRegistryKeyFingerprint,
                    deploymentId,
                    registration,
                    response,
                    now.toString());
        }
    }

    public record RegistrationProtocolState(
            RegistryProtocol.RegistrationResponse receipt) {
        public String deploymentId() {
            return receipt == null ? null : receipt.deploymentId();
        }
    }

    public record OperatorActionJournalEntry(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("request_timestamp") String requestTimestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String action,
            @JsonProperty("operator_name") String operatorName,
            @JsonProperty("operator_avatar_url") String operatorAvatarUrl,
            @JsonProperty("legal_name") String legalName,
            @JsonProperty("registration_number") String registrationNumber,
            String jurisdiction,
            @JsonProperty("registered_address") String registeredAddress,
            String website,
            @JsonProperty("verification_contact_name") String verificationContactName,
            @JsonProperty("verification_contact_role") String verificationContactRole,
            @JsonProperty("verification_contact_email") String verificationContactEmail,
            @JsonProperty("authority_attested") Boolean authorityAttested,
            @JsonProperty("client_token_hash") String clientTokenHash,
            @JsonProperty("token_ttl_seconds") Long tokenTtlSeconds,
            @JsonProperty("token_id") String tokenId,
            @JsonProperty("link_id") String linkId,
            @JsonProperty("payload_hash") String payloadHash,
            @JsonProperty("request_signature") String requestSignature,
            RegistryProtocol.OperatorActionReceipt receipt) {
    }

    public record OperatorClaimStatusEvidence(
            @JsonProperty("schema_version") Integer schemaVersion,
            RegistryProtocol.OperatorClaimStatusReceipt status) {
    }

    public record BindingArchiveRequest(
            String registryBaseUrl,
            String registryScope,
            String registryKeyId,
            String registryPublicKeyFingerprint,
            String deploymentId,
            RegistryProtocol.OperatorActionReceipt deactivationReceipt,
            String archivedAt,
            String archivedBy) {
    }

    public record BindingArchive(
            String archiveId,
            String deploymentId,
            String registryScope,
            Path archiveDirectory) {
    }

    public record BindingArchiveManifest(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("archive_id") String archiveId,
            @JsonProperty("registry_base_url") String registryBaseUrl,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key_fingerprint")
            String registryPublicKeyFingerprint,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("deactivation_audit_index")
            Long deactivationAuditIndex,
            @JsonProperty("deactivation_audit_hash")
            String deactivationAuditHash,
            @JsonProperty("deactivated_at") String deactivatedAt,
            @JsonProperty("archived_at") String archivedAt,
            @JsonProperty("archived_by") String archivedBy) {
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
