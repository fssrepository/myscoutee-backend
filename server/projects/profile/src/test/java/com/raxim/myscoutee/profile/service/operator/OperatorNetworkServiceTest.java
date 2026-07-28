package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorClaimSubmissionSnapshot;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimMutationResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardRowDto;
import com.raxim.myscoutee.profile.repository.OperatorClaimSubmissionSnapshotRepository;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkOperations;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimStatus;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.registry.RegistryProtocolException;

class OperatorNetworkServiceTest {
    @Test
    void submitsStructuredClaimThenReturnsVerifiedRegistryStatus() {
        OperatorRegistrySettingsRepository settingsRepository =
                mock(OperatorRegistrySettingsRepository.class);
        OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository =
                mock(OperatorClaimSubmissionSnapshotRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        OperatorNetworkMapper mapper = mock(OperatorNetworkMapper.class);
        RegistryProperties properties = new RegistryProperties();
        properties.setOutboundAllowed(true);
        when(settingsRepository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenReturn(Optional.of(registeredSettings()));
        when(claimSubmissionRepository.findById(
                OperatorClaimSubmissionSnapshot.SINGLETON_ID))
                .thenReturn(Optional.empty());
        when(claimSubmissionRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(usersRepository.findByUserId("operator-1")).thenReturn(Optional.empty());
        OperatorClaimRequestDto request = new OperatorClaimRequestDto(
                "Example Cooperative",
                "REG-42",
                "Slovakia",
                "Main Street 1",
                "https://example.test",
                "Alex Reviewer",
                "Director",
                "alex@example.test",
                true);

        ClaimStatus registryStatus = new ClaimStatus(
                true,
                "2026-07-28T12:00:00Z",
                "Example Cooperative",
                null,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                "0",
                "1",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                "2026-07-28T12:00:00Z",
                "Example Cooperative");
        OperatorClaimStatusDto publicStatus = new OperatorClaimStatusDto(
                true,
                "2026-07-28T12:00:00Z",
                "operator-1",
                "Example Cooperative",
                null,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                0D,
                "0",
                "1",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                "2026-07-28T12:00:00Z",
                "Example Cooperative");
        LeaderboardRow registryLeaderboardEntry = new LeaderboardRow(
                "opg_0123456789abcdef0123456789abcdef",
                "claimed",
                "opg_0123456789abcdef0123456789abcdef",
                "Example Cooperative",
                "",
                "pending-review",
                1L,
                "0",
                "1",
                "0",
                "1");
        OperatorClaimMutationResultDto publicMutation =
                new OperatorClaimMutationResultDto(
                        publicStatus,
                        request,
                        new OperatorLeaderboardRowDto(
                                "opg_0123456789abcdef0123456789abcdef",
                                "claimed",
                                "opg_0123456789abcdef0123456789abcdef",
                                "Example Cooperative",
                                "",
                                "pending-review",
                                1L,
                                "0",
                                "1",
                                "0",
                                "1"),
                        List.of("dep_0123456789abcdef0123456789abcdef"));
        when(operations.claimStatus(any())).thenReturn(registryStatus);
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(registryLeaderboardEntry),
                        null));
        when(mapper.toClaimMutation(
                eq(registryStatus),
                eq("operator-1"),
                any(OperatorClaimSubmissionSnapshot.class),
                eq(registryLeaderboardEntry),
                eq("dep_0123456789abcdef0123456789abcdef")))
                .thenReturn(publicMutation);
        OperatorNetworkService service = new OperatorNetworkService(
                settingsRepository,
                claimSubmissionRepository,
                usersRepository,
                properties,
                new RegistryDemoProperties(),
                operations,
                mapper);
        assertThat(service.submitClaim(
                request,
                "operator-1",
                "claim-request-12345678")).isSameAs(publicMutation);

        ArgumentCaptor<ActionCommand> command = ArgumentCaptor.forClass(ActionCommand.class);
        verify(operations).apply(any(), command.capture());
        assertThat(command.getValue().action()).isEqualTo(RegistryProtocol.OPERATOR_ACTION_CLAIM);
        assertThat(command.getValue().operatorName()).isNull();
        assertThat(command.getValue().idempotencyKey()).isEqualTo("claim-request-12345678");
        assertThat(command.getValue().claimVerification().legalName())
                .isEqualTo("Example Cooperative");
        assertThat(command.getValue().claimVerification().verificationContactEmail())
                .isEqualTo("alex@example.test");
        assertThat(command.getValue().claimVerification().authorityAttested()).isTrue();
        verify(operations).claimStatus(any());
        verify(operations).leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq(""));
        ArgumentCaptor<OperatorClaimSubmissionSnapshot> submission =
                ArgumentCaptor.forClass(OperatorClaimSubmissionSnapshot.class);
        verify(claimSubmissionRepository).save(submission.capture());
        assertThat(submission.getValue().getLegalName())
                .isEqualTo(request.legalName());
        assertThat(submission.getValue().getRegisteredAddress())
                .isEqualTo(request.registeredAddress());
        assertThat(submission.getValue().getVerificationContactEmail())
                .isEqualTo(request.verificationContactEmail());
        assertThat(submission.getValue().getOperatorGroupId())
                .isEqualTo(registryStatus.groupId());
        assertThat(submission.getValue().getSubmittedAt())
                .isEqualTo(registryStatus.verificationSubmittedAt());
        verify(mapper).toClaimMutation(
                registryStatus,
                "operator-1",
                submission.getValue(),
                registryLeaderboardEntry,
                "dep_0123456789abcdef0123456789abcdef");
    }

    @Test
    void genericActionRouteCannotBypassStructuredClaimValidation() {
        OperatorRegistrySettingsRepository settingsRepository =
                mock(OperatorRegistrySettingsRepository.class);
        OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository =
                mock(OperatorClaimSubmissionSnapshotRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        OperatorNetworkService service = new OperatorNetworkService(
                settingsRepository,
                claimSubmissionRepository,
                usersRepository,
                new RegistryProperties(),
                new RegistryDemoProperties(),
                operations,
                mock(OperatorNetworkMapper.class));

        assertThatThrownBy(() -> service.apply(
                new OperatorActionRequestDto(
                        RegistryProtocol.OPERATOR_ACTION_CLAIM,
                        "Legacy label",
                        null,
                        null,
                        null,
                        null,
                        null,
                        null),
                "operator-1"))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode())
                                .isEqualTo(HttpStatus.BAD_REQUEST));
        verifyNoInteractions(
                settingsRepository,
                claimSubmissionRepository,
                usersRepository,
                operations);
    }

    @Test
    void mapsInvalidRegistryProtocolResponseToBadGateway() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        when(operations.claimStatus(any())).thenThrow(
                new RegistryProtocolException("Registry claim status signature is invalid."));
        OperatorNetworkService service = registeredService(operations);

        assertThatThrownBy(() -> service.claimStatus("operator-1"))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.BAD_GATEWAY);
                            assertThat(exception.getCause())
                                    .isInstanceOf(RegistryProtocolException.class);
                        });
    }

    @Test
    void mapsInvalidRequestToBadRequest() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        when(operations.claimStatus(any())).thenThrow(
                new IllegalArgumentException("Invalid leaderboard cursor."));
        OperatorNetworkService service = registeredService(operations);

        assertThatThrownBy(() -> service.claimStatus("operator-1"))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.BAD_REQUEST);
                            assertThat(exception.getCause())
                                    .isInstanceOf(IllegalArgumentException.class);
                        });
    }

    @Test
    void mapsLocalIntegrityOrPersistenceFailureToInternalServerError() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        when(operations.claimStatus(any())).thenThrow(
                new IllegalStateException("Registry receipt journal is inconsistent."));
        OperatorNetworkService service = registeredService(operations);

        assertThatThrownBy(() -> service.claimStatus("operator-1"))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
                            assertThat(exception.getCause())
                                    .isInstanceOf(IllegalStateException.class);
                        });
    }

    private static OperatorNetworkService registeredService(
            RegistryOperatorNetworkOperations operations) {
        OperatorRegistrySettingsRepository settingsRepository =
                mock(OperatorRegistrySettingsRepository.class);
        RegistryProperties properties = new RegistryProperties();
        properties.setOutboundAllowed(true);
        when(settingsRepository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenReturn(Optional.of(registeredSettings()));
        return new OperatorNetworkService(
                settingsRepository,
                mock(OperatorClaimSubmissionSnapshotRepository.class),
                mock(UsersRepository.class),
                properties,
                new RegistryDemoProperties(),
                operations,
                mock(OperatorNetworkMapper.class));
    }

    private static OperatorRegistrySettings registeredSettings() {
        OperatorRegistrySettings settings = new OperatorRegistrySettings();
        settings.setEnabled(true);
        settings.setLifecycle("REGISTERED");
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl("https://registry.example.test");
        selection.setRegistryScope("example:region-a");
        selection.setRegistryPublicKeyFingerprint(
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        settings.setSelection(selection);
        OperatorRegistrySettings.EnrollmentSummary enrollment =
                new OperatorRegistrySettings.EnrollmentSummary();
        enrollment.setDeploymentCode("dep_0123456789abcdef0123456789abcdef");
        settings.setEnrollment(enrollment);
        return settings;
    }
}
