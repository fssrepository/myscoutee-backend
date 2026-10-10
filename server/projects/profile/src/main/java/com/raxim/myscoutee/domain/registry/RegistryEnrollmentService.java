package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

import java.security.PublicKey;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.MauReceipt;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistrationRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistrationResponse;

import tools.jackson.databind.ObjectMapper;

/**
 * Low-level, one-shot signed enrollment operation.
 *
 * <p>This class is deliberately not a Spring component and has no lifecycle or
 * scheduler annotations. The authenticated operator workflow is the only
 * automatic control plane and constructs this operation with the
 * operator-confirmed, per-mode settings. Keeping this type directly
 * constructible also preserves the packaged recovery helper and protocol
 * integration tests.</p>
 */
public class RegistryEnrollmentService {
    private static final Logger LOGGER = LoggerFactory.getLogger(RegistryEnrollmentService.class);

    private final RegistryConfiguration properties;
    private final RegistryLocalStore localStore;
    private final RegistryHttpClient httpClient;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean attemptRunning = new AtomicBoolean();
    private volatile boolean completionLogged;

    public RegistryEnrollmentService(
            RegistryConfiguration properties,
            ObjectMapper objectMapper) {
        this(
                properties,
                new RegistryLocalStore(properties, objectMapper),
                new RegistryHttpClient(properties, objectMapper),
                Clock.systemUTC(),
                new SecureRandom());
    }

    RegistryEnrollmentService(
            RegistryConfiguration properties,
            RegistryLocalStore localStore,
            RegistryHttpClient httpClient,
            Clock clock,
            SecureRandom secureRandom) {
        this.properties = Objects.requireNonNull(properties, "Registry properties must not be null.");
        this.localStore = Objects.requireNonNull(localStore, "Registry local store must not be null.");
        this.httpClient = Objects.requireNonNull(httpClient, "Registry HTTP client must not be null.");
        this.clock = Objects.requireNonNull(clock, "Clock must not be null.");
        this.secureRandom = Objects.requireNonNull(secureRandom, "SecureRandom must not be null.");
    }

    /**
     * Manual recovery hook retained for callers outside the Spring lifecycle.
     */
    public void attemptWhenApplicationIsReady() {
        if (!properties.isActive()) {
            return;
        }
        Thread.ofVirtual()
                .name("myscoutee-registry-initial-sync")
                .start(this::attemptSafely);
    }

    /**
     * Manual recovery hook retained for callers outside the Spring scheduler.
     */
    public void retryIncompleteEnrollment() {
        if (!properties.isActive()) {
            return;
        }
        Thread.ofVirtual()
                .name("myscoutee-registry-retry")
                .start(this::attemptSafely);
    }

    public SyncResult synchronizeNow() {
        if (!properties.isActive()) {
            return new SyncResult(false, false, null, null, false);
        }
        validateActiveConfiguration();
        RegistryCrypto deploymentCrypto = RegistryCrypto.load(properties);
        Instant now = clock.instant();
        String configuredRegistryScope = RegistryProtocol.requireRegistryScope(
                properties.getRegistryScope());
        LocalState state = localStore.load()
                .orElseGet(() -> localStore.createInitial(
                        deploymentCrypto.deploymentPublicKeyFingerprint(),
                        configuredRegistryScope,
                        stableSoftwareVersion(),
                        secureRandom,
                        now));
        requireMatchingDeploymentKey(state, deploymentCrypto);
        requireMatchingConfiguredScope(state, configuredRegistryScope);

        TrustedRegistry trustedRegistry;
        boolean registrationDuplicate;
        if (state.registration() == null) {
            RegistrationRequest request = registrationRequest(state, deploymentCrypto, clock.instant());
            RegistrationResponse response = httpClient.register(request);
            trustedRegistry = verifyRegistrationResponse(state, deploymentCrypto, response);
            registrationDuplicate = Boolean.TRUE.equals(response.duplicate());
            state = state.withRegistration(response, trustedRegistry.fingerprint(), clock.instant());
            localStore.save(state);
        } else {
            registrationDuplicate = true;
            trustedRegistry = verifyRegistrationResponse(
                    state,
                    deploymentCrypto,
                    state.registration().receipt());
        }

        if (state.installationBatch() == null) {
            BatchRequest request = installationBatchRequest(state, deploymentCrypto, clock.instant());
            BatchResponse response = httpClient.submitInstallationBatch(request);
            verifyBatchResponse(state, trustedRegistry, request.payloadHash(), response);
            localStore.saveInstallationReceipt(response);
            state = state.withInstallationBatch(response, clock.instant());
            localStore.save(state);
        } else {
            String expectedBatchHash = installationBatchPayloadHash(state);
            verifyBatchResponse(state, trustedRegistry, expectedBatchHash, state.installationBatch());
            Optional<BatchResponse> storedReceipt = localStore.loadInstallationReceipt(
                    state.installationBatch().batchId());
            if (storedReceipt.isEmpty()) {
                localStore.saveInstallationReceipt(state.installationBatch());
            } else {
                verifyBatchResponse(state, trustedRegistry, expectedBatchHash, storedReceipt.get());
                if (!storedReceipt.get().equals(state.installationBatch())) {
                    throw new IllegalStateException(
                            "Registry state and persisted installation receipt do not match.");
                }
            }
        }

        return new SyncResult(
                true,
                true,
                state.deploymentId(),
                state.installationBatch().batchId(),
                registrationDuplicate);
    }

    private void attemptSafely() {
        if (!properties.isActive() || !attemptRunning.compareAndSet(false, true)) {
            return;
        }
        try {
            SyncResult result = synchronizeNow();
            if (result.completed() && !completionLogged) {
                completionLogged = true;
                LOGGER.info(
                        "Registry deployment enrollment completed for deployment {} with installation batch {}; "
                                + "signed state is stored at {}.",
                        result.deploymentId(),
                        result.batchId(),
                        localStore.statePath());
            }
        } catch (Exception exception) {
            completionLogged = false;
            LOGGER.warn(
                    "Registry enrollment is incomplete; the local application remains available and will retry: {}",
                    safeMessage(exception));
            LOGGER.debug("Registry enrollment attempt failed.", exception);
        } finally {
            attemptRunning.set(false);
        }
    }

    private RegistrationRequest registrationRequest(
            LocalState state,
            RegistryCrypto deploymentCrypto,
            Instant now) {
        String timestamp = now.toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        String publicKey = deploymentCrypto.deploymentPublicKeyBase64();
        String payloadHash = CanonicalValues.sha256(RegistryProtocol.registrationPayload(
                RegistryProtocol.KEY_ALGORITHM,
                publicKey,
                state.registrationSoftwareVersion()));
        String signature = deploymentCrypto.signBase64(RegistryProtocol.signedRequest(
                "POST",
                RegistryProtocol.REGISTRATION_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                state.registryScope(),
                deploymentCrypto.deploymentPublicKeyFingerprint(),
                timestamp,
                nonce,
                state.registrationIdempotencyKey(),
                payloadHash));
        return new RegistrationRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                state.registryScope(),
                timestamp,
                nonce,
                state.registrationIdempotencyKey(),
                RegistryProtocol.KEY_ALGORITHM,
                publicKey,
                state.registrationSoftwareVersion(),
                payloadHash,
                signature);
    }

    private BatchRequest installationBatchRequest(
            LocalState state,
            RegistryCrypto deploymentCrypto,
            Instant now) {
        String timestamp = now.toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        String commitmentHash = CanonicalValues.sha256(RegistryProtocol.installationCommitment(
                state.deploymentId(),
                state.installationIdempotencyKey()));
        String payloadHash = CanonicalValues.sha256(RegistryProtocol.mauBatchPayload(
                RegistryProtocol.INSTALLATION_KIND,
                state.installationPeriod(),
                RegistryProtocol.INSTALLATION_RULESET,
                RegistryProtocol.INSTALLATION_MAU_COUNT,
                commitmentHash));
        String signature = deploymentCrypto.signBase64(RegistryProtocol.signedRequest(
                "POST",
                RegistryProtocol.MAU_BATCH_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                state.registryScope(),
                state.deploymentId(),
                timestamp,
                nonce,
                state.installationIdempotencyKey(),
                payloadHash));
        return new BatchRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                state.registryScope(),
                state.deploymentId(),
                timestamp,
                nonce,
                state.installationIdempotencyKey(),
                RegistryProtocol.INSTALLATION_KIND,
                state.installationPeriod(),
                RegistryProtocol.INSTALLATION_RULESET,
                RegistryProtocol.INSTALLATION_MAU_COUNT,
                commitmentHash,
                payloadHash,
                signature);
    }

    private TrustedRegistry verifyRegistrationResponse(
            LocalState state,
            RegistryCrypto deploymentCrypto,
            RegistrationResponse response) {
        if (response == null) {
            throw new IllegalArgumentException("Registry registration response is missing.");
        }
        requireProtocolVersion(response.protocolVersion());
        requireMatchingResponseScope(state, response.registryScope(), "registration response");
        RegistryProtocol.requireDeploymentId(response.deploymentId());
        CanonicalValues.requireUtcTimestamp(response.registeredAt(), "registered_at");
        CanonicalValues.requireHash(response.publicKeyFingerprint(), "public_key_fingerprint");
        if (!deploymentCrypto.deploymentPublicKeyFingerprint().equals(response.publicKeyFingerprint())) {
            throw new IllegalArgumentException(
                    "Registry registration receipt does not match the local deployment public key.");
        }
        if (response.duplicate() == null) {
            throw new IllegalArgumentException("Registry registration duplicate flag is missing.");
        }

        PublicKey registryPublicKey = com.raxim.myscoutee.domain.registry.api.RegistryProtocol.parseRegistryPublicKey(response.registryPublicKey());
        String registryFingerprint = CanonicalValues.publicKeyFingerprint(registryPublicKey.getEncoded());
        String derivedRegistryKeyId = RegistryProtocol.registryKeyId(registryFingerprint);
        RegistryProtocol.requireRegistryKeyId(response.registryKeyId());
        if (!derivedRegistryKeyId.equals(response.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry key ID does not match the supplied registry public key.");
        }
        enforceRegistryTrust(state, registryFingerprint);
        if (!com.raxim.myscoutee.common.security.crypto.Ed25519Signatures.verifyBase64(
                registryPublicKey,
                RegistryProtocol.registrationReceipt(response),
                response.receiptSignature())) {
            throw new IllegalArgumentException("Registry registration receipt signature is invalid.");
        }
        return new TrustedRegistry(
                registryPublicKey,
                response.registryPublicKey(),
                registryFingerprint,
                response.registryKeyId());
    }

    private void verifyBatchResponse(
            LocalState state,
            TrustedRegistry trustedRegistry,
            String expectedBatchHash,
            BatchResponse response) {
        if (response == null || response.receipt() == null) {
            throw new IllegalArgumentException("Registry installation batch receipt is missing.");
        }
        requireProtocolVersion(response.protocolVersion());
        requireMatchingResponseScope(state, response.registryScope(), "batch response");
        RegistryProtocol.requireBatchId(response.batchId());
        if (!Objects.equals(state.deploymentId(), response.deploymentId())) {
            throw new IllegalArgumentException("Registry batch receipt deployment ID does not match local state.");
        }
        if (!Objects.equals(state.installationIdempotencyKey(), response.idempotencyKey())) {
            throw new IllegalArgumentException("Registry batch response changed the installation idempotency key.");
        }
        if (response.duplicate() == null) {
            throw new IllegalArgumentException("Registry batch duplicate flag is missing.");
        }

        MauReceipt receipt = response.receipt();
        requireMatchingResponseScope(state, receipt.registryScope(), "MAU receipt");
        long ledgerIndex = requirePositive(receipt.ledgerIndex(), "ledger_index");
        long qualifiedMauCount = requireNonNegative(
                receipt.qualifiedMauCount(),
                "qualified_mau_count");
        if (qualifiedMauCount != RegistryProtocol.INSTALLATION_MAU_COUNT
                || !RegistryProtocol.INSTALLATION_KIND.equals(receipt.kind())
                || !RegistryProtocol.INSTALLATION_RULESET.equals(receipt.rulesetVersion())
                || !state.installationPeriod().equals(receipt.period())) {
            throw new IllegalArgumentException(
                    "Registry receipt is not the requested non-accounting installation test.");
        }
        RegistryProtocol.requirePeriod(receipt.period());
        CanonicalValues.requireHash(receipt.batchHash(), "batch_hash");
        CanonicalValues.requireHash(receipt.entryHash(), "entry_hash");
        CanonicalValues.requireHash(receipt.previousEntryHash(), "previous_entry_hash");
        if (!RegistryProtocol.hashEquals(expectedBatchHash, receipt.batchHash())) {
            throw new IllegalArgumentException("Registry receipt batch hash does not match the submitted payload.");
        }

        Instant acceptedAt = CanonicalValues.requireUtcTimestamp(receipt.acceptedAt(), "accepted_at");
        RegistryProtocol.requireCheckpointDate(receipt.checkpointDate());
        if (!RegistryProtocol.checkpointDateAt(acceptedAt).equals(receipt.checkpointDate())) {
            throw new IllegalArgumentException(
                    "Registry receipt checkpoint date does not match its UTC acceptance date.");
        }
        if (!trustedRegistry.keyId().equals(receipt.registryKeyId())
                || !trustedRegistry.publicKeyBase64().equals(receipt.registryPublicKey())) {
            throw new IllegalArgumentException(
                    "Registry receipt signing key differs from the trusted registration key.");
        }

        String expectedEntryHash = CanonicalValues.sha256(RegistryProtocol.ledgerEntry(
                RegistryProtocol.PROTOCOL_VERSION,
                state.registryScope(),
                ledgerIndex,
                RegistryProtocol.INSTALLATION_ENTRY_TYPE,
                state.deploymentId(),
                response.batchId(),
                receipt.kind(),
                receipt.period(),
                receipt.rulesetVersion(),
                qualifiedMauCount,
                receipt.batchHash(),
                receipt.previousEntryHash(),
                receipt.acceptedAt()));
        if (!RegistryProtocol.hashEquals(expectedEntryHash, receipt.entryHash())) {
            throw new IllegalArgumentException("Registry receipt ledger entry hash is invalid.");
        }
        if (!com.raxim.myscoutee.common.security.crypto.Ed25519Signatures.verifyBase64(
                trustedRegistry.publicKey(),
                RegistryProtocol.mauReceipt(response),
                receipt.signature())) {
            throw new IllegalArgumentException("Registry MAU receipt signature is invalid.");
        }
    }

    private String installationBatchPayloadHash(LocalState state) {
        String commitmentHash = CanonicalValues.sha256(RegistryProtocol.installationCommitment(
                state.deploymentId(),
                state.installationIdempotencyKey()));
        return CanonicalValues.sha256(RegistryProtocol.mauBatchPayload(
                RegistryProtocol.INSTALLATION_KIND,
                state.installationPeriod(),
                RegistryProtocol.INSTALLATION_RULESET,
                RegistryProtocol.INSTALLATION_MAU_COUNT,
                commitmentHash));
    }

    private void enforceRegistryTrust(LocalState state, String responseFingerprint) {
        String configuredFingerprint = safeText(properties.getExpectedRegistryKeyFingerprint());
        if (StringUtils.hasText(configuredFingerprint)) {
            CanonicalValues.requireHash(
                    configuredFingerprint,
                    "configured registry public-key fingerprint");
            if (!configuredFingerprint.equals(responseFingerprint)) {
                throw new IllegalArgumentException(
                        "Registry public key does not match REGISTRY_EXPECTED_KEY_FINGERPRINT.");
            }
        }
        String storedFingerprint = safeText(state.trustedRegistryKeyFingerprint());
        if (StringUtils.hasText(storedFingerprint) && !storedFingerprint.equals(responseFingerprint)) {
            throw new IllegalArgumentException(
                    "Registry public key changed from the locally trusted key.");
        }
        if (!StringUtils.hasText(configuredFingerprint)
                && !StringUtils.hasText(storedFingerprint)
                && !properties.isTrustOnFirstUse()) {
            throw new IllegalStateException(
                    "Registry trust is not configured; set REGISTRY_EXPECTED_KEY_FINGERPRINT "
                            + "or explicitly enable REGISTRY_TRUST_ON_FIRST_USE.");
        }
    }

    private void validateActiveConfiguration() {
        httpClient.endpoint(RegistryProtocol.REGISTRATION_PATH);
        RegistryProtocol.requireRegistryScope(properties.getRegistryScope());
        if (properties.getPrivateKeyPath() == null || properties.getPublicKeyPath() == null) {
            throw new IllegalStateException("Registry deployment key paths must be configured.");
        }
        if (properties.getStateDir() == null) {
            throw new IllegalStateException("REGISTRY_STATE_DIR must be configured.");
        }
    }

    private void requireMatchingDeploymentKey(LocalState state, RegistryCrypto deploymentCrypto) {
        if (!deploymentCrypto.deploymentPublicKeyFingerprint().equals(state.publicKeyFingerprint())) {
            throw new IllegalStateException(
                    "Registry deployment key differs from persisted state; refusing silent identity rotation.");
        }
    }

    private void requireMatchingConfiguredScope(LocalState state, String configuredRegistryScope) {
        if (!configuredRegistryScope.equals(state.registryScope())) {
            throw new IllegalStateException(
                    "Configured registry scope differs from persisted deployment state; "
                            + "refusing silent parent or accounting-domain change.");
        }
    }

    private void requireMatchingResponseScope(LocalState state, String responseScope, String label) {
        RegistryProtocol.requireRegistryScope(responseScope);
        if (!state.registryScope().equals(responseScope)) {
            throw new IllegalArgumentException(
                    "Registry " + label + " scope does not match the persisted deployment scope.");
        }
    }

    private String stableSoftwareVersion() {
        String version = safeText(properties.getSoftwareVersion());
        return StringUtils.hasText(version) ? version : "unknown";
    }

    private void requireProtocolVersion(String protocolVersion) {
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(protocolVersion)) {
            throw new IllegalArgumentException("Registry response protocol version is unsupported.");
        }
    }

    private long requirePositive(Long value, String fieldName) {
        if (value == null || value.longValue() <= 0L) {
            throw new IllegalArgumentException(fieldName + " must be positive.");
        }
        return value.longValue();
    }

    private long requireNonNegative(Long value, String fieldName) {
        if (value == null || value.longValue() < 0L) {
            throw new IllegalArgumentException(fieldName + " must be non-negative.");
        }
        return value.longValue();
    }

    private String safeMessage(Exception exception) {
        String message = exception == null ? "" : safeText(exception.getMessage());
        return StringUtils.hasText(message) ? message : exception.getClass().getSimpleName();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record TrustedRegistry(
            PublicKey publicKey,
            String publicKeyBase64,
            String fingerprint,
            String keyId) {
    }

    public record SyncResult(
            boolean active,
            boolean completed,
            String deploymentId,
            String batchId,
            boolean registrationDuplicate) {
    }
}
