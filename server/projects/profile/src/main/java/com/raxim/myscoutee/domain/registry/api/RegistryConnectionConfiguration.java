package com.raxim.myscoutee.domain.registry.api;

import java.nio.file.Path;

/** Connection settings shared by REAL and isolated DEMO configuration. */
@lombok.Getter
public abstract class RegistryConnectionConfiguration {
    private String baseUrl = "";
    private String registryScope = "";
    private Path privateKeyPath;
    private Path publicKeyPath;
    private Path stateDir;
    private boolean allowInsecureHttp;
    private String insecureHttpAllowedHosts = "";

    protected RegistryConnectionConfiguration(Path privateKeyPath, Path publicKeyPath, Path stateDir) {
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
        this.stateDir = stateDir;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl == null ? "" : baseUrl.trim();
    }
    public void setRegistryScope(String registryScope) {
        this.registryScope =
                registryScope == null ? "" : registryScope.trim();
    }
    public void setPrivateKeyPath(Path privateKeyPath) {
        if (privateKeyPath != null) {
            this.privateKeyPath = privateKeyPath;
        }
    }
    public void setPublicKeyPath(Path publicKeyPath) {
        if (publicKeyPath != null) {
            this.publicKeyPath = publicKeyPath;
        }
    }
    public void setStateDir(Path stateDir) {
        if (stateDir != null) {
            this.stateDir = stateDir;
        }
    }
    public void setAllowInsecureHttp(boolean allowInsecureHttp) {
        this.allowInsecureHttp = allowInsecureHttp;
    }
    public void setInsecureHttpAllowedHosts(String insecureHttpAllowedHosts) {
        this.insecureHttpAllowedHosts =
                insecureHttpAllowedHosts == null ? "" : insecureHttpAllowedHosts.trim();
    }
}
