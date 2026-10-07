package com.raxim.myscoutee.domain.operator.dto;

import java.util.List;

public final class OperatorNetworkDtos {
    private OperatorNetworkDtos() {
    }

    public record OperatorActionRequestDto(
            String action,
            String operatorName,
            String operatorAvatarUrl,
            String clientToken,
            Long tokenTtlSeconds,
            String tokenId,
            String linkId,
            String idempotencyKey) {
    }

    public record OperatorClaimRequestDto(
            String legalName,
            String registrationNumber,
            String jurisdiction,
            String registeredAddress,
            String website,
            String verificationContactName,
            String verificationContactRole,
            String verificationContactEmail,
            boolean authorityAttested) {
    }

    public record OperatorClientTokenRequestDto(
            Long tokenTtlSeconds,
            String idempotencyKey) {
    }

    public record OperatorRedeemClientTokenRequestDto(
            String clientToken,
            String idempotencyKey) {
    }

    public record OperatorActionReferenceRequestDto(
            String referenceId,
            String idempotencyKey) {
    }

    public record OperatorIdempotencyRequestDto(
            String idempotencyKey) {
    }

    public record OperatorActionReceiptDto(
            long auditIndex,
            String auditHash,
            String previousAuditHash,
            String actionId,
            String deploymentId,
            String subjectDeploymentId,
            String relatedDeploymentId,
            String action,
            String acceptedAt,
            String claimState,
            String groupId,
            String linkId,
            String tokenId,
            String sourceClaimActionId,
            String sourcePrivateRecordHash,
            String tokenExpiresAt) {
    }

    public record OperatorActionResultDto(
            boolean duplicate,
            String idempotencyKey,
            String clientToken,
            OperatorActionReceiptDto receipt) {
    }

    public record OperatorClaimStatusDto(
            boolean claimed,
            String claimedAt,
            String claimantUserId,
            String claimantName,
            String claimantAvatarUrl,
            String operatorGroupId,
            String activeLinkId,
            double sharePercent,
            String shareNumerator,
            String shareDenominator,
            String verificationCapability,
            String verificationUnavailableReason,
            String verificationStatus,
            String verificationSubmittedAt,
            String legalName,
            String eligibilityStatus) {
    }

    public record OperatorClaimOverviewDto(
            OperatorClaimStatusDto status,
            OperatorClaimRequestDto submission) {
    }

    public record OperatorClaimMutationResultDto(
            OperatorClaimStatusDto status,
            OperatorClaimRequestDto submission,
            OperatorLeaderboardRowDto leaderboardEntry,
            List<OperatorLeaderboardRowDto> leaderboardUpserts,
            List<String> removedLeaderboardEntryIds,
            int leaderboardTotalDelta) {
        public OperatorClaimMutationResultDto(
                OperatorClaimStatusDto status,
                OperatorClaimRequestDto submission,
                OperatorLeaderboardRowDto leaderboardEntry,
                List<String> removedLeaderboardEntryIds) {
            this(
                    status,
                    submission,
                    leaderboardEntry,
                    leaderboardEntry == null
                            ? List.of()
                            : List.of(leaderboardEntry),
                    removedLeaderboardEntryIds,
                    0);
        }
    }

    public record OperatorLeaderboardSnapshotDto(
            String snapshotId,
            String formulaVersion,
            String rulesetVersion,
            String throughPeriod,
            long throughLedgerIndex,
            long throughAuditIndex,
            long throughReviewIndex,
            long throughEligibilityIndex,
            long throughTransferEventIndex,
            String ledgerHeadHash,
            String auditHeadHash,
            String reviewHeadHash,
            String eligibilityHeadHash,
            String transferEventHeadHash,
            String founderUnitsNumerator,
            String founderUnitsDenominator,
            String founderShareNumerator,
            String founderShareDenominator,
            String measuredWeightNumerator,
            String measuredWeightDenominator,
            String claimedWeightNumerator,
            String claimedWeightDenominator,
            String createdAt,
            String snapshotHash) {
    }

    public record OperatorLeaderboardRowDto(
            String rowId,
            String view,
            String groupId,
            String label,
            String avatarUrl,
            String claimState,
            String eligibilityStatus,
            long deploymentCount,
            String weightNumerator,
            String weightDenominator,
            String shareNumerator,
            String shareDenominator) {
    }

    public record OperatorLeaderboardPageDto(
            OperatorLeaderboardSnapshotDto snapshot,
            String view,
            List<OperatorLeaderboardRowDto> items,
            String nextCursor) {
    }

    public record OperatorLeaderboardDeploymentDto(
            String deploymentId,
            String groupId,
            String claimState,
            String eligibilityStatus,
            String membershipState,
            String weightNumerator,
            String weightDenominator,
            String shareNumerator,
            String shareDenominator) {
    }

    public record OperatorLeaderboardDeploymentPageDto(
            OperatorLeaderboardSnapshotDto snapshot,
            String groupId,
            List<OperatorLeaderboardDeploymentDto> items,
            String nextCursor) {
    }

    public record OperatorAnnouncementLocalizationDto(
            String locale,
            String title,
            String body) {
    }

    public record OperatorAnnouncementLinkDto(
            String relation,
            String url) {
    }

    public record OperatorUpdateManifestDto(
            String manifestVersion,
            String releaseVersion,
            String channel,
            String publishedAt,
            String minimumCompatibleVersion,
            String maximumCompatibleVersion,
            String artifactUrl,
            long artifactSizeBytes,
            String artifactSha256,
            String packageSigningKeyId,
            String packageSignature,
            String releaseNotesUrl,
            boolean backupRequired,
            long expectedDowntimeSeconds,
            String status,
            String supersedesVersion,
            String supersededByVersion,
            String revocationReason,
            boolean packageSigningKeyConfigured,
            boolean packageSigningKeyMatches,
            boolean packageSignatureVerified) {
    }

    public record OperatorAnnouncementDto(
            long sequence,
            String announcementId,
            String kind,
            String severity,
            String publishedAt,
            String expiresAt,
            String titleKey,
            String bodyKey,
            List<OperatorAnnouncementLocalizationDto> localizations,
            List<OperatorAnnouncementLinkDto> links,
            OperatorUpdateManifestDto updateManifest,
            String updateManifestHash,
            String announcementHash) {
    }

    public record OperatorAnnouncementSnapshotDto(
            String snapshotId,
            String asOf,
            long throughSequence,
            String announcementHeadHash,
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            String createdAt,
            String snapshotHash) {
    }

    public record OperatorAnnouncementPageDto(
            OperatorAnnouncementSnapshotDto snapshot,
            List<OperatorAnnouncementDto> items,
            String nextCursor) {
    }
}
