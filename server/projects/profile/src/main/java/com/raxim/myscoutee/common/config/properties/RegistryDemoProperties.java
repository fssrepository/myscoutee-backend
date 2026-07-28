package com.raxim.myscoutee.common.config.properties;

import java.nio.file.Path;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Isolated registry configuration for HTTP demo operator sessions.
 *
 * <p>HTTP sessions use the real signed registry protocol with separate key and
 * state paths. The browser-only Explore workspace is implemented by the
 * frontend local data source and does not pass through this configuration.</p>
 */
@ConfigurationProperties("registry.demo")
public class RegistryDemoProperties {
    private Path privateKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-private-key.pem");
    private Path publicKeyPath = Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-public-key.der");
    private Path stateDir = Path.of("/var/lib/myscoutee/registry-demo/state");
    private boolean allowInsecureHttp;
    private String insecureHttpAllowedHosts = "";

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
