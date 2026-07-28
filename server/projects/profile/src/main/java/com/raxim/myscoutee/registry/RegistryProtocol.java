package com.raxim.myscoutee.registry;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

public final class RegistryProtocol {
    public static final String PROTOCOL_VERSION = "1";
    public static final String REGISTRY_IDENTITY_PATH = "/v1/registry/identity";
    public static final String REGISTRATION_PATH = "/v1/deployments/register";
    public static final String MAU_BATCH_PATH = "/v1/mau/batches";
    public static final String REVENUE_BATCH_PATH = "/v1/revenue/batches";
    public static final String OPERATOR_ACTION_PATH = "/v1/operator/actions";
    public static final String OPERATOR_CLAIM_STATUS_PATH_PREFIX = "/v1/operator/claims/";
    public static final String LEADERBOARD_PATH = "/v1/leaderboard";
    public static final String ANNOUNCEMENT_PATH = "/v1/announcements";
    public static final String KEY_ALGORITHM = "Ed25519";
    public static final String INSTALLATION_KIND = "installation-test";
    public static final String INSTALLATION_RULESET = "installation-test-v1";
    public static final long INSTALLATION_MAU_COUNT = 0L;
    public static final String INSTALLATION_ENTRY_TYPE = "INSTALLATION_TEST_BATCH_ACCEPTED";
    public static final String REVENUE_KIND = "daily-revenue";
    public static final String REVENUE_RULESET_VERSION =
            "net-captured-revenue-v1";
    public static final int REVENUE_COMMISSION_RATE_BASIS_POINTS = 500;
    public static final String LEADERBOARD_FORMULA_VERSION = "six-complete-month-average-v1";
    public static final String LEADERBOARD_RULESET_VERSION = "qmau-v1";
    public static final String UPDATE_MANIFEST_VERSION = "1";
    public static final String OPERATOR_ACTION_CLAIM = "claim";
    public static final String OPERATOR_ACTION_WITHDRAW_CLAIM = "withdraw-claim";
    public static final String OPERATOR_ACTION_ISSUE_CLIENT_TOKEN = "issue-client-token";
    public static final String OPERATOR_ACTION_REVOKE_CLIENT_TOKEN = "revoke-client-token";
    public static final String OPERATOR_ACTION_REDEEM_CLIENT_TOKEN = "redeem-client-token";
    public static final String OPERATOR_ACTION_REVOKE_GROUP_LINK = "revoke-group-link";
    public static final String OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT = "deactivate-deployment";
    public static final String OPERATOR_ACTION_REACTIVATE_DEPLOYMENT = "reactivate-deployment";
    public static final String OPERATOR_CLAIM_STATE_PENDING_REVIEW = "pending-review";
    public static final String OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW = "PENDING_REVIEW";
    public static final String OPERATOR_VERIFICATION_STATUS_APPROVED = "APPROVED";
    public static final String OPERATOR_VERIFICATION_STATUS_WITHDRAWN = "WITHDRAWN";
    public static final String ZERO_HASH =
            "sha256:0000000000000000000000000000000000000000000000000000000000000000";

    private static final Pattern HASH_PATTERN = Pattern.compile("sha256:[0-9a-f]{64}");
    private static final Pattern PERIOD_PATTERN = Pattern.compile("[0-9]{4}-(0[1-9]|1[0-2])");
    private static final Pattern PRINTABLE_TOKEN_PATTERN = Pattern.compile("[\\x21-\\x7e]{8,128}");
    private static final Pattern REGISTRY_SCOPE_PATTERN =
            Pattern.compile("[a-z0-9][a-z0-9._:-]{2,127}");
    private static final Pattern DEPLOYMENT_ID_PATTERN = Pattern.compile("dep_[0-9a-f]{32}");
    private static final Pattern BATCH_ID_PATTERN = Pattern.compile("batch_[0-9a-f]{32}");
    private static final Pattern REVENUE_BATCH_ID_PATTERN =
            Pattern.compile("revbatch_[0-9a-f]{32}");
    private static final Pattern REGISTRY_KEY_ID_PATTERN = Pattern.compile("rkey_[0-9a-f]{32}");
    private static final Pattern OPERATOR_ACTION_ID_PATTERN = Pattern.compile("opa_[0-9a-f]{32}");
    private static final Pattern OPERATOR_REVIEW_ID_PATTERN = Pattern.compile("opr_[0-9a-f]{32}");
    private static final Pattern OPERATOR_GROUP_ID_PATTERN = Pattern.compile("opg_[0-9a-f]{32}");
    private static final Pattern OPERATOR_LINK_ID_PATTERN = Pattern.compile("opl_[0-9a-f]{32}");
    private static final Pattern OPERATOR_TOKEN_ID_PATTERN = Pattern.compile("opt_[0-9a-f]{32}");
    private static final Pattern SNAPSHOT_ID_PATTERN = Pattern.compile("snap_[0-9a-f]{32}");
    private static final Pattern ANNOUNCEMENT_ID_PATTERN = Pattern.compile("ann_[0-9a-f]{32}");
    private static final Pattern ANNOUNCEMENT_SNAPSHOT_ID_PATTERN =
            Pattern.compile("annsnap_[0-9a-f]{32}");
    private static final Pattern PACKAGE_SIGNING_KEY_ID_PATTERN =
            Pattern.compile("pkey_[0-9a-f]{32}");

    private RegistryProtocol() {
    }

    public static byte[] registrationPayload(
            String keyAlgorithm,
            String publicKey,
            String softwareVersion) {
        return canonical(
                "myscoutee-registry-registration-payload-v1",
                keyAlgorithm,
                publicKey,
                softwareVersion);
    }

    public static byte[] registryIdentity(RegistryIdentityResponse response) {
        Objects.requireNonNull(response, "Registry identity response must not be null.");
        return canonical(
                "myscoutee-registry-identity-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.registryKeyId(),
                response.registryPublicKey());
    }

    public static byte[] installationCommitment(String deploymentId, String idempotencyKey) {
        return canonical(
                "myscoutee-registry-installation-test-v1",
                deploymentId,
                idempotencyKey);
    }

    public static byte[] mauBatchPayload(
            String kind,
            String period,
            String rulesetVersion,
            long qualifiedMauCount,
            String commitmentHash) {
        return canonical(
                "myscoutee-registry-mau-batch-payload-v1",
                kind,
                period,
                rulesetVersion,
                Long.toString(qualifiedMauCount),
                commitmentHash);
    }

    public static byte[] revenueBatchPayload(
            String kind,
            String period,
            long revision,
            String supersedesBatchId,
            String rulesetVersion,
            int commissionRateBasisPoints,
            List<RevenueCurrencyRow> currencies) {
        List<RevenueCurrencyRow> rows = currencies == null
                ? List.of()
                : List.copyOf(currencies);
        String[] values = new String[7 + rows.size() * 8];
        values[0] = "myscoutee-registry-revenue-batch-payload-v1";
        values[1] = requireCanonical(kind, "revenue kind");
        values[2] = requireRevenuePeriod(period);
        values[3] = Long.toString(requirePositive(revision, "revision"));
        values[4] = supersedesBatchId == null ? "" : supersedesBatchId;
        values[5] = requireCanonical(rulesetVersion, "revenue ruleset_version");
        values[6] = Integer.toString(commissionRateBasisPoints);
        String[] withCount = new String[values.length + 1];
        System.arraycopy(values, 0, withCount, 0, 7);
        withCount[7] = Integer.toString(rows.size());
        String previousCurrency = "";
        int offset = 8;
        for (RevenueCurrencyRow row : rows) {
            Objects.requireNonNull(row, "Revenue currency row must not be null.");
            String currencyCode = requireRevenueCurrencyCode(row.currencyCode());
            if (currencyCode.compareTo(previousCurrency) <= 0) {
                throw new IllegalArgumentException(
                        "Revenue currency rows must be sorted and unique.");
            }
            previousCurrency = currencyCode;
            withCount[offset++] = currencyCode;
            withCount[offset++] = Integer.toString(requireRevenueFractionDigits(
                    row.fractionDigits()));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.capturedMinor(), "captured_minor"));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.refundedMinor(), "refunded_minor"));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.netMinor(), "net_minor"));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.commissionBasisMinor(), "commission_basis_minor"));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.estimatedCommissionMinor(),
                    "estimated_commission_minor"));
            withCount[offset++] = Long.toString(requireNonNegative(
                    row.paymentCount(), "payment_count"));
        }
        return canonicalAllowEmpty(withCount);
    }

    public static byte[] signedRequest(
            String method,
            String path,
            String protocolVersion,
            String registryScope,
            String signer,
            String timestamp,
            String nonce,
            String idempotencyKey,
            String payloadHash) {
        return canonical(
                "myscoutee-registry-request-v1",
                requireCanonical(method, "HTTP method").toUpperCase(Locale.ROOT),
                path,
                protocolVersion,
                registryScope,
                signer,
                timestamp,
                nonce,
                idempotencyKey,
                payloadHash);
    }

    public static byte[] registrationReceipt(RegistrationResponse response) {
        Objects.requireNonNull(response, "Registration response must not be null.");
        return canonical(
                "myscoutee-registry-registration-receipt-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.deploymentId(),
                response.publicKeyFingerprint(),
                response.registeredAt(),
                response.registryKeyId());
    }

    public static byte[] ledgerEntry(
            String protocolVersion,
            String registryScope,
            long ledgerIndex,
            String entryType,
            String deploymentId,
            String batchId,
            String kind,
            String period,
            String rulesetVersion,
            long qualifiedMauCount,
            String batchHash,
            String previousEntryHash,
            String acceptedAt) {
        return canonical(
                "myscoutee-registry-ledger-entry-v1",
                protocolVersion,
                registryScope,
                Long.toString(ledgerIndex),
                entryType,
                deploymentId,
                batchId,
                kind,
                period,
                rulesetVersion,
                Long.toString(qualifiedMauCount),
                batchHash,
                previousEntryHash,
                acceptedAt);
    }

    public static byte[] mauReceipt(BatchResponse response) {
        Objects.requireNonNull(response, "Batch response must not be null.");
        MauReceipt receipt = Objects.requireNonNull(response.receipt(), "MAU receipt must not be null.");
        return canonical(
                "myscoutee-registry-mau-receipt-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.batchId(),
                response.deploymentId(),
                requiredLong(receipt.ledgerIndex(), "ledger_index"),
                receipt.entryHash(),
                receipt.previousEntryHash(),
                receipt.batchHash(),
                receipt.kind(),
                receipt.period(),
                receipt.rulesetVersion(),
                requiredLong(receipt.qualifiedMauCount(), "qualified_mau_count"),
                receipt.acceptedAt(),
                receipt.checkpointDate(),
                receipt.registryKeyId());
    }

    public static byte[] revenueReceipt(RevenueBatchResponse response) {
        Objects.requireNonNull(response, "Revenue response must not be null.");
        RevenueReceipt receipt = Objects.requireNonNull(
                response.receipt(),
                "Revenue receipt must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-revenue-receipt-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.batchId(),
                response.deploymentId(),
                requiredLong(receipt.ledgerIndex(), "ledger_index"),
                receipt.entryHash(),
                receipt.previousEntryHash(),
                receipt.batchHash(),
                receipt.kind(),
                receipt.period(),
                requiredLong(receipt.revision(), "revision"),
                nullToEmpty(receipt.supersedesBatchId()),
                receipt.rulesetVersion(),
                requiredInteger(
                        receipt.commissionRateBasisPoints(),
                        "commission_rate_basis_points"),
                requiredInteger(receipt.currencyCount(), "currency_count"),
                receipt.acceptedAt(),
                receipt.checkpointDate(),
                receipt.registryKeyId());
    }

    public static byte[] operatorActionPayload(
            String action,
            String operatorName,
            String operatorAvatarUrl,
            String clientTokenHash,
            long tokenTtlSeconds,
            String tokenId,
            String linkId) {
        return canonicalAllowEmpty(
                "myscoutee-registry-operator-action-payload-v1",
                action,
                operatorName,
                operatorAvatarUrl,
                clientTokenHash,
                Long.toString(tokenTtlSeconds),
                tokenId,
                linkId);
    }

    public static byte[] operatorClaimPayload(
            String legalName,
            String registrationNumber,
            String jurisdiction,
            String registeredAddress,
            String website,
            String verificationContactName,
            String verificationContactRole,
            String verificationContactEmail,
            boolean authorityAttested,
            String operatorAvatarUrl) {
        return canonicalAllowEmpty(
                "myscoutee-registry-operator-claim-payload-v2",
                OPERATOR_ACTION_CLAIM,
                legalName,
                registrationNumber,
                jurisdiction,
                registeredAddress,
                website,
                verificationContactName,
                verificationContactRole,
                verificationContactEmail,
                Boolean.toString(authorityAttested),
                operatorAvatarUrl);
    }

    public static byte[] operatorActionReceipt(OperatorActionReceipt receipt) {
        Objects.requireNonNull(receipt, "Operator action receipt must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-operator-action-receipt-v1",
                requiredLong(receipt.auditIndex(), "audit_index"),
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
                receipt.clientTokenHash(),
                receipt.tokenExpiresAt(),
                receipt.registryScope(),
                receipt.registryKeyId());
    }

    public static byte[] operatorAudit(
            OperatorActionReceipt receipt,
            String payloadHash) {
        Objects.requireNonNull(receipt, "Operator action receipt must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-operator-audit-v1",
                requiredLong(receipt.auditIndex(), "audit_index"),
                receipt.actionId(),
                receipt.deploymentId(),
                receipt.subjectDeploymentId(),
                receipt.relatedDeploymentId(),
                receipt.action(),
                payloadHash,
                receipt.acceptedAt(),
                receipt.claimState(),
                receipt.groupId(),
                receipt.linkId(),
                receipt.tokenId(),
                receipt.clientTokenHash(),
                receipt.tokenExpiresAt(),
                receipt.previousAuditHash());
    }

    public static byte[] operatorClaimStatusReceipt(OperatorClaimStatusReceipt status) {
        Objects.requireNonNull(status, "Operator claim status receipt must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-operator-claim-status-receipt-v1",
                status.deploymentId(),
                status.claimActionId(),
                requiredLong(status.claimAuditIndex(), "claim_audit_index"),
                status.claimAuditHash(),
                status.groupId(),
                status.legalName(),
                status.verificationStatus(),
                status.submittedAt(),
                status.reviewId(),
                status.reviewIndex() == null ? "0" : Long.toString(status.reviewIndex()),
                status.reviewHash(),
                status.approvedAt(),
                status.registryScope(),
                status.registryKeyId());
    }

    public static byte[] leaderboardSnapshotHash(LeaderboardSnapshot snapshot) {
        Objects.requireNonNull(snapshot, "Leaderboard snapshot must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-leaderboard-snapshot-hash-v1",
                snapshot.snapshotId(),
                snapshot.formulaVersion(),
                snapshot.rulesetVersion(),
                snapshot.throughPeriod(),
                requiredLong(snapshot.throughLedgerIndex(), "through_ledger_index"),
                requiredLong(snapshot.throughAuditIndex(), "through_audit_index"),
                snapshot.ledgerHeadHash(),
                snapshot.auditHeadHash(),
                snapshot.founderUnitsNumerator(),
                snapshot.founderUnitsDenominator(),
                snapshot.founderShareNumerator(),
                snapshot.founderShareDenominator(),
                snapshot.measuredWeightNumerator(),
                snapshot.measuredWeightDenominator(),
                snapshot.claimedWeightNumerator(),
                snapshot.claimedWeightDenominator(),
                snapshot.createdAt(),
                snapshot.registryScope(),
                snapshot.registryKeyId());
    }

    public static byte[] leaderboardSnapshotReceipt(LeaderboardSnapshot snapshot) {
        Objects.requireNonNull(snapshot, "Leaderboard snapshot must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-leaderboard-snapshot-receipt-v1",
                snapshot.snapshotHash(),
                snapshot.registryKeyId());
    }

    public static byte[] leaderboardCursor(byte[] cursorPayload) {
        byte[] prefix = "myscoutee-registry-leaderboard-cursor-v1\n"
                .getBytes(StandardCharsets.UTF_8);
        byte[] payload = Objects.requireNonNull(cursorPayload, "Leaderboard cursor payload must not be null.");
        byte[] message = new byte[prefix.length + payload.length];
        System.arraycopy(prefix, 0, message, 0, prefix.length);
        System.arraycopy(payload, 0, message, prefix.length, payload.length);
        return message;
    }

    public static byte[] announcementContent(
            String titleKey,
            String bodyKey,
            List<AnnouncementLocalization> localizations) {
        List<AnnouncementLocalization> safeLocalizations =
                localizations == null ? List.of() : localizations;
        java.util.ArrayList<String> values = new java.util.ArrayList<>();
        values.add("myscoutee-registry-announcement-content-v1");
        values.add(nullToEmpty(titleKey));
        values.add(nullToEmpty(bodyKey));
        values.add(Integer.toString(safeLocalizations.size()));
        for (AnnouncementLocalization localization : safeLocalizations) {
            Objects.requireNonNull(localization, "Announcement localization must not be null.");
            values.add(localization.locale());
            values.add(sha256(nullToEmpty(localization.title()).getBytes(StandardCharsets.UTF_8)));
            values.add(sha256(nullToEmpty(localization.body()).getBytes(StandardCharsets.UTF_8)));
        }
        return canonicalAllowEmpty(values.toArray(String[]::new));
    }

    public static byte[] announcementLinks(List<AnnouncementLink> links) {
        List<AnnouncementLink> safeLinks = links == null ? List.of() : links;
        java.util.ArrayList<String> values = new java.util.ArrayList<>();
        values.add("myscoutee-registry-announcement-links-v1");
        values.add(Integer.toString(safeLinks.size()));
        for (AnnouncementLink link : safeLinks) {
            Objects.requireNonNull(link, "Announcement link must not be null.");
            values.add(link.relation());
            values.add(link.url());
        }
        return canonicalAllowEmpty(values.toArray(String[]::new));
    }

    public static byte[] updateManifest(UpdateManifest manifest) {
        Objects.requireNonNull(manifest, "Update manifest must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-update-manifest-v1",
                manifest.manifestVersion(),
                manifest.releaseVersion(),
                manifest.channel(),
                manifest.publishedAt(),
                manifest.minimumCompatibleVersion(),
                manifest.maximumCompatibleVersion(),
                manifest.artifactUrl(),
                requiredLong(manifest.artifactSizeBytes(), "artifact_size_bytes"),
                manifest.artifactSha256(),
                manifest.packageSigningKeyId(),
                manifest.packageSignature(),
                manifest.releaseNotesUrl(),
                Boolean.toString(Boolean.TRUE.equals(manifest.backupRequired())),
                requiredLong(manifest.expectedDowntimeSeconds(), "expected_downtime_seconds"),
                manifest.status(),
                manifest.supersedesVersion(),
                manifest.supersededByVersion(),
                manifest.revocationReason());
    }

    public static byte[] releasePackage(UpdateManifest manifest) {
        Objects.requireNonNull(manifest, "Update manifest must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-release-package-v1",
                manifest.releaseVersion(),
                manifest.channel(),
                requiredLong(manifest.artifactSizeBytes(), "artifact_size_bytes"),
                manifest.artifactSha256());
    }

    public static byte[] announcementEntry(AnnouncementEntry entry) {
        Objects.requireNonNull(entry, "Announcement entry must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-announcement-entry-v1",
                entry.protocolVersion(),
                entry.registryScope(),
                requiredLong(entry.sequence(), "announcement sequence"),
                entry.announcementId(),
                entry.publicationId(),
                entry.kind(),
                entry.severity(),
                entry.publishedAt(),
                entry.expiresAt(),
                entry.contentHash(),
                entry.linksHash(),
                entry.updateManifestHash(),
                entry.previousAnnouncementHash(),
                entry.acceptedAt(),
                entry.registryKeyId());
    }

    public static byte[] announcementReceipt(AnnouncementEntry entry) {
        Objects.requireNonNull(entry, "Announcement entry must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-announcement-receipt-v1",
                entry.announcementHash(),
                entry.registryScope(),
                entry.registryKeyId());
    }

    public static byte[] announcementSnapshotHash(AnnouncementSnapshot snapshot) {
        Objects.requireNonNull(snapshot, "Announcement snapshot must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-announcement-snapshot-hash-v1",
                snapshot.snapshotId(),
                snapshot.asOf(),
                requiredLong(snapshot.throughSequence(), "through_sequence"),
                snapshot.announcementHeadHash(),
                snapshot.kind(),
                snapshot.severity(),
                snapshot.channel(),
                Boolean.toString(Boolean.TRUE.equals(snapshot.includeExpired())),
                snapshot.createdAt(),
                snapshot.registryScope(),
                snapshot.registryKeyId());
    }

    public static byte[] announcementSnapshotReceipt(AnnouncementSnapshot snapshot) {
        Objects.requireNonNull(snapshot, "Announcement snapshot must not be null.");
        return canonicalAllowEmpty(
                "myscoutee-registry-announcement-snapshot-receipt-v1",
                snapshot.snapshotHash(),
                snapshot.registryScope(),
                snapshot.registryKeyId());
    }

    public static byte[] announcementCursor(byte[] cursorPayload) {
        byte[] prefix = "myscoutee-registry-announcement-cursor-v1\n"
                .getBytes(StandardCharsets.UTF_8);
        byte[] payload = Objects.requireNonNull(cursorPayload, "Announcement cursor payload must not be null.");
        byte[] message = new byte[prefix.length + payload.length];
        System.arraycopy(prefix, 0, message, 0, prefix.length);
        System.arraycopy(payload, 0, message, prefix.length, payload.length);
        return message;
    }

    public static byte[] checkpoint(CheckpointResponse checkpoint) {
        Objects.requireNonNull(checkpoint, "Checkpoint must not be null.");
        return canonical(
                "myscoutee-registry-checkpoint-v1",
                checkpoint.registryScope(),
                checkpoint.checkpointDate(),
                requiredLong(checkpoint.throughLedgerIndex(), "through_ledger_index"),
                requiredLong(checkpoint.entryCount(), "entry_count"),
                checkpoint.ledgerHeadHash(),
                checkpoint.previousCheckpointHash(),
                checkpoint.generatedAt(),
                checkpoint.registryKeyId());
    }

    public static byte[] canonical(String... values) {
        StringBuilder canonical = new StringBuilder();
        for (int index = 0; index < values.length; index++) {
            String value = requireCanonical(values[index], "canonical field " + index);
            canonical.append(value).append('\n');
        }
        return canonical.toString().getBytes(StandardCharsets.UTF_8);
    }

    public static byte[] canonicalAllowEmpty(String... values) {
        StringBuilder canonical = new StringBuilder();
        for (int index = 0; index < values.length; index++) {
            String value = values[index] == null ? "" : values[index];
            if (value.indexOf('\r') >= 0 || value.indexOf('\n') >= 0) {
                throw new IllegalArgumentException(
                        "canonical field " + index + " must not contain CR or LF.");
            }
            canonical.append(value).append('\n');
        }
        return canonical.toString().getBytes(StandardCharsets.UTF_8);
    }

    public static String sha256(byte[] value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value);
            return "sha256:" + HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    public static String publicKeyFingerprint(byte[] spkiDer) {
        return sha256(Objects.requireNonNull(spkiDer, "Public key DER must not be null."));
    }

    public static String registryKeyId(String publicKeyFingerprint) {
        requireHash(publicKeyFingerprint, "registry public-key fingerprint");
        return "rkey_" + publicKeyFingerprint.substring("sha256:".length(), "sha256:".length() + 32);
    }

    public static String standardBase64(byte[] value) {
        return Base64.getEncoder().encodeToString(Objects.requireNonNull(value, "Binary value must not be null."));
    }

    public static byte[] decodeStandardBase64(String value, String fieldName) {
        requireCanonical(value, fieldName);
        try {
            byte[] decoded = Base64.getDecoder().decode(value);
            if (!standardBase64(decoded).equals(value)) {
                throw new IllegalArgumentException(fieldName + " is not canonical padded base64.");
            }
            return decoded;
        } catch (IllegalArgumentException exception) {
            if (exception.getMessage() != null && exception.getMessage().contains("canonical padded base64")) {
                throw exception;
            }
            throw new IllegalArgumentException(fieldName + " is not valid standard padded base64.", exception);
        }
    }

    public static String randomToken(String prefix, SecureRandom secureRandom) {
        requireCanonical(prefix, "token prefix");
        byte[] randomBytes = new byte[24];
        Objects.requireNonNull(secureRandom, "SecureRandom must not be null.").nextBytes(randomBytes);
        return prefix + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public static String requireCanonical(String value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be blank.");
        }
        if (value.indexOf('\r') >= 0 || value.indexOf('\n') >= 0) {
            throw new IllegalArgumentException(fieldName + " must not contain CR or LF.");
        }
        return value;
    }

    public static String requireHash(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!HASH_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(fieldName + " must be a canonical SHA-256 value.");
        }
        return value;
    }

    public static String requireToken(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!PRINTABLE_TOKEN_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(fieldName + " must be 8-128 printable ASCII characters.");
        }
        return value;
    }

    public static String requireRegistryScope(String value) {
        requireCanonical(value, "registry_scope");
        if (!REGISTRY_SCOPE_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    "registry_scope must be 3-128 lowercase ASCII letters, digits, dots, colons, underscores, "
                            + "or hyphens, and must begin with a letter or digit.");
        }
        return value;
    }

    public static String requireDeploymentId(String value) {
        requireCanonical(value, "deployment_id");
        if (!DEPLOYMENT_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("deployment_id is malformed.");
        }
        return value;
    }

    public static String requireBatchId(String value) {
        requireCanonical(value, "batch_id");
        if (!BATCH_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("batch_id is malformed.");
        }
        return value;
    }

    public static String requireRevenueBatchId(String value) {
        return requirePattern(
                value,
                "revenue batch_id",
                REVENUE_BATCH_ID_PATTERN);
    }

    public static String requireRevenuePeriod(String value) {
        requireCanonical(value, "revenue period");
        try {
            String canonical = LocalDate.parse(value).toString();
            if (!canonical.equals(value)) {
                throw new IllegalArgumentException(
                        "revenue period must be a canonical UTC calendar date.");
            }
            return value;
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(
                    "revenue period must be a canonical UTC calendar date.",
                    exception);
        }
    }

    public static String requireRevenueCurrencyCode(String value) {
        requireCanonical(value, "currency_code");
        if (!value.matches("[A-Z]{3}")) {
            throw new IllegalArgumentException(
                    "currency_code must contain exactly three uppercase ASCII letters.");
        }
        try {
            java.util.Currency currency = java.util.Currency.getInstance(value);
            if (!currency.getCurrencyCode().equals(value)
                    || currency.getDefaultFractionDigits() < 0) {
                throw new IllegalArgumentException(
                        "currency_code is not an accounting ISO-4217 currency.");
            }
            return value;
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "currency_code is not an accounting ISO-4217 currency.",
                    exception);
        }
    }

    public static int requireRevenueFractionDigits(Integer value) {
        if (value == null || value < 0 || value > 9) {
            throw new IllegalArgumentException(
                    "fraction_digits must be between zero and nine.");
        }
        return value;
    }

    public static String requireRegistryKeyId(String value) {
        requireCanonical(value, "registry_key_id");
        if (!REGISTRY_KEY_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("registry_key_id is malformed.");
        }
        return value;
    }

    public static String requireOperatorActionId(String value) {
        return requirePattern(value, "action_id", OPERATOR_ACTION_ID_PATTERN);
    }

    public static String requireOperatorReviewId(String value) {
        return requirePattern(value, "review_id", OPERATOR_REVIEW_ID_PATTERN);
    }

    public static String requireOperatorGroupId(String value) {
        return requirePattern(value, "group_id", OPERATOR_GROUP_ID_PATTERN);
    }

    public static String requireOperatorLinkId(String value) {
        return requirePattern(value, "link_id", OPERATOR_LINK_ID_PATTERN);
    }

    public static String requireOperatorTokenId(String value) {
        return requirePattern(value, "token_id", OPERATOR_TOKEN_ID_PATTERN);
    }

    public static String requireSnapshotId(String value) {
        return requirePattern(value, "snapshot_id", SNAPSHOT_ID_PATTERN);
    }

    public static String requireAnnouncementId(String value) {
        return requirePattern(value, "announcement_id", ANNOUNCEMENT_ID_PATTERN);
    }

    public static String requireAnnouncementSnapshotId(String value) {
        return requirePattern(
                value,
                "announcement snapshot_id",
                ANNOUNCEMENT_SNAPSHOT_ID_PATTERN);
    }

    public static String requirePackageSigningKeyId(String value) {
        return requirePattern(
                value,
                "package_signing_key_id",
                PACKAGE_SIGNING_KEY_ID_PATTERN);
    }

    public static String packageSigningKeyId(byte[] publicKeyDer) {
        String fingerprint = publicKeyFingerprint(publicKeyDer);
        return "pkey_" + fingerprint.substring(
                "sha256:".length(),
                "sha256:".length() + 32);
    }

    public static SemanticVersion requireSemanticVersion(
            String value,
            String fieldName) {
        String supplied = Objects.requireNonNull(
                value,
                fieldName + " must not be null.");
        if (supplied.length() < 5
                || supplied.length() > 128
                || supplied.indexOf('\n') >= 0
                || supplied.indexOf('\r') >= 0) {
            throw invalidSemanticVersion(fieldName);
        }
        String[] buildParts = supplied.split("\\+", -1);
        if (buildParts.length > 2
                || (buildParts.length == 2
                        && !validSemanticIdentifiers(buildParts[1], false))) {
            throw invalidSemanticVersion(fieldName);
        }
        String[] prereleaseParts = buildParts[0].split("-", 2);
        if (prereleaseParts.length == 2
                && !validSemanticIdentifiers(prereleaseParts[1], true)) {
            throw invalidSemanticVersion(fieldName);
        }
        String[] core = prereleaseParts[0].split("\\.", -1);
        if (core.length != 3) {
            throw invalidSemanticVersion(fieldName);
        }
        BigInteger[] numbers = new BigInteger[3];
        for (int index = 0; index < core.length; index++) {
            String part = core[index];
            if (part.isEmpty()
                    || (part.length() > 1 && part.charAt(0) == '0')
                    || !allAsciiDigits(part)) {
                throw invalidSemanticVersion(fieldName);
            }
            numbers[index] = new BigInteger(part);
            if (numbers[index].bitLength() > 64) {
                throw invalidSemanticVersion(fieldName);
            }
        }
        return new SemanticVersion(
                numbers[0],
                numbers[1],
                numbers[2],
                prereleaseParts.length == 2
                        ? List.of(prereleaseParts[1].split("\\.", -1))
                        : List.of());
    }

    public static int compareSemanticVersions(
            SemanticVersion left,
            SemanticVersion right) {
        Objects.requireNonNull(left, "Left semantic version must not be null.");
        Objects.requireNonNull(right, "Right semantic version must not be null.");
        int comparison = left.major().compareTo(right.major());
        if (comparison == 0) {
            comparison = left.minor().compareTo(right.minor());
        }
        if (comparison == 0) {
            comparison = left.patch().compareTo(right.patch());
        }
        if (comparison != 0) {
            return comparison;
        }
        if (left.prerelease().isEmpty() && right.prerelease().isEmpty()) {
            return 0;
        }
        if (left.prerelease().isEmpty()) {
            return 1;
        }
        if (right.prerelease().isEmpty()) {
            return -1;
        }
        int length = Math.min(
                left.prerelease().size(),
                right.prerelease().size());
        for (int index = 0; index < length; index++) {
            String leftPart = left.prerelease().get(index);
            String rightPart = right.prerelease().get(index);
            if (leftPart.equals(rightPart)) {
                continue;
            }
            boolean leftNumeric = allAsciiDigits(leftPart);
            boolean rightNumeric = allAsciiDigits(rightPart);
            if (leftNumeric && rightNumeric) {
                int numeric = new BigInteger(leftPart)
                        .compareTo(new BigInteger(rightPart));
                if (numeric != 0) {
                    return numeric;
                }
            } else if (leftNumeric) {
                return -1;
            } else if (rightNumeric) {
                return 1;
            } else {
                return leftPart.compareTo(rightPart);
            }
        }
        return Integer.compare(
                left.prerelease().size(),
                right.prerelease().size());
    }

    private static boolean validSemanticIdentifiers(
            String value,
            boolean rejectNumericLeadingZero) {
        if (value.isEmpty()) {
            return false;
        }
        for (String identifier : value.split("\\.", -1)) {
            if (identifier.isEmpty()) {
                return false;
            }
            boolean numeric = true;
            for (int index = 0; index < identifier.length(); index++) {
                char character = identifier.charAt(index);
                if (!((character >= '0' && character <= '9')
                        || (character >= 'A' && character <= 'Z')
                        || (character >= 'a' && character <= 'z')
                        || character == '-')) {
                    return false;
                }
                if (character < '0' || character > '9') {
                    numeric = false;
                }
            }
            if (rejectNumericLeadingZero
                    && numeric
                    && identifier.length() > 1
                    && identifier.charAt(0) == '0') {
                return false;
            }
        }
        return true;
    }

    private static boolean allAsciiDigits(String value) {
        if (value.isEmpty()) {
            return false;
        }
        for (int index = 0; index < value.length(); index++) {
            char character = value.charAt(index);
            if (character < '0' || character > '9') {
                return false;
            }
        }
        return true;
    }

    private static IllegalArgumentException invalidSemanticVersion(
            String fieldName) {
        return new IllegalArgumentException(
                fieldName + " must be a canonical semantic version.");
    }

    private static String requirePattern(String value, String fieldName, Pattern pattern) {
        requireCanonical(value, fieldName);
        if (!pattern.matcher(value).matches()) {
            throw new IllegalArgumentException(fieldName + " is malformed.");
        }
        return value;
    }

    public static Instant requireUtcTimestamp(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!value.endsWith("Z")) {
            throw new IllegalArgumentException(fieldName + " must be an RFC 3339 UTC timestamp ending in Z.");
        }
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(fieldName + " must be an RFC 3339 UTC timestamp.", exception);
        }
    }

    public static YearMonth requirePeriod(String value) {
        requireCanonical(value, "period");
        if (!PERIOD_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("period must use YYYY-MM.");
        }
        return YearMonth.parse(value);
    }

    public static LocalDate requireCheckpointDate(String value) {
        requireCanonical(value, "checkpoint_date");
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("checkpoint_date must use YYYY-MM-DD.", exception);
        }
    }

    public static String periodAt(Instant instant) {
        return YearMonth.from(Objects.requireNonNull(instant, "Instant must not be null.").atZone(ZoneOffset.UTC))
                .toString();
    }

    public static String checkpointDateAt(Instant instant) {
        return instant.atZone(ZoneOffset.UTC).toLocalDate().toString();
    }

    public static boolean hashEquals(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return MessageDigest.isEqual(
                left.getBytes(StandardCharsets.US_ASCII),
                right.getBytes(StandardCharsets.US_ASCII));
    }

    private static String requiredLong(Long value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " must not be null.");
        }
        return Long.toString(value);
    }

    private static String requiredInteger(Integer value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " must not be null.");
        }
        return Integer.toString(value);
    }

    private static long requirePositive(long value, String fieldName) {
        if (value <= 0L) {
            throw new IllegalArgumentException(fieldName + " must be positive.");
        }
        return value;
    }

    private static long requireNonNegative(Long value, String fieldName) {
        if (value == null || value < 0L) {
            throw new IllegalArgumentException(
                    fieldName + " must be non-negative.");
        }
        return value;
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    public record RegistryIdentityResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record RegistrationRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            @JsonProperty("key_algorithm") String keyAlgorithm,
            @JsonProperty("public_key") String publicKey,
            @JsonProperty("software_version") String softwareVersion,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {
    }

    public record RegistrationResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("registered_at") String registeredAt,
            @JsonProperty("public_key_fingerprint") String publicKeyFingerprint,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            @JsonProperty("receipt_signature") String receiptSignature,
            Boolean duplicate) {
    }

    public record BatchRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String kind,
            String period,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("qualified_mau_count") Long qualifiedMauCount,
            @JsonProperty("commitment_hash") String commitmentHash,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {
    }

    public record BatchResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("batch_id") String batchId,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("idempotency_key") String idempotencyKey,
            Boolean duplicate,
            MauReceipt receipt) {
    }

    public record MauReceipt(
            @JsonProperty("ledger_index") Long ledgerIndex,
            @JsonProperty("entry_hash") String entryHash,
            @JsonProperty("previous_entry_hash") String previousEntryHash,
            @JsonProperty("batch_hash") String batchHash,
            String kind,
            String period,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("qualified_mau_count") Long qualifiedMauCount,
            @JsonProperty("accepted_at") String acceptedAt,
            @JsonProperty("checkpoint_date") String checkpointDate,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record RevenueCurrencyRow(
            @JsonProperty("currency_code") String currencyCode,
            @JsonProperty("fraction_digits") Integer fractionDigits,
            @JsonProperty("captured_minor") Long capturedMinor,
            @JsonProperty("refunded_minor") Long refundedMinor,
            @JsonProperty("net_minor") Long netMinor,
            @JsonProperty("commission_basis_minor") Long commissionBasisMinor,
            @JsonProperty("estimated_commission_minor") Long estimatedCommissionMinor,
            @JsonProperty("payment_count") Long paymentCount) {
    }

    public record RevenueBatchRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String kind,
            String period,
            Long revision,
            @JsonProperty("supersedes_batch_id") String supersedesBatchId,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("commission_rate_basis_points") Integer commissionRateBasisPoints,
            List<RevenueCurrencyRow> currencies,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {
    }

    public record RevenueBatchResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("batch_id") String batchId,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("idempotency_key") String idempotencyKey,
            Boolean duplicate,
            RevenueReceipt receipt) {
    }

    public record RevenueReceipt(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("batch_id") String batchId,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("ledger_index") Long ledgerIndex,
            @JsonProperty("entry_hash") String entryHash,
            @JsonProperty("previous_entry_hash") String previousEntryHash,
            @JsonProperty("batch_hash") String batchHash,
            String kind,
            String period,
            Long revision,
            @JsonProperty("supersedes_batch_id") String supersedesBatchId,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("commission_rate_basis_points") Integer commissionRateBasisPoints,
            @JsonProperty("currency_count") Integer currencyCount,
            @JsonProperty("accepted_at") String acceptedAt,
            @JsonProperty("checkpoint_date") String checkpointDate,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record CheckpointResponse(
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("checkpoint_date") String checkpointDate,
            @JsonProperty("through_ledger_index") Long throughLedgerIndex,
            @JsonProperty("entry_count") Long entryCount,
            @JsonProperty("ledger_head_hash") String ledgerHeadHash,
            @JsonProperty("previous_checkpoint_hash") String previousCheckpointHash,
            @JsonProperty("checkpoint_hash") String checkpointHash,
            @JsonProperty("generated_at") String generatedAt,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record OperatorActionRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String action,
            @JsonProperty("operator_name") String operatorName,
            @JsonProperty("operator_avatar_url") String operatorAvatarUrl,
            @JsonProperty("legal_name") String legalName,
            @JsonProperty("registration_number") String registrationNumber,
            String jurisdiction,
            @JsonProperty("registered_address") String registeredAddress,
            String website,
            @JsonProperty("verification_contact_name") String verificationContactName,
            @JsonProperty("verification_contact_role") String verificationContactRole,
            @JsonProperty("verification_contact_email") String verificationContactEmail,
            @JsonProperty("authority_attested") Boolean authorityAttested,
            @JsonProperty("client_token") String clientToken,
            @JsonProperty("token_ttl_seconds") Long tokenTtlSeconds,
            @JsonProperty("token_id") String tokenId,
            @JsonProperty("link_id") String linkId,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {

        public OperatorActionRequest(
                String protocolVersion,
                String registryScope,
                String deploymentId,
                String timestamp,
                String nonce,
                String idempotencyKey,
                String action,
                String operatorName,
                String operatorAvatarUrl,
                String clientToken,
                Long tokenTtlSeconds,
                String tokenId,
                String linkId,
                String payloadHash,
                String signature) {
            this(
                    protocolVersion,
                    registryScope,
                    deploymentId,
                    timestamp,
                    nonce,
                    idempotencyKey,
                    action,
                    operatorName,
                    operatorAvatarUrl,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    clientToken,
                    tokenTtlSeconds,
                    tokenId,
                    linkId,
                    payloadHash,
                    signature);
        }
    }

    public record OperatorActionReceipt(
            @JsonProperty("audit_index") Long auditIndex,
            @JsonProperty("audit_hash") String auditHash,
            @JsonProperty("previous_audit_hash") String previousAuditHash,
            @JsonProperty("action_id") String actionId,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("subject_deployment_id") String subjectDeploymentId,
            @JsonProperty("related_deployment_id") String relatedDeploymentId,
            String action,
            @JsonProperty("accepted_at") String acceptedAt,
            @JsonProperty("claim_state") String claimState,
            @JsonProperty("group_id") String groupId,
            @JsonProperty("link_id") String linkId,
            @JsonProperty("token_id") String tokenId,
            @JsonProperty("client_token") String clientToken,
            @JsonProperty("client_token_hash") String clientTokenHash,
            @JsonProperty("token_expires_at") String tokenExpiresAt,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            String signature) {

        public OperatorActionReceipt withoutPlaintextClientToken() {
            return new OperatorActionReceipt(
                    auditIndex,
                    auditHash,
                    previousAuditHash,
                    actionId,
                    deploymentId,
                    subjectDeploymentId,
                    relatedDeploymentId,
                    action,
                    acceptedAt,
                    claimState,
                    groupId,
                    linkId,
                    tokenId,
                    null,
                    clientTokenHash,
                    tokenExpiresAt,
                    registryScope,
                    registryKeyId,
                    signature);
        }
    }

    public record OperatorActionResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            Boolean duplicate,
            OperatorActionReceipt receipt) {
    }

    public record OperatorClaimStatusReceipt(
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("claim_action_id") String claimActionId,
            @JsonProperty("claim_audit_index") Long claimAuditIndex,
            @JsonProperty("claim_audit_hash") String claimAuditHash,
            @JsonProperty("group_id") String groupId,
            @JsonProperty("legal_name") String legalName,
            @JsonProperty("verification_status") String verificationStatus,
            @JsonProperty("submitted_at") String submittedAt,
            @JsonProperty("review_id") String reviewId,
            @JsonProperty("review_index") Long reviewIndex,
            @JsonProperty("review_hash") String reviewHash,
            @JsonProperty("approved_at") String approvedAt,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            String signature) {
    }

    public record OperatorClaimStatusResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            OperatorClaimStatusReceipt status) {
    }

    public record LeaderboardSnapshot(
            @JsonProperty("snapshot_id") String snapshotId,
            @JsonProperty("formula_version") String formulaVersion,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("through_period") String throughPeriod,
            @JsonProperty("through_ledger_index") Long throughLedgerIndex,
            @JsonProperty("through_audit_index") Long throughAuditIndex,
            @JsonProperty("ledger_head_hash") String ledgerHeadHash,
            @JsonProperty("audit_head_hash") String auditHeadHash,
            @JsonProperty("founder_units_numerator") String founderUnitsNumerator,
            @JsonProperty("founder_units_denominator") String founderUnitsDenominator,
            @JsonProperty("founder_share_numerator") String founderShareNumerator,
            @JsonProperty("founder_share_denominator") String founderShareDenominator,
            @JsonProperty("measured_weight_numerator") String measuredWeightNumerator,
            @JsonProperty("measured_weight_denominator") String measuredWeightDenominator,
            @JsonProperty("claimed_weight_numerator") String claimedWeightNumerator,
            @JsonProperty("claimed_weight_denominator") String claimedWeightDenominator,
            @JsonProperty("created_at") String createdAt,
            @JsonProperty("snapshot_hash") String snapshotHash,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            String signature) {
    }

    public record LeaderboardRow(
            @JsonProperty("row_id") String rowId,
            String view,
            @JsonProperty("group_id") String groupId,
            String label,
            @JsonProperty("avatar_url") String avatarUrl,
            @JsonProperty("claim_state") String claimState,
            @JsonProperty("deployment_count") Long deploymentCount,
            @JsonProperty("weight_numerator") String weightNumerator,
            @JsonProperty("weight_denominator") String weightDenominator,
            @JsonProperty("share_numerator") String shareNumerator,
            @JsonProperty("share_denominator") String shareDenominator) {
    }

    public record LeaderboardPage(
            LeaderboardSnapshot snapshot,
            String view,
            List<LeaderboardRow> items,
            @JsonProperty("next_cursor") String nextCursor) {
    }

    public record LeaderboardDeployment(
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("group_id") String groupId,
            @JsonProperty("claim_state") String claimState,
            @JsonProperty("membership_state") String membershipState,
            @JsonProperty("weight_numerator") String weightNumerator,
            @JsonProperty("weight_denominator") String weightDenominator,
            @JsonProperty("share_numerator") String shareNumerator,
            @JsonProperty("share_denominator") String shareDenominator) {
    }

    public record LeaderboardDeploymentPage(
            LeaderboardSnapshot snapshot,
            @JsonProperty("group_id") String groupId,
            List<LeaderboardDeployment> items,
            @JsonProperty("next_cursor") String nextCursor) {
    }

    public record AnnouncementLocalization(
            String locale,
            String title,
            String body) {
    }

    public record AnnouncementLink(
            String relation,
            String url) {
    }

    public record UpdateManifest(
            @JsonProperty("manifest_version") String manifestVersion,
            @JsonProperty("release_version") String releaseVersion,
            String channel,
            @JsonProperty("published_at") String publishedAt,
            @JsonProperty("minimum_compatible_version") String minimumCompatibleVersion,
            @JsonProperty("maximum_compatible_version") String maximumCompatibleVersion,
            @JsonProperty("artifact_url") String artifactUrl,
            @JsonProperty("artifact_size_bytes") Long artifactSizeBytes,
            @JsonProperty("artifact_sha256") String artifactSha256,
            @JsonProperty("package_signing_key_id") String packageSigningKeyId,
            @JsonProperty("package_signature") String packageSignature,
            @JsonProperty("release_notes_url") String releaseNotesUrl,
            @JsonProperty("backup_required") Boolean backupRequired,
            @JsonProperty("expected_downtime_seconds") Long expectedDowntimeSeconds,
            String status,
            @JsonProperty("supersedes_version") String supersedesVersion,
            @JsonProperty("superseded_by_version") String supersededByVersion,
            @JsonProperty("revocation_reason") String revocationReason) {
    }

    public record AnnouncementEntry(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            Long sequence,
            @JsonProperty("announcement_id") String announcementId,
            @JsonProperty("publication_id") String publicationId,
            String kind,
            String severity,
            @JsonProperty("published_at") String publishedAt,
            @JsonProperty("expires_at") String expiresAt,
            @JsonProperty("title_key") String titleKey,
            @JsonProperty("body_key") String bodyKey,
            List<AnnouncementLocalization> localizations,
            List<AnnouncementLink> links,
            @JsonProperty("update_manifest") UpdateManifest updateManifest,
            @JsonProperty("content_hash") String contentHash,
            @JsonProperty("links_hash") String linksHash,
            @JsonProperty("update_manifest_hash") String updateManifestHash,
            @JsonProperty("previous_announcement_hash") String previousAnnouncementHash,
            @JsonProperty("announcement_hash") String announcementHash,
            @JsonProperty("accepted_at") String acceptedAt,
            @JsonProperty("registry_key_id") String registryKeyId,
            String signature) {
    }

    public record AnnouncementSnapshot(
            @JsonProperty("snapshot_id") String snapshotId,
            @JsonProperty("as_of") String asOf,
            @JsonProperty("through_sequence") Long throughSequence,
            @JsonProperty("announcement_head_hash") String announcementHeadHash,
            String kind,
            String severity,
            String channel,
            @JsonProperty("include_expired") Boolean includeExpired,
            @JsonProperty("created_at") String createdAt,
            @JsonProperty("snapshot_hash") String snapshotHash,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            String signature) {
    }

    public record AnnouncementPage(
            AnnouncementSnapshot snapshot,
            List<AnnouncementEntry> items,
            @JsonProperty("next_cursor") String nextCursor) {
    }

    public record SemanticVersion(
            BigInteger major,
            BigInteger minor,
            BigInteger patch,
            List<String> prerelease) {
        public SemanticVersion {
            prerelease = prerelease == null
                    ? List.of()
                    : List.copyOf(prerelease);
        }
    }
}
