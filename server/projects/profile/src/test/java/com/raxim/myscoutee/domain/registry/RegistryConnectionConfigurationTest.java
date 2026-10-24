package com.raxim.myscoutee.domain.registry;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryDemoConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryConnectionConfiguration;

@org.junit.jupiter.api.Tag("standard")
class RegistryConnectionConfigurationTest {
    @Test
    void realAndDemoKeepIndependentDefaultsAndExistingSetterPolicies() {
        var real = new RegistryConfiguration();
        var demo = new RegistryDemoConfiguration();
        assertThat(real.getPrivateKeyPath()).isEqualTo(Path.of("/etc/myscoutee/registry/deployment-private-key.pem"));
        assertThat(demo.getPrivateKeyPath()).isEqualTo(Path.of("/var/lib/myscoutee/registry-demo/keys/deployment-private-key.pem"));
        assertThat(real.statePath()).isEqualTo(Path.of("/var/lib/myscoutee/registry/deployment-state.json"));
        assertThat(demo.getStateDir()).isEqualTo(Path.of("/var/lib/myscoutee/registry-demo/state"));
        for (RegistryConnectionConfiguration value : new RegistryConnectionConfiguration[] {real, demo}) {
            Path privateKey = value.getPrivateKeyPath(), publicKey = value.getPublicKeyPath(), state = value.getStateDir();
            value.setPrivateKeyPath(null); value.setPublicKeyPath(null); value.setStateDir(null);
            assertThat(value.getPrivateKeyPath()).isEqualTo(privateKey);
            assertThat(value.getPublicKeyPath()).isEqualTo(publicKey);
            assertThat(value.getStateDir()).isEqualTo(state);
            value.setBaseUrl("  https://registry.example  ");
            value.setRegistryScope("  scope  ");
            value.setInsecureHttpAllowedHosts("  localhost  ");
            assertThat(value.getBaseUrl()).isEqualTo("https://registry.example");
            assertThat(value.getRegistryScope()).isEqualTo("scope");
            assertThat(value.getInsecureHttpAllowedHosts()).isEqualTo("localhost");
            value.setBaseUrl(null); value.setRegistryScope(null); value.setInsecureHttpAllowedHosts(null);
            assertThat(value.getBaseUrl()).isEmpty();
            assertThat(value.getRegistryScope()).isEmpty();
            assertThat(value.getInsecureHttpAllowedHosts()).isEmpty();
            assertThat(value.isAllowInsecureHttp()).isFalse();
        }
        real.setBaseUrl("https://real.example");
        assertThat(demo.getBaseUrl()).isEmpty();
    }
}
