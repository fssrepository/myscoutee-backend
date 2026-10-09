package com.raxim.myscoutee.domain.registry.dto;
import java.util.*;
import java.time.Instant;
import java.nio.file.Path;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.*;
public final class RegistryNetworkValues {
    private RegistryNetworkValues() {}
    public record ActionCommand(
            String action,
            String operatorName,
            String operatorAvatarUrl,
            String clientToken,
            Long tokenTtlSeconds,
            String tokenId,
            String linkId,
            String idempotencyKey,
            ClaimVerification claimVerification) {

        public ActionCommand(
                String action,
                String operatorName,
                String operatorAvatarUrl,
                String clientToken,
                Long tokenTtlSeconds,
                String tokenId,
                String linkId,
                String idempotencyKey) {
            this(
                    action,
                    operatorName,
                    operatorAvatarUrl,
                    clientToken,
                    tokenTtlSeconds,
                    tokenId,
                    linkId,
                    idempotencyKey,
                    null);
        }
    }
    public record ClaimVerification(
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
    public record ActionOutcome(
            OperatorActionResponse response,
            String idempotencyKey,
            String plaintextClientToken,
            Path receiptPath) {
    }
    public record ClaimStatus(
            boolean claimed,
            String claimedAt,
            String operatorName,
            String operatorAvatarUrl,
            String groupId,
            String activeLinkId,
            String shareNumerator,
            String shareDenominator,
            String verificationCapability,
            String verificationUnavailableReason,
            String verificationStatus,
            String verificationSubmittedAt,
            String legalName,
            String eligibilityStatus) {
    }
    public record PackageVerification(
            String announcementId,
            boolean packageSigningKeyConfigured,
            boolean packageSigningKeyMatches,
            boolean packageSignatureVerified) {
    }
    public record AnnouncementOutcome(
            AnnouncementPage page,
            List<PackageVerification> packageVerifications) {
    }
}
