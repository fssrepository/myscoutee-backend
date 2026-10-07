package com.raxim.myscoutee.domain.operator.service;

import com.raxim.myscoutee.domain.operator.mapper.OperatorNetworkMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.registry.config.RegistryDemoProperties;
import com.raxim.myscoutee.domain.registry.config.RegistryProperties;
import com.raxim.myscoutee.domain.operator.document.OperatorClaimSubmissionSnapshot;
import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorActionRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimMutationResultDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardRowDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorRedeemClientTokenRequestDto;
import com.raxim.myscoutee.domain.operator.repository.OperatorClaimSubmissionSnapshotRepository;
import com.raxim.myscoutee.domain.operator.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkOperations;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.ClaimStatus;
import com.raxim.myscoutee.domain.registry.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardDeployment;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardSnapshot;
import com.raxim.myscoutee.domain.registry.RegistryProtocolException;

@org.junit.jupiter.api.Tag("standard")
class OperatorNetworkServiceTest {
    @Test
    void mapperPreservesSnapshotAndDeploymentEligibilityBoundaries() {
        LeaderboardSnapshot snapshot = new LeaderboardSnapshot(
                "snap_0123456789abcdef0123456789abcdef",
                RegistryProtocol.LEADERBOARD_FORMULA_VERSION,
                RegistryProtocol.LEADERBOARD_RULESET_VERSION,
                "2026-06",
                12L,
                4L,
                3L,
                2L,
                0L,
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
                RegistryProtocol.ZERO_HASH,
                "100000",
                "1",
                "1",
                "4",
                "200000",
                "1",
                "150000",
                "1",
                "2026-07-28T00:00:05Z",
                "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "operator-test:parent-a",
                "rkey_0123456789abcdef0123456789abcdef",
                "signature");
        LeaderboardDeployment deployment = new LeaderboardDeployment(
                "dep_0123456789abcdef0123456789abcdef",
                "opg_0123456789abcdef0123456789abcdef",
                "approved",
                "suspended",
                "owner",
                "0",
                "1",
                "0",
                "1");

        var mapped = new OperatorNetworkMapper()
                .toLeaderboardDeploymentPage(
                        new LeaderboardDeploymentPage(
                                snapshot,
                                deployment.groupId(),
                                List.of(deployment),
                                null));

        assertThat(mapped.snapshot().throughReviewIndex()).isEqualTo(3L);
        assertThat(mapped.snapshot().throughEligibilityIndex()).isEqualTo(2L);
        assertThat(mapped.snapshot().reviewHeadHash())
                .isEqualTo(snapshot.reviewHeadHash());
        assertThat(mapped.snapshot().eligibilityHeadHash())
                .isEqualTo(snapshot.eligibilityHeadHash());
        assertThat(mapped.items())
                .singleElement()
                .satisfies(item -> assertThat(item.eligibilityStatus())
                        .isEqualTo("suspended"));
    }

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
                "Example Cooperative",
                "inactive");
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
                "Example Cooperative",
                "inactive");
        LeaderboardRow registryLeaderboardEntry = new LeaderboardRow(
                "opg_0123456789abcdef0123456789abcdef",
                "claimed",
                "opg_0123456789abcdef0123456789abcdef",
                "Example Cooperative",
                "",
                "pending-review",
                "inactive",
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
                                "inactive",
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
        assertThat(submission.getValue().getRegistryScope())
                .isEqualTo("example:region-a");
        assertThat(submission.getValue().getDeploymentId())
                .isEqualTo("dep_0123456789abcdef0123456789abcdef");
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
    void redeemsClientTokenThenReturnsCanonicalPaginatedLeaderboardMutation() {
        OperatorRegistrySettingsRepository settingsRepository =
                mock(OperatorRegistrySettingsRepository.class);
        OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository =
                mock(OperatorClaimSubmissionSnapshotRepository.class);
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        RegistryProperties properties = new RegistryProperties();
        properties.setOutboundAllowed(true);
        when(settingsRepository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenReturn(Optional.of(registeredSettings()));
        when(claimSubmissionRepository.findById(
                OperatorClaimSubmissionSnapshot.SINGLETON_ID))
                .thenReturn(Optional.empty());

        String groupId = "opg_0123456789abcdef0123456789abcdef";
        String previousGroupId =
                "opg_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        ClaimStatus previousStatus = pendingClaimStatus(
                previousGroupId,
                "2026-07-28T01:00:00Z");
        ClaimStatus registryStatus = new ClaimStatus(
                true,
                "2026-07-29T01:00:00Z",
                "Token Source Cooperative",
                "https://cdn.example.test/operator.png",
                groupId,
                null,
                "277",
                "5000",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                "2026-07-29T01:00:00Z",
                "Token Source Cooperative",
                "inactive");
        LeaderboardRow unrelatedRow = new LeaderboardRow(
                "opg_fedcba9876543210fedcba9876543210",
                "claimed",
                "opg_fedcba9876543210fedcba9876543210",
                "Other Operator",
                "",
                "approved",
                "active",
                2L,
                "65000",
                "1",
                "3",
                "10");
        LeaderboardRow registryLeaderboardEntry = new LeaderboardRow(
                groupId,
                "claimed",
                groupId,
                "Token Source Cooperative",
                "https://cdn.example.test/operator.png",
                "pending-review",
                "inactive",
                2L,
                "12000",
                "1",
                "277",
                "5000");
        when(operations.claimStatus(any()))
                .thenReturn(previousStatus, registryStatus);
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(unrelatedRow),
                        "claimed-page-2"));
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("claimed-page-2")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(registryLeaderboardEntry),
                        null));
        OperatorNetworkService service = new OperatorNetworkService(
                settingsRepository,
                claimSubmissionRepository,
                mock(UsersRepository.class),
                properties,
                new RegistryDemoProperties(),
                operations,
                new OperatorNetworkMapper());
        OperatorRedeemClientTokenRequestDto request =
                new OperatorRedeemClientTokenRequestDto(
                        "client-token",
                        "redeem-request-12345678");

        OperatorClaimMutationResultDto mutation =
                service.redeemClientToken(request, "operator-1");

        assertThat(mutation.status().operatorGroupId()).isEqualTo(groupId);
        assertThat(mutation.status().verificationStatus())
                .isEqualTo("PENDING_REVIEW");
        assertThat(mutation.status().eligibilityStatus())
                .isEqualTo("inactive");
        assertThat(mutation.submission()).isNull();
        assertThat(mutation.leaderboardEntry())
                .isEqualTo(new OperatorLeaderboardRowDto(
                        groupId,
                        "claimed",
                        groupId,
                        "Token Source Cooperative",
                        "https://cdn.example.test/operator.png",
                        "pending-review",
                        "inactive",
                        2L,
                        "12000",
                        "1",
                        "277",
                        "5000"));
        assertThat(mutation.leaderboardUpserts())
                .extracting(OperatorLeaderboardRowDto::rowId)
                .containsExactly(groupId);
        assertThat(mutation.removedLeaderboardEntryIds())
                .containsExactly(previousGroupId);
        assertThat(mutation.leaderboardTotalDelta()).isEqualTo(-1);

        ArgumentCaptor<ActionCommand> command =
                ArgumentCaptor.forClass(ActionCommand.class);
        verify(operations).apply(any(), command.capture());
        assertThat(command.getValue().action())
                .isEqualTo(RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN);
        assertThat(command.getValue().clientToken()).isEqualTo("client-token");
        assertThat(command.getValue().idempotencyKey())
                .isEqualTo("redeem-request-12345678");
        verify(operations, times(2)).claimStatus(any());
        verify(operations).leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq(""));
        verify(operations).leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("claimed-page-2"));
    }

    @Test
    void redemptionUpsertsPreviousGroupWhenItStillHasDeployments() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        String groupId = "opg_0123456789abcdef0123456789abcdef";
        String previousGroupId =
                "opg_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        when(operations.claimStatus(any())).thenReturn(
                pendingClaimStatus(previousGroupId, "2026-07-28T01:00:00Z"),
                pendingClaimStatus(groupId, "2026-07-29T01:00:00Z"));
        LeaderboardRow currentGroup = leaderboardRow(groupId, 2L, "12000");
        LeaderboardRow survivingPreviousGroup =
                leaderboardRow(previousGroupId, 2L, "9000");
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(currentGroup, survivingPreviousGroup),
                        null));

        OperatorClaimMutationResultDto mutation =
                registeredServiceWithRealMapper(operations).redeemClientToken(
                        new OperatorRedeemClientTokenRequestDto(
                                "client-token",
                                "redeem-request-12345678"),
                        "operator-1");

        assertThat(mutation.leaderboardEntry().rowId()).isEqualTo(groupId);
        assertThat(mutation.leaderboardUpserts())
                .extracting(OperatorLeaderboardRowDto::rowId)
                .containsExactly(groupId, previousGroupId);
        assertThat(mutation.removedLeaderboardEntryIds()).isEmpty();
        assertThat(mutation.leaderboardTotalDelta()).isZero();
    }

    @Test
    void redemptionRemovesThePriorUnclaimedDeploymentRow() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        String groupId = "opg_0123456789abcdef0123456789abcdef";
        when(operations.claimStatus(any())).thenReturn(
                unclaimedStatus(),
                pendingClaimStatus(groupId, "2026-07-29T01:00:00Z"));
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(leaderboardRow(groupId, 2L, "12000")),
                        null));

        OperatorClaimMutationResultDto mutation =
                registeredServiceWithRealMapper(operations).redeemClientToken(
                        new OperatorRedeemClientTokenRequestDto(
                                "client-token",
                                "redeem-request-12345678"),
                        "operator-1");

        assertThat(mutation.leaderboardUpserts())
                .extracting(OperatorLeaderboardRowDto::rowId)
                .containsExactly(groupId);
        assertThat(mutation.removedLeaderboardEntryIds())
                .containsExactly("dep_0123456789abcdef0123456789abcdef");
        assertThat(mutation.leaderboardTotalDelta()).isEqualTo(-1);
    }

    @Test
    void idempotentSameGroupRedemptionDoesNotChangeTheRowTotal() {
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        String groupId = "opg_0123456789abcdef0123456789abcdef";
        when(operations.claimStatus(any())).thenReturn(
                pendingClaimStatus(groupId, "2026-07-28T01:00:00Z"),
                pendingClaimStatus(groupId, "2026-07-28T01:00:00Z"));
        when(operations.leaderboard(
                any(),
                eq("claimed"),
                isNull(),
                eq(100),
                eq("")))
                .thenReturn(new LeaderboardPage(
                        null,
                        "claimed",
                        List.of(leaderboardRow(groupId, 2L, "12000")),
                        null));

        OperatorClaimMutationResultDto mutation =
                registeredServiceWithRealMapper(operations).redeemClientToken(
                        new OperatorRedeemClientTokenRequestDto(
                                "client-token",
                                "redeem-request-12345678"),
                        "operator-1");

        assertThat(mutation.leaderboardUpserts())
                .extracting(OperatorLeaderboardRowDto::rowId)
                .containsExactly(groupId);
        assertThat(mutation.removedLeaderboardEntryIds()).isEmpty();
        assertThat(mutation.leaderboardTotalDelta()).isZero();
    }

    @Test
    void claimOverviewHydratesOnlyTheCurrentRegistryClaimSubmission() {
        OperatorRegistrySettingsRepository settingsRepository =
                mock(OperatorRegistrySettingsRepository.class);
        OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository =
                mock(OperatorClaimSubmissionSnapshotRepository.class);
        RegistryOperatorNetworkOperations operations =
                mock(RegistryOperatorNetworkOperations.class);
        RegistryProperties properties = new RegistryProperties();
        properties.setOutboundAllowed(true);
        when(settingsRepository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenReturn(Optional.of(registeredSettings()));

        String groupId = "opg_0123456789abcdef0123456789abcdef";
        String submittedAt = "2026-07-28T12:00:00Z";
        ClaimStatus current = pendingClaimStatus(groupId, submittedAt);
        OperatorClaimRequestDto request = new OperatorClaimRequestDto(
                "Example Cooperative",
                "REG-42",
                "Slovakia",
                " Main Street 1 ",
                "https://example.test",
                "Alex Reviewer",
                "Director",
                "alex@example.test",
                true);
        OperatorClaimSubmissionSnapshot submission =
                claimSubmission(request, groupId, submittedAt);
        when(operations.claimStatus(any())).thenReturn(current);
        when(claimSubmissionRepository.findById(
                OperatorClaimSubmissionSnapshot.SINGLETON_ID))
                .thenReturn(Optional.of(submission));
        OperatorNetworkService service = new OperatorNetworkService(
                settingsRepository,
                claimSubmissionRepository,
                mock(UsersRepository.class),
                properties,
                new RegistryDemoProperties(),
                operations,
                new OperatorNetworkMapper());

        assertThat(service.claimStatus("operator-1").submission())
                .isEqualTo(request);

        when(operations.claimStatus(any())).thenReturn(pendingClaimStatus(
                "opg_abcdef0123456789abcdef0123456789",
                "2026-07-28T13:00:00Z"));

        assertThat(service.claimStatus("operator-1").submission()).isNull();
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

    private static OperatorNetworkService registeredServiceWithRealMapper(
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
                new OperatorNetworkMapper());
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

    private static ClaimStatus pendingClaimStatus(
            String groupId,
            String submittedAt) {
        return new ClaimStatus(
                true,
                submittedAt,
                "Example Cooperative",
                null,
                groupId,
                null,
                "0",
                "1",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                submittedAt,
                "Example Cooperative",
                "inactive");
    }

    private static ClaimStatus unclaimedStatus() {
        return new ClaimStatus(
                false,
                null,
                null,
                null,
                null,
                null,
                "0",
                "1",
                "AVAILABLE",
                null,
                "NOT_SUBMITTED",
                null,
                null,
                null);
    }

    private static LeaderboardRow leaderboardRow(
            String groupId,
            long deploymentCount,
            String weightNumerator) {
        return new LeaderboardRow(
                groupId,
                "claimed",
                groupId,
                "Example Cooperative",
                "",
                "pending-review",
                "inactive",
                deploymentCount,
                weightNumerator,
                "1",
                "1",
                "10");
    }

    private static OperatorClaimSubmissionSnapshot claimSubmission(
            OperatorClaimRequestDto request,
            String groupId,
            String submittedAt) {
        OperatorClaimSubmissionSnapshot submission =
                new OperatorClaimSubmissionSnapshot();
        submission.setId(OperatorClaimSubmissionSnapshot.SINGLETON_ID);
        submission.setSchemaVersion(
                OperatorClaimSubmissionSnapshot.SCHEMA_VERSION);
        submission.setLegalName(request.legalName());
        submission.setRegistrationNumber(request.registrationNumber());
        submission.setJurisdiction(request.jurisdiction());
        submission.setRegisteredAddress(request.registeredAddress());
        submission.setWebsite(request.website());
        submission.setVerificationContactName(
                request.verificationContactName());
        submission.setVerificationContactRole(
                request.verificationContactRole());
        submission.setVerificationContactEmail(
                request.verificationContactEmail());
        submission.setAuthorityAttested(request.authorityAttested());
        submission.setRegistryScope("example:region-a");
        submission.setDeploymentId(
                "dep_0123456789abcdef0123456789abcdef");
        submission.setOperatorGroupId(groupId);
        submission.setSubmittedAt(submittedAt);
        submission.setSubmittedBy("operator-1");
        return submission;
    }
}
