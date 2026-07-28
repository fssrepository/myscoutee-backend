package com.raxim.myscoutee.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertTimeoutPreemptively;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.security.PublicKey;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.registry.RegistryProtocol.BatchRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.MauReceipt;
import com.raxim.myscoutee.registry.RegistryProtocol.RegistrationRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.RegistrationResponse;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import tools.jackson.databind.ObjectMapper;

class RegistryEnrollmentServiceTest {
    private static final Instant REQUEST_TIME = Instant.parse("2026-07-28T00:00:02Z");
    private static final String DEPLOYMENT_ID = "dep_0123456789abcdef0123456789abcdef";
    private static final String BATCH_ID = "batch_0123456789abcdef0123456789abcdef";
    private static final String ACCEPTED_AT = "2026-07-28T00:00:03Z";
    private static final String REGISTRY_SCOPE = "test-program:parent-a";

    @TempDir
    Path temporaryDirectory;

    @Test
    void enrollmentOperationIsNotAnAutomaticSpringControlPlane() throws Exception {
        assertThat(RegistryEnrollmentService.class.isAnnotationPresent(Service.class)).isFalse();
        assertThat(RegistryEnrollmentService.class
                        .getMethod("attemptWhenApplicationIsReady")
                        .isAnnotationPresent(EventListener.class))
                .isFalse();
        assertThat(RegistryEnrollmentService.class
                        .getMethod("retryIncompleteEnrollment")
                        .isAnnotationPresent(Scheduled.class))
                .isFalse();
    }

    @Test
    void enrollmentWithoutOperatorConfirmationDoesNotTouchKeysStateOrNetwork() {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = new RegistryProperties();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setBaseUrl("not a URI");
        properties.setPrivateKeyPath(temporaryDirectory.resolve("missing-private.pem"));
        properties.setPublicKeyPath(temporaryDirectory.resolve("missing-public.der"));
        properties.setStateDir(temporaryDirectory.resolve("missing-state"));
        RegistryEnrollmentService service = service(
                properties,
                new RegistryLocalStore(properties, objectMapper),
                objectMapper);

        RegistryEnrollmentService.SyncResult result = service.synchronizeNow();

        assertThat(result.active()).isFalse();
        assertThat(result.completed()).isFalse();
        assertThat(Files.exists(properties.getStateDir())).isFalse();
    }

    @Test
    void activeMissingInstallerKeysDoesNotBlockOrFailApplicationReadyHandling() {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = new RegistryProperties();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setOperatorRegistrationConfirmed(true);
        properties.setBaseUrl("http://127.0.0.1:1");
        properties.setRegistryScope(REGISTRY_SCOPE);
        properties.setAllowInsecureHttp(true);
        properties.setPrivateKeyPath(temporaryDirectory.resolve("missing-private.pem"));
        properties.setPublicKeyPath(temporaryDirectory.resolve("missing-public.der"));
        properties.setStateDir(temporaryDirectory.resolve("missing-state"));
        RegistryEnrollmentService service = service(
                properties,
                new RegistryLocalStore(properties, objectMapper),
                objectMapper);

        assertTimeoutPreemptively(
                Duration.ofSeconds(1),
                () -> assertThatCode(service::attemptWhenApplicationIsReady)
                        .doesNotThrowAnyException());
        assertThatCode(service::retryIncompleteEnrollment).doesNotThrowAnyException();
        assertThatThrownBy(service::synchronizeNow)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("operator must initialize");
    }

    @Test
    void retryKeepsDurableIdempotencyStateAndDoesNotAppendTwice() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        TestRegistry registry = new TestRegistry(objectMapper, true, false);
        try (registry) {
            RegistryProperties properties = properties(registry, "backend-v1");
            RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);
            RegistryEnrollmentService firstProcess = service(properties, store, objectMapper);

            assertThatThrownBy(firstProcess::synchronizeNow)
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class)
                    .hasMessageContaining("temporarily unavailable");

            LocalState afterFailure = store.load().orElseThrow();
            assertThat(afterFailure.registration()).isNotNull();
            assertThat(afterFailure.installationBatch()).isNull();
            assertThat(afterFailure.registrationSoftwareVersion()).isEqualTo("backend-v1");
            assertThat(registry.registrationRequests).hasSize(1);
            assertThat(registry.batchRequests).hasSize(1);

            String registrationIdempotencyKey = afterFailure.registrationIdempotencyKey();
            String installationIdempotencyKey = afterFailure.installationIdempotencyKey();
            String firstBatchNonce = registry.batchRequests.getFirst().nonce();

            properties.setSoftwareVersion("backend-v2");
            RegistryEnrollmentService restartedProcess = service(
                    properties,
                    new RegistryLocalStore(properties, objectMapper),
                    objectMapper);
            RegistryEnrollmentService.SyncResult completed = restartedProcess.synchronizeNow();

            assertThat(completed.active()).isTrue();
            assertThat(completed.completed()).isTrue();
            assertThat(completed.deploymentId()).isEqualTo(DEPLOYMENT_ID);
            assertThat(completed.batchId()).isEqualTo(BATCH_ID);
            assertThat(registry.registrationRequests).hasSize(1);
            assertThat(registry.batchRequests).hasSize(2);
            assertThat(registry.batchRequests)
                    .extracting(BatchRequest::idempotencyKey)
                    .containsOnly(installationIdempotencyKey);
            assertThat(registry.batchRequests.get(1).nonce()).isNotEqualTo(firstBatchNonce);

            LocalState completedState = store.load().orElseThrow();
            assertThat(completedState.registryScope()).isEqualTo(REGISTRY_SCOPE);
            assertThat(completedState.registrationIdempotencyKey()).isEqualTo(registrationIdempotencyKey);
            assertThat(completedState.installationIdempotencyKey()).isEqualTo(installationIdempotencyKey);
            assertThat(completedState.registrationSoftwareVersion()).isEqualTo("backend-v1");
            assertThat(completedState.deploymentId()).isEqualTo(DEPLOYMENT_ID);
            assertThat(completedState.installationBatch()).isNotNull();
            assertThat(store.loadInstallationReceipt(BATCH_ID)).contains(completedState.installationBatch());

            RegistryEnrollmentService.SyncResult repeated = restartedProcess.synchronizeNow();
            assertThat(repeated).isEqualTo(completed);
            assertThat(registry.registrationRequests).hasSize(1);
            assertThat(registry.batchRequests).hasSize(2);

            properties.setRegistryScope("test-program:parent-b");
            assertThatThrownBy(restartedProcess::synchronizeNow)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("refusing silent parent or accounting-domain change");
            assertThat(registry.registrationRequests).hasSize(1);
            assertThat(registry.batchRequests).hasSize(2);
            registry.assertHealthy();
        }
    }

    @Test
    void invalidCentralReceiptIsNotPersistedOrMarkedComplete() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        TestRegistry registry = new TestRegistry(objectMapper, false, true);
        try (registry) {
            RegistryProperties properties = properties(registry, "backend-v1");
            RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);

            assertThatThrownBy(service(properties, store, objectMapper)::synchronizeNow)
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("signature is invalid");

            LocalState state = store.load().orElseThrow();
            assertThat(state.registration()).isNotNull();
            assertThat(state.installationBatch()).isNull();
            assertThat(store.loadInstallationReceipt(BATCH_ID)).isEmpty();
            registry.assertHealthy();
        }
    }

    @Test
    void responseFromAnotherRegistryScopeIsRejectedBeforeItCanBePersisted() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        TestRegistry registry = new TestRegistry(
                objectMapper,
                false,
                false,
                "test-program:parent-b");
        try (registry) {
            RegistryProperties properties = properties(registry, "backend-v1");
            RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);

            assertThatThrownBy(service(properties, store, objectMapper)::synchronizeNow)
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("scope does not match");

            LocalState state = store.load().orElseThrow();
            assertThat(state.registryScope()).isEqualTo(REGISTRY_SCOPE);
            assertThat(state.registration()).isNull();
            assertThat(registry.registrationRequests).hasSize(1);
            assertThat(registry.batchRequests).isEmpty();
            registry.assertHealthy();
        }
    }

    @Test
    void persistedRegistrationReceiptMustRemainBoundToTheTopLevelDeploymentId() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        RegistryProperties properties = new RegistryProperties();
        Path stateDirectory = temporaryDirectory.resolve("binding-state");
        Files.createDirectory(stateDirectory);
        properties.setStateDir(stateDirectory);
        RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);
        LocalState initial = store.createInitial(
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                REGISTRY_SCOPE,
                "backend-v1",
                new java.security.SecureRandom(),
                REQUEST_TIME);
        RegistrationResponse receipt = new RegistrationResponse(
                RegistryProtocol.PROTOCOL_VERSION,
                REGISTRY_SCOPE,
                DEPLOYMENT_ID,
                REQUEST_TIME.toString(),
                initial.publicKeyFingerprint(),
                "rkey_0123456789abcdef0123456789abcdef",
                "MCowBQYDK2VwAyEA//////////////////////////////////////////8=",
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
                false);
        LocalState registered = initial.withRegistration(
                receipt,
                "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                REQUEST_TIME);
        LocalState mismatched = new LocalState(
                registered.schemaVersion(),
                registered.protocolVersion(),
                registered.registryScope(),
                registered.publicKeyFingerprint(),
                registered.registrationIdempotencyKey(),
                registered.registrationSoftwareVersion(),
                registered.installationIdempotencyKey(),
                registered.installationPeriod(),
                registered.trustedRegistryKeyFingerprint(),
                "dep_ffffffffffffffffffffffffffffffff",
                registered.registration(),
                registered.installationBatch(),
                registered.updatedAt());
        Files.writeString(
                properties.statePath(),
                objectMapper.writeValueAsString(mismatched),
                StandardCharsets.UTF_8);

        assertThatThrownBy(store::load)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("deployment ID does not match");
    }

    private RegistryProperties properties(TestRegistry registry, String softwareVersion) throws IOException {
        Path keyDirectory = temporaryDirectory.resolve("keys-" + softwareVersion);
        Path stateDirectory = temporaryDirectory.resolve("state-" + softwareVersion);
        RegistryTestIdentity.writeDeploymentIdentity(keyDirectory, RegistryTestIdentity.generate());
        Files.createDirectory(stateDirectory);

        RegistryProperties properties = new RegistryProperties();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setOperatorRegistrationConfirmed(true);
        properties.setBaseUrl(registry.baseUrl());
        properties.setRegistryScope(REGISTRY_SCOPE);
        properties.setPrivateKeyPath(keyDirectory.resolve("deployment-private-key.pem"));
        properties.setPublicKeyPath(keyDirectory.resolve("deployment-public-key.der"));
        properties.setStateDir(stateDirectory);
        properties.setSoftwareVersion(softwareVersion);
        properties.setConnectTimeout(Duration.ofSeconds(2));
        properties.setRequestTimeout(Duration.ofSeconds(2));
        properties.setAllowInsecureHttp(true);
        properties.setExpectedRegistryKeyFingerprint(registry.registryFingerprint);
        return properties;
    }

    private RegistryEnrollmentService service(
            RegistryProperties properties,
            RegistryLocalStore store,
            ObjectMapper objectMapper) {
        return new RegistryEnrollmentService(
                properties,
                store,
                new RegistryHttpClient(properties, objectMapper),
                Clock.fixed(REQUEST_TIME, ZoneOffset.UTC),
                new java.security.SecureRandom());
    }

    private static final class TestRegistry implements AutoCloseable {
        private final ObjectMapper objectMapper;
        private final HttpServer server;
        private final KeyPair registryKeyPair = RegistryTestIdentity.generate();
        private final String registryPublicKey =
                RegistryProtocol.standardBase64(registryKeyPair.getPublic().getEncoded());
        private final String registryFingerprint =
                RegistryProtocol.publicKeyFingerprint(registryKeyPair.getPublic().getEncoded());
        private final String registryKeyId = RegistryProtocol.registryKeyId(registryFingerprint);
        private final boolean failFirstBatch;
        private final boolean corruptBatchSignature;
        private final String responseRegistryScope;
        private final AtomicReference<Throwable> handlerFailure = new AtomicReference<>();
        private final List<RegistrationRequest> registrationRequests = new ArrayList<>();
        private final List<BatchRequest> batchRequests = new ArrayList<>();
        private volatile PublicKey deploymentPublicKey;

        private TestRegistry(
                ObjectMapper objectMapper,
                boolean failFirstBatch,
                boolean corruptBatchSignature) throws IOException {
            this(objectMapper, failFirstBatch, corruptBatchSignature, REGISTRY_SCOPE);
        }

        private TestRegistry(
                ObjectMapper objectMapper,
                boolean failFirstBatch,
                boolean corruptBatchSignature,
                String responseRegistryScope) throws IOException {
            this.objectMapper = objectMapper;
            this.failFirstBatch = failFirstBatch;
            this.corruptBatchSignature = corruptBatchSignature;
            this.responseRegistryScope = responseRegistryScope;
            this.server = HttpServer.create(
                    new InetSocketAddress(InetAddress.getLoopbackAddress(), 0),
                    0);
            server.createContext(RegistryProtocol.REGISTRATION_PATH, this::handleRegistration);
            server.createContext(RegistryProtocol.MAU_BATCH_PATH, this::handleBatch);
            server.start();
        }

        private String baseUrl() {
            return "http://127.0.0.1:" + server.getAddress().getPort();
        }

        private void handleRegistration(HttpExchange exchange) throws IOException {
            try {
                require("POST".equals(exchange.getRequestMethod()), "Registration method was not POST.");
                RegistrationRequest request = objectMapper.readValue(
                        exchange.getRequestBody().readAllBytes(),
                        RegistrationRequest.class);
                registrationRequests.add(request);
                require(REGISTRY_SCOPE.equals(request.registryScope()), "Registration scope was invalid.");
                deploymentPublicKey = RegistryCrypto.parseRegistryPublicKey(request.publicKey());
                String fingerprint = RegistryProtocol.publicKeyFingerprint(deploymentPublicKey.getEncoded());
                String expectedPayloadHash = RegistryProtocol.sha256(RegistryProtocol.registrationPayload(
                        request.keyAlgorithm(),
                        request.publicKey(),
                        request.softwareVersion()));
                require(expectedPayloadHash.equals(request.payloadHash()), "Registration payload hash was invalid.");
                require(RegistryCrypto.verifyBase64(
                                deploymentPublicKey,
                                RegistryProtocol.signedRequest(
                                        exchange.getRequestMethod(),
                                        exchange.getRequestURI().getPath(),
                                        request.protocolVersion(),
                                        request.registryScope(),
                                        fingerprint,
                                        request.timestamp(),
                                        request.nonce(),
                                        request.idempotencyKey(),
                                        request.payloadHash()),
                                request.signature()),
                        "Registration signature was invalid.");

                RegistrationResponse unsigned = new RegistrationResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        responseRegistryScope,
                        DEPLOYMENT_ID,
                        "2026-07-28T00:00:01Z",
                        fingerprint,
                        registryKeyId,
                        registryPublicKey,
                        null,
                        false);
                RegistrationResponse response = new RegistrationResponse(
                        unsigned.protocolVersion(),
                        unsigned.registryScope(),
                        unsigned.deploymentId(),
                        unsigned.registeredAt(),
                        unsigned.publicKeyFingerprint(),
                        unsigned.registryKeyId(),
                        unsigned.registryPublicKey(),
                        RegistryTestIdentity.sign(
                                registryKeyPair.getPrivate(),
                                RegistryProtocol.registrationReceipt(unsigned)),
                        false);
                sendJson(exchange, 201, response);
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private void handleBatch(HttpExchange exchange) throws IOException {
            try {
                require("POST".equals(exchange.getRequestMethod()), "Batch method was not POST.");
                BatchRequest request = objectMapper.readValue(
                        exchange.getRequestBody().readAllBytes(),
                        BatchRequest.class);
                batchRequests.add(request);
                require(REGISTRY_SCOPE.equals(request.registryScope()), "Batch scope was invalid.");
                require(deploymentPublicKey != null, "Deployment was not registered before its batch.");
                String commitmentHash = RegistryProtocol.sha256(RegistryProtocol.installationCommitment(
                        request.deploymentId(),
                        request.idempotencyKey()));
                String payloadHash = RegistryProtocol.sha256(RegistryProtocol.mauBatchPayload(
                        request.kind(),
                        request.period(),
                        request.rulesetVersion(),
                        request.qualifiedMauCount(),
                        request.commitmentHash()));
                require(commitmentHash.equals(request.commitmentHash()), "Batch commitment hash was invalid.");
                require(payloadHash.equals(request.payloadHash()), "Batch payload hash was invalid.");
                require(RegistryCrypto.verifyBase64(
                                deploymentPublicKey,
                                RegistryProtocol.signedRequest(
                                        exchange.getRequestMethod(),
                                        exchange.getRequestURI().getPath(),
                                        request.protocolVersion(),
                                        request.registryScope(),
                                        request.deploymentId(),
                                        request.timestamp(),
                                        request.nonce(),
                                        request.idempotencyKey(),
                                        request.payloadHash()),
                                request.signature()),
                        "Batch signature was invalid.");
                if (failFirstBatch && batchRequests.size() == 1) {
                    sendError(exchange, 503, "registry_unavailable", "Registry temporarily unavailable.");
                    return;
                }

                long ledgerIndex = 1L;
                String entryHash = RegistryProtocol.sha256(RegistryProtocol.ledgerEntry(
                        RegistryProtocol.PROTOCOL_VERSION,
                        REGISTRY_SCOPE,
                        ledgerIndex,
                        RegistryProtocol.INSTALLATION_ENTRY_TYPE,
                        DEPLOYMENT_ID,
                        BATCH_ID,
                        request.kind(),
                        request.period(),
                        request.rulesetVersion(),
                        request.qualifiedMauCount(),
                        request.payloadHash(),
                        RegistryProtocol.ZERO_HASH,
                        ACCEPTED_AT));
                MauReceipt unsignedReceipt = new MauReceipt(
                        ledgerIndex,
                        entryHash,
                        RegistryProtocol.ZERO_HASH,
                        request.payloadHash(),
                        request.kind(),
                        request.period(),
                        request.rulesetVersion(),
                        request.qualifiedMauCount(),
                        ACCEPTED_AT,
                        "2026-07-28",
                        REGISTRY_SCOPE,
                        registryKeyId,
                        registryPublicKey,
                        null);
                BatchResponse unsignedResponse = new BatchResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        REGISTRY_SCOPE,
                        BATCH_ID,
                        DEPLOYMENT_ID,
                        request.idempotencyKey(),
                        false,
                        unsignedReceipt);
                String receiptSignature = RegistryTestIdentity.sign(
                        registryKeyPair.getPrivate(),
                        RegistryProtocol.mauReceipt(unsignedResponse));
                if (corruptBatchSignature) {
                    receiptSignature = RegistryProtocol.standardBase64(new byte[64]);
                }
                MauReceipt signedReceipt = new MauReceipt(
                        unsignedReceipt.ledgerIndex(),
                        unsignedReceipt.entryHash(),
                        unsignedReceipt.previousEntryHash(),
                        unsignedReceipt.batchHash(),
                        unsignedReceipt.kind(),
                        unsignedReceipt.period(),
                        unsignedReceipt.rulesetVersion(),
                        unsignedReceipt.qualifiedMauCount(),
                        unsignedReceipt.acceptedAt(),
                        unsignedReceipt.checkpointDate(),
                        unsignedReceipt.registryScope(),
                        unsignedReceipt.registryKeyId(),
                        unsignedReceipt.registryPublicKey(),
                        receiptSignature);
                sendJson(exchange, 201, new BatchResponse(
                        unsignedResponse.protocolVersion(),
                        unsignedResponse.registryScope(),
                        unsignedResponse.batchId(),
                        unsignedResponse.deploymentId(),
                        unsignedResponse.idempotencyKey(),
                        false,
                        signedReceipt));
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private void sendJson(HttpExchange exchange, int status, Object response) throws IOException {
            byte[] body = objectMapper.writeValueAsString(response).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        }

        private void sendError(HttpExchange exchange, int status, String code, String message) throws IOException {
            byte[] body = ("{\"error\":{\"code\":\"" + code + "\",\"message\":\"" + message + "\"}}")
                    .getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        }

        private void failExchange(HttpExchange exchange, Throwable failure) throws IOException {
            handlerFailure.compareAndSet(null, failure);
            sendError(exchange, 500, "test_registry_failure", "Test registry failed.");
        }

        private void assertHealthy() {
            Throwable failure = handlerFailure.get();
            if (failure != null) {
                throw new AssertionError("Test registry handler failed.", failure);
            }
        }

        private static void require(boolean condition, String message) {
            if (!condition) {
                throw new IllegalArgumentException(message);
            }
        }

        @Override
        public void close() {
            server.stop(0);
        }
    }
}
