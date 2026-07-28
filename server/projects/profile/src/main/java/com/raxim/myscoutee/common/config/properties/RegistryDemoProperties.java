package com.raxim.myscoutee.common.config.properties;

import java.nio.file.Path;
import java.util.Locale;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Isolated registry configuration for the Explore/demo operator workspace.
 *
 * <p>The default is deliberately {@code sample}: production Explore must not
 * contact a registry or touch deployment identity files. Development may opt
 * into {@code live} and must provide its own endpoint, key paths, state path,
 * and exact insecure-HTTP allowlist.</p>
 */
@ConfigurationProperties("registry.demo")
public class RegistryDemoProperties {
    private String mode = "sample";
    private String candidateBaseUrl = "";
    private String candidateScope = "";
    private Path privateKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-private-key.pem");
    private Path publicKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-public-key.der");
    private Path stateDir = Path.of("/var/lib/myscoutee/registry-demo/state");
    private boolean allowInsecureHttp;
    private String insecureHttpAllowedHosts = "";

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode == null ? "sample" : mode.trim().toLowerCase(Locale.ROOT);
    }

    public boolean isLive() {
        return "live".equals(mode);
    }

    public String getCandidateBaseUrl() {
        return candidateBaseUrl;
    }

    public void setCandidateBaseUrl(String candidateBaseUrl) {
        this.candidateBaseUrl = candidateBaseUrl == null ? "" : candidateBaseUrl.trim();
    }

    public String getCandidateScope() {
        return candidateScope;
    }

    public void setCandidateScope(String candidateScope) {
        this.candidateScope = candidateScope == null ? "" : candidateScope.trim();
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
}
