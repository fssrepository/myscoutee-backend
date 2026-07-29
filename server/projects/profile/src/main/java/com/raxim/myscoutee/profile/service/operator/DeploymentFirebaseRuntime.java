package com.raxim.myscoutee.profile.service.operator;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.messaging.FirebaseMessaging;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

/**
 * Resolves the explicitly activated deployment Firebase configuration for
 * live authentication and messaging. Operator capability tests continue to
 * use short-lived isolated apps and therefore cannot switch live traffic.
 */
@Service
public class DeploymentFirebaseRuntime {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(DeploymentFirebaseRuntime.class);
    private static final String APP_NAME_PREFIX =
            "myscoutee-deployment-firebase-";

    private final DeploymentConfigurationRepository repository;
    private final DeploymentConfigurationCrypto crypto;
    private final ConfigProperties configProperties;
    private final Object appLock = new Object();
    private final AtomicLong appSequence = new AtomicLong();
    private RuntimeApp authenticationApp;
    private RuntimeApp messagingApp;

    public DeploymentFirebaseRuntime(
            DeploymentConfigurationRepository repository,
            DeploymentConfigurationCrypto crypto,
            ConfigProperties configProperties) {
        this.repository = Objects.requireNonNull(repository);
        this.crypto = Objects.requireNonNull(crypto);
        this.configProperties = Objects.requireNonNull(configProperties);
    }

    @PostConstruct
    public void initializeAvailability() {
        refreshAfterConfigurationChange();
    }

    public boolean isAuthenticationEnabled() {
        return configProperties.isStartupFirebaseEnabled()
                || configProperties.isFirebaseEnabled();
    }

    public FirebaseAuth authentication() {
        if (MongoSessionModeContext.currentMode()
                == MongoSessionMode.DEMO) {
            throw new IllegalStateException(
                    "Live Firebase authentication is unavailable in Explore/demo mode.");
        }
        ResolvedCredential resolved = resolve(
                CredentialKind.AUTHENTICATION);
        if (resolved.legacyStartup()) {
            return FirebaseAuth.getInstance();
        }
        return FirebaseAuth.getInstance(runtimeApp(resolved));
    }

    public FirebaseMessaging messaging() {
        if (MongoSessionModeContext.currentMode()
                == MongoSessionMode.DEMO) {
            throw new IllegalStateException(
                    "Live Firebase messaging is unavailable in Explore/demo mode.");
        }
        ResolvedCredential resolved = resolve(CredentialKind.MESSAGING);
        if (resolved.legacyStartup()) {
            return FirebaseMessaging.getInstance();
        }
        return FirebaseMessaging.getInstance(runtimeApp(resolved));
    }

    /**
     * Refreshes only the public enabled signal after a real-workspace save or
     * activation. Demo configuration can never change live process state.
     */
    public void refreshAfterConfigurationChange() {
        if (MongoSessionModeContext.currentMode()
                == MongoSessionMode.DEMO) {
            return;
        }
        boolean active = false;
        try {
            active = repository.findById(
                    DeploymentConfiguration.SINGLETON_ID)
                    .map(DeploymentConfiguration::getFirebase)
                    .map(DeploymentConfiguration.Firebase::isActive)
                    .orElse(false);
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Unable to refresh deployment Firebase availability; "
                            + "the bootstrap login remains available.",
                    exception);
        }
        configProperties.publishDeploymentFirebaseEnabled(active);
        if (!active) {
            closeRuntimeApps();
        }
    }

    @PreDestroy
    public void close() {
        closeRuntimeApps();
    }

    private ResolvedCredential resolve(CredentialKind kind) {
        DeploymentConfiguration configuration = repository.findById(
                DeploymentConfiguration.SINGLETON_ID)
                .orElse(null);
        DeploymentConfiguration.Firebase firebase =
                configuration == null ? null : configuration.getFirebase();
        if (firebase == null || !firebase.isActive()) {
            if (configProperties.isStartupFirebaseEnabled()) {
                return ResolvedCredential.legacy();
            }
            throw new IllegalStateException(
                    "Firebase has not been activated for this deployment.");
        }
        long revision = firebase.getRevision() == null
                ? 0L
                : Math.max(0L, firebase.getRevision());
        String projectId = requireText(
                firebase.getProjectId(),
                "Activated Firebase project id is missing.");
        DeploymentConfiguration.EncryptedSecret envelope =
                kind == CredentialKind.AUTHENTICATION
                        ? firebase.getAuthenticationCredentialEnvelope()
                        : firebase.getMessagingCredentialEnvelope();
        if (envelope == null) {
            throw new IllegalStateException(
                    "Activated Firebase credential is missing.");
        }
        String purpose = kind == CredentialKind.AUTHENTICATION
                ? OperatorConfigurationService
                        .FIREBASE_AUTHENTICATION_PURPOSE
                : OperatorConfigurationService
                        .FIREBASE_MESSAGING_PURPOSE;
        return new ResolvedCredential(
                kind,
                projectId,
                revision,
                envelope,
                purpose,
                false);
    }

    private FirebaseApp runtimeApp(ResolvedCredential resolved) {
        synchronized (appLock) {
            RuntimeApp current =
                    resolved.kind() == CredentialKind.AUTHENTICATION
                            ? authenticationApp
                            : messagingApp;
            if (current != null && current.matches(resolved)) {
                return current.app();
            }
            FirebaseApp next = initializeApp(resolved);
            RuntimeApp replacement = new RuntimeApp(
                    resolved.projectId(),
                    resolved.revision(),
                    next);
            if (resolved.kind() == CredentialKind.AUTHENTICATION) {
                authenticationApp = replacement;
            } else {
                messagingApp = replacement;
            }
            delete(current);
            return next;
        }
    }

    private FirebaseApp initializeApp(ResolvedCredential resolved) {
        try {
            String serviceAccountJson = requireText(
                    crypto.decrypt(
                            resolved.purpose(),
                            resolved.credentialEnvelope()),
                    "Activated Firebase credential is unavailable.");
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(
                            serviceAccountJson
                                    .getBytes(StandardCharsets.UTF_8)));
            if (!(credentials
                    instanceof ServiceAccountCredentials serviceAccount)) {
                throw new IllegalStateException(
                        "Activated Firebase credential is not a service account.");
            }
            String credentialProjectId = serviceAccount.getProjectId();
            if (StringUtils.hasText(credentialProjectId)
                    && !resolved.projectId().equals(
                            credentialProjectId.trim())) {
                throw new IllegalStateException(
                        "Activated Firebase project does not match its service account.");
            }
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(resolved.projectId())
                    .build();
            String appName = APP_NAME_PREFIX
                    + resolved.kind().name().toLowerCase()
                    + "-"
                    + resolved.revision()
                    + "-"
                    + appSequence.incrementAndGet();
            return FirebaseApp.initializeApp(options, appName);
        } catch (IOException | IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Activated Firebase credential is invalid.",
                    exception);
        } catch (RuntimeException exception) {
            if (exception instanceof IllegalStateException) {
                throw exception;
            }
            throw new IllegalStateException(
                    "Activated Firebase runtime initialization failed.",
                    exception);
        }
    }

    private void closeRuntimeApps() {
        synchronized (appLock) {
            delete(authenticationApp);
            delete(messagingApp);
            authenticationApp = null;
            messagingApp = null;
        }
    }

    private void delete(RuntimeApp runtimeApp) {
        if (runtimeApp == null) {
            return;
        }
        try {
            runtimeApp.app().delete();
        } catch (RuntimeException exception) {
            LOGGER.debug(
                    "Unable to delete a replaced Firebase runtime app.",
                    exception);
        }
    }

    private String requireText(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(message);
        }
        return value.trim();
    }

    private enum CredentialKind {
        AUTHENTICATION,
        MESSAGING
    }

    private record ResolvedCredential(
            CredentialKind kind,
            String projectId,
            long revision,
            DeploymentConfiguration.EncryptedSecret credentialEnvelope,
            String purpose,
            boolean legacyStartup) {
        private static ResolvedCredential legacy() {
            return new ResolvedCredential(
                    CredentialKind.AUTHENTICATION,
                    "",
                    -1L,
                    null,
                    "",
                    true);
        }
    }

    private record RuntimeApp(
            String projectId,
            long revision,
            FirebaseApp app) {
        private boolean matches(ResolvedCredential resolved) {
            return projectId.equals(resolved.projectId())
                    && revision == resolved.revision();
        }
    }
}
