package com.raxim.myscoutee.domain.operator.service;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;

import java.security.PublicKey;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryDemoConfiguration;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.domain.registry.api.RegistryTransport;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.MauReceipt;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistrationResponse;

import tools.jackson.databind.ObjectMapper;

/**
 * Read-only gate for signed registry delivery and private registry reads.
 *
 * <p>The settings row is checked before durable key, state, outbox, accounting,
 * or HTTP access. This resolver never selects a registry, initializes an
 * identity, or repairs enrollment state.</p>
 */
@Service
class OperatorRevenueRegistryRuntimeResolver {
    private final OperatorRegistrySettingsRepository settingsRepository;
    private final RegistryConfiguration configuredProperties;
    private final RegistryDemoConfiguration demoProperties;
    private final com.raxim.myscoutee.domain.registry.api.RegistryOperations operations;

    OperatorRevenueRegistryRuntimeResolver(
            OperatorRegistrySettingsRepository settingsRepository,
            RegistryConfiguration configuredProperties,
            RegistryDemoConfiguration demoProperties,
            com.raxim.myscoutee.domain.registry.api.RegistryOperations operations) {
        this.settingsRepository = Objects.requireNonNull(settingsRepository);
        this.configuredProperties = Objects.requireNonNull(configuredProperties);
        this.demoProperties = Objects.requireNonNull(demoProperties);
        this.operations = Objects.requireNonNull(operations);
    }

    Resolution resolveReal() {
        return resolveRevenue(MongoSessionMode.REAL);
    }

    Resolution resolveRevenue(MongoSessionMode mode) {
        return resolve(mode, RegistryProtocol.REVENUE_BATCH_PATH);
    }

    Resolution resolveMau(MongoSessionMode mode) {
        return resolve(mode, RegistryProtocol.MAU_BATCH_PATH);
    }

    Resolution resolveSettlement(MongoSessionMode mode) {
        return resolve(mode, RegistryProtocol.SETTLEMENT_QUERY_PATH);
    }

    Resolution resolveGlobalIdentity(MongoSessionMode mode) {
        return resolve(
                mode,
                RegistryProtocol.GLOBAL_IDENTITY_VOPRF_KEY_PATH);
    }

    private Resolution resolve(
            MongoSessionMode requestedMode,
            String requiredEndpointPath) {
        MongoSessionMode mode = requestedMode == null
                ? MongoSessionMode.REAL
                : requestedMode;
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
        if (mode == MongoSessionMode.REAL
                && !configuredProperties.isOutboundAllowed()) {
            return Resolution.dormant(
                    "REGISTRY_OUTBOUND_DISABLED",
                    "Outbound registry communication is disabled by the deployment policy.");
        }

        try {
            RegistryConfiguration runtime = runtimeProperties(
                    settings.getSelection(),
                    mode);
            RegisteredRuntime registered = operations.registeredEvidence(runtime, requiredEndpointPath,
                    new com.raxim.myscoutee.domain.registry.dto.RegistryExpectation(
                            settings.getEnrollment().getDeploymentCode(), settings.getSelection().getRegistryScope(),
                            settings.getSelection().getRegistryPublicKeyFingerprint(), settings.getSelection().getRegistryKeyId(),
                            settings.getNodeIdentity().getPublicKeyFingerprint(), settings.getSelection().getProtocolVersion(),
                            settings.getEnrollment().getInstallationTestBatchId()));
            return Resolution.ready(registered);
        } catch (RuntimeException exception) {
            return Resolution.blocked(
                    "REGISTRY_EVIDENCE_INVALID",
                    safeMessage(exception));
        }
    }

    RegistryConfiguration runtimeProperties(
            OperatorRegistrySettings.RegistrySelection selection,
            MongoSessionMode mode) {
        RegistryConfiguration runtime = new RegistryConfiguration();
        runtime.setEnabled(true);
        runtime.setOutboundAllowed(true);
        runtime.setOperatorRegistrationConfirmed(false);
        String baseUrl = safeText(selection.getBaseUrl());
        String scope = safeText(selection.getRegistryScope());
        if (mode == MongoSessionMode.DEMO) {
            String configuredDemoBaseUrl = stripTrailingSlash(
                    demoProperties.getBaseUrl());
            String configuredDemoScope = safeText(
                    demoProperties.getRegistryScope());
            if (!StringUtils.hasText(configuredDemoBaseUrl)
                    || !StringUtils.hasText(configuredDemoScope)) {
                throw new IllegalStateException(
                        "Explore registry endpoint and scope are not configured.");
            }
            if (!configuredDemoBaseUrl.equals(stripTrailingSlash(baseUrl))
                    || !configuredDemoScope.equals(scope)) {
                throw new IllegalStateException(
                        "Explore registry selection does not match its isolated demo registry.");
            }
            baseUrl = configuredDemoBaseUrl;
            scope = configuredDemoScope;
        }
        runtime.setBaseUrl(baseUrl);
        runtime.setRegistryScope(scope);
        runtime.setExpectedRegistryKeyFingerprint(
                selection.getRegistryPublicKeyFingerprint());
        runtime.setTrustOnFirstUse(false);
        runtime.setConnectTimeout(configuredProperties.getConnectTimeout());
        runtime.setRequestTimeout(configuredProperties.getRequestTimeout());
        runtime.setRetryDelay(configuredProperties.getRetryDelay());
        runtime.setMaxResponseBytes(configuredProperties.getMaxResponseBytes());
        runtime.setSoftwareVersion(configuredProperties.getSoftwareVersion());
        runtime.setPackageSigningPublicKeyPath(
                configuredProperties.getPackageSigningPublicKeyPath());
        if (mode == MongoSessionMode.DEMO) {
            runtime.setPrivateKeyPath(demoProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(demoProperties.getPublicKeyPath());
            runtime.setStateDir(demoProperties.getStateDir());
            runtime.setAllowInsecureHttp(
                    demoProperties.isAllowInsecureHttp());
            runtime.setInsecureHttpAllowedHosts(
                    demoProperties.getInsecureHttpAllowedHosts());
        } else {
            runtime.setPrivateKeyPath(
                    configuredProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(
                    configuredProperties.getPublicKeyPath());
            runtime.setStateDir(configuredProperties.getStateDir());
            runtime.setAllowInsecureHttp(false);
            runtime.setInsecureHttpAllowedHosts("");
        }
        return runtime;
    }

    private static String stripTrailingSlash(String value) {
        String normalized = safeText(value);
        while (normalized.endsWith("/") && normalized.length() > 1) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }





    private static String safeMessage(RuntimeException exception) {
        String message = exception == null ? "" : exception.getMessage();
        return StringUtils.hasText(message)
                ? message.trim()
                : "Registered deployment evidence is invalid.";
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
    com.raxim.myscoutee.domain.registry.api.RegistryTransport transport(RegisteredRuntime runtime) {
        return operations.openTransport(runtime.properties());
    }

    static void applyIdentityPaths(RegistryConfiguration runtime, MongoSessionMode mode,
            RegistryConfiguration realProperties, RegistryDemoConfiguration demoProperties) {
        if (mode == MongoSessionMode.DEMO) {
            runtime.setPrivateKeyPath(demoProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(demoProperties.getPublicKeyPath());
            runtime.setStateDir(demoProperties.getStateDir());
            runtime.setAllowInsecureHttp(demoProperties.isAllowInsecureHttp());
            runtime.setInsecureHttpAllowedHosts(demoProperties.getInsecureHttpAllowedHosts());
        } else {
            runtime.setPrivateKeyPath(realProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(realProperties.getPublicKeyPath());
            runtime.setStateDir(realProperties.getStateDir());
            runtime.setAllowInsecureHttp(false);
            runtime.setInsecureHttpAllowedHosts("");
        }
    }

}
