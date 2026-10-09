package com.raxim.myscoutee.domain.operator.mapper;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.operator.document.OperatorClaimSubmissionSnapshot;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorActionReceiptDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorActionResultDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorAnnouncementDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorAnnouncementLinkDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorAnnouncementLocalizationDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorAnnouncementPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorAnnouncementSnapshotDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimMutationResultDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimOverviewDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardDeploymentDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardDeploymentPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardRowDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorLeaderboardSnapshotDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorNetworkDtos.OperatorUpdateManifestDto;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.AnnouncementOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimStatus;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.PackageVerification;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementEntry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementLink;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementLocalization;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementSnapshot;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeployment;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardSnapshot;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorActionReceipt;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.UpdateManifest;

@Component
public class OperatorNetworkMapper {
    public OperatorActionResultDto toActionResult(ActionOutcome outcome) {
        return new OperatorActionResultDto(
                Boolean.TRUE.equals(outcome.response().duplicate()),
                outcome.idempotencyKey(),
                outcome.plaintextClientToken(),
                toActionReceipt(outcome.response().receipt()));
    }

    public OperatorLeaderboardPageDto toLeaderboardPage(LeaderboardPage page) {
        List<OperatorLeaderboardRowDto> items = page.items().stream()
                .map(this::toLeaderboardRow)
                .toList();
        return new OperatorLeaderboardPageDto(
                toSnapshot(page.snapshot()),
                page.view(),
                items,
                page.nextCursor());
    }

    public OperatorClaimStatusDto toClaimStatus(
            ClaimStatus status,
            String claimantUserId) {
        double sharePercent = new BigDecimal(status.shareNumerator())
                .divide(
                        new BigDecimal(status.shareDenominator()),
                        MathContext.DECIMAL64)
                .movePointRight(2)
                .doubleValue();
        return new OperatorClaimStatusDto(
                status.claimed(),
                status.claimedAt(),
                status.claimed() ? claimantUserId : null,
                status.operatorName(),
                status.operatorAvatarUrl(),
                status.groupId(),
                status.activeLinkId(),
                sharePercent,
                status.shareNumerator(),
                status.shareDenominator(),
                status.verificationCapability(),
                status.verificationUnavailableReason(),
                status.verificationStatus(),
                status.verificationSubmittedAt(),
                status.legalName(),
                status.eligibilityStatus());
    }

    public OperatorClaimMutationResultDto toClaimMutation(
            ClaimStatus status,
            String claimantUserId,
            OperatorClaimSubmissionSnapshot submission,
            LeaderboardRow leaderboardEntry,
            String removedLeaderboardEntryId) {
        return toClaimMutation(
                status,
                claimantUserId,
                submission,
                leaderboardEntry,
                leaderboardEntry == null
                        ? List.of()
                        : List.of(leaderboardEntry),
                removedLeaderboardEntryId == null
                        || removedLeaderboardEntryId.isBlank()
                        ? List.of()
                        : List.of(removedLeaderboardEntryId.trim()),
                0);
    }

    public OperatorClaimMutationResultDto toClaimMutation(
            ClaimStatus status,
            String claimantUserId,
            OperatorClaimSubmissionSnapshot submission,
            LeaderboardRow leaderboardEntry,
            List<LeaderboardRow> leaderboardUpserts,
            List<String> removedLeaderboardEntryIds,
            int leaderboardTotalDelta) {
        return new OperatorClaimMutationResultDto(
                toClaimStatus(status, claimantUserId),
                toClaimSubmission(submission),
                leaderboardEntry == null
                        ? null
                        : toLeaderboardRow(leaderboardEntry),
                leaderboardUpserts == null
                        ? List.of()
                        : leaderboardUpserts.stream()
                                .filter(Objects::nonNull)
                                .map(this::toLeaderboardRow)
                                .toList(),
                removedLeaderboardEntryIds == null
                        ? List.of()
                        : removedLeaderboardEntryIds.stream()
                                .filter(Objects::nonNull)
                                .map(String::trim)
                                .filter(value -> !value.isBlank())
                                .distinct()
                                .toList(),
                leaderboardTotalDelta);
    }

    public OperatorClaimOverviewDto toClaimOverview(
            ClaimStatus status,
            String claimantUserId,
            OperatorClaimSubmissionSnapshot submission) {
        return new OperatorClaimOverviewDto(
                toClaimStatus(status, claimantUserId),
                toClaimSubmission(submission));
    }

    private OperatorClaimRequestDto toClaimSubmission(
            OperatorClaimSubmissionSnapshot submission) {
        if (submission == null) {
            return null;
        }
        return new OperatorClaimRequestDto(
                submission.getLegalName(),
                submission.getRegistrationNumber(),
                submission.getJurisdiction(),
                submission.getRegisteredAddress(),
                submission.getWebsite(),
                submission.getVerificationContactName(),
                submission.getVerificationContactRole(),
                submission.getVerificationContactEmail(),
                Boolean.TRUE.equals(submission.getAuthorityAttested()));
    }

    public OperatorAnnouncementPageDto toAnnouncementPage(
            AnnouncementOutcome outcome) {
        return new OperatorAnnouncementPageDto(
                toAnnouncementSnapshot(outcome.page().snapshot()),
                outcome.page().items().stream()
                        .map(entry -> toAnnouncement(
                                entry,
                                outcome.packageVerifications().stream()
                                        .filter(verification -> verification
                                                .announcementId()
                                                .equals(entry.announcementId()))
                                        .findFirst()
                                        .orElse(null)))
                        .toList(),
                outcome.page().nextCursor());
    }

    public OperatorLeaderboardDeploymentPageDto toLeaderboardDeploymentPage(
            LeaderboardDeploymentPage page) {
        List<OperatorLeaderboardDeploymentDto> items = page.items().stream()
                .map(this::toLeaderboardDeployment)
                .toList();
        return new OperatorLeaderboardDeploymentPageDto(
                toSnapshot(page.snapshot()),
                page.groupId(),
                items,
                page.nextCursor());
    }

    private OperatorActionReceiptDto toActionReceipt(OperatorActionReceipt receipt) {
        return new OperatorActionReceiptDto(
                receipt.auditIndex(),
                receipt.auditHash(),
                receipt.previousAuditHash(),
                receipt.actionId(),
                receipt.deploymentId(),
                receipt.subjectDeploymentId(),
                receipt.relatedDeploymentId(),
                receipt.action(),
                receipt.acceptedAt(),
                receipt.claimState(),
                receipt.groupId(),
                receipt.linkId(),
                receipt.tokenId(),
                receipt.sourceClaimActionId(),
                receipt.sourcePrivateRecordHash(),
                receipt.tokenExpiresAt());
    }

    private OperatorLeaderboardSnapshotDto toSnapshot(LeaderboardSnapshot snapshot) {
        return new OperatorLeaderboardSnapshotDto(
                snapshot.snapshotId(),
                snapshot.formulaVersion(),
                snapshot.rulesetVersion(),
                snapshot.throughPeriod(),
                snapshot.throughLedgerIndex(),
                snapshot.throughAuditIndex(),
                snapshot.throughReviewIndex(),
                snapshot.throughEligibilityIndex(),
                snapshot.throughTransferEventIndex(),
                snapshot.ledgerHeadHash(),
                snapshot.auditHeadHash(),
                snapshot.reviewHeadHash(),
                snapshot.eligibilityHeadHash(),
                snapshot.transferEventHeadHash(),
                snapshot.founderUnitsNumerator(),
                snapshot.founderUnitsDenominator(),
                snapshot.founderShareNumerator(),
                snapshot.founderShareDenominator(),
                snapshot.measuredWeightNumerator(),
                snapshot.measuredWeightDenominator(),
                snapshot.claimedWeightNumerator(),
                snapshot.claimedWeightDenominator(),
                snapshot.createdAt(),
                snapshot.snapshotHash());
    }

    public OperatorLeaderboardRowDto toLeaderboardRow(LeaderboardRow row) {
        return new OperatorLeaderboardRowDto(
                row.rowId(),
                row.view(),
                row.groupId(),
                row.label(),
                row.avatarUrl(),
                row.claimState(),
                row.eligibilityStatus(),
                row.deploymentCount(),
                row.weightNumerator(),
                row.weightDenominator(),
                row.shareNumerator(),
                row.shareDenominator());
    }

    private OperatorLeaderboardDeploymentDto toLeaderboardDeployment(
            LeaderboardDeployment deployment) {
        return new OperatorLeaderboardDeploymentDto(
                deployment.deploymentId(),
                deployment.groupId(),
                deployment.claimState(),
                deployment.eligibilityStatus(),
                deployment.membershipState(),
                deployment.weightNumerator(),
                deployment.weightDenominator(),
                deployment.shareNumerator(),
                deployment.shareDenominator());
    }

    private OperatorAnnouncementSnapshotDto toAnnouncementSnapshot(
            AnnouncementSnapshot snapshot) {
        return new OperatorAnnouncementSnapshotDto(
                snapshot.snapshotId(),
                snapshot.asOf(),
                snapshot.throughSequence(),
                snapshot.announcementHeadHash(),
                snapshot.kind(),
                snapshot.severity(),
                snapshot.channel(),
                Boolean.TRUE.equals(snapshot.includeExpired()),
                snapshot.createdAt(),
                snapshot.snapshotHash());
    }

    private OperatorAnnouncementDto toAnnouncement(
            AnnouncementEntry entry,
            PackageVerification verification) {
        return new OperatorAnnouncementDto(
                entry.sequence(),
                entry.announcementId(),
                entry.kind(),
                entry.severity(),
                entry.publishedAt(),
                entry.expiresAt(),
                entry.titleKey(),
                entry.bodyKey(),
                safeList(entry.localizations()).stream()
                        .map(this::toAnnouncementLocalization)
                        .toList(),
                safeList(entry.links()).stream()
                        .map(this::toAnnouncementLink)
                        .toList(),
                entry.updateManifest() == null
                        ? null
                        : toUpdateManifest(entry.updateManifest(), verification),
                entry.updateManifestHash(),
                entry.announcementHash());
    }

    private OperatorAnnouncementLocalizationDto toAnnouncementLocalization(
            AnnouncementLocalization localization) {
        return new OperatorAnnouncementLocalizationDto(
                localization.locale(),
                localization.title(),
                localization.body());
    }

    private OperatorAnnouncementLinkDto toAnnouncementLink(AnnouncementLink link) {
        return new OperatorAnnouncementLinkDto(link.relation(), link.url());
    }

    private OperatorUpdateManifestDto toUpdateManifest(
            UpdateManifest manifest,
            PackageVerification verification) {
        return new OperatorUpdateManifestDto(
                manifest.manifestVersion(),
                manifest.releaseVersion(),
                manifest.channel(),
                manifest.publishedAt(),
                manifest.minimumCompatibleVersion(),
                manifest.maximumCompatibleVersion(),
                manifest.artifactUrl(),
                manifest.artifactSizeBytes(),
                manifest.artifactSha256(),
                manifest.packageSigningKeyId(),
                manifest.packageSignature(),
                manifest.releaseNotesUrl(),
                Boolean.TRUE.equals(manifest.backupRequired()),
                manifest.expectedDowntimeSeconds(),
                manifest.status(),
                manifest.supersedesVersion(),
                manifest.supersededByVersion(),
                manifest.revocationReason(),
                verification != null && verification.packageSigningKeyConfigured(),
                verification != null && verification.packageSigningKeyMatches(),
                verification != null && verification.packageSignatureVerified());
    }

    private static <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
    }
}
