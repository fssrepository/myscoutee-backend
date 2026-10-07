package com.raxim.myscoutee.domain.registry.dto;
import java.security.PublicKey;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistrySigner;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
public final class RegistryRegisteredState {
    private RegistryRegisteredState() {}
    public record RegisteredRuntime(
            RegistryConfiguration properties,
            LocalState state,
            RegistrySigner deploymentCrypto,
            PublicKey registryPublicKey,
            String registryPublicKeyBase64,
            String registryPublicKeyFingerprint,
            String registryKeyId) {
    }
}
