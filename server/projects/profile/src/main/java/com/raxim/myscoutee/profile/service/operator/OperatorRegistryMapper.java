package com.raxim.myscoutee.profile.service.operator;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.DraftInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.EnrollmentDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.NodeIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.OperatorRegistryStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryAuditDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistrySelectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.SafeRegistryErrorDto;

@Component
public class OperatorRegistryMapper {
    public OperatorRegistryStatusDto toStatus(
            OperatorRegistrySettings settings,
            String mode,
            boolean simulation,
            CandidateDefaultsDto candidateDefaults,
            NodeIdentityDto observedNodeIdentity) {
        OperatorRegistrySettings source = settings == null
                ? new OperatorRegistrySettings()
                : settings;
        return new OperatorRegistryStatusDto(
                mode,
                textOr(source.getLifecycle(), "UNCONFIGURED"),
                Boolean.TRUE.equals(source.getEnabled()),
                simulation,
                candidateDefaults,
                toDraft(source.getDraftInspection()),
                toSelection(source.getSelection()),
                observedNodeIdentity != null
                        ? observedNodeIdentity
                        : toNodeIdentity(source.getNodeIdentity()),
                toEnrollment(source.getEnrollment()),
                toAudit(source.getAudit()),
                toFailure(source.getLastError()));
    }

    public RegistryInspectionDto toInspection(
            OperatorRegistrySettings.DraftInspection draft,
            String rawToken,
            boolean simulation) {
        return new RegistryInspectionDto(
                rawToken,
                draft.getExpiresAt(),
                draft.getBaseUrl(),
                simulation,
                new RegistryIdentityDto(
                        draft.getIdentityEndpoint(),
                        draft.getProtocolVersion(),
                        draft.getRegistryScope(),
                        draft.getRegistryKeyId(),
                        draft.getRegistryPublicKeyFingerprint()));
    }

    private DraftInspectionDto toDraft(OperatorRegistrySettings.DraftInspection value) {
        if (value == null) {
            return null;
        }
        return new DraftInspectionDto(
                value.getBaseUrl(),
                value.getRegistryScope(),
                value.getRegistryKeyId(),
                value.getRegistryPublicKeyFingerprint(),
                value.getInspectedAt(),
                value.getExpiresAt());
    }

    private RegistrySelectionDto toSelection(OperatorRegistrySettings.RegistrySelection value) {
        if (value == null) {
            return null;
        }
        return new RegistrySelectionDto(
                value.getBaseUrl(),
                new RegistryIdentityDto(
                        value.getIdentityEndpoint(),
                        value.getProtocolVersion(),
                        value.getRegistryScope(),
                        value.getRegistryKeyId(),
                        value.getRegistryPublicKeyFingerprint()),
                value.getConfirmedAt());
    }

    private NodeIdentityDto toNodeIdentity(OperatorRegistrySettings.NodeIdentity value) {
        if (value == null) {
            return new NodeIdentityDto("MISSING", null, null);
        }
        return new NodeIdentityDto(
                textOr(value.getState(), "MISSING"),
                value.getPublicKeyFingerprint(),
                value.getInitializedAt());
    }

    private EnrollmentDto toEnrollment(OperatorRegistrySettings.EnrollmentSummary value) {
        if (value == null) {
            return null;
        }
        return new EnrollmentDto(
                value.getDeploymentCode(),
                value.getInstallationTestBatchId(),
                value.getInstallationTestAcceptedAt(),
                value.getInstallationTestLedgerIndex(),
                value.getCompletedAt());
    }

    private RegistryAuditDto toAudit(OperatorRegistrySettings.Audit value) {
        if (value == null) {
            return new RegistryAuditDto(null, null, null, null, null, null);
        }
        return new RegistryAuditDto(
                value.getCreatedAt(),
                value.getUpdatedAt(),
                value.getLastAttemptAt(),
                value.getLastSuccessAt(),
                value.getDisabledAt(),
                value.getUpdatedBy());
    }

    private SafeRegistryErrorDto toFailure(OperatorRegistrySettings.Failure value) {
        if (value == null) {
            return null;
        }
        return new SafeRegistryErrorDto(
                value.getCode(),
                value.getMessage(),
                value.getAt(),
                Boolean.TRUE.equals(value.getRetryable()));
    }

    private String textOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
