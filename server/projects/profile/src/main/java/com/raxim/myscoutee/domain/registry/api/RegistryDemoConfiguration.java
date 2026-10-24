package com.raxim.myscoutee.domain.registry.api;

import java.nio.file.Path;

/**
 * Isolated registry configuration for HTTP Explore operator sessions.
 *
 * <p>Explore uses the Java API, {@code demo_db}, and a bundled internal-only
 * demo registry. Its endpoint, signing identity, and client state are
 * deliberately independent from the operator-selected REAL registry.</p>
 */
public class RegistryDemoConfiguration extends RegistryConnectionConfiguration {
    public RegistryDemoConfiguration() {
        super(Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-private-key.pem"), Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-public-key.der"), Path.of("/var/lib/myscoutee/registry-demo/state"));
    }

}
