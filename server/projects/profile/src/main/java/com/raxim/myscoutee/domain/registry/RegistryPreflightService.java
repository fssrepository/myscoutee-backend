package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.dto.RegistryInspection;

import java.net.URI;
import java.security.PublicKey;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistryIdentityResponse;

import tools.jackson.databind.ObjectMapper;

/**
 * Read-only inspection of an operator-selected registry.
 *
 * <p>This service deliberately does not load or create the node identity and
 * does not read or write enrollment state. A future authenticated operator API
 * can use the returned public metadata before separately initializing and
 * registering the node.</p>
 */
@Service
public class RegistryPreflightService {
    private final RegistryConfiguration properties;
    private final RegistryHttpClient httpClient;

    @Autowired
    public RegistryPreflightService(
            RegistryConfiguration properties,
            ObjectMapper objectMapper) {
        this(properties, new RegistryHttpClient(properties, objectMapper));
    }

    RegistryPreflightService(
            RegistryConfiguration properties,
            RegistryHttpClient httpClient) {
        this.properties = Objects.requireNonNull(properties, "Registry properties must not be null.");
        this.httpClient = Objects.requireNonNull(httpClient, "Registry HTTP client must not be null.");
    }

    public RegistryInspection inspectConfiguredRegistry() {
        if (!properties.isEnabled() || !properties.isOutboundAllowed()) {
            throw new IllegalStateException(
                    "Registry inspection requires registry access and outbound communication to be enabled.");
        }

        URI endpoint = httpClient.endpoint(RegistryProtocol.REGISTRY_IDENTITY_PATH);
        RegistryIdentityResponse identity = Objects.requireNonNull(
                httpClient.inspectIdentity(),
                "Registry identity response must not be null.");
        verifyIdentity(identity);

        return new RegistryInspection(
                endpoint.toString(),
                identity.protocolVersion(),
                identity.registryScope(),
                identity.registryKeyId(),
                RegistryProtocol.publicKeyFingerprint(
                        RegistryProtocol.decodeStandardBase64(
                                identity.registryPublicKey(),
                                "registry_public_key")),
                identity.registryPublicKey());
    }

    private void verifyIdentity(RegistryIdentityResponse identity) {
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(identity.protocolVersion())) {
            throw new IllegalArgumentException("Registry identity protocol version is unsupported.");
        }
        String responseScope = RegistryProtocol.requireRegistryScope(identity.registryScope());
        String configuredScope = safeText(properties.getRegistryScope());
        if (!configuredScope.isEmpty()) {
            RegistryProtocol.requireRegistryScope(configuredScope);
            if (!configuredScope.equals(responseScope)) {
                throw new IllegalArgumentException(
                        "Registry identity scope does not match the operator-selected scope.");
            }
        }

        String registryKeyId = RegistryProtocol.requireRegistryKeyId(identity.registryKeyId());
        byte[] publicKeyDer = RegistryProtocol.decodeStandardBase64(
                identity.registryPublicKey(),
                "registry_public_key");
        PublicKey publicKey = com.raxim.myscoutee.domain.registry.api.RegistrySignatures.parsePublicKeyDer(publicKeyDer, "registry_public_key");
        String fingerprint = RegistryProtocol.publicKeyFingerprint(publicKeyDer);
        if (!RegistryProtocol.registryKeyId(fingerprint).equals(registryKeyId)) {
            throw new IllegalArgumentException(
                    "Registry identity key ID does not match its public key.");
        }

        String configuredFingerprint = safeText(properties.getExpectedRegistryKeyFingerprint());
        if (!configuredFingerprint.isEmpty()) {
            RegistryProtocol.requireHash(
                    configuredFingerprint,
                    "configured registry public-key fingerprint");
            if (!RegistryProtocol.hashEquals(configuredFingerprint, fingerprint)) {
                throw new IllegalArgumentException(
                        "Registry identity does not match REGISTRY_EXPECTED_KEY_FINGERPRINT.");
            }
        }

        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                publicKey,
                RegistryProtocol.registryIdentity(identity),
                identity.signature())) {
            throw new IllegalArgumentException("Registry identity self-signature is invalid.");
        }
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }


}
