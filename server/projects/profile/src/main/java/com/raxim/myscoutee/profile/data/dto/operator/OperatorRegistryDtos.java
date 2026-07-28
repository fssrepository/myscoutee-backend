package com.raxim.myscoutee.profile.data.dto.operator;

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

    public record RegistryIdentityDto(
            String identityEndpoint,
            String protocolVersion,
            String registryScope,
            String registryKeyId,
            String registryPublicKeyFingerprint) {
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
            String registryKeyId,
            String registryPublicKeyFingerprint,
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
            String publicKeyFingerprint,
            String initializedAt) {
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
            CandidateDefaultsDto candidateDefaults,
            DraftInspectionDto draftInspection,
            RegistrySelectionDto selection,
            NodeIdentityDto nodeIdentity,
            EnrollmentDto enrollment,
            RegistryAuditDto audit,
            SafeRegistryErrorDto lastError) {
    }
}
