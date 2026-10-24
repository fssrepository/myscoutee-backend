package com.raxim.myscoutee.domain.registry.api;

import java.nio.file.Path;
import java.time.Duration;

@lombok.Getter
public class RegistryConfiguration extends RegistryConnectionConfiguration {
    public RegistryConfiguration() {
        super(Path.of("/etc/myscoutee/registry/deployment-private-key.pem"), Path.of("/etc/myscoutee/registry/deployment-public-key.der"), Path.of("/var/lib/myscoutee/registry"));
    }
    private boolean enabled;
    private boolean outboundAllowed;
    private boolean operatorRegistrationConfirmed;
    private Path packageSigningPublicKeyPath =
            Path.of("/etc/myscoutee/update/release-public-key.pem");
    private Duration connectTimeout = Duration.ofSeconds(5);
    private Duration requestTimeout = Duration.ofSeconds(20);
    private Duration retryDelay = Duration.ofMinutes(1);
    private int maxResponseBytes = 1_048_576;
    private String softwareVersion = "unknown";
    private String expectedRegistryKeyFingerprint = "";
    private boolean trustOnFirstUse;

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setOutboundAllowed(boolean outboundAllowed) {
        this.outboundAllowed = outboundAllowed;
    }

    /**
     * Legacy gate for directly invoked, environment-configured enrollment.
     *
     * <p>The operator API does not treat this environment value as consent.
     * It sets the corresponding value only on an ephemeral runtime snapshot
     * after the exact inspected registry identity has been confirmed and
     * persisted in Mongo.</p>
     */
    public void setOperatorRegistrationConfirmed(boolean operatorRegistrationConfirmed) {
        this.operatorRegistrationConfirmed = operatorRegistrationConfirmed;
    }

    public void setPackageSigningPublicKeyPath(Path packageSigningPublicKeyPath) {
        if (packageSigningPublicKeyPath != null) {
            this.packageSigningPublicKeyPath = packageSigningPublicKeyPath;
        }
    }

    public void setConnectTimeout(Duration connectTimeout) {
        if (connectTimeout != null && !connectTimeout.isNegative() && !connectTimeout.isZero()) {
            this.connectTimeout = connectTimeout;
        }
    }

    public void setRequestTimeout(Duration requestTimeout) {
        if (requestTimeout != null && !requestTimeout.isNegative() && !requestTimeout.isZero()) {
            this.requestTimeout = requestTimeout;
        }
    }

    public void setRetryDelay(Duration retryDelay) {
        if (retryDelay != null && !retryDelay.isNegative() && !retryDelay.isZero()) {
            this.retryDelay = retryDelay;
        }
    }

    public void setMaxResponseBytes(int maxResponseBytes) {
        this.maxResponseBytes = Math.max(1_024, Math.min(4_194_304, maxResponseBytes));
    }

    public void setSoftwareVersion(String softwareVersion) {
        this.softwareVersion = softwareVersion == null ? "unknown" : softwareVersion.trim();
    }

    public void setExpectedRegistryKeyFingerprint(String expectedRegistryKeyFingerprint) {
        this.expectedRegistryKeyFingerprint =
                expectedRegistryKeyFingerprint == null ? "" : expectedRegistryKeyFingerprint.trim();
    }

    public void setTrustOnFirstUse(boolean trustOnFirstUse) {
        this.trustOnFirstUse = trustOnFirstUse;
    }

    public boolean isActive() {
        return enabled && outboundAllowed && operatorRegistrationConfirmed;
    }

    public Path statePath() {
        return getStateDir().resolve("deployment-state.json");
    }

    public Path receiptDirectory() {
        return getStateDir().resolve("receipts");
    }
}
