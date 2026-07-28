package com.raxim.myscoutee.profile.service.operator;

import java.security.PublicKey;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.registry.RegistryCrypto;
import com.raxim.myscoutee.registry.RegistryLocalStore;
import com.raxim.myscoutee.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.MauReceipt;
import com.raxim.myscoutee.registry.RegistryProtocol.RegistrationResponse;

import tools.jackson.databind.ObjectMapper;

/**
 * Read-only gate for background revenue delivery.
 *
 * <p>The settings row is checked before key, state, outbox, payment, or HTTP
 * access. This resolver never selects a registry, initializes an identity, or
 * repairs enrollment state.</p>
 */
@Service
class OperatorRevenueRegistryRuntimeResolver {
    private final OperatorRegistrySettingsRepository settingsRepository;
    private final RegistryProperties configuredProperties;
    private final ObjectMapper objectMapper;

    OperatorRevenueRegistryRuntimeResolver(
            OperatorRegistrySettingsRepository settingsRepository,
            RegistryProperties configuredProperties,
            ObjectMapper objectMapper) {
        this.settingsRepository = Objects.requireNonNull(settingsRepository);
        this.configuredProperties = Objects.requireNonNull(configuredProperties);
        this.objectMapper = Objects.requireNonNull(objectMapper);
    }

    Resolution resolveReal() {
        Optional<OperatorRegistrySettings> stored = settingsRepository.findById(
                OperatorRegistrySettings.SINGLETON_ID);
        if (stored.isEmpty()) {
            return Resolution.dormant(
                    "REGISTRY_NOT_CONFIGURED",
                    "Register this deployment before sending revenue reports.");
        }
        OperatorRegistrySettings settings = stored.get();
        if (!Boolean.TRUE.equals(settings.getEnabled())) {
            return Resolution.dormant(
                    "REGISTRY_DISABLED",
                    "The operator has disabled this deployment's registry connection.");
        }
        if (!"REGISTERED".equals(settings.getLifecycle())
                || settings.getSelection() == null
                || settings.getNodeIdentity() == null
                || !"READY".equals(settings.getNodeIdentity().getState())
                || settings.getEnrollment() == null
                || !StringUtils.hasText(
                        settings.getEnrollment().getDeploymentCode())) {
            return Resolution.dormant(
                    "DEPLOYMENT_NOT_REGISTERED",
                    "Complete node registration before sending revenue reports.");
        }
        if (!configuredProperties.isOutboundAllowed()) {
            return Resolution.dormant(
                    "REGISTRY_OUTBOUND_DISABLED",
                    "Outbound registry communication is disabled by the deployment policy.");
        }

        try {
            RegistryProperties runtime = runtimeProperties(settings.getSelection());
            RegistryCrypto crypto = RegistryCrypto.load(runtime);
            RegistryLocalStore localStore =
                    new RegistryLocalStore(runtime, objectMapper);
            LocalState state = localStore.load().orElseThrow(() ->
                    new IllegalStateException(
                            "Signed registry state is missing."));
            RegisteredRuntime registered = verifyRegisteredEvidence(
                    settings,
                    runtime,
                    crypto,
                    localStore,
                    state);
            return Resolution.ready(registered);
        } catch (RuntimeException exception) {
            return Resolution.blocked(
                    "REGISTRY_EVIDENCE_INVALID",
                    safeMessage(exception));
        }
    }

    private RegistryProperties runtimeProperties(
            OperatorRegistrySettings.RegistrySelection selection) {
        RegistryProperties runtime = new RegistryProperties();
        runtime.setEnabled(true);
        runtime.setOutboundAllowed(true);
        runtime.setOperatorRegistrationConfirmed(false);
        runtime.setBaseUrl(selection.getBaseUrl());
        runtime.setRegistryScope(selection.getRegistryScope());
        runtime.setExpectedRegistryKeyFingerprint(
                selection.getRegistryPublicKeyFingerprint());
        runtime.setTrustOnFirstUse(false);
        runtime.setConnectTimeout(configuredProperties.getConnectTimeout());
        runtime.setRequestTimeout(configuredProperties.getRequestTimeout());
        runtime.setRetryDelay(configuredProperties.getRetryDelay());
        runtime.setMaxResponseBytes(configuredProperties.getMaxResponseBytes());
        runtime.setSoftwareVersion(configuredProperties.getSoftwareVersion());
        runtime.setPrivateKeyPath(configuredProperties.getPrivateKeyPath());
        runtime.setPublicKeyPath(configuredProperties.getPublicKeyPath());
        runtime.setStateDir(configuredProperties.getStateDir());
        runtime.setPackageSigningPublicKeyPath(
                configuredProperties.getPackageSigningPublicKeyPath());
        runtime.setAllowInsecureHttp(false);
        runtime.setInsecureHttpAllowedHosts("");
        return runtime;
    }

    private RegisteredRuntime verifyRegisteredEvidence(
            OperatorRegistrySettings settings,
            RegistryProperties runtime,
            RegistryCrypto crypto,
            RegistryLocalStore localStore,
            LocalState state) {
        OperatorRegistrySettings.RegistrySelection selection =
                settings.getSelection();
        String deploymentId = RegistryProtocol.requireDeploymentId(
                settings.getEnrollment().getDeploymentCode());
        String registryScope = RegistryProtocol.requireRegistryScope(
                selection.getRegistryScope());
        String selectedFingerprint = RegistryProtocol.requireHash(
                selection.getRegistryPublicKeyFingerprint(),
                "selected registry public-key fingerprint");
        String selectedKeyId = RegistryProtocol.requireRegistryKeyId(
                selection.getRegistryKeyId());
        String nodeFingerprint = RegistryProtocol.requireHash(
                settings.getNodeIdentity().getPublicKeyFingerprint(),
                "persisted node public-key fingerprint");

        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    selection.getProtocolVersion())
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
        PublicKey registryPublicKey = RegistryCrypto.parseRegistryPublicKey(
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
                || !RegistryCrypto.verifyBase64(
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
                    settings.getEnrollment().getInstallationTestBatchId(),
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
        var acceptedAt = RegistryProtocol.requireUtcTimestamp(
                receipt.acceptedAt(),
                "accepted_at");
        RegistryProtocol.requireCheckpointDate(receipt.checkpointDate());
        if (!RegistryProtocol.checkpointDateAt(acceptedAt).equals(
                    receipt.checkpointDate())
                || !RegistryCrypto.verifyBase64(
                        registryPublicKey,
                        RegistryProtocol.mauReceipt(response),
                        receipt.signature())) {
            throw new IllegalStateException(
                    "Installation receipt signature or checkpoint is invalid.");
        }
    }

    private static String safeMessage(RuntimeException exception) {
        String message = exception == null ? "" : exception.getMessage();
        return StringUtils.hasText(message)
                ? message.trim()
                : "Registered deployment evidence is invalid.";
    }

    record RegisteredRuntime(
            RegistryProperties properties,
            LocalState state,
            RegistryCrypto deploymentCrypto,
            PublicKey registryPublicKey,
            String registryPublicKeyBase64,
            String registryPublicKeyFingerprint,
            String registryKeyId) {
    }

    record Resolution(
            String state,
            String code,
            String message,
            RegisteredRuntime runtime) {
        static Resolution ready(RegisteredRuntime runtime) {
            return new Resolution("READY", null, null, runtime);
        }

        static Resolution dormant(String code, String message) {
            return new Resolution("DORMANT", code, message, null);
        }

        static Resolution blocked(String code, String message) {
            return new Resolution("BLOCKED", code, message, null);
        }

        boolean isReady() {
            return runtime != null;
        }
    }
}
