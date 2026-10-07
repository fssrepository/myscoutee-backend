package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocolException;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionCommand;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimVerification;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimStatus;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.PackageVerification;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.AnnouncementOutcome;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.OperatorActionJournalEntry;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.OperatorClaimStatusEvidence;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeployment;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardSnapshot;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorActionReceipt;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorActionRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorActionResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorClaimStatusReceipt;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.OperatorClaimStatusResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RegistrationResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementEntry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementLink;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementLocalization;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.AnnouncementSnapshot;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.UpdateManifest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Explicit signed operator control-plane client.
 *
 * <p>This operation never creates a deployment identity and never enrolls a
 * deployment. Every call requires an already registered local state, uses that
 * deployment's Ed25519 key, verifies the pinned registry key, and persists
 * signed mutation receipts before returning.</p>
 */
public final class RegistryOperatorNetworkService {
    private static final int DEFAULT_CLIENT_TOKEN_TTL_SECONDS = 300;
    private static final int MAX_CURSOR_LENGTH = 4096;
    private static final Pattern NON_NEGATIVE_INTEGER = Pattern.compile("0|[1-9][0-9]*");
    private static final Pattern EMAIL_LOCAL =
            Pattern.compile("[a-z0-9!#$%&'*+/=?^_`{|}~.-]+");
    private static final Pattern EMAIL_DOMAIN_LABEL =
            Pattern.compile("[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?");
    private static final Pattern UPDATE_CHANNEL =
            Pattern.compile("^[a-z][a-z0-9._-]{0,31}$");
    private static final Set<String> LEADERBOARD_CURSOR_V2_FIELDS = Set.of(
            "version",
            "kind",
            "view",
            "snapshot_id",
            "from_period",
            "through_period",
            "through_ledger_index",
            "through_audit_index",
            "through_review_index",
            "through_eligibility_index",
            "ledger_head_hash",
            "audit_head_hash",
            "review_head_hash",
            "eligibility_head_hash",
            "created_at",
            "after_weight",
            "after_id");
    private static final Set<String> LEADERBOARD_CURSOR_V3_FIELDS = Set.of(
            "version",
            "kind",
            "view",
            "snapshot_id",
            "from_period",
            "through_period",
            "through_ledger_index",
            "through_audit_index",
            "through_review_index",
            "through_eligibility_index",
            "through_transfer_event_index",
            "ledger_head_hash",
            "audit_head_hash",
            "review_head_hash",
            "eligibility_head_hash",
            "transfer_event_head_hash",
            "created_at",
            "after_weight",
            "after_id");
    private static final Set<String> ACTIONS = Set.of(
            RegistryProtocol.OPERATOR_ACTION_CLAIM,
            RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
            RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN,
            RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN,
            RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
            RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK,
            RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
            RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT);

    private final RegistryConfiguration properties;
    private final RegistryLocalStore localStore;
    private final RegistryHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;

    public RegistryOperatorNetworkService(
            RegistryConfiguration properties,
            ObjectMapper objectMapper) {
        this(
                properties,
                new RegistryLocalStore(properties, objectMapper),
                new RegistryHttpClient(properties, objectMapper),
                objectMapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    RegistryOperatorNetworkService(
            RegistryConfiguration properties,
            RegistryLocalStore localStore,
            RegistryHttpClient httpClient,
            ObjectMapper objectMapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.properties = Objects.requireNonNull(properties, "Registry properties must not be null.");
        this.localStore = Objects.requireNonNull(localStore, "Registry local store must not be null.");
        this.httpClient = Objects.requireNonNull(httpClient, "Registry HTTP client must not be null.");
        this.objectMapper = Objects.requireNonNull(objectMapper, "Object mapper must not be null.");
        this.clock = Objects.requireNonNull(clock, "Clock must not be null.");
        this.secureRandom = Objects.requireNonNull(secureRandom, "Secure random must not be null.");
    }

    public void activateReconnectedDeployment() {
        TrustedDeployment trusted = trustedDeployment();
        if (!localStore.hasArchivedBinding(trusted.state())) {
            return;
        }
        for (OperatorActionJournalEntry entry : localStore.loadOperatorActionJournal()) {
            verifyJournalEntry(trusted, entry);
            if (Set.of(RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT,
                    RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT).contains(entry.action())) {
                return;
            }
        }
        // Registration preserves the deployment identity. Explicitly activate
        // this new connection without restoring its archived claim or link.
        apply(new ActionCommand(RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT,
                null, null, null, null, null, null, null));
    }

    public ActionOutcome apply(ActionCommand suppliedCommand) {
        ActionCommand command = normalizeAction(suppliedCommand);
        TrustedDeployment trusted = trustedDeployment();
        Instant now = clock.instant();
        String timestamp = now.toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        String clientTokenHash = RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN.equals(command.action())
                ? RegistryProtocol.sha256(command.clientToken().getBytes(StandardCharsets.UTF_8))
                : "";
        long ttl = command.tokenTtlSeconds() == null ? 0L : command.tokenTtlSeconds();
        ClaimVerification claimVerification = command.claimVerification();
        String payloadHash = RegistryProtocol.sha256(
                claimVerification == null
                        ? RegistryProtocol.operatorActionPayload(
                                command.action(),
                                command.operatorName(),
                                command.operatorAvatarUrl(),
                                clientTokenHash,
                                ttl,
                                command.tokenId(),
                                command.linkId())
                        : RegistryProtocol.operatorClaimPayload(
                                claimVerification.legalName(),
                                claimVerification.registrationNumber(),
                                claimVerification.jurisdiction(),
                                claimVerification.registeredAddress(),
                                claimVerification.website(),
                                claimVerification.verificationContactName(),
                                claimVerification.verificationContactRole(),
                                claimVerification.verificationContactEmail(),
                                claimVerification.authorityAttested(),
                                command.operatorAvatarUrl()));
        String idempotencyKey;
        if (StringUtils.hasText(command.idempotencyKey())) {
            idempotencyKey = RegistryProtocol.requireToken(
                    command.idempotencyKey(),
                    "idempotency_key");
        } else if (claimVerification != null) {
            idempotencyKey = deterministicClaimIdempotencyKey(trusted, payloadHash);
        } else if (Set.of(
                        RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
                        RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                        RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK,
                        RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN)
                .contains(command.action())) {
            idempotencyKey = deterministicReferenceActionIdempotencyKey(
                    trusted,
                    command,
                    clientTokenHash,
                    payloadHash);
        } else if (Set.of(
                        RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                        RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT)
                .contains(command.action())) {
            idempotencyKey = deterministicLifecycleActionIdempotencyKey(
                    trusted,
                    command.action(),
                    payloadHash);
        } else {
            idempotencyKey = RegistryProtocol.randomToken("operator_", secureRandom);
        }
        String signature = trusted.deploymentCrypto().signBase64(RegistryProtocol.signedRequest(
                "POST",
                RegistryProtocol.OPERATOR_ACTION_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                trusted.state().registryScope(),
                trusted.state().deploymentId(),
                timestamp,
                nonce,
                idempotencyKey,
                payloadHash));
        OperatorActionRequest request = new OperatorActionRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                trusted.state().registryScope(),
                trusted.state().deploymentId(),
                timestamp,
                nonce,
                idempotencyKey,
                command.action(),
                emptyToNull(command.operatorName()),
                emptyToNull(command.operatorAvatarUrl()),
                claimVerification == null ? null : claimVerification.legalName(),
                claimVerification == null ? null : claimVerification.registrationNumber(),
                claimVerification == null ? null : claimVerification.jurisdiction(),
                claimVerification == null ? null : claimVerification.registeredAddress(),
                claimVerification == null ? null : emptyToNull(claimVerification.website()),
                claimVerification == null ? null : claimVerification.verificationContactName(),
                claimVerification == null ? null : claimVerification.verificationContactRole(),
                claimVerification == null ? null : claimVerification.verificationContactEmail(),
                claimVerification == null ? null : claimVerification.authorityAttested(),
                emptyToNull(command.clientToken()),
                ttl == 0L ? null : ttl,
                emptyToNull(command.tokenId()),
                emptyToNull(command.linkId()),
                payloadHash,
                signature);

        OperatorActionResponse response = httpClient.applyOperatorAction(request);
        try {
            verifyActionResponse(trusted, request, clientTokenHash, response);
        } catch (IllegalArgumentException exception) {
            throw new RegistryProtocolException(
                    "Registry returned an invalid operator action receipt.",
                    exception);
        }
        OperatorActionReceipt durableReceipt = response.receipt().withoutPlaintextClientToken();
        Path receiptPath = localStore.saveOperatorActionReceipt(
                request,
                clientTokenHash,
                durableReceipt);
        String plaintextClientToken =
                RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN.equals(command.action())
                        ? safeText(response.receipt().clientToken())
                        : "";
        return new ActionOutcome(
                response,
                idempotencyKey,
                emptyToNull(plaintextClientToken),
                receiptPath);
    }

    private String deterministicClaimIdempotencyKey(
            TrustedDeployment trusted,
            String payloadHash) {
        String generationBoundary = trusted.state().registrationIdempotencyKey();
        String activeMatchingKey = "";
        for (OperatorActionJournalEntry entry : localStore.loadOperatorActionJournal()) {
            verifyJournalEntry(trusted, entry);
            if (isClaimVerificationBoundary(entry)) {
                generationBoundary = entry.receipt().auditHash();
                activeMatchingKey = isStructuredClaim(entry)
                                && RegistryProtocol.hashEquals(
                                        payloadHash,
                                        entry.payloadHash())
                        ? entry.idempotencyKey()
                        : "";
            } else if (RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM.equals(
                    entry.action())) {
                generationBoundary = entry.receipt().auditHash();
                activeMatchingKey = "";
            }
        }
        if (StringUtils.hasText(activeMatchingKey)) {
            return RegistryProtocol.requireToken(activeMatchingKey, "idempotency_key");
        }
        String digest = RegistryProtocol.sha256(RegistryProtocol.canonical(
                "myscoutee-registry-operator-claim-idempotency-v1",
                trusted.state().registryScope(),
                trusted.state().deploymentId(),
                payloadHash,
                generationBoundary));
        return "claim_" + digest.substring("sha256:".length());
    }

    private String deterministicReferenceActionIdempotencyKey(
            TrustedDeployment trusted,
            ActionCommand command,
            String clientTokenHash,
            String payloadHash) {
        String reference = switch (command.action()) {
            case RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM ->
                    latestClaimGenerationReference(trusted);
            case RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN ->
                    RegistryProtocol.requireHash(clientTokenHash, "client_token_hash");
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK ->
                    RegistryProtocol.requireOperatorLinkId(command.linkId());
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN ->
                    RegistryProtocol.requireOperatorTokenId(command.tokenId());
            default -> throw new IllegalArgumentException(
                    "Operator action does not support deterministic reference idempotency.");
        };
        String activeWithdrawalKey = "";
        for (OperatorActionJournalEntry entry : localStore.loadOperatorActionJournal()) {
            verifyJournalEntry(trusted, entry);
            if (RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM.equals(command.action())) {
                if (isClaimVerificationBoundary(entry)) {
                    activeWithdrawalKey = "";
                } else if (RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM.equals(entry.action())
                        && RegistryProtocol.hashEquals(payloadHash, entry.payloadHash())) {
                    activeWithdrawalKey = entry.idempotencyKey();
                }
                continue;
            }
            if (command.action().equals(entry.action())
                    && RegistryProtocol.hashEquals(payloadHash, entry.payloadHash())) {
                return RegistryProtocol.requireToken(
                        entry.idempotencyKey(),
                        "idempotency_key");
            }
        }
        if (StringUtils.hasText(activeWithdrawalKey)) {
            return RegistryProtocol.requireToken(
                    activeWithdrawalKey,
                    "idempotency_key");
        }
        String digest = RegistryProtocol.sha256(RegistryProtocol.canonical(
                "myscoutee-registry-operator-reference-idempotency-v1",
                trusted.state().registryScope(),
                trusted.state().deploymentId(),
                command.action(),
                reference,
                payloadHash));
        String prefix = switch (command.action()) {
            case RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM -> "withdraw_";
            case RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN -> "redeem_";
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK -> "revoke_link_";
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN -> "revoke_token_";
            default -> "operator_";
        };
        return prefix + digest.substring("sha256:".length());
    }

    private String deterministicLifecycleActionIdempotencyKey(
            TrustedDeployment trusted,
            String action,
            String payloadHash) {
        String generationBoundary = trusted.state().registrationIdempotencyKey();
        String activeMatchingKey = "";
        for (OperatorActionJournalEntry entry :
                localStore.loadOperatorActionJournal()) {
            verifyJournalEntry(trusted, entry);
            if (!Set.of(
                            RegistryProtocol
                                    .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                            RegistryProtocol
                                    .OPERATOR_ACTION_REACTIVATE_DEPLOYMENT)
                    .contains(entry.action())) {
                continue;
            }
            generationBoundary = entry.receipt().auditHash();
            activeMatchingKey = action.equals(entry.action())
                            && RegistryProtocol.hashEquals(
                                    payloadHash,
                                    entry.payloadHash())
                    ? entry.idempotencyKey()
                    : "";
        }
        if (StringUtils.hasText(activeMatchingKey)) {
            return RegistryProtocol.requireToken(
                    activeMatchingKey,
                    "idempotency_key");
        }
        String digest = RegistryProtocol.sha256(RegistryProtocol.canonical(
                "myscoutee-registry-operator-lifecycle-idempotency-v1",
                trusted.state().registryScope(),
                trusted.state().deploymentId(),
                action,
                generationBoundary,
                payloadHash));
        String prefix = RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT
                        .equals(action)
                ? "deactivate_"
                : "reactivate_";
        return prefix + digest.substring("sha256:".length());
    }

    private String latestClaimGenerationReference(TrustedDeployment trusted) {
        OperatorActionJournalEntry latestClaim = null;
        for (OperatorActionJournalEntry entry : localStore.loadOperatorActionJournal()) {
            verifyJournalEntry(trusted, entry);
            if (isClaimVerificationBoundary(entry)) {
                latestClaim = entry;
            }
        }
        if (latestClaim == null) {
            return RegistryProtocol.ZERO_HASH;
        }
        return RegistryProtocol.sha256(RegistryProtocol.canonical(
                latestClaim.receipt().actionId(),
                Long.toString(latestClaim.receipt().auditIndex()),
                latestClaim.receipt().auditHash()));
    }

    public LeaderboardPage leaderboard(
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        TrustedDeployment trusted = trustedDeployment();
        String normalizedView = safeText(view);
        if (!Set.of("founder", "claimed", "unclaimed").contains(normalizedView)) {
            throw new IllegalArgumentException("Leaderboard view must be founder, claimed, or unclaimed.");
        }
        validateLeaderboardQuery(throughPeriod, limit);
        CursorClaims suppliedCursor = verifyCursor(
                trusted,
                cursor,
                "rows",
                normalizedView,
                "",
                null);
        LeaderboardPage response = httpClient.leaderboard(
                normalizedView,
                emptyToNull(safeText(throughPeriod)),
                limit,
                emptyToNull(safeText(cursor)));
        try {
            verifyLeaderboardPage(trusted, normalizedView, suppliedCursor, response);
        } catch (IllegalArgumentException exception) {
            throw new RegistryProtocolException(
                    "Registry returned an invalid leaderboard page.",
                    exception);
        }
        return response;
    }

    public LeaderboardDeploymentPage leaderboardDeployments(
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        TrustedDeployment trusted = trustedDeployment();
        String normalizedGroupId = RegistryProtocol.requireOperatorGroupId(safeText(groupId));
        validateLeaderboardQuery(throughPeriod, limit);
        CursorClaims suppliedCursor = verifyCursor(
                trusted,
                cursor,
                "deployments",
                "claimed",
                normalizedGroupId,
                null);
        LeaderboardDeploymentPage response = httpClient.leaderboardDeployments(
                normalizedGroupId,
                emptyToNull(safeText(throughPeriod)),
                limit,
                emptyToNull(safeText(cursor)));
        try {
            verifyLeaderboardDeploymentPage(
                    trusted,
                    normalizedGroupId,
                    suppliedCursor,
                    response);
        } catch (IllegalArgumentException exception) {
            throw new RegistryProtocolException(
                    "Registry returned an invalid leaderboard deployment page.",
                    exception);
        }
        return response;
    }

    public ClaimStatus claimStatus() {
        TrustedDeployment trusted = trustedDeployment();
        boolean claimed = false;
        String claimedAt = "";
        String operatorName = "";
        String operatorAvatarUrl = "";
        String ownClaimGroupId = "";
        String currentGroupId = "";
        String activeLinkId = "";
        OperatorActionJournalEntry claimVerificationBoundary = null;
        boolean claimVerificationLocallyWithdrawn = false;
        List<OperatorActionJournalEntry> journal =
                localStore.loadOperatorActionJournal();
        for (OperatorActionJournalEntry entry : journal) {
            verifyJournalEntry(trusted, entry);
            OperatorActionReceipt receipt = entry.receipt();
            switch (entry.action()) {
                case RegistryProtocol.OPERATOR_ACTION_CLAIM -> {
                    claimed = true;
                    claimedAt = receipt.acceptedAt();
                    if (isStructuredClaim(entry)) {
                        claimVerificationBoundary = entry;
                        claimVerificationLocallyWithdrawn = false;
                        operatorName = safeText(entry.legalName());
                    } else {
                        claimVerificationBoundary = null;
                        claimVerificationLocallyWithdrawn = false;
                        operatorName = safeText(entry.operatorName());
                    }
                    operatorAvatarUrl = safeText(entry.operatorAvatarUrl());
                    ownClaimGroupId = safeText(receipt.groupId());
                    currentGroupId = ownClaimGroupId;
                    activeLinkId = "";
                }
                case RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM -> {
                    claimed = false;
                    claimedAt = "";
                    currentGroupId = safeText(receipt.groupId());
                    activeLinkId = "";
                    if (claimVerificationBoundary != null) {
                        claimVerificationLocallyWithdrawn = true;
                    }
                }
                case RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN -> {
                    claimed = true;
                    currentGroupId = safeText(receipt.groupId());
                    activeLinkId = safeText(receipt.linkId());
                    if (isTokenDerivedClaim(entry)) {
                        claimedAt = receipt.acceptedAt();
                        claimVerificationBoundary = entry;
                        claimVerificationLocallyWithdrawn = false;
                        ownClaimGroupId = currentGroupId;
                    }
                }
                case RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK -> {
                    if (trusted.state().deploymentId().equals(receipt.subjectDeploymentId())) {
                        currentGroupId = ownClaimGroupId;
                        activeLinkId = "";
                    }
                }
                case RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT -> {
                    claimed = false;
                    claimedAt = "";
                    currentGroupId = "";
                    activeLinkId = "";
                    if (claimVerificationBoundary != null) {
                        claimVerificationLocallyWithdrawn = true;
                    }
                }
                default -> {
                    // Token issuance/revocation and reactivation do not restore
                    // or otherwise change claim ownership.
                }
            }
        }
        String verificationStatus = claimed ? "VERIFIED" : "NOT_SUBMITTED";
        String verificationSubmittedAt = "";
        String legalName = "";
        String eligibilityStatus = null;
        String verificationCapability = "AVAILABLE";
        String verificationUnavailableReason = null;
        if (claimVerificationBoundary != null) {
            verificationStatus = claimVerificationLocallyWithdrawn
                    ? RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                    : RegistryProtocol.OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW;
            verificationSubmittedAt =
                    claimVerificationBoundary.receipt().acceptedAt();
            if (isStructuredClaim(claimVerificationBoundary)) {
                legalName = safeText(claimVerificationBoundary.legalName());
                operatorName = legalName;
            }
            OperatorClaimStatusReceipt previousStatus =
                    loadVerifiedClaimStatusEvidence(trusted, journal);
            if (previousStatus != null) {
                if (!claimVerificationLocallyWithdrawn
                        || RegistryProtocol
                                .OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                                .equals(previousStatus
                                        .verificationStatus())) {
                    verificationStatus =
                            previousStatus.verificationStatus();
                }
                verificationSubmittedAt = previousStatus.submittedAt();
                legalName = previousStatus.legalName();
                operatorName = legalName;
                eligibilityStatus = previousStatus.eligibilityStatus();
                if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                        .equals(verificationStatus)) {
                    claimed = false;
                    claimedAt = "";
                    currentGroupId = "";
                    activeLinkId = "";
                    eligibilityStatus =
                            RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE;
                }
            }
            try {
                OperatorClaimStatusResponse response =
                        httpClient.operatorClaimStatus(trusted.state().deploymentId());
                OperatorClaimStatusReceipt registryStatus;
                try {
                    registryStatus = verifyClaimStatus(
                            trusted,
                            claimVerificationBoundary,
                            response);
                    requireMonotonicClaimStatus(
                            previousStatus,
                            registryStatus);
                    if (claimVerificationLocallyWithdrawn
                            && !RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                                    .equals(registryStatus.verificationStatus())) {
                        throw new IllegalArgumentException(
                                "Registry claim status predates the durable local withdrawal.");
                    }
                } catch (IllegalArgumentException exception) {
                    throw new RegistryProtocolException(
                            "Registry returned an invalid or stale operator claim status.",
                            exception);
                }
                localStore.saveOperatorClaimStatusReceipt(registryStatus);
                verificationStatus = registryStatus.verificationStatus();
                verificationSubmittedAt = registryStatus.submittedAt();
                legalName = registryStatus.legalName();
                operatorName = legalName;
                eligibilityStatus = registryStatus.eligibilityStatus();
                if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                        .equals(verificationStatus)) {
                    // A signed withdrawn state is also the recovery signal when
                    // the central withdrawal committed but its action response
                    // was lost before the local journal could be updated.
                    claimed = false;
                    claimedAt = "";
                    currentGroupId = "";
                    activeLinkId = "";
                    eligibilityStatus =
                            RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE;
                }
            } catch (com.raxim.myscoutee.domain.registry.api.RegistryHttpException exception) {
                if (!isUnsupportedClaimStatusEndpoint(exception)) {
                    throw exception;
                }
                verificationCapability = "BACKEND_UNAVAILABLE";
                verificationUnavailableReason =
                        "operator.claim.verification.backend.unavailable";
            }
        } else {
            try {
                OperatorClaimStatusResponse unexpected =
                        httpClient.operatorClaimStatus(trusted.state().deploymentId());
                if (unexpected != null && unexpected.status() != null) {
                    // Reconnection retains the deployment key, while the old
                    // claim journal is archived. A signed withdrawn claim is
                    // historical evidence, not a claim on this new connection.
                    verifyClaimStatus(trusted, null, unexpected);
                } else {
                    throw new RegistryProtocolException(
                            "Registry returned an incomplete operator claim capability response.");
                }
            } catch (com.raxim.myscoutee.domain.registry.api.RegistryHttpException exception) {
                if (isUnsupportedClaimStatusEndpoint(exception)) {
                    verificationCapability = "BACKEND_UNAVAILABLE";
                    verificationUnavailableReason =
                            "operator.claim.verification.backend.unavailable";
                } else if (!isMissingStructuredClaim(exception)) {
                    throw exception;
                }
            }
        }
        String shareNumerator = "0";
        String shareDenominator = "1";
        if (claimed && StringUtils.hasText(currentGroupId)) {
            try {
                String cursor = "";
                int pageCount = 0;
                boolean found = false;
                do {
                    if (++pageCount > 1_000) {
                        break;
                    }
                    LeaderboardPage page = leaderboard("claimed", null, 100, cursor);
                    for (LeaderboardRow row : page.items()) {
                        if (currentGroupId.equals(row.groupId())) {
                            shareNumerator = row.shareNumerator();
                            shareDenominator = row.shareDenominator();
                            found = true;
                            break;
                        }
                    }
                    cursor = safeText(page.nextCursor());
                } while (!found && !cursor.isEmpty());
            } catch (com.raxim.myscoutee.domain.registry.api.RegistryHttpException
                    | RegistryProtocolException exception) {
                // Share is optional enrichment. The independently verified
                // claim status remains usable when leaderboard reads fail.
                shareNumerator = "0";
                shareDenominator = "1";
            }
        }
        return new ClaimStatus(
                claimed,
                emptyToNull(claimedAt),
                emptyToNull(operatorName),
                emptyToNull(operatorAvatarUrl),
                emptyToNull(currentGroupId),
                emptyToNull(activeLinkId),
                shareNumerator,
                shareDenominator,
                verificationCapability,
                verificationUnavailableReason,
                verificationStatus,
                emptyToNull(verificationSubmittedAt),
                emptyToNull(legalName),
                emptyToNull(eligibilityStatus));
    }

    public AnnouncementOutcome announcements(
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            Integer limit,
            String cursor) {
        TrustedDeployment trusted = trustedDeployment();
        String normalizedKind = safeText(kind);
        String normalizedSeverity = safeText(severity);
        String normalizedChannel = safeText(channel);
        validateAnnouncementQuery(
                normalizedKind,
                normalizedSeverity,
                normalizedChannel,
                limit);
        AnnouncementCursorClaims suppliedCursor = verifyAnnouncementCursor(
                trusted,
                cursor,
                normalizedKind,
                normalizedSeverity,
                normalizedChannel,
                includeExpired,
                null);
        AnnouncementPage page = httpClient.announcements(
                emptyToNull(normalizedKind),
                emptyToNull(normalizedSeverity),
                emptyToNull(normalizedChannel),
                includeExpired,
                limit,
                emptyToNull(safeText(cursor)));
        List<PackageVerification> packageVerifications;
        try {
            packageVerifications = verifyAnnouncementPage(
                    trusted,
                    normalizedKind,
                    normalizedSeverity,
                    normalizedChannel,
                    includeExpired,
                    suppliedCursor,
                    page);
        } catch (IllegalArgumentException exception) {
            throw new RegistryProtocolException(
                    "Registry returned an invalid announcement page.",
                    exception);
        }
        return new AnnouncementOutcome(page, packageVerifications);
    }

    private TrustedDeployment trustedDeployment() {
        try {
            return trustedDeploymentContents();
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Registered local registry trust state is invalid.",
                    exception);
        }
    }

    private TrustedDeployment trustedDeploymentContents() {
        if (!properties.isEnabled() || !properties.isOutboundAllowed()) {
            throw new IllegalStateException("Outbound registry communication is disabled.");
        }
        httpClient.endpoint(RegistryProtocol.OPERATOR_ACTION_PATH);
        LocalState state = localStore.load().orElseThrow(() ->
                new IllegalStateException(
                        "This deployment is not registered; register it explicitly before using operator actions."));
        if (state.registration() == null || state.registration().receipt() == null
                || !StringUtils.hasText(state.deploymentId())) {
            throw new IllegalStateException(
                    "This deployment is not registered; register it explicitly before using operator actions.");
        }
        String configuredScope = RegistryProtocol.requireRegistryScope(properties.getRegistryScope());
        if (!configuredScope.equals(state.registryScope())) {
            throw new IllegalStateException(
                    "Configured registry scope differs from the registered local deployment state.");
        }
        RegistryCrypto deploymentCrypto = RegistryCrypto.load(properties);
        if (!deploymentCrypto.deploymentPublicKeyFingerprint().equals(state.publicKeyFingerprint())) {
            throw new IllegalStateException(
                    "Deployment signing key differs from the registered local deployment state.");
        }

        RegistrationResponse registration = state.registration().receipt();
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(registration.protocolVersion())
                || !state.registryScope().equals(registration.registryScope())
                || !state.deploymentId().equals(registration.deploymentId())
                || !state.publicKeyFingerprint().equals(registration.publicKeyFingerprint())) {
            throw new IllegalStateException("Persisted registry registration receipt is inconsistent.");
        }
        RegistryProtocol.requireUtcTimestamp(registration.registeredAt(), "registered_at");
        if (registration.duplicate() == null) {
            throw new IllegalStateException("Persisted registry registration receipt is incomplete.");
        }
        PublicKey registryPublicKey = com.raxim.myscoutee.domain.registry.api.RegistrySignatures.parseRegistryPublicKey(
                registration.registryPublicKey());
        String registryFingerprint =
                RegistryProtocol.publicKeyFingerprint(registryPublicKey.getEncoded());
        String registryKeyId = RegistryProtocol.registryKeyId(registryFingerprint);
        if (!registryKeyId.equals(registration.registryKeyId())) {
            throw new IllegalStateException("Persisted registry key ID is inconsistent.");
        }
        String storedFingerprint = RegistryProtocol.requireHash(
                state.trustedRegistryKeyFingerprint(),
                "trusted registry public-key fingerprint");
        String configuredFingerprint = RegistryProtocol.requireHash(
                properties.getExpectedRegistryKeyFingerprint(),
                "configured registry public-key fingerprint");
        if (!registryFingerprint.equals(storedFingerprint)
                || !registryFingerprint.equals(configuredFingerprint)) {
            throw new IllegalStateException(
                    "Registry key differs from the explicitly pinned registration key.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                registryPublicKey,
                RegistryProtocol.registrationReceipt(registration),
                registration.receiptSignature())) {
            throw new IllegalStateException("Persisted registry registration signature is invalid.");
        }
        return new TrustedDeployment(state, deploymentCrypto, registryPublicKey, registryKeyId);
    }

    private ActionCommand normalizeAction(ActionCommand supplied) {
        Objects.requireNonNull(supplied, "Operator action must not be null.");
        String action = safeText(supplied.action());
        if (!ACTIONS.contains(action)) {
            throw new IllegalArgumentException("Operator action is not supported.");
        }
        String operatorName = safeText(supplied.operatorName());
        String avatarUrl = safeText(supplied.operatorAvatarUrl());
        String clientToken = safeText(supplied.clientToken());
        String tokenId = safeText(supplied.tokenId());
        String linkId = safeText(supplied.linkId());
        Long ttl = supplied.tokenTtlSeconds();
        ClaimVerification verification = supplied.claimVerification();

        switch (action) {
            case RegistryProtocol.OPERATOR_ACTION_CLAIM -> {
                if (verification == null) {
                    throw new IllegalArgumentException(
                            "Structured company verification fields are required.");
                }
                requireAbsent(operatorName);
                verification = normalizeClaimVerification(verification);
                if (!avatarUrl.isEmpty()) {
                    requireHttpsUrl(avatarUrl, "operator_avatar_url");
                }
                requireAbsent(clientToken, ttl, tokenId, linkId);
            }
            case RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN -> {
                requireAbsentClaimVerification(verification);
                requireAbsent(operatorName, avatarUrl, clientToken, tokenId, linkId);
                long normalizedTtl = ttl == null || ttl.longValue() == 0L
                        ? DEFAULT_CLIENT_TOKEN_TTL_SECONDS
                        : ttl.longValue();
                if (normalizedTtl < 60L || normalizedTtl > 3600L) {
                    throw new IllegalArgumentException(
                            "token_ttl_seconds must be between 60 and 3600.");
                }
                ttl = normalizedTtl;
            }
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN -> {
                requireAbsentClaimVerification(verification);
                requireAbsent(operatorName, avatarUrl, clientToken, ttl, linkId);
                RegistryProtocol.requireOperatorTokenId(tokenId);
            }
            case RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN -> {
                requireAbsentClaimVerification(verification);
                requireAbsent(operatorName, avatarUrl, ttl, tokenId, linkId);
                RegistryProtocol.requireToken(clientToken, "client_token");
            }
            case RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK -> {
                requireAbsentClaimVerification(verification);
                requireAbsent(operatorName, avatarUrl, clientToken, ttl, tokenId);
                RegistryProtocol.requireOperatorLinkId(linkId);
            }
            case RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
                    RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                    RegistryProtocol.OPERATOR_ACTION_REACTIVATE_DEPLOYMENT -> {
                requireAbsentClaimVerification(verification);
                    requireAbsent(operatorName, avatarUrl, clientToken, ttl, tokenId, linkId);
            }
            default -> throw new IllegalArgumentException("Operator action is not supported.");
        }
        return new ActionCommand(
                action,
                operatorName,
                avatarUrl,
                clientToken,
                ttl,
                tokenId,
                linkId,
                safeText(supplied.idempotencyKey()),
                verification);
    }

    private void verifyJournalEntry(
            TrustedDeployment trusted,
            OperatorActionJournalEntry entry) {
        try {
            verifyJournalEntryContents(trusted, entry);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Registry operator receipt journal validation failed.",
                    exception);
        }
    }

    private void verifyJournalEntryContents(
            TrustedDeployment trusted,
            OperatorActionJournalEntry entry) {
        if (entry == null || entry.schemaVersion() == null
                || entry.schemaVersion() != 1 || entry.receipt() == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(entry.protocolVersion())
                || !trusted.state().registryScope().equals(entry.registryScope())
                || !trusted.state().deploymentId().equals(entry.deploymentId())
                || !Objects.equals(entry.action(), entry.receipt().action())) {
            throw new IllegalStateException("Registry operator receipt journal is inconsistent.");
        }
        RegistryProtocol.requireUtcTimestamp(entry.requestTimestamp(), "request_timestamp");
        RegistryProtocol.requireToken(entry.nonce(), "nonce");
        RegistryProtocol.requireToken(entry.idempotencyKey(), "idempotency_key");
        long ttl = entry.tokenTtlSeconds() == null ? 0L : entry.tokenTtlSeconds();
        String clientTokenHash = safeText(entry.clientTokenHash());
        if (!clientTokenHash.isEmpty()) {
            RegistryProtocol.requireHash(clientTokenHash, "client_token_hash");
        }
        String expectedPayloadHash = RegistryProtocol.sha256(
                isStructuredClaim(entry)
                        ? RegistryProtocol.operatorClaimPayload(
                                safeText(entry.legalName()),
                                safeText(entry.registrationNumber()),
                                safeText(entry.jurisdiction()),
                                safeText(entry.registeredAddress()),
                                safeText(entry.website()),
                                safeText(entry.verificationContactName()),
                                safeText(entry.verificationContactRole()),
                                safeText(entry.verificationContactEmail()),
                                Boolean.TRUE.equals(entry.authorityAttested()),
                                safeText(entry.operatorAvatarUrl()))
                        : RegistryProtocol.operatorActionPayload(
                                entry.action(),
                                safeText(entry.operatorName()),
                                safeText(entry.operatorAvatarUrl()),
                                clientTokenHash,
                                ttl,
                                safeText(entry.tokenId()),
                                safeText(entry.linkId())));
        if (!RegistryProtocol.hashEquals(expectedPayloadHash, entry.payloadHash())) {
            throw new IllegalStateException(
                    "Registry operator journal payload hash is invalid.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.deploymentCrypto().deploymentPublicKey(),
                RegistryProtocol.signedRequest(
                        "POST",
                        RegistryProtocol.OPERATOR_ACTION_PATH,
                        entry.protocolVersion(),
                        entry.registryScope(),
                        entry.deploymentId(),
                        entry.requestTimestamp(),
                        entry.nonce(),
                        entry.idempotencyKey(),
                        entry.payloadHash()),
                entry.requestSignature())) {
            throw new IllegalStateException(
                    "Registry operator journal request signature is invalid.");
        }
        OperatorActionRequest request = new OperatorActionRequest(
                entry.protocolVersion(),
                entry.registryScope(),
                entry.deploymentId(),
                entry.requestTimestamp(),
                entry.nonce(),
                entry.idempotencyKey(),
                entry.action(),
                entry.operatorName(),
                entry.operatorAvatarUrl(),
                entry.legalName(),
                entry.registrationNumber(),
                entry.jurisdiction(),
                entry.registeredAddress(),
                entry.website(),
                entry.verificationContactName(),
                entry.verificationContactRole(),
                entry.verificationContactEmail(),
                entry.authorityAttested(),
                null,
                entry.tokenTtlSeconds(),
                entry.tokenId(),
                entry.linkId(),
                entry.payloadHash(),
                entry.requestSignature());
        try {
            verifyActionResponse(
                    trusted,
                    request,
                    clientTokenHash,
                    new OperatorActionResponse(
                            entry.protocolVersion(),
                            entry.registryScope(),
                            true,
                            entry.receipt()));
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Registry operator journal receipt verification failed.",
                    exception);
        }
    }

    private void verifyActionResponse(
            TrustedDeployment trusted,
            OperatorActionRequest request,
            String expectedClientTokenHash,
            OperatorActionResponse response) {
        if (response == null || response.receipt() == null || response.duplicate() == null) {
            throw new IllegalArgumentException("Registry operator action receipt is missing.");
        }
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(response.protocolVersion())
                || !trusted.state().registryScope().equals(response.registryScope())) {
            throw new IllegalArgumentException("Registry operator response has a mismatched protocol or scope.");
        }
        OperatorActionReceipt receipt = response.receipt();
        if (receipt.auditIndex() == null || receipt.auditIndex() <= 0L) {
            throw new IllegalArgumentException("Registry operator audit index must be positive.");
        }
        RegistryProtocol.requireHash(receipt.auditHash(), "audit_hash");
        RegistryProtocol.requireHash(receipt.previousAuditHash(), "previous_audit_hash");
        RegistryProtocol.requireOperatorActionId(receipt.actionId());
        RegistryProtocol.requireDeploymentId(receipt.deploymentId());
        RegistryProtocol.requireDeploymentId(receipt.subjectDeploymentId());
        if (StringUtils.hasText(receipt.relatedDeploymentId())) {
            RegistryProtocol.requireDeploymentId(receipt.relatedDeploymentId());
        }
        RegistryProtocol.requireUtcTimestamp(receipt.acceptedAt(), "accepted_at");
        if (!trusted.state().deploymentId().equals(receipt.deploymentId())
                || !request.action().equals(receipt.action())
                || !trusted.state().registryScope().equals(receipt.registryScope())
                || !trusted.registryKeyId().equals(receipt.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry operator receipt does not match the signed request or pinned registry.");
        }
        validateOptionalOperatorIds(receipt);
        if (RegistryProtocol.OPERATOR_ACTION_CLAIM.equals(request.action())
                && StringUtils.hasText(request.legalName())
                && (!RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW.equals(receipt.claimState())
                        || !StringUtils.hasText(receipt.groupId()))) {
            throw new IllegalArgumentException(
                    "Structured operator claim receipt is not pending review or has no group.");
        }
        if (RegistryProtocol.OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT.equals(
                        request.action())
                && (StringUtils.hasText(receipt.groupId())
                        != RegistryProtocol.OPERATOR_CLAIM_STATE_WITHDRAWN
                                .equals(receipt.claimState()))) {
            throw new IllegalArgumentException(
                    "Deployment deactivation receipt has an inconsistent claim withdrawal boundary.");
        }
        if (StringUtils.hasText(receipt.tokenExpiresAt())) {
            RegistryProtocol.requireUtcTimestamp(receipt.tokenExpiresAt(), "token_expires_at");
        }
        if (StringUtils.hasText(receipt.clientTokenHash())) {
            RegistryProtocol.requireHash(receipt.clientTokenHash(), "client_token_hash");
        }
        String expectedAuditHash = RegistryProtocol.sha256(
                RegistryProtocol.operatorAudit(receipt, request.payloadHash()));
        if (!RegistryProtocol.hashEquals(expectedAuditHash, receipt.auditHash())) {
            throw new IllegalArgumentException("Registry operator audit hash is invalid.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.registryPublicKey(),
                RegistryProtocol.operatorActionReceipt(receipt),
                receipt.signature())) {
            throw new IllegalArgumentException("Registry operator receipt signature is invalid.");
        }

        String plaintextToken = safeText(receipt.clientToken());
        if (!RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN.equals(request.action())
                && !plaintextToken.isEmpty()) {
            throw new IllegalArgumentException(
                    "Registry returned a plaintext client token for an incompatible action.");
        }
        if (RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN.equals(request.action())) {
            RegistryProtocol.requireOperatorTokenId(receipt.tokenId());
            RegistryProtocol.requireHash(receipt.clientTokenHash(), "client_token_hash");
            RegistryProtocol.requireUtcTimestamp(receipt.tokenExpiresAt(), "token_expires_at");
            if (!response.duplicate()) {
                RegistryProtocol.requireToken(plaintextToken, "client_token");
                String actualHash = RegistryProtocol.sha256(
                        plaintextToken.getBytes(StandardCharsets.UTF_8));
                if (!RegistryProtocol.hashEquals(actualHash, receipt.clientTokenHash())) {
                    throw new IllegalArgumentException(
                            "Registry plaintext client token does not match its signed hash.");
                }
            } else if (!plaintextToken.isEmpty()) {
                throw new IllegalArgumentException(
                        "Registry repeated a plaintext client token for a duplicate request.");
            }
        }
        if (RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN.equals(request.action())
                && !RegistryProtocol.hashEquals(expectedClientTokenHash, receipt.clientTokenHash())) {
            throw new IllegalArgumentException(
                    "Registry redemption receipt does not match the submitted client token.");
        }
        if (RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN.equals(request.action())
                && RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW.equals(
                        receipt.claimState())
                && !StringUtils.hasText(receipt.linkId())
                && (!trusted.state().deploymentId().equals(
                                receipt.subjectDeploymentId())
                        || !StringUtils.hasText(receipt.groupId())
                        || !StringUtils.hasText(receipt.relatedDeploymentId())
                        || !StringUtils.hasText(receipt.tokenId()))) {
            throw new IllegalArgumentException(
                    "Token-derived claim receipt has an invalid pending-review boundary.");
        }
    }

    private OperatorClaimStatusReceipt verifyClaimStatus(
            TrustedDeployment trusted,
            OperatorActionJournalEntry claim,
            OperatorClaimStatusResponse response) {
        if (response == null || response.status() == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(response.protocolVersion())
                || !trusted.state().registryScope().equals(response.registryScope())) {
            throw new IllegalArgumentException(
                    "Registry operator claim status response is incomplete or has a mismatched scope.");
        }
        return verifyClaimStatusReceipt(trusted, claim, response.status());
    }

    private OperatorClaimStatusReceipt verifyClaimStatusReceipt(
            TrustedDeployment trusted,
            OperatorActionJournalEntry claim,
            OperatorClaimStatusReceipt status) {
        return verifyClaimStatusReceipt(trusted, claim, status, false);
    }

    private OperatorClaimStatusReceipt verifyLegacyClaimStatusReceipt(
            TrustedDeployment trusted,
            OperatorActionJournalEntry claim,
            OperatorClaimStatusReceipt status) {
        return verifyClaimStatusReceipt(trusted, claim, status, true);
    }

    private OperatorClaimStatusReceipt verifyClaimStatusReceipt(
            TrustedDeployment trusted,
            OperatorActionJournalEntry claim,
            OperatorClaimStatusReceipt status,
            boolean legacyEvidence) {
        if (status == null) {
            throw new IllegalArgumentException(
                    "Registry operator claim status receipt is missing.");
        }
        RegistryProtocol.requireDeploymentId(status.deploymentId());
        RegistryProtocol.requireOperatorActionId(status.claimActionId());
        if (status.claimAuditIndex() == null || status.claimAuditIndex() <= 0L) {
            throw new IllegalArgumentException("claim_audit_index must be positive.");
        }
        RegistryProtocol.requireHash(status.claimAuditHash(), "claim_audit_hash");
        RegistryProtocol.requireOperatorGroupId(status.groupId());
        requireText(status.legalName(), "legal_name", 160);
        RegistryProtocol.requireUtcTimestamp(status.submittedAt(), "submitted_at");
        RegistryProtocol.requireHash(status.reviewHash(), "review_hash");
        if (status.verificationStatus() == null
                || !Set.of(
                        RegistryProtocol.OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW,
                        RegistryProtocol.OPERATOR_VERIFICATION_STATUS_APPROVED,
                        RegistryProtocol.OPERATOR_VERIFICATION_STATUS_REJECTED,
                        RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN)
                .contains(status.verificationStatus())) {
            throw new IllegalArgumentException(
                    "Registry operator claim verification status is unsupported.");
        }
        boolean hasReview = StringUtils.hasText(status.reviewId());
        if (hasReview) {
            RegistryProtocol.requireOperatorReviewId(status.reviewId());
            if (status.reviewIndex() == null || status.reviewIndex() <= 0L
                    || RegistryProtocol.ZERO_HASH.equals(status.reviewHash())) {
                throw new IllegalArgumentException(
                        "Registry operator claim review boundary is incomplete.");
            }
            if (StringUtils.hasText(status.approvedAt())) {
                RegistryProtocol.requireUtcTimestamp(
                        status.approvedAt(),
                        "approved_at");
            }
        } else if ((status.reviewIndex() != null && status.reviewIndex() != 0L)
                || !RegistryProtocol.ZERO_HASH.equals(status.reviewHash())
                || StringUtils.hasText(status.approvedAt())) {
            throw new IllegalArgumentException(
                    "Registry operator claim review boundary is inconsistent.");
        }
        if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_APPROVED
                        .equals(status.verificationStatus())
                && (!hasReview || !StringUtils.hasText(status.approvedAt()))) {
            throw new IllegalArgumentException(
                    "Approved operator claim status has no signed review boundary.");
        }
        if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_REJECTED
                        .equals(status.verificationStatus())
                && (!hasReview || StringUtils.hasText(status.approvedAt()))) {
            throw new IllegalArgumentException(
                    "Rejected operator claim status has an invalid signed review boundary.");
        }
        if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW
                        .equals(status.verificationStatus())
                && hasReview) {
            throw new IllegalArgumentException(
                    "Pending operator claim status unexpectedly has a review boundary.");
        }
        if (!trusted.state().deploymentId().equals(status.deploymentId())
                || !trusted.state().registryScope().equals(status.registryScope())
                || !trusted.registryKeyId().equals(status.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry operator claim status does not match the registered deployment.");
        }
        if (claim == null) {
            if (legacyEvidence
                    || !RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                            .equals(status.verificationStatus())
                    || !RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE
                            .equals(status.eligibilityStatus())) {
                throw new IllegalArgumentException(
                        "Registry reports a current claim without a durable local claim receipt.");
            }
        } else {
            if (!isClaimVerificationBoundary(claim)) {
                throw new IllegalArgumentException(
                        "Registry operator claim status has no matching durable claim boundary.");
            }
            OperatorActionReceipt claimReceipt = claim.receipt();
            boolean structuredClaim = isStructuredClaim(claim);
            if (!claimReceipt.actionId().equals(status.claimActionId())
                || !claimReceipt.auditIndex().equals(status.claimAuditIndex())
                || !claimReceipt.auditHash().equals(status.claimAuditHash())
                || !claimReceipt.groupId().equals(status.groupId())
                || (structuredClaim
                        && !safeText(claim.legalName()).equals(
                                status.legalName()))
                || !claimReceipt.acceptedAt().equals(status.submittedAt())) {
                throw new IllegalArgumentException(
                        "Registry operator claim status does not match the durable claim receipt.");
            }
        }
        if (legacyEvidence) {
            requireLegacyEligibilityBoundaryAbsent(status);
        } else {
            verifyClaimEligibilityBoundary(status);
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.registryPublicKey(),
                legacyEvidence
                        ? RegistryProtocol.legacyOperatorClaimStatusReceipt(
                                status)
                        : RegistryProtocol.operatorClaimStatusReceipt(status),
                status.signature())) {
            throw new IllegalArgumentException(
                    "Registry operator claim status signature is invalid.");
        }
        return status;
    }

    private OperatorClaimStatusReceipt loadVerifiedClaimStatusEvidence(
            TrustedDeployment trusted,
            List<OperatorActionJournalEntry> journal) {
        OperatorClaimStatusEvidence evidence =
                localStore.loadOperatorClaimStatusEvidence().orElse(null);
        if (evidence == null) {
            return null;
        }
        OperatorClaimStatusReceipt stored = evidence.status();
        OperatorActionJournalEntry storedClaim = null;
        for (OperatorActionJournalEntry entry : journal) {
            if (isClaimVerificationBoundary(entry)
                    && Objects.equals(
                            entry.receipt().actionId(),
                            stored.claimActionId())) {
                storedClaim = entry;
                break;
            }
        }
        if (storedClaim == null) {
            throw new IllegalStateException(
                    "Durable claim status evidence has no matching local claim receipt.");
        }
        try {
            return evidence.schemaVersion() == 1
                    ? verifyLegacyClaimStatusReceipt(
                            trusted,
                            storedClaim,
                            stored)
                    : verifyClaimStatusReceipt(
                            trusted,
                            storedClaim,
                            stored);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Durable claim status evidence failed cryptographic verification.",
                    exception);
        }
    }

    private static void requireLegacyEligibilityBoundaryAbsent(
            OperatorClaimStatusReceipt status) {
        if (status.eligibilityStatus() != null
                || status.eligibilityId() != null
                || status.eligibilityIndex() != null
                || status.eligibilityHash() != null) {
            throw new IllegalArgumentException(
                    "Legacy operator claim status evidence unexpectedly contains an eligibility boundary.");
        }
    }

    private static void verifyClaimEligibilityBoundary(
            OperatorClaimStatusReceipt status) {
        if (status.eligibilityStatus() == null
                || !Set.of(
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_SUSPENDED,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE)
                .contains(status.eligibilityStatus())) {
            throw new IllegalArgumentException(
                    "Registry operator claim eligibility status is unsupported.");
        }
        RegistryProtocol.requireHash(
                status.eligibilityHash(),
                "eligibility_hash");
        long eligibilityIndex = status.eligibilityIndex() == null
                ? 0L
                : status.eligibilityIndex();
        if (eligibilityIndex < 0L) {
            throw new IllegalArgumentException(
                    "eligibility_index must be non-negative.");
        }
        boolean hasEligibilityId = status.eligibilityId() != null
                && !status.eligibilityId().isEmpty();
        if (hasEligibilityId) {
            RegistryProtocol.requireOperatorEligibilityId(
                    status.eligibilityId());
        }
        boolean hasEligibilityBoundary = eligibilityIndex > 0L;
        if (hasEligibilityBoundary != hasEligibilityId
                || (hasEligibilityBoundary
                        == RegistryProtocol.ZERO_HASH.equals(
                                status.eligibilityHash()))) {
            throw new IllegalArgumentException(
                    "Registry operator claim eligibility boundary is inconsistent.");
        }

        boolean approved = RegistryProtocol
                .OPERATOR_VERIFICATION_STATUS_APPROVED
                .equals(status.verificationStatus());
        if (approved
                && !Set.of(
                                RegistryProtocol
                                        .OPERATOR_ELIGIBILITY_STATUS_ACTIVE,
                                RegistryProtocol
                                        .OPERATOR_ELIGIBILITY_STATUS_SUSPENDED)
                        .contains(status.eligibilityStatus())) {
            throw new IllegalArgumentException(
                    "Approved operator claim status has an invalid eligibility state.");
        }
        if (!approved
                && !RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE
                        .equals(status.eligibilityStatus())) {
            throw new IllegalArgumentException(
                    "Non-approved operator claim status must be eligibility-inactive.");
        }
        if (RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_SUSPENDED
                        .equals(status.eligibilityStatus())
                && !hasEligibilityBoundary) {
            throw new IllegalArgumentException(
                    "Suspended operator claim status has no signed eligibility decision.");
        }
    }

    private static void requireMonotonicClaimStatus(
            OperatorClaimStatusReceipt previous,
            OperatorClaimStatusReceipt incoming) {
        if (previous == null) {
            return;
        }
        boolean sameClaim = Objects.equals(
                        previous.claimActionId(),
                        incoming.claimActionId())
                && Objects.equals(
                        previous.claimAuditIndex(),
                        incoming.claimAuditIndex())
                && Objects.equals(
                        previous.claimAuditHash(),
                        incoming.claimAuditHash());
        if (!sameClaim) {
            if (incoming.claimAuditIndex() == null
                    || previous.claimAuditIndex() == null
                    || incoming.claimAuditIndex() <= previous.claimAuditIndex()
                    || Objects.equals(
                            incoming.claimActionId(),
                            previous.claimActionId())) {
                throw new IllegalArgumentException(
                        "Registry operator claim status rolled back to an older claim generation.");
            }
            return;
        }

        int previousRank = claimStatusRank(previous.verificationStatus());
        int incomingRank = claimStatusRank(incoming.verificationStatus());
        if (incomingRank < previousRank) {
            throw new IllegalArgumentException(
                    "Registry operator claim status regressed within the current claim generation.");
        }
        boolean previousHasReview = StringUtils.hasText(previous.reviewId());
        boolean incomingHasReview = StringUtils.hasText(incoming.reviewId());
        if (previousHasReview
                && (!incomingHasReview
                        || !Objects.equals(previous.reviewId(), incoming.reviewId())
                        || !Objects.equals(previous.reviewIndex(), incoming.reviewIndex())
                        || !Objects.equals(previous.reviewHash(), incoming.reviewHash())
                        || !Objects.equals(previous.approvedAt(), incoming.approvedAt()))) {
            throw new IllegalArgumentException(
                    "Registry operator claim review boundary changed or rolled back.");
        }
        if (previous.eligibilityStatus() != null) {
            long previousEligibilityIndex =
                    previous.eligibilityIndex() == null
                            ? 0L
                            : previous.eligibilityIndex();
            long incomingEligibilityIndex =
                    incoming.eligibilityIndex() == null
                            ? 0L
                            : incoming.eligibilityIndex();
            if (incomingEligibilityIndex < previousEligibilityIndex) {
                throw new IllegalArgumentException(
                        "Registry operator claim eligibility boundary rolled back.");
            }
            if (incomingEligibilityIndex == previousEligibilityIndex
                    && (!Objects.equals(
                                    previous.eligibilityId(),
                                    incoming.eligibilityId())
                            || !Objects.equals(
                                    previous.eligibilityHash(),
                                    incoming.eligibilityHash()))) {
                throw new IllegalArgumentException(
                        "Registry operator claim eligibility boundary changed at the same index.");
            }
            boolean approvalRemainsCurrent = RegistryProtocol
                            .OPERATOR_VERIFICATION_STATUS_APPROVED
                            .equals(previous.verificationStatus())
                    && RegistryProtocol
                            .OPERATOR_VERIFICATION_STATUS_APPROVED
                            .equals(incoming.verificationStatus());
            if (approvalRemainsCurrent
                    && incomingEligibilityIndex
                            == previousEligibilityIndex
                    && !Objects.equals(
                            previous.eligibilityStatus(),
                            incoming.eligibilityStatus())) {
                throw new IllegalArgumentException(
                        "Registry operator claim eligibility state changed without a newer decision.");
            }
        }
        if (RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                        .equals(previous.verificationStatus())
                && (!RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                                .equals(incoming.verificationStatus())
                        || previousHasReview != incomingHasReview)) {
            throw new IllegalArgumentException(
                    "Registry operator claim status changed after withdrawal.");
        }
    }

    private static int claimStatusRank(String status) {
        return switch (status) {
            case RegistryProtocol.OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW -> 0;
            case RegistryProtocol.OPERATOR_VERIFICATION_STATUS_APPROVED -> 1;
            case RegistryProtocol.OPERATOR_VERIFICATION_STATUS_REJECTED -> 1;
            case RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN -> 2;
            default -> throw new IllegalArgumentException(
                    "Registry operator claim verification status is unsupported.");
        };
    }

    private static boolean isUnsupportedClaimStatusEndpoint(
            com.raxim.myscoutee.domain.registry.api.RegistryHttpException exception) {
        return exception.getStatusCode() == 404
                && "not_found".equals(exception.getErrorCode());
    }

    private static boolean isMissingStructuredClaim(
            com.raxim.myscoutee.domain.registry.api.RegistryHttpException exception) {
        return exception.getStatusCode() == 404
                && "operator_claim_not_found".equals(exception.getErrorCode());
    }

    private void verifyLeaderboardPage(
            TrustedDeployment trusted,
            String expectedView,
            CursorClaims suppliedCursor,
            LeaderboardPage page) {
        if (page == null || page.snapshot() == null || page.items() == null
                || !expectedView.equals(page.view())) {
            throw new IllegalArgumentException("Registry leaderboard page is incomplete.");
        }
        verifySnapshot(trusted, page.snapshot());
        requireCursorSnapshot(suppliedCursor, page.snapshot());
        for (LeaderboardRow row : page.items()) {
            if (row == null || !expectedView.equals(row.view())) {
                throw new IllegalArgumentException("Registry leaderboard row has a mismatched view.");
            }
            RegistryProtocol.requireCanonical(row.rowId(), "leaderboard row_id");
            RegistryProtocol.requireCanonical(row.label(), "leaderboard label");
            requireCanonicalOptional(row.avatarUrl(), "leaderboard avatar_url");
            RegistryProtocol.requireCanonical(row.claimState(), "leaderboard claim_state");
            requireLeaderboardRowEligibility(expectedView, row);
            if (row.deploymentCount() == null || row.deploymentCount() < 0L) {
                throw new IllegalArgumentException("leaderboard deployment_count must be non-negative.");
            }
            if (StringUtils.hasText(row.groupId())) {
                RegistryProtocol.requireOperatorGroupId(row.groupId());
            }
            requireRational(row.weightNumerator(), row.weightDenominator(), "leaderboard weight");
            requireRational(row.shareNumerator(), row.shareDenominator(), "leaderboard share");
        }
        verifyCursor(
                trusted,
                page.nextCursor(),
                "rows",
                expectedView,
                "",
                page.snapshot());
    }

    private void verifyLeaderboardDeploymentPage(
            TrustedDeployment trusted,
            String expectedGroupId,
            CursorClaims suppliedCursor,
            LeaderboardDeploymentPage page) {
        if (page == null || page.snapshot() == null || page.items() == null
                || !expectedGroupId.equals(page.groupId())) {
            throw new IllegalArgumentException("Registry leaderboard deployment page is incomplete.");
        }
        verifySnapshot(trusted, page.snapshot());
        requireCursorSnapshot(suppliedCursor, page.snapshot());
        for (LeaderboardDeployment deployment : page.items()) {
            if (deployment == null) {
                throw new IllegalArgumentException("Registry leaderboard deployment is missing.");
            }
            RegistryProtocol.requireDeploymentId(deployment.deploymentId());
            if (!expectedGroupId.equals(deployment.groupId())) {
                throw new IllegalArgumentException(
                        "Registry leaderboard deployment has a mismatched group.");
            }
            RegistryProtocol.requireOperatorGroupId(deployment.groupId());
            RegistryProtocol.requireCanonical(deployment.claimState(), "leaderboard claim_state");
            requireLeaderboardDeploymentEligibility(deployment);
            RegistryProtocol.requireCanonical(
                    deployment.membershipState(),
                    "leaderboard membership_state");
            requireRational(
                    deployment.weightNumerator(),
                    deployment.weightDenominator(),
                    "leaderboard deployment weight");
            requireRational(
                    deployment.shareNumerator(),
                    deployment.shareDenominator(),
                    "leaderboard deployment share");
        }
        verifyCursor(
                trusted,
                page.nextCursor(),
                "deployments",
                "claimed",
                expectedGroupId,
                page.snapshot());
    }

    private static void requireLeaderboardRowEligibility(
            String view,
            LeaderboardRow row) {
        String eligibilityStatus = row.eligibilityStatus();
        if (eligibilityStatus == null
                || !Set.of(
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_SUSPENDED,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_PARTIALLY_SUSPENDED)
                .contains(eligibilityStatus)) {
            throw new IllegalArgumentException(
                    "Registry leaderboard row eligibility status is unsupported.");
        }
        if ("founder".equals(view)
                && !RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE
                        .equals(eligibilityStatus)) {
            throw new IllegalArgumentException(
                    "Registry founder row must be eligibility-active.");
        }
        if ("unclaimed".equals(view)
                && !RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE
                        .equals(eligibilityStatus)) {
            throw new IllegalArgumentException(
                    "Registry unclaimed row must be eligibility-inactive.");
        }
    }

    private static void requireLeaderboardDeploymentEligibility(
            LeaderboardDeployment deployment) {
        String eligibilityStatus = deployment.eligibilityStatus();
        if (eligibilityStatus == null
                || !Set.of(
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_SUSPENDED,
                        RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE)
                .contains(eligibilityStatus)) {
            throw new IllegalArgumentException(
                    "Registry leaderboard deployment eligibility status is unsupported.");
        }
        if ("claimed".equals(deployment.claimState())) {
            if (!RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE
                    .equals(eligibilityStatus)) {
                throw new IllegalArgumentException(
                        "Legacy claimed deployment must be eligibility-active.");
            }
            return;
        }
        if ("approved".equals(deployment.claimState())) {
            if (!Set.of(
                            RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_ACTIVE,
                            RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_SUSPENDED)
                    .contains(eligibilityStatus)) {
                throw new IllegalArgumentException(
                        "Approved deployment has an invalid eligibility status.");
            }
            return;
        }
        if (!RegistryProtocol.OPERATOR_ELIGIBILITY_STATUS_INACTIVE
                .equals(eligibilityStatus)) {
            throw new IllegalArgumentException(
                    "Non-approved deployment must be eligibility-inactive.");
        }
    }

    private void verifySnapshot(TrustedDeployment trusted, LeaderboardSnapshot snapshot) {
        RegistryProtocol.requireSnapshotId(snapshot.snapshotId());
        if (!RegistryProtocol.LEADERBOARD_FORMULA_VERSION.equals(snapshot.formulaVersion())
                || !RegistryProtocol.LEADERBOARD_RULESET_VERSION.equals(snapshot.rulesetVersion())) {
            throw new IllegalArgumentException("Registry leaderboard formula or ruleset is unsupported.");
        }
        RegistryProtocol.requirePeriod(snapshot.throughPeriod());
        requireNonNegative(snapshot.throughLedgerIndex(), "through_ledger_index");
        requireNonNegative(snapshot.throughAuditIndex(), "through_audit_index");
        requireNonNegative(snapshot.throughReviewIndex(), "through_review_index");
        requireNonNegative(
                snapshot.throughEligibilityIndex(),
                "through_eligibility_index");
        requireNonNegative(
                snapshot.throughTransferEventIndex(),
                "through_transfer_event_index");
        RegistryProtocol.requireHash(snapshot.ledgerHeadHash(), "ledger_head_hash");
        RegistryProtocol.requireHash(snapshot.auditHeadHash(), "audit_head_hash");
        RegistryProtocol.requireHash(snapshot.reviewHeadHash(), "review_head_hash");
        RegistryProtocol.requireHash(
                snapshot.eligibilityHeadHash(),
                "eligibility_head_hash");
        RegistryProtocol.requireHash(
                snapshot.transferEventHeadHash(),
                "transfer_event_head_hash");
        requireHeadBoundary(
                snapshot.throughReviewIndex(),
                snapshot.reviewHeadHash(),
                "review");
        requireHeadBoundary(
                snapshot.throughEligibilityIndex(),
                snapshot.eligibilityHeadHash(),
                "eligibility");
        requireHeadBoundary(
                snapshot.throughTransferEventIndex(),
                snapshot.transferEventHeadHash(),
                "transfer event");
        requireRational(
                snapshot.founderUnitsNumerator(),
                snapshot.founderUnitsDenominator(),
                "founder units");
        requireRational(
                snapshot.founderShareNumerator(),
                snapshot.founderShareDenominator(),
                "founder share");
        requireRational(
                snapshot.measuredWeightNumerator(),
                snapshot.measuredWeightDenominator(),
                "measured weight");
        requireRational(
                snapshot.claimedWeightNumerator(),
                snapshot.claimedWeightDenominator(),
                "claimed weight");
        RegistryProtocol.requireUtcTimestamp(snapshot.createdAt(), "snapshot created_at");
        RegistryProtocol.requireHash(snapshot.snapshotHash(), "snapshot_hash");
        if (!trusted.state().registryScope().equals(snapshot.registryScope())
                || !trusted.registryKeyId().equals(snapshot.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry leaderboard snapshot does not match the pinned registry.");
        }
        String expectedHash = RegistryProtocol.sha256(
                RegistryProtocol.leaderboardSnapshotHash(snapshot));
        if (!RegistryProtocol.hashEquals(expectedHash, snapshot.snapshotHash())) {
            throw new IllegalArgumentException("Registry leaderboard snapshot hash is invalid.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.registryPublicKey(),
                RegistryProtocol.leaderboardSnapshotReceipt(snapshot),
                snapshot.signature())) {
            throw new IllegalArgumentException("Registry leaderboard snapshot signature is invalid.");
        }
    }

    private static void requireHeadBoundary(
            Long index,
            String hash,
            String fieldName) {
        boolean hasEntries = index != null && index > 0L;
        boolean hasNonZeroHash = !RegistryProtocol.ZERO_HASH.equals(hash);
        if (hasEntries != hasNonZeroHash) {
            throw new IllegalArgumentException(
                    fieldName + " index and head hash boundary is inconsistent.");
        }
    }

    private List<PackageVerification> verifyAnnouncementPage(
            TrustedDeployment trusted,
            String expectedKind,
            String expectedSeverity,
            String expectedChannel,
            boolean expectedIncludeExpired,
            AnnouncementCursorClaims suppliedCursor,
            AnnouncementPage page) {
        if (page == null || page.snapshot() == null || page.items() == null) {
            throw new IllegalArgumentException("Registry announcement page is incomplete.");
        }
        AnnouncementSnapshot snapshot = page.snapshot();
        RegistryProtocol.requireAnnouncementSnapshotId(snapshot.snapshotId());
        RegistryProtocol.requireUtcTimestamp(snapshot.asOf(), "announcement snapshot as_of");
        requireNonNegative(snapshot.throughSequence(), "announcement through_sequence");
        RegistryProtocol.requireHash(
                snapshot.announcementHeadHash(),
                "announcement_head_hash");
        if (!expectedKind.equals(safeText(snapshot.kind()))
                || !expectedSeverity.equals(safeText(snapshot.severity()))
                || !expectedChannel.equals(safeText(snapshot.channel()))
                || snapshot.includeExpired() == null
                || snapshot.includeExpired() != expectedIncludeExpired
                || !trusted.state().registryScope().equals(snapshot.registryScope())
                || !trusted.registryKeyId().equals(snapshot.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry announcement snapshot does not match the requested filters or pinned registry.");
        }
        RegistryProtocol.requireUtcTimestamp(
                snapshot.createdAt(),
                "announcement snapshot created_at");
        RegistryProtocol.requireHash(snapshot.snapshotHash(), "announcement snapshot_hash");
        String expectedSnapshotHash = RegistryProtocol.sha256(
                RegistryProtocol.announcementSnapshotHash(snapshot));
        if (!RegistryProtocol.hashEquals(
                expectedSnapshotHash,
                snapshot.snapshotHash())) {
            throw new IllegalArgumentException(
                    "Registry announcement snapshot hash is invalid.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.registryPublicKey(),
                RegistryProtocol.announcementSnapshotReceipt(snapshot),
                snapshot.signature())) {
            throw new IllegalArgumentException(
                    "Registry announcement snapshot signature is invalid.");
        }
        requireAnnouncementCursorSnapshot(suppliedCursor, snapshot);

        PublicKey packageSigningKey = loadPackageSigningKey();
        String configuredPackageKeyId = packageSigningKey == null
                ? ""
                : RegistryProtocol.packageSigningKeyId(packageSigningKey.getEncoded());
        java.util.ArrayList<PackageVerification> verifications =
                new java.util.ArrayList<>();
        long previousSequence = Long.MAX_VALUE;
        for (AnnouncementEntry entry : page.items()) {
            verifyAnnouncementEntry(trusted, snapshot, entry);
            if (entry.sequence() >= previousSequence) {
                throw new IllegalArgumentException(
                        "Registry announcement page ordering is invalid.");
            }
            previousSequence = entry.sequence();
            if (entry.updateManifest() != null) {
                UpdateManifest manifest = entry.updateManifest();
                boolean keyMatches = packageSigningKey != null
                        && manifest.packageSigningKeyId().equals(configuredPackageKeyId);
                boolean signatureVerified = keyMatches && com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                        packageSigningKey,
                        RegistryProtocol.releasePackage(manifest),
                        manifest.packageSignature());
                verifications.add(new PackageVerification(
                        entry.announcementId(),
                        packageSigningKey != null,
                        keyMatches,
                        signatureVerified));
            }
        }
        verifyAnnouncementCursor(
                trusted,
                page.nextCursor(),
                expectedKind,
                expectedSeverity,
                expectedChannel,
                expectedIncludeExpired,
                snapshot);
        return List.copyOf(verifications);
    }

    private void verifyAnnouncementEntry(
            TrustedDeployment trusted,
            AnnouncementSnapshot snapshot,
            AnnouncementEntry entry) {
        if (entry == null || entry.sequence() == null || entry.sequence() <= 0L
                || entry.sequence() > snapshot.throughSequence()) {
            throw new IllegalArgumentException("Registry announcement sequence is invalid.");
        }
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(entry.protocolVersion())
                || !trusted.state().registryScope().equals(entry.registryScope())
                || !trusted.registryKeyId().equals(entry.registryKeyId())) {
            throw new IllegalArgumentException(
                    "Registry announcement does not match the pinned registry.");
        }
        RegistryProtocol.requireAnnouncementId(entry.announcementId());
        RegistryProtocol.requireToken(entry.publicationId(), "publication_id");
        requireAnnouncementKind(entry.kind());
        requireAnnouncementSeverity(entry.severity());
        RegistryProtocol.requireUtcTimestamp(entry.publishedAt(), "announcement published_at");
        if (StringUtils.hasText(entry.expiresAt())) {
            RegistryProtocol.requireUtcTimestamp(entry.expiresAt(), "announcement expires_at");
        }
        RegistryProtocol.requireUtcTimestamp(entry.acceptedAt(), "announcement accepted_at");
        List<AnnouncementLocalization> localizations =
                entry.localizations() == null ? List.of() : entry.localizations();
        List<AnnouncementLink> links =
                entry.links() == null ? List.of() : entry.links();
        String expectedContentHash = RegistryProtocol.sha256(
                RegistryProtocol.announcementContent(
                        entry.titleKey(),
                        entry.bodyKey(),
                        localizations));
        String expectedLinksHash = RegistryProtocol.sha256(
                RegistryProtocol.announcementLinks(links));
        String expectedManifestHash = RegistryProtocol.ZERO_HASH;
        if (entry.updateManifest() != null) {
            if (!"UPDATE".equals(entry.kind())) {
                throw new IllegalArgumentException(
                        "Only UPDATE announcements may contain an update manifest.");
            }
            validateUpdateManifest(entry.updateManifest(), entry.publishedAt());
            expectedManifestHash = RegistryProtocol.sha256(
                    RegistryProtocol.updateManifest(entry.updateManifest()));
        } else if ("UPDATE".equals(entry.kind())) {
            throw new IllegalArgumentException(
                    "UPDATE announcement is missing its update manifest.");
        }
        if (!RegistryProtocol.hashEquals(expectedContentHash, entry.contentHash())
                || !RegistryProtocol.hashEquals(expectedLinksHash, entry.linksHash())
                || !RegistryProtocol.hashEquals(
                        expectedManifestHash,
                        entry.updateManifestHash())) {
            throw new IllegalArgumentException(
                    "Registry announcement nested content hash is invalid.");
        }
        RegistryProtocol.requireHash(
                entry.previousAnnouncementHash(),
                "previous_announcement_hash");
        RegistryProtocol.requireHash(entry.announcementHash(), "announcement_hash");
        String expectedAnnouncementHash = RegistryProtocol.sha256(
                RegistryProtocol.announcementEntry(entry));
        if (!RegistryProtocol.hashEquals(
                expectedAnnouncementHash,
                entry.announcementHash())) {
            throw new IllegalArgumentException("Registry announcement hash is invalid.");
        }
        if (!com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verifyBase64(
                trusted.registryPublicKey(),
                RegistryProtocol.announcementReceipt(entry),
                entry.signature())) {
            throw new IllegalArgumentException(
                    "Registry announcement signature is invalid.");
        }
    }

    private void validateUpdateManifest(
            UpdateManifest manifest,
            String announcementPublishedAt) {
        if (!RegistryProtocol.UPDATE_MANIFEST_VERSION.equals(
                manifest.manifestVersion())) {
            throw new IllegalArgumentException(
                    "Update manifest version is unsupported.");
        }
        RegistryProtocol.SemanticVersion release =
                RegistryProtocol.requireSemanticVersion(
                        manifest.releaseVersion(),
                        "release_version");
        RegistryProtocol.SemanticVersion minimum =
                RegistryProtocol.requireSemanticVersion(
                        manifest.minimumCompatibleVersion(),
                        "minimum_compatible_version");
        RegistryProtocol.SemanticVersion maximum =
                RegistryProtocol.requireSemanticVersion(
                        manifest.maximumCompatibleVersion(),
                        "maximum_compatible_version");
        if (RegistryProtocol.compareSemanticVersions(minimum, maximum) > 0) {
            throw new IllegalArgumentException(
                    "Minimum compatible version exceeds maximum compatible version.");
        }
        if (!UPDATE_CHANNEL.matcher(safeText(manifest.channel())).matches()) {
            throw new IllegalArgumentException(
                    "Update channel is invalid.");
        }
        if (!announcementPublishedAt.equals(manifest.publishedAt())) {
            throw new IllegalArgumentException(
                    "Update manifest publication time differs from its announcement.");
        }
        RegistryProtocol.requireUtcTimestamp(manifest.publishedAt(), "update published_at");
        requireHttpsUrl(manifest.artifactUrl(), "artifact_url");
        if (!URI.create(manifest.artifactUrl()).getPath().toLowerCase().endsWith(".deb")) {
            throw new IllegalArgumentException(
                    "Update artifact URL must identify a Debian package.");
        }
        if (manifest.artifactSizeBytes() == null
                || manifest.artifactSizeBytes() < 1L
                || manifest.artifactSizeBytes() > 17_179_869_184L) {
            throw new IllegalArgumentException(
                    "Update artifact size must be between 1 byte and 16 GiB.");
        }
        RegistryProtocol.requireHash(manifest.artifactSha256(), "artifact_sha256");
        RegistryProtocol.requirePackageSigningKeyId(manifest.packageSigningKeyId());
        byte[] packageSignature = RegistryProtocol.decodeStandardBase64(
                manifest.packageSignature(),
                "package_signature");
        if (packageSignature.length != 64) {
            throw new IllegalArgumentException(
                    "Update package signature must be an Ed25519 signature.");
        }
        requireHttpsUrl(manifest.releaseNotesUrl(), "release_notes_url");
        if (manifest.backupRequired() == null
                || manifest.expectedDowntimeSeconds() == null
                || manifest.expectedDowntimeSeconds() < 0L
                || manifest.expectedDowntimeSeconds() > 86_400L) {
            throw new IllegalArgumentException("Update manifest status metadata is invalid.");
        }
        String supersedes = safeText(manifest.supersedesVersion());
        String supersededBy = safeText(manifest.supersededByVersion());
        String revocation = safeText(manifest.revocationReason());
        switch (safeText(manifest.status())) {
            case "AVAILABLE" -> {
                if (!supersededBy.isEmpty() || !revocation.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Available update manifest has invalid status metadata.");
                }
                if (!supersedes.isEmpty()) {
                    RegistryProtocol.SemanticVersion previous =
                            RegistryProtocol.requireSemanticVersion(
                                    supersedes,
                                    "supersedes_version");
                    if (RegistryProtocol.compareSemanticVersions(
                            release,
                            previous) == 0) {
                        throw new IllegalArgumentException(
                                "An update cannot supersede its own release version.");
                    }
                }
            }
            case "REVOKED" -> {
                if (!supersedes.isEmpty()
                        || !supersededBy.isEmpty()
                        || revocation.isEmpty()
                        || revocation.length() > 1_000
                        || revocation.indexOf('\r') >= 0
                        || revocation.indexOf('\n') >= 0) {
                    throw new IllegalArgumentException(
                            "Revoked update manifest has invalid status metadata.");
                }
            }
            case "SUPERSEDED" -> {
                if (!supersedes.isEmpty()
                        || !revocation.isEmpty()
                        || supersededBy.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Superseded update manifest has invalid status metadata.");
                }
                RegistryProtocol.SemanticVersion replacement =
                        RegistryProtocol.requireSemanticVersion(
                                supersededBy,
                                "superseded_by_version");
                if (RegistryProtocol.compareSemanticVersions(
                        release,
                        replacement) == 0) {
                    throw new IllegalArgumentException(
                            "An update cannot be superseded by its own release version.");
                }
            }
            default -> throw new IllegalArgumentException(
                    "Update manifest status metadata is invalid.");
        }
    }

    private PublicKey loadPackageSigningKey() {
        Path path = properties.getPackageSigningPublicKeyPath();
        if (path == null) {
            return null;
        }
        Path normalized = path.toAbsolutePath().normalize();
        if (!Files.exists(normalized, LinkOption.NOFOLLOW_LINKS)) {
            return null;
        }
        if (Files.isSymbolicLink(normalized)
                || !Files.isRegularFile(normalized, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    "Package-signing public key must be a regular non-symlink file.");
        }
        try {
            long size = Files.size(normalized);
            if (size <= 0L || size > 4_096L) {
                throw new IllegalStateException(
                        "Package-signing public key file has an invalid size.");
            }
            return com.raxim.myscoutee.domain.registry.api.RegistrySignatures.parsePublicKeyPemOrDer(
                    Files.readAllBytes(normalized),
                    "package-signing public key");
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to read the pinned package-signing public key.",
                    exception);
        }
    }

    private AnnouncementCursorClaims verifyAnnouncementCursor(
            TrustedDeployment trusted,
            String value,
            String expectedKind,
            String expectedSeverity,
            String expectedChannel,
            boolean expectedIncludeExpired,
            AnnouncementSnapshot snapshot) {
        String cursor = safeText(value);
        if (cursor.isEmpty()) {
            return null;
        }
        if (cursor.length() > MAX_CURSOR_LENGTH) {
            throw new IllegalArgumentException("Announcement cursor is too long.");
        }
        int separator = cursor.indexOf('.');
        if (separator <= 0 || separator != cursor.lastIndexOf('.')
                || separator == cursor.length() - 1) {
            throw new IllegalArgumentException("Announcement cursor is malformed.");
        }
        byte[] payload = decodeCanonicalUrlBase64(
                cursor.substring(0, separator),
                "announcement cursor payload");
        byte[] signature = decodeCanonicalUrlBase64(
                cursor.substring(separator + 1),
                "announcement cursor signature");
        if (signature.length != 64 || !com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verify(
                trusted.registryPublicKey(),
                RegistryProtocol.announcementCursor(payload),
                signature)) {
            throw new IllegalArgumentException("Announcement cursor signature is invalid.");
        }
        JsonNode node = objectMapper.readTree(payload);
        AnnouncementCursorClaims claims = new AnnouncementCursorClaims(
                node.path("version").asInt(-1),
                node.path("snapshot_id").asText(""),
                node.path("as_of").asText(""),
                node.path("through_sequence").asLong(-1L),
                node.path("announcement_head_hash").asText(""),
                node.path("kind").asText(""),
                node.path("severity").asText(""),
                node.path("channel").asText(""),
                node.path("include_expired").asBoolean(false),
                node.path("created_at").asText(""),
                node.path("after_sequence").asLong(-1L));
        if (claims.version() != 1
                || !expectedKind.equals(claims.kind())
                || !expectedSeverity.equals(claims.severity())
                || !expectedChannel.equals(claims.channel())
                || expectedIncludeExpired != claims.includeExpired()
                || claims.afterSequence() <= 0L
                || claims.afterSequence() > claims.throughSequence()) {
            throw new IllegalArgumentException(
                    "Announcement cursor does not belong to this request.");
        }
        RegistryProtocol.requireAnnouncementSnapshotId(claims.snapshotId());
        RegistryProtocol.requireUtcTimestamp(claims.asOf(), "announcement cursor as_of");
        requireNonNegative(claims.throughSequence(), "announcement cursor through_sequence");
        RegistryProtocol.requireHash(
                claims.announcementHeadHash(),
                "announcement cursor head hash");
        RegistryProtocol.requireUtcTimestamp(
                claims.createdAt(),
                "announcement cursor created_at");
        if (snapshot != null) {
            requireAnnouncementCursorSnapshot(claims, snapshot);
        }
        return claims;
    }

    private void requireAnnouncementCursorSnapshot(
            AnnouncementCursorClaims cursor,
            AnnouncementSnapshot snapshot) {
        if (cursor == null) {
            return;
        }
        if (!cursor.snapshotId().equals(snapshot.snapshotId())
                || !cursor.asOf().equals(snapshot.asOf())
                || cursor.throughSequence() != snapshot.throughSequence()
                || !cursor.announcementHeadHash().equals(snapshot.announcementHeadHash())
                || !cursor.createdAt().equals(snapshot.createdAt())) {
            throw new IllegalArgumentException(
                    "Announcement cursor and signed snapshot boundaries differ.");
        }
    }

    private static void validateAnnouncementQuery(
            String kind,
            String severity,
            String channel,
            Integer limit) {
        if (!kind.isEmpty()) {
            requireAnnouncementKind(kind);
        }
        if (!severity.isEmpty()) {
            requireAnnouncementSeverity(severity);
        }
        if (!channel.isEmpty()) {
            RegistryProtocol.requireCanonical(channel, "announcement channel");
            if (!kind.isEmpty() && !"UPDATE".equals(kind)) {
                throw new IllegalArgumentException(
                        "Announcement channel may be combined only with kind UPDATE.");
            }
        }
        if (limit != null && (limit < 1 || limit > 100)) {
            throw new IllegalArgumentException(
                    "Announcement limit must be between 1 and 100.");
        }
    }

    private static void requireAnnouncementKind(String kind) {
        if (!Set.of("GENERAL", "UPDATE", "MAINTENANCE", "SECURITY").contains(kind)) {
            throw new IllegalArgumentException("Announcement kind is unsupported.");
        }
    }

    private static void requireAnnouncementSeverity(String severity) {
        if (!Set.of("INFO", "NOTICE", "WARNING", "CRITICAL").contains(severity)) {
            throw new IllegalArgumentException("Announcement severity is unsupported.");
        }
    }

    private CursorClaims verifyCursor(
            TrustedDeployment trusted,
            String value,
            String expectedKind,
            String expectedView,
            String expectedGroupId,
            LeaderboardSnapshot snapshot) {
        String cursor = safeText(value);
        if (cursor.isEmpty()) {
            return null;
        }
        if (cursor.length() > MAX_CURSOR_LENGTH) {
            throw new IllegalArgumentException("Leaderboard cursor is too long.");
        }
        int separator = cursor.indexOf('.');
        if (separator <= 0 || separator != cursor.lastIndexOf('.')
                || separator == cursor.length() - 1) {
            throw new IllegalArgumentException("Leaderboard cursor is malformed.");
        }
        byte[] payload = decodeCanonicalUrlBase64(
                cursor.substring(0, separator),
                "leaderboard cursor payload");
        byte[] signature = decodeCanonicalUrlBase64(
                cursor.substring(separator + 1),
                "leaderboard cursor signature");
        JsonNode node;
        try {
            node = objectMapper.readTree(payload);
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException("Leaderboard cursor payload is invalid.", exception);
        }
        int version = node.path("version").asInt(-1);
        requireLeaderboardCursorFields(node, version);
        if (signature.length != 64 || !com.raxim.myscoutee.domain.registry.api.RegistrySignatures.verify(
                trusted.registryPublicKey(),
                RegistryProtocol.leaderboardCursor(version, payload),
                signature)) {
            throw new IllegalArgumentException("Leaderboard cursor signature is invalid.");
        }
        CursorClaims claims = new CursorClaims(
                version,
                node.path("kind").asText(""),
                node.path("view").asText(""),
                node.path("group_id").asText(""),
                node.path("snapshot_id").asText(""),
                node.path("from_period").asText(""),
                node.path("through_period").asText(""),
                node.path("through_ledger_index").asLong(-1L),
                node.path("through_audit_index").asLong(-1L),
                node.path("through_review_index").asLong(-1L),
                node.path("through_eligibility_index").asLong(-1L),
                version == 2
                        ? 0L
                        : node.path("through_transfer_event_index")
                                .asLong(-1L),
                node.path("ledger_head_hash").asText(""),
                node.path("audit_head_hash").asText(""),
                node.path("review_head_hash").asText(""),
                node.path("eligibility_head_hash").asText(""),
                version == 2
                        ? RegistryProtocol.ZERO_HASH
                        : node.path("transfer_event_head_hash").asText(""),
                node.path("created_at").asText(""),
                node.path("after_weight").asLong(-1L),
                node.path("after_id").asText(""));
        if ((claims.version() != 2 && claims.version() != 3)
                || !expectedKind.equals(claims.kind())
                || !expectedView.equals(claims.view())
                || !expectedGroupId.equals(claims.groupId())
                || claims.afterWeight() < 0L
                || !StringUtils.hasText(claims.afterId())) {
            throw new IllegalArgumentException(
                    "Leaderboard cursor does not belong to this request.");
        }
        RegistryProtocol.requireSnapshotId(claims.snapshotId());
        RegistryProtocol.requirePeriod(claims.fromPeriod());
        RegistryProtocol.requirePeriod(claims.throughPeriod());
        requireNonNegative(claims.throughLedgerIndex(), "cursor through_ledger_index");
        requireNonNegative(claims.throughAuditIndex(), "cursor through_audit_index");
        requireNonNegative(claims.throughReviewIndex(), "cursor through_review_index");
        requireNonNegative(
                claims.throughEligibilityIndex(),
                "cursor through_eligibility_index");
        requireNonNegative(
                claims.throughTransferEventIndex(),
                "cursor through_transfer_event_index");
        RegistryProtocol.requireHash(claims.ledgerHeadHash(), "cursor ledger_head_hash");
        RegistryProtocol.requireHash(claims.auditHeadHash(), "cursor audit_head_hash");
        RegistryProtocol.requireHash(claims.reviewHeadHash(), "cursor review_head_hash");
        RegistryProtocol.requireHash(
                claims.eligibilityHeadHash(),
                "cursor eligibility_head_hash");
        RegistryProtocol.requireHash(
                claims.transferEventHeadHash(),
                "cursor transfer_event_head_hash");
        requireHeadBoundary(
                claims.throughReviewIndex(),
                claims.reviewHeadHash(),
                "cursor review");
        requireHeadBoundary(
                claims.throughEligibilityIndex(),
                claims.eligibilityHeadHash(),
                "cursor eligibility");
        requireHeadBoundary(
                claims.throughTransferEventIndex(),
                claims.transferEventHeadHash(),
                "cursor transfer event");
        RegistryProtocol.requireUtcTimestamp(claims.createdAt(), "cursor created_at");
        if (snapshot != null) {
            requireCursorSnapshot(claims, snapshot);
        }
        return claims;
    }

    private static void requireLeaderboardCursorFields(
            JsonNode node,
            int version) {
        if (node == null || !node.isObject()
                || (version != 2 && version != 3)) {
            throw new IllegalArgumentException(
                    "Leaderboard cursor version is unsupported.");
        }
        Set<String> required = version == 2
                ? LEADERBOARD_CURSOR_V2_FIELDS
                : LEADERBOARD_CURSOR_V3_FIELDS;
        Set<String> actual = new HashSet<>();
        actual.addAll(node.propertyNames());
        boolean unknown = actual.stream().anyMatch(field ->
                !"group_id".equals(field) && !required.contains(field));
        if (unknown || !actual.containsAll(required)) {
            throw new IllegalArgumentException(
                    "Leaderboard cursor payload fields are invalid.");
        }
    }

    private void requireCursorSnapshot(CursorClaims cursor, LeaderboardSnapshot snapshot) {
        if (cursor == null) {
            return;
        }
        if (!cursor.snapshotId().equals(snapshot.snapshotId())
                || !cursor.throughPeriod().equals(snapshot.throughPeriod())
                || cursor.throughLedgerIndex() != snapshot.throughLedgerIndex()
                || cursor.throughAuditIndex() != snapshot.throughAuditIndex()
                || cursor.throughReviewIndex() != snapshot.throughReviewIndex()
                || cursor.throughEligibilityIndex()
                        != snapshot.throughEligibilityIndex()
                || cursor.throughTransferEventIndex()
                        != snapshot.throughTransferEventIndex()
                || !cursor.ledgerHeadHash().equals(snapshot.ledgerHeadHash())
                || !cursor.auditHeadHash().equals(snapshot.auditHeadHash())
                || !cursor.reviewHeadHash().equals(snapshot.reviewHeadHash())
                || !cursor.eligibilityHeadHash()
                        .equals(snapshot.eligibilityHeadHash())
                || !cursor.transferEventHeadHash()
                        .equals(snapshot.transferEventHeadHash())
                || !cursor.createdAt().equals(snapshot.createdAt())) {
            throw new IllegalArgumentException(
                    "Leaderboard cursor and signed snapshot boundaries differ.");
        }
    }

    private static void validateOptionalOperatorIds(OperatorActionReceipt receipt) {
        if (StringUtils.hasText(receipt.groupId())) {
            RegistryProtocol.requireOperatorGroupId(receipt.groupId());
        }
        if (StringUtils.hasText(receipt.linkId())) {
            RegistryProtocol.requireOperatorLinkId(receipt.linkId());
        }
        if (StringUtils.hasText(receipt.tokenId())) {
            RegistryProtocol.requireOperatorTokenId(receipt.tokenId());
        }
        boolean hasSourceClaimActionId =
                receipt.sourceClaimActionId() != null
                        && !receipt.sourceClaimActionId().isEmpty();
        boolean hasSourcePrivateRecordHash =
                receipt.sourcePrivateRecordHash() != null
                        && !receipt.sourcePrivateRecordHash().isEmpty();
        if (hasSourceClaimActionId != hasSourcePrivateRecordHash) {
            throw new IllegalArgumentException(
                    "Registry operator source claim anchors must be both absent or both present.");
        }
        boolean tokenDerivedPendingClaim =
                RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN.equals(
                                receipt.action())
                        && RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW.equals(
                                receipt.claimState())
                        && !StringUtils.hasText(receipt.linkId());
        if (tokenDerivedPendingClaim && !hasSourceClaimActionId) {
            throw new IllegalArgumentException(
                    "Token-derived pending claim receipt has no signed source claim anchors.");
        }
        if (hasSourceClaimActionId) {
            RegistryProtocol.requireOperatorActionId(
                    receipt.sourceClaimActionId());
            RegistryProtocol.requireHash(
                    receipt.sourcePrivateRecordHash(),
                    "source_private_record_hash");
            if (!tokenDerivedPendingClaim
                    || !StringUtils.hasText(receipt.groupId())
                    || !StringUtils.hasText(receipt.relatedDeploymentId())) {
                throw new IllegalArgumentException(
                        "Registry operator source claim anchors are invalid for this action.");
            }
        }
        requireCanonicalOptional(receipt.claimState(), "claim_state");
    }

    private static void validateLeaderboardQuery(String throughPeriod, Integer limit) {
        if (StringUtils.hasText(throughPeriod)) {
            RegistryProtocol.requirePeriod(throughPeriod.trim());
        }
        if (limit != null && (limit < 1 || limit > 100)) {
            throw new IllegalArgumentException("Leaderboard limit must be between 1 and 100.");
        }
    }

    private static void requireRational(String numerator, String denominator, String fieldName) {
        if (!NON_NEGATIVE_INTEGER.matcher(safeText(numerator)).matches()
                || !NON_NEGATIVE_INTEGER.matcher(safeText(denominator)).matches()
                || "0".equals(denominator)) {
            throw new IllegalArgumentException(fieldName + " must be a non-negative rational value.");
        }
    }

    private static long requireNonNegative(Long value, String fieldName) {
        if (value == null || value < 0L) {
            throw new IllegalArgumentException(fieldName + " must be non-negative.");
        }
        return value;
    }

    private static byte[] decodeCanonicalUrlBase64(String value, String fieldName) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(value);
            if (!Base64.getUrlEncoder().withoutPadding().encodeToString(decoded).equals(value)) {
                throw new IllegalArgumentException(fieldName + " is not canonical base64url.");
            }
            return decoded;
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(fieldName + " is invalid.", exception);
        }
    }

    private static ClaimVerification normalizeClaimVerification(
            ClaimVerification supplied) {
        String legalName = requireClaimText(supplied.legalName(), "legal_name", 160);
        String registrationNumber = requireClaimText(
                supplied.registrationNumber(),
                "registration_number",
                80);
        String jurisdiction = requireClaimText(
                supplied.jurisdiction(),
                "jurisdiction",
                80);
        String registeredAddress = requireClaimText(
                supplied.registeredAddress(),
                "registered_address",
                500);
        String website = safeText(supplied.website());
        if (!Objects.equals(supplied.website() == null ? "" : supplied.website(), website)) {
            throw new IllegalArgumentException(
                    "website must not have surrounding whitespace.");
        }
        if (website.isEmpty()) {
            throw new IllegalArgumentException(
                    "website is required.");
        }
        requireHttpsUrl(website, "website");
        String contactName = requireClaimText(
                supplied.verificationContactName(),
                "verification_contact_name",
                120);
        String contactRole = requireClaimText(
                supplied.verificationContactRole(),
                "verification_contact_role",
                120);
        String contactEmail = requireClaimEmail(supplied.verificationContactEmail());
        if (!supplied.authorityAttested()) {
            throw new IllegalArgumentException("authority_attested must be true.");
        }
        return new ClaimVerification(
                legalName,
                registrationNumber,
                jurisdiction,
                registeredAddress,
                website,
                contactName,
                contactRole,
                contactEmail,
                true);
    }

    private static String requireClaimText(
            String value,
            String fieldName,
            int maxUtf8Bytes) {
        String normalized = safeText(value);
        if (!Objects.equals(value, normalized)) {
            throw new IllegalArgumentException(
                    fieldName + " must not have surrounding whitespace.");
        }
        requireText(normalized, fieldName, maxUtf8Bytes);
        return normalized;
    }

    private static String requireClaimEmail(String value) {
        String email = requireClaimText(value, "verification_contact_email", 254);
        if (!email.equals(email.toLowerCase(java.util.Locale.ROOT))) {
            throw new IllegalArgumentException(
                    "verification_contact_email must be a canonical lowercase email address.");
        }
        int at = email.indexOf('@');
        if (at <= 0 || at != email.lastIndexOf('@') || at > 64
                || email.charAt(0) == '.' || email.charAt(at - 1) == '.'
                || email.substring(0, at).contains("..")
                || !EMAIL_LOCAL.matcher(email.substring(0, at)).matches()) {
            throw new IllegalArgumentException(
                    "verification_contact_email must be a canonical lowercase email address.");
        }
        String[] labels = email.substring(at + 1).split("\\.", -1);
        if (labels.length < 2) {
            throw new IllegalArgumentException(
                    "verification_contact_email must be a canonical lowercase email address.");
        }
        for (String label : labels) {
            if (!EMAIL_DOMAIN_LABEL.matcher(label).matches()) {
                throw new IllegalArgumentException(
                        "verification_contact_email must be a canonical lowercase email address.");
            }
        }
        return email;
    }

    private static boolean isStructuredClaim(OperatorActionJournalEntry entry) {
        return entry != null
                && RegistryProtocol.OPERATOR_ACTION_CLAIM.equals(entry.action())
                && StringUtils.hasText(entry.legalName());
    }

    private static boolean isTokenDerivedClaim(
            OperatorActionJournalEntry entry) {
        if (entry == null
                || !RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN.equals(
                        entry.action())
                || entry.receipt() == null) {
            return false;
        }
        OperatorActionReceipt receipt = entry.receipt();
        return RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW.equals(
                        receipt.claimState())
                && StringUtils.hasText(receipt.groupId())
                && StringUtils.hasText(receipt.relatedDeploymentId())
                && StringUtils.hasText(receipt.tokenId())
                && StringUtils.hasText(receipt.sourceClaimActionId())
                && StringUtils.hasText(receipt.sourcePrivateRecordHash())
                && !StringUtils.hasText(receipt.linkId());
    }

    private static boolean isClaimVerificationBoundary(
            OperatorActionJournalEntry entry) {
        return isStructuredClaim(entry) || isTokenDerivedClaim(entry);
    }

    private static void requireAbsentClaimVerification(ClaimVerification verification) {
        if (verification != null) {
            throw new IllegalArgumentException(
                    "Operator action contains fields that are not valid for this action.");
        }
    }

    private static void requireText(String value, String fieldName, int maxUtf8Bytes) {
        RegistryProtocol.requireCanonical(value, fieldName);
        if (value.getBytes(StandardCharsets.UTF_8).length > maxUtf8Bytes) {
            throw new IllegalArgumentException(fieldName + " is too long.");
        }
    }

    private static void requireHttpsUrl(String value, String fieldName) {
        requireText(value, fieldName, 2048);
        try {
            URI uri = URI.create(value);
            if (!"https".equals(uri.getScheme())
                    || uri.getHost() == null
                    || uri.getUserInfo() != null
                    || uri.getFragment() != null) {
                throw new IllegalArgumentException(fieldName + " must be an absolute HTTPS URL.");
            }
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException(fieldName + " must be an absolute HTTPS URL.", exception);
        }
    }

    private static void requireCanonicalOptional(String value, String fieldName) {
        String normalized = value == null ? "" : value;
        if (normalized.indexOf('\r') >= 0 || normalized.indexOf('\n') >= 0) {
            throw new IllegalArgumentException(fieldName + " must not contain CR or LF.");
        }
    }

    private static void requireAbsent(Object... values) {
        for (Object value : values) {
            if (value instanceof String text && !text.isEmpty()) {
                throw new IllegalArgumentException(
                        "Operator action contains fields that are not valid for this action.");
            }
            if (value instanceof Number number && number.longValue() != 0L) {
                throw new IllegalArgumentException(
                        "Operator action contains fields that are not valid for this action.");
            }
        }
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private static String emptyToNull(String value) {
        return StringUtils.hasText(value) ? value : null;
    }













    private record TrustedDeployment(
            LocalState state,
            RegistryCrypto deploymentCrypto,
            PublicKey registryPublicKey,
            String registryKeyId) {
    }

    private record CursorClaims(
            int version,
            String kind,
            String view,
            String groupId,
            String snapshotId,
            String fromPeriod,
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
            String createdAt,
            long afterWeight,
            String afterId) {
    }

    private record AnnouncementCursorClaims(
            int version,
            String snapshotId,
            String asOf,
            long throughSequence,
            String announcementHeadHash,
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            String createdAt,
            long afterSequence) {
    }
}
