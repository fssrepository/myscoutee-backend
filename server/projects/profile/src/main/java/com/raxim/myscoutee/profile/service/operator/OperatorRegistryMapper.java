package com.raxim.myscoutee.profile.service.operator;

import java.util.List;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardRowDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.DraftInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.EnrollmentDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.NodeIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.OperatorRegistryMutationResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.OperatorRegistryStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryAuditDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistrySelectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.SafeRegistryErrorDto;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardRow;

@Component
public class OperatorRegistryMapper {
    private final OperatorNetworkMapper networkMapper;

    public OperatorRegistryMapper(
            OperatorNetworkMapper networkMapper) {
        this.networkMapper = networkMapper;
    }

    public OperatorRegistryStatusDto toStatus(
            OperatorRegistrySettings settings,
            String mode,
            List<RegistryOptionDto> registryOptions,
            CandidateDefaultsDto candidateDefaults,
            NodeIdentityDto observedNodeIdentity) {
        return new OperatorRegistryStatusDto(
                mode,
                settings == null
                        ? "UNCONFIGURED"
                        : requireText(settings.getLifecycle(), "Registry lifecycle"),
                settings != null && Boolean.TRUE.equals(settings.getEnabled()),
                false,
                registryOptions == null ? List.of() : List.copyOf(registryOptions),
                candidateDefaults,
                toDraft(settings == null ? null : settings.getDraftInspection()),
                toSelection(settings == null ? null : settings.getSelection()),
                observedNodeIdentity != null
                        ? observedNodeIdentity
                        : toNodeIdentity(settings == null ? null : settings.getNodeIdentity()),
                toEnrollment(settings == null ? null : settings.getEnrollment()),
                toAudit(settings == null ? null : settings.getAudit()),
                toFailure(settings == null ? null : settings.getLastError()));
    }

    public RegistryInspectionDto toInspection(
            OperatorRegistrySettings.DraftInspection draft,
            String rawToken) {
        return new RegistryInspectionDto(
                rawToken,
                draft.getExpiresAt(),
                draft.getBaseUrl(),
                false,
                new RegistryIdentityDto(
                        draft.getIdentityEndpoint(),
                        draft.getProtocolVersion(),
                        draft.getRegistryScope()));
    }

    public OperatorRegistryMutationResultDto toRegistrationMutation(
            OperatorRegistryStatusDto status,
            String deploymentId,
            boolean created) {
        OperatorLeaderboardRowDto entry = deploymentId != null
                && !deploymentId.isBlank()
                ? new OperatorLeaderboardRowDto(
                        requireText(deploymentId, "Deployment ID"),
                        "unclaimed",
                        "",
                        requireText(deploymentId, "Deployment ID"),
                        "",
                        "unclaimed",
                        "inactive",
                        1L,
                        "0",
                        "1",
                        "0",
                        "1")
                : null;
        return new OperatorRegistryMutationResultDto(
                status,
                entry,
                entry == null ? List.of() : List.of(entry),
                List.of(),
                created && entry != null ? 1 : 0,
                created);
    }

    public OperatorRegistryMutationResultDto toDisconnectMutation(
            OperatorRegistryStatusDto status,
            LeaderboardRow remainingClaimedGroup,
            List<String> removedLeaderboardEntryIds) {
        List<String> removedIds = removedLeaderboardEntryIds == null
                ? List.of()
                : removedLeaderboardEntryIds.stream()
                        .filter(value -> value != null && !value.isBlank())
                        .map(String::trim)
                        .distinct()
                        .toList();
        OperatorLeaderboardRowDto entry = remainingClaimedGroup == null
                ? null
                : networkMapper.toLeaderboardRow(remainingClaimedGroup);
        return new OperatorRegistryMutationResultDto(
                status,
                entry,
                entry == null ? List.of() : List.of(entry),
                removedIds,
                entry == null && !removedIds.isEmpty() ? -1 : 0,
                false);
    }

    private DraftInspectionDto toDraft(OperatorRegistrySettings.DraftInspection value) {
        if (value == null) {
            return null;
        }
        return new DraftInspectionDto(
                value.getBaseUrl(),
                value.getRegistryScope(),
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
                        value.getRegistryScope()),
                value.getConfirmedAt());
    }

    private NodeIdentityDto toNodeIdentity(OperatorRegistrySettings.NodeIdentity value) {
        if (value == null) {
            return new NodeIdentityDto("MISSING", null);
        }
        return new NodeIdentityDto(
                requireText(value.getState(), "Node identity state"),
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

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(fieldName + " is missing.");
        }
        return value.trim();
    }
}
