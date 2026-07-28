package com.raxim.myscoutee.profile.data.dto.operator;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardRowDto;

public final class OperatorRegistryDtos {
    private OperatorRegistryDtos() {
    }

    public record RegistryInspectRequestDto(
            String baseUrl,
            String expectedScope) {
    }

    public record RegistryConfirmRequestDto(
            String inspectionToken) {
    }

    public record RegistryRegisterRequestDto(
            String registryBaseUrl,
            String expectedRegistryScope) {
    }

    public record RegistryIdentityDto(
            String identityEndpoint,
            String protocolVersion,
            String registryScope) {
    }

    public record RegistryInspectionDto(
            String inspectionToken,
            String expiresAt,
            String baseUrl,
            boolean simulation,
            RegistryIdentityDto registryIdentity) {
    }

    public record CandidateDefaultsDto(
            String baseUrl,
            String registryScope) {
    }

    public record DraftInspectionDto(
            String baseUrl,
            String registryScope,
            String inspectedAt,
            String expiresAt) {
    }

    public record RegistrySelectionDto(
            String baseUrl,
            RegistryIdentityDto registryIdentity,
            String confirmedAt) {
    }

    public record NodeIdentityDto(
            String state,
            String initializedAt) {
    }

    public record RegistryOptionDto(
            String id,
            String label,
            String baseUrl,
            String registryScope,
            boolean selected) {
    }

    public record EnrollmentDto(
            String deploymentCode,
            String installationTestBatchId,
            String installationTestAcceptedAt,
            Long installationTestLedgerIndex,
            String completedAt) {
    }

    public record RegistryAuditDto(
            String createdAt,
            String updatedAt,
            String lastAttemptAt,
            String lastSuccessAt,
            String disabledAt,
            String updatedBy) {
    }

    public record SafeRegistryErrorDto(
            String code,
            String message,
            String at,
            boolean retryable) {
    }

    public record OperatorRegistryStatusDto(
            String mode,
            String lifecycle,
            boolean enabled,
            boolean simulation,
            List<RegistryOptionDto> registryOptions,
            CandidateDefaultsDto candidateDefaults,
            DraftInspectionDto draftInspection,
            RegistrySelectionDto selection,
            NodeIdentityDto nodeIdentity,
            EnrollmentDto enrollment,
            RegistryAuditDto audit,
            SafeRegistryErrorDto lastError) {
    }

    public record OperatorRegistryMutationResultDto(
            OperatorRegistryStatusDto status,
            OperatorLeaderboardRowDto leaderboardEntry,
            List<String> removedLeaderboardEntryIds,
            boolean created) {
    }
}
