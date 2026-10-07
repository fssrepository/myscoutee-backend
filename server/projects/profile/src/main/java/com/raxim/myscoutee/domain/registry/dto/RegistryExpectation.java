package com.raxim.myscoutee.domain.registry.dto;
public record RegistryExpectation(String deploymentId, String registryScope, String registryPublicKeyFingerprint,
        String registryKeyId, String nodePublicKeyFingerprint, String protocolVersion, String installationBatchId) {}
