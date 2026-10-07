package com.raxim.myscoutee.domain.registry.dto;
import java.util.*;
import java.time.Instant;
import java.nio.file.Path;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.*;
public record RegistryInspection(
        String registryEndpoint,
        String protocolVersion,
        String registryScope,
        String registryKeyId,
        String registryPublicKeyFingerprint,
        String registryPublicKey) {
}
