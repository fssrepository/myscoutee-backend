package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectRequestDto;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.registry.RegistryNodeIdentityService.NodeIdentity;
import com.raxim.myscoutee.registry.RegistryOperatorOperations;
import com.raxim.myscoutee.registry.RegistryOperatorOperations.EnrollmentOutcome;
import com.raxim.myscoutee.registry.RegistryOperatorOperations.NodeStatus;
import com.raxim.myscoutee.registry.RegistryPreflightService.RegistryInspection;
import com.raxim.myscoutee.registry.RegistryProtocol;

class OperatorRegistryServiceTest {
    private static final Instant NOW = Instant.parse("2026-07-28T10:15:30Z");
    private static final String REGISTRY_FINGERPRINT =
            "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private static final String NODE_FINGERPRINT =
            "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

    @TempDir
    Path tempDirectory;

    private OperatorRegistrySettingsRepository repository;
    private RegistryOperatorOperations operations;
    private RegistryProperties realProperties;
    private RegistryDemoProperties demoProperties;
    private AtomicReference<OperatorRegistrySettings> stored;

    @BeforeEach
    void setUp() {
        repository = mock(OperatorRegistrySettingsRepository.class);
        operations = mock(RegistryOperatorOperations.class);
        realProperties = new RegistryProperties();
        realProperties.setPrivateKeyPath(tempDirectory.resolve("real/key.pem"));
        realProperties.setPublicKeyPath(tempDirectory.resolve("real/key.der"));
        realProperties.setStateDir(tempDirectory.resolve("real/state"));
        demoProperties = new RegistryDemoProperties();
        demoProperties.setPrivateKeyPath(tempDirectory.resolve("demo/key.pem"));
        demoProperties.setPublicKeyPath(tempDirectory.resolve("demo/key.der"));
        demoProperties.setStateDir(tempDirectory.resolve("demo/state"));
        stored = new AtomicReference<>();
        when(repository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenAnswer(ignored -> Optional.ofNullable(stored.get()));
        when(repository.save(any(OperatorRegistrySettings.class)))
                .thenAnswer(invocation -> {
                    OperatorRegistrySettings value = invocation.getArgument(0);
                    stored.set(value);
                    return value;
                });
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void sampleExploreNeverTouchesNetworkKeysOrRegistryState() {
        demoProperties.setMode("sample");
        OperatorRegistryService service = service();

        var initial = service.status();
        var inspection = service.inspect(
                new RegistryInspectRequestDto(null, null),
                "operator-demo-dev");
        var confirmed = service.confirm(inspection.inspectionToken(), "operator-demo-dev");

        assertThat(initial.nodeIdentity().state()).isEqualTo("MISSING");
        assertThat(inspection.simulation()).isTrue();
        assertThat(confirmed.simulation()).isTrue();
        assertThat(confirmed.lifecycle()).isEqualTo("REGISTERED");
        assertThat(confirmed.nodeIdentity().state()).isEqualTo("SIMULATED");
        assertThat(confirmed.enrollment().deploymentCode()).startsWith("dep_");
        assertThat(tempDirectory.resolve("demo/key.pem")).doesNotExist();
        assertThat(tempDirectory.resolve("demo/state")).doesNotExist();
        verify(operations, never()).inspect(any());
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());
    }

    @Test
    void liveInspectPersistsOnlyDraftAndDoesNotInitializeOrRegister() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        OperatorRegistryService service = service();

        var response = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        assertThat(response.registryIdentity().registryKeyId()).isEqualTo("rkey_test");
        assertThat(stored.get().getDraftInspection()).isNotNull();
        assertThat(stored.get().getSelection()).isNull();
        assertThat(stored.get().getNodeIdentity()).isNull();
        assertThat(stored.get().getEnrollment()).isNull();
        verify(operations).inspect(any());
        verify(operations, never()).inspectNodeIdentity(any());
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());
    }

    @Test
    void failedConfirmStaysRetryableAndRetryCompletesIdempotently() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any()))
                .thenThrow(new IllegalStateException("connection unavailable"))
                .thenReturn(new EnrollmentOutcome(
                        "dep_0123456789abcdef0123456789abcdef",
                        "batch_0123456789abcdef0123456789abcdef",
                        NOW.plusSeconds(1).toString(),
                        1L));
        OperatorRegistryService service = service();
        var inspection = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        var failed = service.confirm(inspection.inspectionToken(), "operator-demo-dev");
        var completed = service.retry("operator-demo-dev");
        var repeated = service.retry("operator-demo-dev");

        assertThat(failed.lifecycle()).isEqualTo("ERROR");
        assertThat(failed.lastError().retryable()).isTrue();
        assertThat(completed.lifecycle()).isEqualTo("REGISTERED");
        assertThat(completed.enrollment().deploymentCode())
                .isEqualTo("dep_0123456789abcdef0123456789abcdef");
        assertThat(repeated).isEqualTo(completed);
        verify(operations).initializeNodeIdentity(any());
        verify(operations, times(2)).synchronize(any());

        ArgumentCaptor<RegistryProperties> runtime = ArgumentCaptor.forClass(RegistryProperties.class);
        verify(operations, times(2)).synchronize(runtime.capture());
        assertThat(runtime.getAllValues())
                .allSatisfy(properties -> {
                    assertThat(properties.getPrivateKeyPath())
                            .isEqualTo(tempDirectory.resolve("demo/key.pem"));
                    assertThat(properties.getStateDir())
                            .isEqualTo(tempDirectory.resolve("demo/state"));
                });
    }

    @Test
    void automaticRetrySkipsTerminalErrorsButExplicitRetryRemainsAvailable() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT))
                .thenReturn(new NodeStatus("MISSING", null));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenThrow(new IllegalStateException("connection unavailable"));
        OperatorRegistryService service = service();
        var inspection = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        service.confirm(inspection.inspectionToken(), "operator-demo-dev");
        var retry = service.retry("operator-demo-dev");

        assertThat(retry.lifecycle()).isEqualTo("ERROR");
        assertThat(retry.lastError().code()).isEqualTo("NODE_IDENTITY_MISSING");
        assertThat(retry.lastError().retryable()).isFalse();
        verify(operations).initializeNodeIdentity(any());
        verify(operations).synchronize(any());

        clearInvocations(operations);
        service.retryPendingSelections();
        verify(operations, never()).inspectNodeIdentity(any());
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());

        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(new EnrollmentOutcome(
                "dep_0123456789abcdef0123456789abcdef",
                "batch_0123456789abcdef0123456789abcdef",
                NOW.plusSeconds(1).toString(),
                1L));

        var explicitlyRetried = service.retry("operator-demo-dev");

        assertThat(explicitlyRetried.lifecycle()).isEqualTo("REGISTERED");
        assertThat(explicitlyRetried.lastError()).isNull();
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations).synchronize(any());
    }

    @Test
    void realModeRejectsHttpBeforeAnyRegistryOperation() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        OperatorRegistryService service = service();

        assertThatThrownBy(() -> service.inspect(
                new RegistryInspectRequestDto("http://registry.example", "prod:one"),
                "operator"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
        verify(operations, never()).inspect(any());
    }

    @Test
    void realOperatorConfirmationSuppliesConsentButPreservesHostOutboundPolicy() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        realProperties.setOutboundAllowed(true);
        when(operations.inspect(any())).thenReturn(new RegistryInspection(
                "https://registry.example" + RegistryProtocol.REGISTRY_IDENTITY_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                "prod:one",
                "rkey_test",
                REGISTRY_FINGERPRINT,
                "public-key"));
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(new EnrollmentOutcome(
                "dep_0123456789abcdef0123456789abcdef",
                "batch_0123456789abcdef0123456789abcdef",
                NOW.plusSeconds(1).toString(),
                1L));
        OperatorRegistryService service = service();

        var inspection = service.inspect(
                new RegistryInspectRequestDto("https://registry.example", "prod:one"),
                "operator");
        var confirmed = service.confirm(inspection.inspectionToken(), "operator");

        assertThat(confirmed.lifecycle()).isEqualTo("REGISTERED");
        assertThat(realProperties.isOperatorRegistrationConfirmed()).isFalse();

        ArgumentCaptor<RegistryProperties> inspections =
                ArgumentCaptor.forClass(RegistryProperties.class);
        verify(operations, times(2)).inspect(inspections.capture());
        assertThat(inspections.getAllValues())
                .allSatisfy(properties -> {
                    assertThat(properties.isEnabled()).isTrue();
                    assertThat(properties.isOutboundAllowed()).isTrue();
                    assertThat(properties.isOperatorRegistrationConfirmed()).isFalse();
                });

        ArgumentCaptor<RegistryProperties> enrollment =
                ArgumentCaptor.forClass(RegistryProperties.class);
        verify(operations).synchronize(enrollment.capture());
        assertThat(enrollment.getValue().isEnabled()).isTrue();
        assertThat(enrollment.getValue().isOutboundAllowed()).isTrue();
        assertThat(enrollment.getValue().isOperatorRegistrationConfirmed()).isTrue();
        assertThat(enrollment.getValue().isActive()).isTrue();
    }

    @Test
    void realInspectionCannotTurnOnTheHostOutboundKillSwitch() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        realProperties.setOutboundAllowed(false);
        when(operations.inspect(any())).thenReturn(new RegistryInspection(
                "https://registry.example" + RegistryProtocol.REGISTRY_IDENTITY_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                "prod:one",
                "rkey_test",
                REGISTRY_FINGERPRINT,
                "public-key"));
        OperatorRegistryService service = service();

        service.inspect(
                new RegistryInspectRequestDto("https://registry.example", "prod:one"),
                "operator");

        ArgumentCaptor<RegistryProperties> runtime =
                ArgumentCaptor.forClass(RegistryProperties.class);
        verify(operations).inspect(runtime.capture());
        assertThat(runtime.getValue().isEnabled()).isTrue();
        assertThat(runtime.getValue().isOperatorRegistrationConfirmed()).isFalse();
        assertThat(runtime.getValue().isOutboundAllowed()).isFalse();
        assertThat(runtime.getValue().isActive()).isFalse();
    }

    @Test
    void disconnectPreservesDeploymentCodeAndDisablesRetry() {
        demoProperties.setMode("sample");
        OperatorRegistryService service = service();
        var inspection = service.inspect(new RegistryInspectRequestDto(null, null), "operator-demo-dev");
        var registered = service.confirm(inspection.inspectionToken(), "operator-demo-dev");

        var disconnected = service.disconnect("operator-demo-dev");

        assertThat(disconnected.lifecycle()).isEqualTo("DISABLED");
        assertThat(disconnected.enabled()).isFalse();
        assertThat(disconnected.enrollment().deploymentCode())
                .isEqualTo(registered.enrollment().deploymentCode());
        assertThatThrownBy(() -> service.retry("operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void sameSignedRegistryCanBeReconfirmedAfterItsBaseUrlChanges() {
        demoProperties.setMode("sample");
        OperatorRegistryService service = service();
        var firstInspection =
                service.inspect(new RegistryInspectRequestDto(null, null), "operator-demo-dev");
        service.confirm(firstInspection.inspectionToken(), "operator-demo-dev");

        var movedInspection = service.inspect(
                new RegistryInspectRequestDto("https://moved-registry.example", SAMPLE_SCOPE),
                "operator-demo-dev");
        var moved = service.confirm(movedInspection.inspectionToken(), "operator-demo-dev");

        assertThat(moved.lifecycle()).isEqualTo("REGISTERED");
        assertThat(moved.selection().baseUrl()).isEqualTo("https://moved-registry.example");
    }

    @Test
    void optimisticConflictDoesNotOverwriteAnotherInstancesSelection() {
        demoProperties.setMode("sample");
        when(repository.save(any(OperatorRegistrySettings.class)))
                .thenThrow(new OptimisticLockingFailureException("stale version"));
        OperatorRegistryService service = service();

        assertThatThrownBy(() -> service.inspect(
                new RegistryInspectRequestDto(null, null),
                "operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void statusRemainsReadableWhenNodeFilesCannotBeInspected() {
        configureLiveDemo();
        when(operations.inspectNodeIdentity(any()))
                .thenThrow(new IllegalStateException("filesystem unavailable"));
        OperatorRegistryService service = service();

        var status = service.status();

        assertThat(status.lifecycle()).isEqualTo("UNCONFIGURED");
        assertThat(status.nodeIdentity().state()).isEqualTo("INCOMPLETE");
    }

    private OperatorRegistryService service() {
        return new OperatorRegistryService(
                repository,
                realProperties,
                demoProperties,
                operations,
                new OperatorRegistryMapper(),
                Clock.fixed(NOW, ZoneOffset.UTC),
                new SecureRandom());
    }

    private void configureLiveDemo() {
        demoProperties.setMode("live");
        demoProperties.setCandidateBaseUrl("http://registry:8080");
        demoProperties.setCandidateScope("demo:local-registry");
        demoProperties.setAllowInsecureHttp(true);
        demoProperties.setInsecureHttpAllowedHosts("registry");
    }

    private RegistryInspection registryInspection() {
        return new RegistryInspection(
                "http://registry:8080" + RegistryProtocol.REGISTRY_IDENTITY_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                "demo:local-registry",
                "rkey_test",
                REGISTRY_FINGERPRINT,
                "public-key");
    }

    private static final String SAMPLE_SCOPE = "demo:sample";
}
