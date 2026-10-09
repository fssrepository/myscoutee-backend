package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistryIdentityResponse;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("embedded")
class RegistryPreflightServiceTest {
    private static final String REGISTRY_SCOPE = "test-program:parent-a";

    @TempDir
    Path temporaryDirectory;

    @Test
    void inspectsAndVerifiesPublicIdentityBeforeConfirmationWithoutLocalMutation() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, false, 0)) {
            RegistryConfiguration properties = properties(registry);
            properties.setOperatorRegistrationConfirmed(false);
            RegistryPreflightService service = new RegistryPreflightService(
                    properties,
                    objectMapper);

            com.raxim.myscoutee.domain.registry.dto.RegistryInspection inspection =
                    service.inspectConfiguredRegistry();

            assertThat(inspection.registryEndpoint())
                    .isEqualTo(registry.baseUrl() + RegistryProtocol.REGISTRY_IDENTITY_PATH);
            assertThat(inspection.protocolVersion()).isEqualTo(RegistryProtocol.PROTOCOL_VERSION);
            assertThat(inspection.registryScope()).isEqualTo(REGISTRY_SCOPE);
            assertThat(inspection.registryKeyId()).isEqualTo(registry.identity.registryKeyId());
            assertThat(inspection.registryPublicKeyFingerprint()).isEqualTo(registry.fingerprint);
            assertThat(inspection.registryPublicKey()).isEqualTo(registry.identity.registryPublicKey());
            assertThat(registry.requestMethod).hasValue("GET");
            assertThat(Files.exists(properties.getPrivateKeyPath())).isFalse();
            assertThat(Files.exists(properties.getPublicKeyPath())).isFalse();
            assertThat(Files.exists(properties.getStateDir())).isFalse();
            registry.assertHealthy();
        }
    }

    @Test
    void hostOutboundKillSwitchBlocksInspectionEvenWithLegacyConfirmationEnabled() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, false, 0)) {
            RegistryConfiguration properties = properties(registry);
            properties.setOutboundAllowed(false);
            properties.setOperatorRegistrationConfirmed(true);

            assertThatThrownBy(() -> new RegistryPreflightService(properties, objectMapper)
                            .inspectConfiguredRegistry())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("outbound communication");
            assertThat(registry.requestMethod.get()).isNull();
            assertThat(Files.exists(properties.getPrivateKeyPath())).isFalse();
            assertThat(Files.exists(properties.getStateDir())).isFalse();
        }
    }

    @Test
    void rejectsInvalidSelfSignatureScopeAndConfiguredFingerprint() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, true, 0)) {
            RegistryConfiguration properties = properties(registry);
            assertThatThrownBy(() -> new RegistryPreflightService(properties, objectMapper)
                            .inspectConfiguredRegistry())
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("self-signature");
        }

        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, false, 0)) {
            RegistryConfiguration properties = properties(registry);
            properties.setRegistryScope("test-program:parent-b");
            assertThatThrownBy(() -> new RegistryPreflightService(properties, objectMapper)
                            .inspectConfiguredRegistry())
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("scope does not match");

            properties.setRegistryScope(REGISTRY_SCOPE);
            properties.setExpectedRegistryKeyFingerprint(
                    "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            assertThatThrownBy(() -> new RegistryPreflightService(properties, objectMapper)
                            .inspectConfiguredRegistry())
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("EXPECTED_KEY_FINGERPRINT");
        }
    }

    @Test
    void canDiscoverTheSignedScopeWithoutAClientSideParentDefault() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, false, 0)) {
            RegistryConfiguration properties = properties(registry);
            properties.setRegistryScope("");

            com.raxim.myscoutee.domain.registry.dto.RegistryInspection inspection =
                    new RegistryPreflightService(properties, objectMapper)
                            .inspectConfiguredRegistry();

            assertThat(inspection.registryScope()).isEqualTo(REGISTRY_SCOPE);
            assertThat(properties.getRegistryScope()).isEmpty();
            assertThat(Files.exists(properties.getPrivateKeyPath())).isFalse();
            assertThat(Files.exists(properties.getStateDir())).isFalse();
        }
    }

    @Test
    void identityGetUsesTheConfiguredResponseSizeBound() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (IdentityServer registry = new IdentityServer(objectMapper, REGISTRY_SCOPE, false, 2_048)) {
            RegistryConfiguration properties = properties(registry);
            properties.setMaxResponseBytes(1_024);

            assertThatThrownBy(() -> new RegistryHttpClient(properties, objectMapper).inspectIdentity())
                    .isInstanceOf(com.raxim.myscoutee.domain.registry.api.RegistryHttpException.class)
                    .extracting(exception -> ((com.raxim.myscoutee.domain.registry.api.RegistryHttpException) exception).getErrorCode())
                    .isEqualTo("registry_response_too_large");
        }
    }

    private RegistryConfiguration properties(IdentityServer registry) {
        RegistryConfiguration properties = new RegistryConfiguration();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setBaseUrl(registry.baseUrl());
        properties.setRegistryScope(REGISTRY_SCOPE);
        properties.setAllowInsecureHttp(true);
        Path keyDirectory = temporaryDirectory.resolve("keys");
        properties.setPrivateKeyPath(keyDirectory.resolve("deployment-private-key.pem"));
        properties.setPublicKeyPath(keyDirectory.resolve("deployment-public-key.der"));
        properties.setStateDir(temporaryDirectory.resolve("state"));
        return properties;
    }

    private static final class IdentityServer implements AutoCloseable {
        private final ObjectMapper objectMapper;
        private final HttpServer server;
        private final AtomicReference<Throwable> failure = new AtomicReference<>();
        private final int responsePadding;
        private final String fingerprint;
        private final RegistryIdentityResponse identity;
        private final AtomicReference<String> requestMethod = new AtomicReference<>();

        private IdentityServer(
                ObjectMapper objectMapper,
                String registryScope,
                boolean corruptSignature,
                int responsePadding) throws Exception {
            this.objectMapper = objectMapper;
            this.responsePadding = responsePadding;
            KeyPair keyPair = RegistryTestIdentity.generate();
            String publicKey = RegistryProtocol.standardBase64(keyPair.getPublic().getEncoded());
            this.fingerprint = RegistryProtocol.publicKeyFingerprint(keyPair.getPublic().getEncoded());
            String keyId = RegistryProtocol.registryKeyId(fingerprint);
            RegistryIdentityResponse unsigned = new RegistryIdentityResponse(
                    RegistryProtocol.PROTOCOL_VERSION,
                    registryScope,
                    keyId,
                    publicKey,
                    "");
            String signature = RegistryTestIdentity.sign(
                    keyPair.getPrivate(),
                    RegistryProtocol.registryIdentity(unsigned));
            if (corruptSignature) {
                signature = RegistryProtocol.standardBase64(new byte[64]);
            }
            this.identity = new RegistryIdentityResponse(
                    unsigned.protocolVersion(),
                    unsigned.registryScope(),
                    unsigned.registryKeyId(),
                    unsigned.registryPublicKey(),
                    signature);
            this.server = HttpServer.create(
                    new InetSocketAddress(InetAddress.getLoopbackAddress(), 0),
                    0);
            server.createContext(RegistryProtocol.REGISTRY_IDENTITY_PATH, this::handle);
            server.start();
        }

        private void handle(HttpExchange exchange) {
            try (exchange) {
                requestMethod.set(exchange.getRequestMethod());
                byte[] body;
                if (responsePadding == 0) {
                    body = objectMapper.writeValueAsBytes(identity);
                } else {
                    body = ("{\"padding\":\""
                                    + "x".repeat(responsePadding)
                                    + "\"}")
                            .getBytes(StandardCharsets.UTF_8);
                }
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, body.length);
                exchange.getResponseBody().write(body);
            } catch (Throwable throwable) {
                failure.compareAndSet(null, throwable);
            }
        }

        private String baseUrl() {
            return "http://127.0.0.1:" + server.getAddress().getPort();
        }

        private void assertHealthy() {
            assertThat(failure.get()).isNull();
        }

        @Override
        public void close() {
            server.stop(0);
        }
    }
}
