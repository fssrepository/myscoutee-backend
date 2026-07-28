package com.raxim.myscoutee.registry;

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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;

import tools.jackson.databind.ObjectMapper;

public final class RegistryLocalStore {
    private static final int STATE_SCHEMA_VERSION = 1;
    private static final int MAX_STATE_BYTES = 1_048_576;
    private static final Set<PosixFilePermission> DIRECTORY_PERMISSIONS =
            PosixFilePermissions.fromString("rwx------");
    private static final Set<PosixFilePermission> FILE_PERMISSIONS =
            PosixFilePermissions.fromString("rw-------");

    private final ObjectMapper objectMapper;
    private final Path stateDirectory;
    private final Path statePath;
    private final Path receiptDirectory;

    public RegistryLocalStore(RegistryProperties properties, ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "ObjectMapper must not be null.");
        this.stateDirectory = properties.getStateDir().toAbsolutePath().normalize();
        this.statePath = properties.statePath().toAbsolutePath().normalize();
        this.receiptDirectory = properties.receiptDirectory().toAbsolutePath().normalize();
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
        setPosixPermissions(stateDirectory, DIRECTORY_PERMISSIONS);
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
                if (!Arrays.equals(existing, json)) {
                    throw new IllegalStateException(
                            "A different operator receipt already exists for " + actionId + ".");
                }
                return receiptPath;
            }
            atomicCreate(receiptPath, json);
            return receiptPath;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to persist registry operator receipt to " + receiptPath + ".",
                    exception);
        }
    }

    public Path statePath() {
        return statePath;
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
    }

    private static void setPosixPermissions(Path path, Set<PosixFilePermission> permissions) {
        try {
            Files.setPosixFilePermissions(path, permissions);
        } catch (UnsupportedOperationException | IOException ignored) {
            // POSIX permissions are enforced on the Linux package target. Tests may use another file system.
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
            @JsonProperty("client_token_hash") String clientTokenHash,
            @JsonProperty("token_ttl_seconds") Long tokenTtlSeconds,
            @JsonProperty("token_id") String tokenId,
            @JsonProperty("link_id") String linkId,
            @JsonProperty("payload_hash") String payloadHash,
            @JsonProperty("request_signature") String requestSignature,
            RegistryProtocol.OperatorActionReceipt receipt) {
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
