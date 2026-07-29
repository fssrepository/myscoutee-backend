package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.inOrder;
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
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.document.OperatorClaimSubmissionSnapshot;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryRegisterRequestDto;
import com.raxim.myscoutee.profile.repository.OperatorClaimSubmissionSnapshotRepository;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.registry.RegistryNodeIdentityService.NodeIdentity;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkOperations;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionOutcome;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimStatus;
import com.raxim.myscoutee.registry.RegistryOperatorOperations;
import com.raxim.myscoutee.registry.RegistryOperatorOperations.EnrollmentOutcome;
import com.raxim.myscoutee.registry.RegistryOperatorOperations.NodeStatus;
import com.raxim.myscoutee.registry.RegistryPreflightService.RegistryInspection;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorActionReceipt;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorActionResponse;

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
    private RegistryOperatorNetworkOperations networkOperations;
    private OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository;
    private RegistryProperties realProperties;
    private RegistryDemoProperties demoProperties;
    private OperatorRegistryEndpointService endpointService;
    private AtomicReference<OperatorRegistrySettings> stored;

    @BeforeEach
    void setUp() {
        repository = mock(OperatorRegistrySettingsRepository.class);
        operations = mock(RegistryOperatorOperations.class);
        networkOperations = mock(RegistryOperatorNetworkOperations.class);
        claimSubmissionRepository =
                mock(OperatorClaimSubmissionSnapshotRepository.class);
        endpointService = mock(OperatorRegistryEndpointService.class);
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
    void demoHttpConfigurationNeverInitializesOrRegistersTheNode() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any())).thenReturn(new NodeStatus("MISSING", null));
        OperatorRegistryService service = service();

        var initial = service.status();
        var inspection = service.inspect(
                new RegistryInspectRequestDto(
                        "http://registry:8080",
                        "demo:local-registry"),
                "operator-demo-dev");
        var configured = service.confirm(inspection.inspectionToken(), "operator-demo-dev");

        assertThat(initial.nodeIdentity().state()).isEqualTo("MISSING");
        assertThat(inspection.simulation()).isFalse();
        assertThat(configured.simulation()).isFalse();
        assertThat(configured.lifecycle()).isEqualTo("CONFIGURED");
        assertThat(configured.nodeIdentity().state()).isEqualTo("MISSING");
        assertThat(configured.enrollment()).isNull();
        assertThat(tempDirectory.resolve("demo/key.pem")).doesNotExist();
        assertThat(tempDirectory.resolve("demo/state")).doesNotExist();
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());
        verify(operations, times(2)).inspect(any());
    }

    @Test
    void demoInspectionWithoutARequestDoesNotInventRegistryData() {
        OperatorRegistryService service = service();

        assertThatThrownBy(() -> service.inspect(null, "operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Registry base URL is required");
        assertThat(stored.get()).isNull();
        verify(operations, never()).inspect(any());
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());
    }

    @Test
    void statusCandidateComesFromTheMongoEndpointCatalog() {
        RegistryOptionDto seededOption = new RegistryOptionDto(
                "registry-demo-local",
                "Local registry",
                "http://registry:8080",
                "demo:local-registry",
                false);
        when(endpointService.options(null)).thenReturn(List.of(seededOption));
        when(operations.inspectNodeIdentity(any())).thenReturn(new NodeStatus("MISSING", null));
        OperatorRegistryService service = service();

        var status = service.status();

        assertThat(status.registryOptions()).containsExactly(seededOption);
        assertThat(status.candidateDefaults().baseUrl()).isEqualTo(seededOption.baseUrl());
        assertThat(status.candidateDefaults().registryScope())
                .isEqualTo(seededOption.registryScope());
    }

    @Test
    void liveInspectPersistsOnlyDraftAndDoesNotInitializeOrRegister() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        OperatorRegistryService service = service();

        var response = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        assertThat(response.registryIdentity().registryScope()).isEqualTo("demo:local-registry");
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
    void failedExplicitRegistrationStaysRetryableAndRetryCompletesIdempotently() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any()))
                .thenThrow(new IllegalStateException("connection unavailable"))
                .thenReturn(new EnrollmentOutcome(
                        "dep_0123456789abcdef0123456789abcdef",
                        "batch_0123456789abcdef0123456789abcdef",
                        NOW.plusSeconds(1).toString(),
                        1L,
                        false));
        OperatorRegistryService service = service();
        var inspection = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        var configured = service.confirm(inspection.inspectionToken(), "operator-demo-dev");
        assertThat(configured.lifecycle()).isEqualTo("CONFIGURED");
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());

        var failed = service.register(
                registerRequest("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");
        var completed = service.retry("operator-demo-dev");
        var repeated = service.retry("operator-demo-dev");

        assertThat(failed.status().lifecycle()).isEqualTo("ERROR");
        assertThat(failed.status().lastError().retryable()).isTrue();
        assertThat(failed.created()).isFalse();
        assertThat(failed.leaderboardEntry()).isNull();
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
    void manualRetryRequiresAnExplicitRegistrationRequest() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any())).thenReturn(new NodeStatus("MISSING", null));
        OperatorRegistryService service = service();
        var inspection = service.inspect(
                new RegistryInspectRequestDto("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        service.confirm(inspection.inspectionToken(), "operator-demo-dev");

        assertThatThrownBy(() -> service.retry("operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("No explicitly requested pending registration");
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());
    }

    @Test
    void explicitlyRequestedRegistrationCanBeRetriedAfterATerminalLocalError() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
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
        service.register(
                registerRequest("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");
        var retry = service.retry("operator-demo-dev");

        assertThat(retry.lifecycle()).isEqualTo("ERROR");
        assertThat(retry.lastError().code()).isEqualTo("NODE_IDENTITY_MISSING");
        assertThat(retry.lastError().retryable()).isFalse();
        verify(operations).initializeNodeIdentity(any());
        verify(operations).synchronize(any());

        clearInvocations(operations);
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        doReturn(new EnrollmentOutcome(
                "dep_0123456789abcdef0123456789abcdef",
                "batch_0123456789abcdef0123456789abcdef",
                NOW.plusSeconds(1).toString(),
                1L,
                false))
                .when(operations)
                .synchronize(any());

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
    void explicitRealRegistrationSuppliesConsentButPreservesHostOutboundPolicy() {
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
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(new EnrollmentOutcome(
                "dep_0123456789abcdef0123456789abcdef",
                "batch_0123456789abcdef0123456789abcdef",
                NOW.plusSeconds(1).toString(),
                1L,
                false));
        OperatorRegistryService service = service();

        var inspection = service.inspect(
                new RegistryInspectRequestDto("https://registry.example", "prod:one"),
                "operator");
        var configured = service.confirm(inspection.inspectionToken(), "operator");

        assertThat(configured.lifecycle()).isEqualTo("CONFIGURED");
        verify(operations, never()).initializeNodeIdentity(any());
        verify(operations, never()).synchronize(any());

        var registered = service.register(
                registerRequest("https://registry.example", "prod:one"),
                "operator");

        assertThat(registered.status().lifecycle()).isEqualTo("REGISTERED");
        assertThat(registered.created()).isTrue();
        assertThat(registered.leaderboardEntry().rowId())
                .isEqualTo("dep_0123456789abcdef0123456789abcdef");
        assertThat(realProperties.isOperatorRegistrationConfirmed()).isFalse();

        ArgumentCaptor<RegistryProperties> inspections =
                ArgumentCaptor.forClass(RegistryProperties.class);
        verify(operations, times(3)).inspect(inspections.capture());
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
    void disconnectDeactivatesRegistryBeforeLocalDisableAndRemovesClaimedGroup() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(enrollmentOutcome());
        when(networkOperations.claimStatus(any()))
                .thenReturn(claimStatus());
        when(networkOperations.apply(any(), any()))
                .thenReturn(deactivationOutcome());
        when(networkOperations.leaderboard(
                        any(),
                        any(),
                        any(),
                        any(),
                        any()))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(),
                        null));
        OperatorRegistryService service = service();
        var inspection = service.inspect(
                new RegistryInspectRequestDto(
                        "http://registry:8080",
                        "demo:local-registry"),
                "operator-demo-dev");
        var configured = service.confirm(inspection.inspectionToken(), "operator-demo-dev");
        var registered = service.register(
                registerRequest(
                        configured.selection().baseUrl(),
                        configured.selection().registryIdentity().registryScope()),
                "operator-demo-dev");

        clearInvocations(
                repository,
                networkOperations,
                claimSubmissionRepository);
        var disconnected = service.disconnect("operator-demo-dev");

        assertThat(disconnected.status().lifecycle()).isEqualTo("DISABLED");
        assertThat(disconnected.status().enabled()).isFalse();
        assertThat(disconnected.status().enrollment().deploymentCode())
                .isEqualTo(registered.status().enrollment().deploymentCode());
        assertThat(disconnected.removedLeaderboardEntryIds())
                .containsExactly(
                        "opg_0123456789abcdef0123456789abcdef",
                        registered.status().enrollment().deploymentCode());
        assertThat(disconnected.leaderboardEntry()).isNull();
        ArgumentCaptor<ActionCommand> command =
                ArgumentCaptor.forClass(ActionCommand.class);
        verify(networkOperations).apply(any(), command.capture());
        assertThat(command.getValue().action()).isEqualTo(
                RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT);
        InOrder committedOrder = inOrder(
                networkOperations,
                claimSubmissionRepository,
                repository);
        committedOrder.verify(networkOperations).claimStatus(any());
        committedOrder.verify(networkOperations).apply(any(), any());
        committedOrder.verify(networkOperations).leaderboard(
                any(),
                any(),
                any(),
                any(),
                any());
        committedOrder.verify(claimSubmissionRepository).deleteById(
                OperatorClaimSubmissionSnapshot.SINGLETON_ID);
        committedOrder.verify(repository).save(any());
        assertThatThrownBy(() -> service.retry("operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void disconnectReturnsCanonicalClaimedGroupWhenOtherDeploymentsRemain() {
        configureLiveDemo();
        stored.set(registeredSettings());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(networkOperations.claimStatus(any()))
                .thenReturn(claimStatus());
        when(networkOperations.apply(any(), any()))
                .thenReturn(deactivationOutcome());
        LeaderboardRow remainingGroup = claimedGroupRow(1L);
        when(networkOperations.leaderboard(
                        any(),
                        any(),
                        any(),
                        any(),
                        any()))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(remainingGroup),
                        null));
        OperatorRegistryService service = service();

        var disconnected = service.disconnect("operator-demo-dev");

        assertThat(disconnected.leaderboardEntry().rowId())
                .isEqualTo(remainingGroup.rowId());
        assertThat(disconnected.leaderboardEntry().deploymentCount())
                .isEqualTo(1L);
        assertThat(disconnected.removedLeaderboardEntryIds())
                .containsExactly(
                        "dep_0123456789abcdef0123456789abcdef");
    }

    @Test
    void failedRemoteDeactivationLeavesLocalConnectionAndClaimSnapshotIntact() {
        configureLiveDemo();
        stored.set(registeredSettings());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(networkOperations.claimStatus(any()))
                .thenReturn(claimStatus());
        when(networkOperations.apply(any(), any()))
                .thenThrow(new IllegalStateException(
                        "registry unavailable"));
        OperatorRegistryService service = service();
        clearInvocations(repository, claimSubmissionRepository);

        assertThatThrownBy(() ->
                        service.disconnect("operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining(
                        "local registry connection remains enabled");

        assertThat(stored.get().getEnabled()).isTrue();
        assertThat(stored.get().getLifecycle())
                .isEqualTo("REGISTERED");
        verify(repository, never()).save(any());
        verify(claimSubmissionRepository, never()).deleteById(any());
    }

    @Test
    void sameSignedRegistryCanMoveToANewBaseUrlFromTheRegisterAction() {
        configureLiveDemo();
        when(operations.inspect(any())).thenAnswer(invocation -> {
            RegistryProperties properties = invocation.getArgument(0);
            return registryInspection(
                    properties.getBaseUrl(),
                    "demo:local-registry",
                    REGISTRY_FINGERPRINT);
        });
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(enrollmentOutcome());
        OperatorRegistryService service = service();
        var firstInspection =
                service.inspect(new RegistryInspectRequestDto(
                        "http://registry:8080",
                        "demo:local-registry"), "operator-demo-dev");
        service.confirm(firstInspection.inspectionToken(), "operator-demo-dev");

        var moved = service.register(
                registerRequest("http://moved-registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        assertThat(moved.status().lifecycle()).isEqualTo("REGISTERED");
        assertThat(moved.status().selection().baseUrl())
                .isEqualTo("http://moved-registry:8080");
    }

    @Test
    void differentSignedRegistryRequiresCentralUnregisterBeforeSelectionChanges() {
        configureLiveDemo();
        String otherFingerprint =
                "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
        when(operations.inspect(any()))
                .thenReturn(registryInspection())
                .thenReturn(registryInspection())
                .thenReturn(registryInspection(
                        "http://another-registry:8080",
                        "demo:another-registry",
                        otherFingerprint));
        when(operations.inspectNodeIdentity(any())).thenReturn(new NodeStatus("MISSING", null));
        OperatorRegistryService service = service();
        var firstInspection =
                service.inspect(new RegistryInspectRequestDto(
                        "http://registry:8080",
                        "demo:local-registry"), "operator-demo-dev");
        service.confirm(firstInspection.inspectionToken(), "operator-demo-dev");

        assertThatThrownBy(() -> service.register(
                registerRequest(
                        "http://another-registry:8080",
                        "demo:another-registry"),
                "operator-demo-dev"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("EXPLICIT_UNREGISTER_REQUIRED");
        assertThat(stored.get().getSelection().getRegistryScope())
                .isEqualTo("demo:local-registry");
    }

    @Test
    void explicitRegisterCanSelectATargetWithoutSeparateConfiguration() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(operations.inspectNodeIdentity(any()))
                .thenReturn(new NodeStatus("MISSING", null))
                .thenReturn(new NodeStatus("READY", NODE_FINGERPRINT));
        when(operations.initializeNodeIdentity(any())).thenReturn(new NodeIdentity(NODE_FINGERPRINT));
        when(operations.synchronize(any())).thenReturn(enrollmentOutcome());
        OperatorRegistryService service = service();

        var registered = service.register(
                registerRequest("http://registry:8080", "demo:local-registry"),
                "operator-demo-dev");

        assertThat(registered.status().lifecycle()).isEqualTo("REGISTERED");
        assertThat(registered.status().selection().baseUrl())
                .isEqualTo("http://registry:8080");
        assertThat(stored.get().getRegistrationRequest()).isNotNull();
    }

    @Test
    void optimisticConflictDoesNotOverwriteAnotherInstancesSelection() {
        configureLiveDemo();
        when(operations.inspect(any())).thenReturn(registryInspection());
        when(repository.save(any(OperatorRegistrySettings.class)))
                .thenThrow(new OptimisticLockingFailureException("stale version"));
        OperatorRegistryService service = service();

        assertThatThrownBy(() -> service.inspect(
                new RegistryInspectRequestDto(
                        "http://registry:8080",
                        "demo:local-registry"),
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
                networkOperations,
                claimSubmissionRepository,
                endpointService,
                new OperatorRegistryMapper(new OperatorNetworkMapper()),
                Clock.fixed(NOW, ZoneOffset.UTC),
                new SecureRandom());
    }

    private void configureLiveDemo() {
        demoProperties.setAllowInsecureHttp(true);
        demoProperties.setInsecureHttpAllowedHosts("registry");
    }

    private RegistryInspection registryInspection() {
        return registryInspection(
                "http://registry:8080",
                "demo:local-registry",
                REGISTRY_FINGERPRINT);
    }

    private RegistryInspection registryInspection(
            String baseUrl,
            String registryScope,
            String registryFingerprint) {
        return new RegistryInspection(
                baseUrl + RegistryProtocol.REGISTRY_IDENTITY_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                registryScope,
                "rkey_test",
                registryFingerprint,
                "public-key");
    }

    private EnrollmentOutcome enrollmentOutcome() {
        return new EnrollmentOutcome(
                "dep_0123456789abcdef0123456789abcdef",
                "batch_0123456789abcdef0123456789abcdef",
                NOW.plusSeconds(1).toString(),
                1L,
                false);
    }

    private OperatorRegistrySettings registeredSettings() {
        OperatorRegistrySettings settings =
                new OperatorRegistrySettings();
        settings.setLifecycle("REGISTERED");
        settings.setEnabled(true);
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl("http://registry:8080");
        selection.setProtocolVersion(RegistryProtocol.PROTOCOL_VERSION);
        selection.setRegistryScope("demo:local-registry");
        selection.setRegistryKeyId("rkey_test");
        selection.setRegistryPublicKeyFingerprint(
                REGISTRY_FINGERPRINT);
        settings.setSelection(selection);
        OperatorRegistrySettings.NodeIdentity node =
                new OperatorRegistrySettings.NodeIdentity();
        node.setState("READY");
        node.setPublicKeyFingerprint(NODE_FINGERPRINT);
        node.setInitializedAt(NOW.toString());
        settings.setNodeIdentity(node);
        OperatorRegistrySettings.EnrollmentSummary enrollment =
                new OperatorRegistrySettings.EnrollmentSummary();
        enrollment.setDeploymentCode(
                "dep_0123456789abcdef0123456789abcdef");
        enrollment.setCompletedAt(NOW.toString());
        settings.setEnrollment(enrollment);
        return settings;
    }

    private ClaimStatus claimStatus() {
        return new ClaimStatus(
                true,
                NOW.toString(),
                "Example Cooperative",
                null,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                "1",
                "10",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                NOW.toString(),
                "Example Cooperative");
    }

    private ActionOutcome deactivationOutcome() {
        String deploymentId =
                "dep_0123456789abcdef0123456789abcdef";
        OperatorActionReceipt receipt = new OperatorActionReceipt(
                2L,
                "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
                "opa_0123456789abcdef0123456789abcdef",
                deploymentId,
                deploymentId,
                null,
                RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                NOW.toString(),
                RegistryProtocol.OPERATOR_CLAIM_STATE_WITHDRAWN,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "demo:local-registry",
                "rkey_test",
                "signature");
        return new ActionOutcome(
                new OperatorActionResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        "demo:local-registry",
                        false,
                        receipt),
                "deactivate_test",
                null,
                null);
    }

    private LeaderboardRow claimedGroupRow(long deploymentCount) {
        return new LeaderboardRow(
                "opg_0123456789abcdef0123456789abcdef",
                "claimed",
                "opg_0123456789abcdef0123456789abcdef",
                "Example Cooperative",
                "",
                "pending-review",
                deploymentCount,
                "10",
                "1",
                "1",
                "10");
    }

    private RegistryRegisterRequestDto registerRequest(String baseUrl, String registryScope) {
        return new RegistryRegisterRequestDto(baseUrl, registryScope);
    }
}
