package com.raxim.myscoutee.common.config.properties;

import java.nio.file.Path;
import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("registry")
public class RegistryProperties {
    private boolean enabled;
    private boolean outboundAllowed;
    private boolean operatorRegistrationConfirmed;
    private String baseUrl = "";
    private String registryScope = "";
    private Path privateKeyPath = Path.of("/etc/myscoutee/registry/deployment-private-key.pem");
    private Path publicKeyPath = Path.of("/etc/myscoutee/registry/deployment-public-key.der");
    private Path stateDir = Path.of("/var/lib/myscoutee/registry");
    private Duration connectTimeout = Duration.ofSeconds(5);
    private Duration requestTimeout = Duration.ofSeconds(20);
    private Duration retryDelay = Duration.ofMinutes(1);
    private int maxResponseBytes = 1_048_576;
    private String softwareVersion = "unknown";
    private String expectedRegistryKeyFingerprint = "";
    private boolean trustOnFirstUse;
    private boolean allowInsecureHttp;
    private String insecureHttpAllowedHosts = "";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isOutboundAllowed() {
        return outboundAllowed;
    }

    public void setOutboundAllowed(boolean outboundAllowed) {
        this.outboundAllowed = outboundAllowed;
    }

    public boolean isOperatorRegistrationConfirmed() {
        return operatorRegistrationConfirmed;
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

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl == null ? "" : baseUrl.trim();
    }

    public String getRegistryScope() {
        return registryScope;
    }

    public void setRegistryScope(String registryScope) {
        this.registryScope = registryScope == null ? "" : registryScope.trim();
    }

    public Path getPrivateKeyPath() {
        return privateKeyPath;
    }

    public void setPrivateKeyPath(Path privateKeyPath) {
        if (privateKeyPath != null) {
            this.privateKeyPath = privateKeyPath;
        }
    }

    public Path getPublicKeyPath() {
        return publicKeyPath;
    }

    public void setPublicKeyPath(Path publicKeyPath) {
        if (publicKeyPath != null) {
            this.publicKeyPath = publicKeyPath;
        }
    }

    public Path getStateDir() {
        return stateDir;
    }

    public void setStateDir(Path stateDir) {
        if (stateDir != null) {
            this.stateDir = stateDir;
        }
    }

    public Duration getConnectTimeout() {
        return connectTimeout;
    }

    public void setConnectTimeout(Duration connectTimeout) {
        if (connectTimeout != null && !connectTimeout.isNegative() && !connectTimeout.isZero()) {
            this.connectTimeout = connectTimeout;
        }
    }

    public Duration getRequestTimeout() {
        return requestTimeout;
    }

    public void setRequestTimeout(Duration requestTimeout) {
        if (requestTimeout != null && !requestTimeout.isNegative() && !requestTimeout.isZero()) {
            this.requestTimeout = requestTimeout;
        }
    }

    public Duration getRetryDelay() {
        return retryDelay;
    }

    public void setRetryDelay(Duration retryDelay) {
        if (retryDelay != null && !retryDelay.isNegative() && !retryDelay.isZero()) {
            this.retryDelay = retryDelay;
        }
    }

    public int getMaxResponseBytes() {
        return maxResponseBytes;
    }

    public void setMaxResponseBytes(int maxResponseBytes) {
        this.maxResponseBytes = Math.max(1_024, Math.min(4_194_304, maxResponseBytes));
    }

    public String getSoftwareVersion() {
        return softwareVersion;
    }

    public void setSoftwareVersion(String softwareVersion) {
        this.softwareVersion = softwareVersion == null ? "unknown" : softwareVersion.trim();
    }

    public String getExpectedRegistryKeyFingerprint() {
        return expectedRegistryKeyFingerprint;
    }

    public void setExpectedRegistryKeyFingerprint(String expectedRegistryKeyFingerprint) {
        this.expectedRegistryKeyFingerprint =
                expectedRegistryKeyFingerprint == null ? "" : expectedRegistryKeyFingerprint.trim();
    }

    public boolean isTrustOnFirstUse() {
        return trustOnFirstUse;
    }

    public void setTrustOnFirstUse(boolean trustOnFirstUse) {
        this.trustOnFirstUse = trustOnFirstUse;
    }

    public boolean isAllowInsecureHttp() {
        return allowInsecureHttp;
    }

    public void setAllowInsecureHttp(boolean allowInsecureHttp) {
        this.allowInsecureHttp = allowInsecureHttp;
    }

    public String getInsecureHttpAllowedHosts() {
        return insecureHttpAllowedHosts;
    }

    public void setInsecureHttpAllowedHosts(String insecureHttpAllowedHosts) {
        this.insecureHttpAllowedHosts =
                insecureHttpAllowedHosts == null ? "" : insecureHttpAllowedHosts.trim();
    }

    public boolean isActive() {
        return enabled && outboundAllowed && operatorRegistrationConfirmed;
    }

    public Path statePath() {
        return stateDir.resolve("deployment-state.json");
    }

    public Path receiptDirectory() {
        return stateDir.resolve("receipts");
    }
}
