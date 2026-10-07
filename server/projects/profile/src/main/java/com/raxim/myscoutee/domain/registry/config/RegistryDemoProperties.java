package com.raxim.myscoutee.domain.registry.config;

import java.nio.file.Path;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Isolated registry configuration for HTTP Explore operator sessions.
 *
 * <p>Explore uses the Java API, {@code demo_db}, and a bundled internal-only
 * demo registry. Its endpoint, signing identity, and client state are
 * deliberately independent from the operator-selected REAL registry.</p>
 */
@ConfigurationProperties("registry.demo")
public class RegistryDemoProperties {
    private String baseUrl = "";
    private String registryScope = "";
    private Path privateKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-private-key.pem");
    private Path publicKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-public-key.der");
    private Path stateDir = Path.of("/var/lib/myscoutee/registry-demo/state");
    private boolean allowInsecureHttp;
    private String insecureHttpAllowedHosts = "";

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
        this.registryScope =
                registryScope == null ? "" : registryScope.trim();
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
