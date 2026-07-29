package com.raxim.myscoutee.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.KeyPair;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimVerification;
import com.raxim.myscoutee.registry.RegistryProtocol.AnnouncementEntry;
import com.raxim.myscoutee.registry.RegistryProtocol.AnnouncementLink;
import com.raxim.myscoutee.registry.RegistryProtocol.AnnouncementLocalization;
import com.raxim.myscoutee.registry.RegistryProtocol.AnnouncementPage;
import com.raxim.myscoutee.registry.RegistryProtocol.AnnouncementSnapshot;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardSnapshot;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorActionReceipt;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorActionRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorActionResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorClaimStatusReceipt;
import com.raxim.myscoutee.registry.RegistryProtocol.OperatorClaimStatusResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.RegistrationResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.UpdateManifest;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import tools.jackson.databind.ObjectMapper;

class RegistryOperatorNetworkServiceTest {
    private static final String SCOPE = "operator-test:parent-a";
    private static final String DEPLOYMENT_ID = "dep_0123456789abcdef0123456789abcdef";
    private static final String ISSUER_DEPLOYMENT_ID =
            "dep_fedcba9876543210fedcba9876543210";
    private static final String GROUP_ID = "opg_0123456789abcdef0123456789abcdef";
    private static final String TOKEN_ID = "opt_0123456789abcdef0123456789abcdef";
    private static final String LINK_ID = "opl_0123456789abcdef0123456789abcdef";
    private static final String ACTION_ID = "opa_0123456789abcdef0123456789abcdef";
    private static final String CLIENT_TOKEN =
            "opc_0123456789abcdef0123456789abcdef";
    private static final String SOURCE_PRIVATE_RECORD_HASH =
            "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

    @TempDir
    Path temporaryDirectory;

    @Test
    void signsActionVerifiesAuditReceiptAndPersistsNoPlaintextToken() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            RegistryOperatorNetworkService.ActionOutcome outcome = service.apply(
                    new ActionCommand(
                            RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN,
                            null,
                            null,
                            null,
                            300L,
                            null,
                            null,
                            "operator_issue_12345678"));

            assertThat(outcome.plaintextClientToken()).isEqualTo(CLIENT_TOKEN);
            assertThat(outcome.response().receipt().tokenId()).isEqualTo(TOKEN_ID);
            assertThat(outcome.response().receipt().auditHash())
                    .isEqualTo(registry.lastAuditHash.get());
            String durableReceipt = Files.readString(
                    outcome.receiptPath(),
                    StandardCharsets.UTF_8);
            assertThat(durableReceipt)
                    .contains(ACTION_ID)
                    .doesNotContain(CLIENT_TOKEN)
                    .doesNotContain("\"client_token\"");
            assertThat(registry.actionRequests).hasValue(1);
            registry.assertHealthy();
        }
    }

    @Test
    void verifiesSignedSnapshotAndOpaqueCursorWithoutCalculatingLeaderboard() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            LeaderboardPage first = service.leaderboard("claimed", "2026-06", 10, null);
            LeaderboardRow row = first.items().getFirst();

            assertThat(row.weightNumerator()).isEqualTo("12345");
            assertThat(row.weightDenominator()).isEqualTo("2");
            assertThat(row.shareNumerator()).isEqualTo("7");
            assertThat(row.shareDenominator()).isEqualTo("20");
            assertThat(first.nextCursor()).isNotBlank();

            LeaderboardPage second =
                    service.leaderboard("claimed", "2026-06", 10, first.nextCursor());
            assertThat(second.snapshot()).isEqualTo(first.snapshot());
            assertThat(registry.leaderboardRequests).hasValue(2);

            String[] cursorParts = first.nextCursor().split("\\.", -1);
            byte[] tamperedSignature = Base64.getUrlDecoder().decode(cursorParts[1]);
            tamperedSignature[0] ^= 0x01;
            String tampered = cursorParts[0] + "."
                    + Base64.getUrlEncoder().withoutPadding().encodeToString(tamperedSignature);
            assertThatThrownBy(() ->
                    service.leaderboard("claimed", "2026-06", 10, tampered))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("cursor");
            assertThat(registry.leaderboardRequests).hasValue(2);
            registry.assertHealthy();
        }
    }

    @Test
    void claimStatusComesFromVerifiedJournalAndSignedGroupShare() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    "https://cdn.example.test/operator.png",
                    null,
                    null,
                    null,
                    null,
                    "operator_claim_12345678",
                    new ClaimVerification(
                            "Verified Operator Ltd",
                            "REG-42",
                            "Slovakia",
                            "Main Street 1",
                            "https://operator.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true)));

            RegistryOperatorNetworkService.ClaimStatus status = service.claimStatus();

            assertThat(status.claimed()).isTrue();
            assertThat(status.claimedAt()).isEqualTo("2026-07-28T00:00:03Z");
            assertThat(status.operatorName()).isEqualTo("Verified Operator Ltd");
            assertThat(status.operatorAvatarUrl())
                    .isEqualTo("https://cdn.example.test/operator.png");
            assertThat(status.groupId()).isEqualTo(GROUP_ID);
            assertThat(status.shareNumerator()).isEqualTo("7");
            assertThat(status.shareDenominator()).isEqualTo("20");
            assertThat(status.verificationCapability()).isEqualTo("AVAILABLE");
            assertThat(status.verificationStatus()).isEqualTo("PENDING_REVIEW");
            assertThat(status.verificationSubmittedAt())
                    .isEqualTo("2026-07-28T00:00:03Z");
            assertThat(status.legalName()).isEqualTo("Verified Operator Ltd");
            assertThat(registry.claimStatusRequests).hasValue(1);
            assertThat(registry.leaderboardRequests).hasValue(1);
            registry.assertHealthy();
        }
    }

    @Test
    void tokenDerivedPendingClaimUsesSignedRedeemBoundaryWithoutLocalPii()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            registry.redeemAsTokenDerivedClaim = true;
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);

            RegistryOperatorNetworkService.ActionOutcome redemption =
                    service.apply(new ActionCommand(
                            RegistryProtocol
                                    .OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                            null,
                            null,
                            CLIENT_TOKEN,
                            null,
                            null,
                            null,
                            null));
            RegistryOperatorNetworkService.ClaimStatus status =
                    service.claimStatus();

            assertThat(status.claimed()).isTrue();
            assertThat(status.claimedAt())
                    .isEqualTo("2026-07-28T00:00:03Z");
            assertThat(status.operatorName())
                    .isEqualTo("Token Source Cooperative");
            assertThat(status.groupId()).isEqualTo(GROUP_ID);
            assertThat(status.activeLinkId()).isNull();
            assertThat(status.verificationStatus())
                    .isEqualTo("PENDING_REVIEW");
            assertThat(status.legalName())
                    .isEqualTo("Token Source Cooperative");
            assertThat(redemption.response().receipt().relatedDeploymentId())
                    .isEqualTo(ISSUER_DEPLOYMENT_ID);
            assertThat(redemption.response().receipt().tokenId())
                    .isEqualTo(TOKEN_ID);
            assertThat(redemption.response().receipt().linkId()).isNull();
            assertThat(redemption.response().receipt().sourceClaimActionId())
                    .isEqualTo(ACTION_ID);
            assertThat(redemption.response().receipt().sourcePrivateRecordHash())
                    .isEqualTo(SOURCE_PRIVATE_RECORD_HASH);

            RegistryLocalStore.OperatorActionJournalEntry durable =
                    new RegistryLocalStore(properties, objectMapper)
                            .loadOperatorActionJournal()
                            .getFirst();
            assertThat(durable.action()).isEqualTo(
                    RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN);
            assertThat(durable.legalName()).isNull();
            assertThat(durable.registrationNumber()).isNull();
            assertThat(durable.registeredAddress()).isNull();
            assertThat(durable.website()).isNull();
            assertThat(durable.verificationContactEmail()).isNull();
            assertThat(durable.receipt().sourceClaimActionId())
                    .isEqualTo(ACTION_ID);
            assertThat(durable.receipt().sourcePrivateRecordHash())
                    .isEqualTo(SOURCE_PRIVATE_RECORD_HASH);
            RegistryOperatorNetworkService restarted =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);
            assertThat(restarted.claimStatus().verificationStatus())
                    .isEqualTo("PENDING_REVIEW");
            registry.assertHealthy();
        }
    }

    @Test
    void rejectsSourceClaimAnchorsOnAnUnrelatedOperatorAction()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            registry.sourceAnchorsForOrdinaryAction = true;
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);

            assertThatThrownBy(() -> service.apply(new ActionCommand(
                            RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN,
                            null,
                            null,
                            null,
                            300L,
                            null,
                            null,
                            "operator_issue_12345678")))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining(
                            "source claim anchors are invalid");
            registry.assertHealthy();
        }
    }

    @Test
    void rejectsTokenDerivedPendingClaimWithoutSignedSourceAnchors()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            registry.redeemAsTokenDerivedClaim = true;
            registry.omitTokenDerivedSourceAnchors = true;
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);

            assertThatThrownBy(() -> service.apply(new ActionCommand(
                            RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                            null,
                            null,
                            CLIENT_TOKEN,
                            null,
                            null,
                            null,
                            null)))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining(
                            "no signed source claim anchors");
            registry.assertHealthy();
        }
    }

    @Test
    void structuredClaimRequiresWebsiteBeforeCallingRegistry()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);

            assertThatThrownBy(() -> service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    new ClaimVerification(
                            "Website Required Cooperative",
                            "REG-WEBSITE",
                            "Slovakia",
                            "Main Street 5",
                            null,
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true))))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("website is required.");
            assertThat(registry.actionRequests).hasValue(0);
            registry.assertHealthy();
        }
    }

    @Test
    void rejectsTamperedSignedClaimStatus() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "operator_claim_tamper_12345678",
                    new ClaimVerification(
                            "Verified Operator Ltd",
                            "REG-42",
                            "Slovakia",
                            "Main Street 1",
                            "https://operator.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true)));
            registry.tamperClaimStatus = true;

            assertThatThrownBy(service::claimStatus)
                    .isInstanceOf(RegistryProtocolException.class)
                    .hasRootCauseMessage(
                            "Registry operator claim status signature is invalid.");
            registry.assertHealthy();
        }
    }

    @Test
    void approvedStatusComesOnlyFromVerifiedRegistryReceipt() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    new ClaimVerification(
                            "Approved Cooperative",
                            "REG-APPROVED",
                            "Slovakia",
                            "Main Street 3",
                            "https://approved.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true)));
            registry.approvedClaimStatus = true;

            RegistryOperatorNetworkService.ClaimStatus status = service.claimStatus();

            assertThat(status.verificationStatus()).isEqualTo("APPROVED");
            assertThat(status.claimed()).isTrue();
            assertThat(status.legalName()).isEqualTo("Approved Cooperative");
            registry.assertHealthy();
        }
    }

    @Test
    void rejectedStatusPassesThroughWithoutInferringWithdrawalOrShare()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);
            service.apply(structuredClaim("Rejected Cooperative"));
            registry.rejectedClaimStatus = true;

            RegistryOperatorNetworkService.ClaimStatus status =
                    service.claimStatus();

            assertThat(status.verificationStatus()).isEqualTo("REJECTED");
            assertThat(status.claimed()).isTrue();
            assertThat(status.groupId()).isEqualTo(GROUP_ID);
            assertThat(status.shareNumerator()).isEqualTo("0");
            assertThat(status.shareDenominator()).isEqualTo("1");
            assertThat(status.legalName())
                    .isEqualTo("Rejected Cooperative");

            RegistryOperatorNetworkService restarted =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);
            assertThat(restarted.claimStatus().verificationStatus())
                    .isEqualTo("REJECTED");
            registry.assertHealthy();
        }
    }

    @Test
    void rejectsSignedStatusRollbackAfterApprovalAndRestart() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            service.apply(structuredClaim("Restart Cooperative"));
            registry.approvedClaimStatus = true;
            assertThat(service.claimStatus().verificationStatus()).isEqualTo("APPROVED");

            RegistryOperatorNetworkService restarted =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            registry.approvedClaimStatus = false;

            assertThatThrownBy(restarted::claimStatus)
                    .isInstanceOf(RegistryProtocolException.class)
                    .hasMessageContaining("stale");
            registry.assertHealthy();
        }
    }

    @Test
    void withdrawalIsTerminalAndReconcilesAResponseLostBeforeLocalPersistence()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            service.apply(structuredClaim("Withdrawal Cooperative"));
            registry.approvedClaimStatus = true;
            assertThat(service.claimStatus().verificationStatus()).isEqualTo("APPROVED");
            registry.loseFirstResponseForAction =
                    RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM;
            ActionCommand withdraw = new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);

            assertThatThrownBy(() -> service.apply(withdraw))
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class);
            RegistryOperatorNetworkService.ClaimStatus reconciled =
                    service.claimStatus();

            assertThat(reconciled.claimed()).isFalse();
            assertThat(reconciled.groupId()).isNull();
            assertThat(reconciled.activeLinkId()).isNull();
            assertThat(reconciled.shareNumerator()).isEqualTo("0");
            assertThat(reconciled.shareDenominator()).isEqualTo("1");
            assertThat(reconciled.verificationStatus()).isEqualTo("WITHDRAWN");

            RegistryOperatorNetworkService.ActionOutcome retry =
                    service.apply(withdraw);
            assertThat(retry.response().duplicate()).isTrue();
            assertThat(registry.firstWithdrawalIdempotency.get())
                    .startsWith("withdraw_")
                    .isEqualTo(registry.lastWithdrawalIdempotency.get());
            assertThat(new RegistryLocalStore(properties, objectMapper)
                            .loadOperatorActionJournal())
                    .hasSize(2);

            RegistryOperatorNetworkService restarted =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            registry.withdrawnClaimStatus = false;
            registry.approvedClaimStatus = true;
            assertThatThrownBy(restarted::claimStatus)
                    .isInstanceOf(RegistryProtocolException.class)
                    .hasMessageContaining("stale");
            registry.assertHealthy();
        }
    }

    @Test
    void deactivationIsRetrySafeAndLocallyWithdrawsStaleApprovedClaimState()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry =
                new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties =
                    registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);
            service.apply(structuredClaim("Deactivation Cooperative"));
            registry.approvedClaimStatus = true;
            assertThat(service.claimStatus().verificationStatus())
                    .isEqualTo("APPROVED");
            registry.loseFirstResponseForAction =
                    RegistryProtocol
                            .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT;
            ActionCommand deactivate = new ActionCommand(
                    RegistryProtocol
                            .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);

            assertThatThrownBy(() -> service.apply(deactivate))
                    .isInstanceOf(
                            RegistryHttpClient
                                    .RegistryHttpException.class);
            RegistryOperatorNetworkService.ActionOutcome retry =
                    service.apply(deactivate);

            assertThat(retry.response().duplicate()).isTrue();
            assertThat(registry.firstLostActionIdempotency.get())
                    .startsWith("deactivate_")
                    .isEqualTo(
                            registry.lastRetriedActionIdempotency
                                    .get());
            registry.unsupportedClaimStatusEndpoint = true;
            RegistryOperatorNetworkService restarted =
                    new RegistryOperatorNetworkService(
                            properties,
                            objectMapper);
            RegistryOperatorNetworkService.ClaimStatus status =
                    restarted.claimStatus();

            assertThat(status.claimed()).isFalse();
            assertThat(status.groupId()).isNull();
            assertThat(status.activeLinkId()).isNull();
            assertThat(status.shareNumerator()).isEqualTo("0");
            assertThat(status.shareDenominator()).isEqualTo("1");
            assertThat(status.verificationStatus())
                    .isEqualTo("WITHDRAWN");
            assertThat(new RegistryLocalStore(properties, objectMapper)
                            .loadOperatorActionJournal())
                    .hasSize(2);
            registry.assertHealthy();
        }
    }

    @Test
    void sameClaimPayloadAfterWithdrawalStartsANewIdempotencyGeneration()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            ActionCommand claim = structuredClaim("Generation Cooperative");
            String firstKey = service.apply(claim).idempotencyKey();
            service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null));
            assertThat(service.claimStatus().verificationStatus())
                    .isEqualTo("WITHDRAWN");

            String secondKey = service.apply(claim).idempotencyKey();

            assertThat(secondKey).startsWith("claim_").isNotEqualTo(firstKey);
            assertThat(service.claimStatus().verificationStatus())
                    .isEqualTo("PENDING_REVIEW");
            registry.assertHealthy();
        }
    }

    @Test
    void claimStatusSurvivesLeaderboardOutageWithoutLosingSignedState()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            service.apply(structuredClaim("Leaderboard Independent Cooperative"));
            registry.failLeaderboard = true;

            RegistryOperatorNetworkService.ClaimStatus status =
                    service.claimStatus();

            assertThat(status.claimed()).isTrue();
            assertThat(status.verificationStatus()).isEqualTo("PENDING_REVIEW");
            assertThat(status.shareNumerator()).isEqualTo("0");
            assertThat(status.shareDenominator()).isEqualTo("1");
            registry.assertHealthy();
        }
    }

    @Test
    void legacyRegistryWithoutClaimStatusEndpointReportsUnavailableCapability()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            registry.unsupportedClaimStatusEndpoint = true;
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            RegistryOperatorNetworkService.ClaimStatus status =
                    service.claimStatus();

            assertThat(status.verificationCapability())
                    .isEqualTo("BACKEND_UNAVAILABLE");
            assertThat(status.verificationUnavailableReason())
                    .isEqualTo("operator.claim.verification.backend.unavailable");
            registry.assertHealthy();
        }
    }

    @Test
    void redeemAndRevokeLinkRetriesUseStableIdempotencyKeys() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            ActionCommand redeem = new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                    null,
                    null,
                    CLIENT_TOKEN,
                    null,
                    null,
                    null,
                    null);
            registry.loseFirstResponseForAction =
                    RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN;

            assertThatThrownBy(() -> service.apply(redeem))
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class);
            RegistryOperatorNetworkService.ActionOutcome redeemed =
                    service.apply(redeem);
            assertThat(redeemed.response().duplicate()).isTrue();
            assertThat(redeemed.idempotencyKey()).startsWith("redeem_");
            assertThat(redeemed.response().receipt().sourceClaimActionId())
                    .isNull();
            assertThat(redeemed.response().receipt().sourcePrivateRecordHash())
                    .isNull();

            ActionCommand revoke = new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK,
                    null,
                    null,
                    null,
                    null,
                    null,
                    LINK_ID,
                    null);
            registry.loseFirstResponseForAction =
                    RegistryProtocol.OPERATOR_ACTION_REVOKE_GROUP_LINK;
            assertThatThrownBy(() -> service.apply(revoke))
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class);
            RegistryOperatorNetworkService.ActionOutcome revoked =
                    service.apply(revoke);

            assertThat(revoked.response().duplicate()).isTrue();
            assertThat(revoked.idempotencyKey()).startsWith("revoke_link_");
            assertThat(registry.firstLostActionIdempotency.get())
                    .isEqualTo(registry.lastRetriedActionIdempotency.get());
            assertThat(new RegistryLocalStore(properties, objectMapper)
                            .loadOperatorActionJournal())
                    .hasSize(2);
            registry.assertHealthy();
        }
    }

    @Test
    void localRegistryEvidenceUsesPrivatePosixModesAndRepairsReadableFiles()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            RegistryOperatorNetworkService.ActionOutcome claim =
                    service.apply(structuredClaim("Private Evidence Cooperative"));
            service.claimStatus();
            Path statusPath = properties.receiptDirectory()
                    .resolve("operator-claim-status.json");
            if (!Files.getFileStore(properties.getStateDir())
                    .supportsFileAttributeView("posix")) {
                return;
            }
            Set<PosixFilePermission> privateDirectory =
                    PosixFilePermissions.fromString("rwx------");
            Set<PosixFilePermission> privateFile =
                    PosixFilePermissions.fromString("rw-------");

            assertThat(Files.getPosixFilePermissions(properties.getStateDir()))
                    .isEqualTo(privateDirectory);
            assertThat(Files.getPosixFilePermissions(properties.receiptDirectory()))
                    .isEqualTo(privateDirectory);
            assertThat(Files.getPosixFilePermissions(claim.receiptPath()))
                    .isEqualTo(privateFile);
            assertThat(Files.getPosixFilePermissions(statusPath))
                    .isEqualTo(privateFile);

            Files.setPosixFilePermissions(claim.receiptPath(),
                    PosixFilePermissions.fromString("rw-r--r--"));
            new RegistryLocalStore(properties, objectMapper)
                    .loadOperatorActionJournal();
            assertThat(Files.getPosixFilePermissions(claim.receiptPath()))
                    .isEqualTo(privateFile);
            registry.assertHealthy();
        }
    }

    @Test
    void structuredClaimRetryAfterLostResponseReusesDeterministicIdempotencyKey()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            ActionCommand claim = new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    new ClaimVerification(
                            "Retry Cooperative",
                            "REG-RETRY",
                            "Slovakia",
                            "Main Street 2",
                            "https://retry.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true));
            registry.loseFirstClaimResponse = true;

            assertThatThrownBy(() -> service.apply(claim))
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class)
                    .hasMessageContaining("communicate");
            RegistryOperatorNetworkService.ActionOutcome retry = service.apply(claim);

            assertThat(retry.response().duplicate()).isTrue();
            assertThat(registry.firstClaimIdempotency.get())
                    .startsWith("claim_")
                    .isEqualTo(registry.lastClaimIdempotency.get());
            assertThat(retry.idempotencyKey())
                    .isEqualTo(registry.firstClaimIdempotency.get());
            assertThat(service.claimStatus().verificationStatus())
                    .isEqualTo("PENDING_REVIEW");
            registry.assertHealthy();
        }
    }

    @Test
    void retryAfterPostApplyStatusFailureReusesOneDurableJournalEntry()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);
            ActionCommand claim = new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    new ClaimVerification(
                            "Durable Retry Cooperative",
                            "REG-DURABLE",
                            "Slovakia",
                            "Main Street 4",
                            "https://durable.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true));

            RegistryOperatorNetworkService.ActionOutcome first = service.apply(claim);
            byte[] durableBefore = Files.readAllBytes(first.receiptPath());
            registry.failClaimStatusOnce = true;
            assertThatThrownBy(service::claimStatus)
                    .isInstanceOf(RegistryHttpClient.RegistryHttpException.class);

            RegistryOperatorNetworkService.ActionOutcome retry = service.apply(claim);

            assertThat(retry.response().duplicate()).isTrue();
            assertThat(retry.receiptPath()).isEqualTo(first.receiptPath());
            assertThat(Files.readAllBytes(retry.receiptPath())).isEqualTo(durableBefore);
            assertThat(new RegistryLocalStore(properties, objectMapper)
                            .loadOperatorActionJournal())
                    .hasSize(1);
            assertThat(service.claimStatus().verificationStatus())
                    .isEqualTo("PENDING_REVIEW");
            registry.assertHealthy();
        }
    }

    @Test
    void verifiesSignedUpdateAnnouncementAndSeparatelyPinnedPackageSignature()
            throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = registeredProperties(registry, objectMapper);
            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            RegistryOperatorNetworkService.AnnouncementOutcome outcome =
                    service.announcements(
                            "UPDATE",
                            "NOTICE",
                            "stable",
                            false,
                            10,
                            null);

            assertThat(outcome.page().snapshot().announcementHeadHash())
                    .isEqualTo(registry.announcement.announcementHash());
            assertThat(outcome.page().items())
                    .singleElement()
                    .satisfies(entry -> {
                        assertThat(entry.announcementId())
                                .isEqualTo("ann_0123456789abcdef0123456789abcdef");
                        assertThat(entry.localizations())
                                .singleElement()
                                .extracting(AnnouncementLocalization::locale)
                                .isEqualTo("en");
                        assertThat(entry.updateManifest().artifactUrl())
                                .isEqualTo(
                                        "https://downloads.example.test/myscoutee_1.2.3_amd64.deb");
                    });
            assertThat(outcome.packageVerifications())
                    .singleElement()
                    .satisfies(verification -> {
                        assertThat(verification.packageSigningKeyConfigured()).isTrue();
                        assertThat(verification.packageSigningKeyMatches()).isTrue();
                        assertThat(verification.packageSignatureVerified()).isTrue();
                    });
            assertThat(registry.announcementRequests).hasValue(1);
            registry.assertHealthy();
        }
    }

    @Test
    void refusesOperatorNetworkBeforeExplicitRegistrationWithoutCallingRegistry() throws Exception {
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (TestOperatorRegistry registry = new TestOperatorRegistry(objectMapper)) {
            RegistryProperties properties = baseProperties(registry);
            Path keyDirectory = temporaryDirectory.resolve("unregistered-keys");
            RegistryTestIdentity.writeDeploymentIdentity(
                    keyDirectory,
                    registry.deploymentKeyPair);
            Files.createDirectory(properties.getStateDir());
            properties.setPrivateKeyPath(keyDirectory.resolve("deployment-private-key.pem"));
            properties.setPublicKeyPath(keyDirectory.resolve("deployment-public-key.der"));

            RegistryOperatorNetworkService service =
                    new RegistryOperatorNetworkService(properties, objectMapper);

            assertThatThrownBy(() -> service.apply(new ActionCommand(
                    RegistryProtocol.OPERATOR_ACTION_CLAIM,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    new ClaimVerification(
                            "Operator Ltd",
                            "REG-42",
                            "Slovakia",
                            "Main Street 1",
                            "https://operator.example.test",
                            "Alex Reviewer",
                            "Director",
                            "alex@example.test",
                            true))))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("not registered");
            assertThat(registry.actionRequests).hasValue(0);
            assertThat(registry.leaderboardRequests).hasValue(0);
        }
    }

    private static ActionCommand structuredClaim(String legalName) {
        return new ActionCommand(
                RegistryProtocol.OPERATOR_ACTION_CLAIM,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                new ClaimVerification(
                        legalName,
                        "REG-42",
                        "Slovakia",
                        "Main Street 1",
                        "https://operator.example.test",
                        "Alex Reviewer",
                        "Director",
                        "alex@example.test",
                        true));
    }

    private RegistryProperties registeredProperties(
            TestOperatorRegistry registry,
            ObjectMapper objectMapper) throws IOException {
        RegistryProperties properties = baseProperties(registry);
        Path keyDirectory = temporaryDirectory.resolve("registered-keys");
        RegistryTestIdentity.writeDeploymentIdentity(
                keyDirectory,
                registry.deploymentKeyPair);
        Files.createDirectory(properties.getStateDir());
        properties.setPrivateKeyPath(keyDirectory.resolve("deployment-private-key.pem"));
        properties.setPublicKeyPath(keyDirectory.resolve("deployment-public-key.der"));
        Path packagePublicKey = keyDirectory.resolve("package-public-key.pem");
        String encodedPackageKey = Base64.getMimeEncoder(
                        64,
                        "\n".getBytes(StandardCharsets.US_ASCII))
                .encodeToString(
                        registry.packageSigningKeyPair.getPublic().getEncoded());
        Files.writeString(
                packagePublicKey,
                "-----BEGIN PUBLIC KEY-----\n"
                        + encodedPackageKey
                        + "\n-----END PUBLIC KEY-----\n",
                StandardCharsets.US_ASCII);
        properties.setPackageSigningPublicKeyPath(packagePublicKey);

        RegistryLocalStore store = new RegistryLocalStore(properties, objectMapper);
        String deploymentFingerprint = RegistryProtocol.publicKeyFingerprint(
                registry.deploymentKeyPair.getPublic().getEncoded());
        LocalState initial = store.createInitial(
                deploymentFingerprint,
                SCOPE,
                "test-v1",
                new java.security.SecureRandom(),
                Instant.parse("2026-07-28T00:00:00Z"));
        RegistrationResponse unsigned = new RegistrationResponse(
                RegistryProtocol.PROTOCOL_VERSION,
                SCOPE,
                DEPLOYMENT_ID,
                "2026-07-28T00:00:01Z",
                deploymentFingerprint,
                registry.registryKeyId,
                registry.registryPublicKey,
                null,
                false);
        RegistrationResponse registration = new RegistrationResponse(
                unsigned.protocolVersion(),
                unsigned.registryScope(),
                unsigned.deploymentId(),
                unsigned.registeredAt(),
                unsigned.publicKeyFingerprint(),
                unsigned.registryKeyId(),
                unsigned.registryPublicKey(),
                RegistryTestIdentity.sign(
                        registry.registryKeyPair.getPrivate(),
                        RegistryProtocol.registrationReceipt(unsigned)),
                false);
        store.save(initial.withRegistration(
                registration,
                registry.registryFingerprint,
                Instant.parse("2026-07-28T00:00:01Z")));
        return properties;
    }

    private RegistryProperties baseProperties(TestOperatorRegistry registry) {
        RegistryProperties properties = new RegistryProperties();
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setOperatorRegistrationConfirmed(false);
        properties.setBaseUrl(registry.baseUrl());
        properties.setRegistryScope(SCOPE);
        properties.setStateDir(temporaryDirectory.resolve(
                "state-" + Integer.toHexString(System.identityHashCode(registry))));
        properties.setConnectTimeout(Duration.ofSeconds(2));
        properties.setRequestTimeout(Duration.ofSeconds(2));
        properties.setAllowInsecureHttp(true);
        properties.setExpectedRegistryKeyFingerprint(registry.registryFingerprint);
        return properties;
    }

    private static final class TestOperatorRegistry implements AutoCloseable {
        private final ObjectMapper objectMapper;
        private final HttpServer server;
        private final KeyPair registryKeyPair = RegistryTestIdentity.generate();
        private final KeyPair deploymentKeyPair = RegistryTestIdentity.generate();
        private final KeyPair packageSigningKeyPair = RegistryTestIdentity.generate();
        private final String registryPublicKey =
                RegistryProtocol.standardBase64(registryKeyPair.getPublic().getEncoded());
        private final String registryFingerprint =
                RegistryProtocol.publicKeyFingerprint(registryKeyPair.getPublic().getEncoded());
        private final String registryKeyId =
                RegistryProtocol.registryKeyId(registryFingerprint);
        private final AtomicReference<Throwable> handlerFailure = new AtomicReference<>();
        private final AtomicReference<String> lastAuditHash = new AtomicReference<>();
        private final AtomicReference<OperatorActionRequest> lastClaimRequest = new AtomicReference<>();
        private final AtomicReference<OperatorActionReceipt> lastClaimReceipt = new AtomicReference<>();
        private final AtomicReference<String> lastClaimLegalName =
                new AtomicReference<>();
        private final AtomicReference<String> firstClaimIdempotency = new AtomicReference<>();
        private final AtomicReference<String> lastClaimIdempotency = new AtomicReference<>();
        private final AtomicReference<String> firstWithdrawalIdempotency = new AtomicReference<>();
        private final AtomicReference<String> lastWithdrawalIdempotency = new AtomicReference<>();
        private final AtomicReference<String> firstLostActionIdempotency = new AtomicReference<>();
        private final AtomicReference<String> lastRetriedActionIdempotency = new AtomicReference<>();
        private final AtomicInteger actionRequests = new AtomicInteger();
        private final AtomicInteger auditEvents = new AtomicInteger();
        private final AtomicInteger claimStatusRequests = new AtomicInteger();
        private final AtomicInteger leaderboardRequests = new AtomicInteger();
        private final AtomicInteger announcementRequests = new AtomicInteger();
        private final Map<String, AcceptedAction> acceptedActions = new HashMap<>();
        private final LeaderboardSnapshot snapshot;
        private final String cursor;
        private final AnnouncementEntry announcement;
        private final AnnouncementSnapshot announcementSnapshot;
        private volatile boolean tamperClaimStatus;
        private volatile boolean loseFirstClaimResponse;
        private volatile boolean approvedClaimStatus;
        private volatile boolean rejectedClaimStatus;
        private volatile boolean withdrawnClaimStatus;
        private volatile boolean failClaimStatusOnce;
        private volatile boolean failLeaderboard;
        private volatile boolean unsupportedClaimStatusEndpoint;
        private volatile boolean redeemAsTokenDerivedClaim;
        private volatile boolean omitTokenDerivedSourceAnchors;
        private volatile boolean sourceAnchorsForOrdinaryAction;
        private volatile String loseFirstResponseForAction;

        private TestOperatorRegistry(ObjectMapper objectMapper) throws IOException {
            this.objectMapper = objectMapper;
            LeaderboardSnapshot unsignedSnapshot = new LeaderboardSnapshot(
                    "snap_0123456789abcdef0123456789abcdef",
                    RegistryProtocol.LEADERBOARD_FORMULA_VERSION,
                    RegistryProtocol.LEADERBOARD_RULESET_VERSION,
                    "2026-06",
                    12L,
                    4L,
                    "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                    "100000",
                    "1",
                    "1",
                    "4",
                    "200000",
                    "1",
                    "150000",
                    "1",
                    "2026-07-28T00:00:05Z",
                    null,
                    SCOPE,
                    registryKeyId,
                    null);
            String snapshotHash = RegistryProtocol.sha256(
                    RegistryProtocol.leaderboardSnapshotHash(unsignedSnapshot));
            LeaderboardSnapshot hashedSnapshot = new LeaderboardSnapshot(
                    unsignedSnapshot.snapshotId(),
                    unsignedSnapshot.formulaVersion(),
                    unsignedSnapshot.rulesetVersion(),
                    unsignedSnapshot.throughPeriod(),
                    unsignedSnapshot.throughLedgerIndex(),
                    unsignedSnapshot.throughAuditIndex(),
                    unsignedSnapshot.ledgerHeadHash(),
                    unsignedSnapshot.auditHeadHash(),
                    unsignedSnapshot.founderUnitsNumerator(),
                    unsignedSnapshot.founderUnitsDenominator(),
                    unsignedSnapshot.founderShareNumerator(),
                    unsignedSnapshot.founderShareDenominator(),
                    unsignedSnapshot.measuredWeightNumerator(),
                    unsignedSnapshot.measuredWeightDenominator(),
                    unsignedSnapshot.claimedWeightNumerator(),
                    unsignedSnapshot.claimedWeightDenominator(),
                    unsignedSnapshot.createdAt(),
                    snapshotHash,
                    unsignedSnapshot.registryScope(),
                    unsignedSnapshot.registryKeyId(),
                    null);
            this.snapshot = new LeaderboardSnapshot(
                    hashedSnapshot.snapshotId(),
                    hashedSnapshot.formulaVersion(),
                    hashedSnapshot.rulesetVersion(),
                    hashedSnapshot.throughPeriod(),
                    hashedSnapshot.throughLedgerIndex(),
                    hashedSnapshot.throughAuditIndex(),
                    hashedSnapshot.ledgerHeadHash(),
                    hashedSnapshot.auditHeadHash(),
                    hashedSnapshot.founderUnitsNumerator(),
                    hashedSnapshot.founderUnitsDenominator(),
                    hashedSnapshot.founderShareNumerator(),
                    hashedSnapshot.founderShareDenominator(),
                    hashedSnapshot.measuredWeightNumerator(),
                    hashedSnapshot.measuredWeightDenominator(),
                    hashedSnapshot.claimedWeightNumerator(),
                    hashedSnapshot.claimedWeightDenominator(),
                    hashedSnapshot.createdAt(),
                    hashedSnapshot.snapshotHash(),
                    hashedSnapshot.registryScope(),
                    hashedSnapshot.registryKeyId(),
                    RegistryTestIdentity.sign(
                            registryKeyPair.getPrivate(),
                            RegistryProtocol.leaderboardSnapshotReceipt(hashedSnapshot)));
            this.cursor = signedCursor();
            this.announcement = signedUpdateAnnouncement();
            this.announcementSnapshot = signedAnnouncementSnapshot(announcement);
            this.server = HttpServer.create(
                    new InetSocketAddress(InetAddress.getLoopbackAddress(), 0),
                    0);
            server.createContext(
                    RegistryProtocol.OPERATOR_ACTION_PATH,
                    this::handleAction);
            server.createContext(
                    RegistryProtocol.OPERATOR_CLAIM_STATUS_PATH_PREFIX,
                    this::handleClaimStatus);
            server.createContext(
                    RegistryProtocol.LEADERBOARD_PATH,
                    this::handleLeaderboard);
            server.createContext(
                    RegistryProtocol.ANNOUNCEMENT_PATH,
                    this::handleAnnouncements);
            server.start();
        }

        private String baseUrl() {
            return "http://127.0.0.1:" + server.getAddress().getPort();
        }

        private void handleAction(HttpExchange exchange) throws IOException {
            try {
                actionRequests.incrementAndGet();
                require("POST".equals(exchange.getRequestMethod()), "Action method was not POST.");
                OperatorActionRequest request = objectMapper.readValue(
                        exchange.getRequestBody().readAllBytes(),
                        OperatorActionRequest.class);
                boolean structuredClaim = RegistryProtocol.OPERATOR_ACTION_CLAIM
                        .equals(request.action());
                boolean redeemToken = RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN
                        .equals(request.action());
                boolean tokenDerivedClaim =
                        redeemToken && redeemAsTokenDerivedClaim;
                String submittedClientTokenHash = redeemToken
                        ? RegistryProtocol.sha256(
                                request.clientToken().getBytes(StandardCharsets.UTF_8))
                        : "";
                String expectedPayloadHash = RegistryProtocol.sha256(
                        structuredClaim
                                ? RegistryProtocol.operatorClaimPayload(
                                        request.legalName(),
                                        request.registrationNumber(),
                                        request.jurisdiction(),
                                        request.registeredAddress(),
                                        request.website(),
                                        request.verificationContactName(),
                                        request.verificationContactRole(),
                                        request.verificationContactEmail(),
                                        Boolean.TRUE.equals(request.authorityAttested()),
                                        request.operatorAvatarUrl())
                                : RegistryProtocol.operatorActionPayload(
                                        request.action(),
                                        request.operatorName(),
                                        request.operatorAvatarUrl(),
                                        submittedClientTokenHash,
                                        request.tokenTtlSeconds() == null
                                                ? 0L
                                                : request.tokenTtlSeconds(),
                                        request.tokenId(),
                                        request.linkId()));
                require(expectedPayloadHash.equals(request.payloadHash()), "Action payload hash was invalid.");
                require(RegistryCrypto.verifyBase64(
                                deploymentKeyPair.getPublic(),
                                RegistryProtocol.signedRequest(
                                        "POST",
                                        RegistryProtocol.OPERATOR_ACTION_PATH,
                                        request.protocolVersion(),
                                        request.registryScope(),
                                        request.deploymentId(),
                                        request.timestamp(),
                                        request.nonce(),
                                        request.idempotencyKey(),
                                        request.payloadHash()),
                                request.signature()),
                        "Action signature was invalid.");
                if (structuredClaim) {
                    firstClaimIdempotency.compareAndSet(null, request.idempotencyKey());
                    lastClaimIdempotency.set(request.idempotencyKey());
                }
                if (RegistryProtocol.OPERATOR_ACTION_WITHDRAW_CLAIM
                        .equals(request.action())) {
                    firstWithdrawalIdempotency.compareAndSet(
                            null,
                            request.idempotencyKey());
                    lastWithdrawalIdempotency.set(request.idempotencyKey());
                }
                AcceptedAction duplicate = acceptedActions.get(request.idempotencyKey());
                if (duplicate != null) {
                    require(
                            duplicate.action().equals(request.action())
                                    && duplicate.payloadHash().equals(request.payloadHash()),
                            "Duplicate action changed its canonical request.");
                    if (duplicate.responseLost()) {
                        lastRetriedActionIdempotency.set(request.idempotencyKey());
                    }
                    sendJson(exchange, 200, new OperatorActionResponse(
                            RegistryProtocol.PROTOCOL_VERSION,
                            SCOPE,
                            true,
                            duplicate.receipt().withoutPlaintextClientToken()));
                    return;
                }
                boolean issueToken = RegistryProtocol.OPERATOR_ACTION_ISSUE_CLIENT_TOKEN
                        .equals(request.action());
                String tokenHash = issueToken
                        ? RegistryProtocol.sha256(
                                CLIENT_TOKEN.getBytes(StandardCharsets.UTF_8))
                        : redeemToken ? submittedClientTokenHash : null;
                long auditIndex = auditEvents.incrementAndGet();
                String previousAuditHash = lastAuditHash.get() == null
                        ? RegistryProtocol.ZERO_HASH
                        : lastAuditHash.get();
                String actionId = issueToken
                        ? ACTION_ID
                        : "opa_" + String.format("%032x", auditIndex);
                String claimState = tokenDerivedClaim
                        ? RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW
                        : switch (request.action()) {
                            case RegistryProtocol.OPERATOR_ACTION_CLAIM ->
                                    RegistryProtocol
                                            .OPERATOR_CLAIM_STATE_PENDING_REVIEW;
                            case RegistryProtocol
                                    .OPERATOR_ACTION_WITHDRAW_CLAIM ->
                                            RegistryProtocol
                                                    .OPERATOR_CLAIM_STATE_WITHDRAWN;
                            case RegistryProtocol
                                    .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT ->
                                            RegistryProtocol
                                                    .OPERATOR_CLAIM_STATE_WITHDRAWN;
                            default -> "claimed";
                        };
                String linkId = tokenDerivedClaim
                        ? null
                        : Set.of(
                                        RegistryProtocol
                                                .OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                                        RegistryProtocol
                                                .OPERATOR_ACTION_REVOKE_GROUP_LINK)
                                .contains(request.action())
                                        ? LINK_ID
                                        : null;
                String tokenId = issueToken || redeemToken
                        ? TOKEN_ID
                        : RegistryProtocol.OPERATOR_ACTION_REVOKE_CLIENT_TOKEN
                                .equals(request.action())
                                        ? request.tokenId()
                                        : null;
                boolean sourceAnchored =
                        (tokenDerivedClaim
                                && !omitTokenDerivedSourceAnchors)
                                || sourceAnchorsForOrdinaryAction;
                OperatorActionReceipt auditSeed = new OperatorActionReceipt(
                        auditIndex,
                        null,
                        previousAuditHash,
                        actionId,
                        DEPLOYMENT_ID,
                        DEPLOYMENT_ID,
                        tokenDerivedClaim ? ISSUER_DEPLOYMENT_ID : null,
                        request.action(),
                        "2026-07-28T00:00:03Z",
                        claimState,
                        GROUP_ID,
                        linkId,
                        tokenId,
                        issueToken ? CLIENT_TOKEN : null,
                        tokenHash,
                        sourceAnchored ? ACTION_ID : null,
                        sourceAnchored
                                ? SOURCE_PRIVATE_RECORD_HASH
                                : null,
                        issueToken ? "2026-07-28T00:05:03Z" : null,
                        SCOPE,
                        registryKeyId,
                        null);
                String auditHash = RegistryProtocol.sha256(
                        RegistryProtocol.operatorAudit(auditSeed, request.payloadHash()));
                lastAuditHash.set(auditHash);
                OperatorActionReceipt unsigned = new OperatorActionReceipt(
                        auditSeed.auditIndex(),
                        auditHash,
                        auditSeed.previousAuditHash(),
                        auditSeed.actionId(),
                        auditSeed.deploymentId(),
                        auditSeed.subjectDeploymentId(),
                        auditSeed.relatedDeploymentId(),
                        auditSeed.action(),
                        auditSeed.acceptedAt(),
                        auditSeed.claimState(),
                        auditSeed.groupId(),
                        auditSeed.linkId(),
                        auditSeed.tokenId(),
                        auditSeed.clientToken(),
                        auditSeed.clientTokenHash(),
                        auditSeed.sourceClaimActionId(),
                        auditSeed.sourcePrivateRecordHash(),
                        auditSeed.tokenExpiresAt(),
                        auditSeed.registryScope(),
                        auditSeed.registryKeyId(),
                        null);
                OperatorActionReceipt signed = new OperatorActionReceipt(
                        unsigned.auditIndex(),
                        unsigned.auditHash(),
                        unsigned.previousAuditHash(),
                        unsigned.actionId(),
                        unsigned.deploymentId(),
                        unsigned.subjectDeploymentId(),
                        unsigned.relatedDeploymentId(),
                        unsigned.action(),
                        unsigned.acceptedAt(),
                        unsigned.claimState(),
                        unsigned.groupId(),
                        unsigned.linkId(),
                        unsigned.tokenId(),
                        unsigned.clientToken(),
                        unsigned.clientTokenHash(),
                        unsigned.sourceClaimActionId(),
                        unsigned.sourcePrivateRecordHash(),
                        unsigned.tokenExpiresAt(),
                        unsigned.registryScope(),
                        unsigned.registryKeyId(),
                                RegistryTestIdentity.sign(
                                        registryKeyPair.getPrivate(),
                                        RegistryProtocol.operatorActionReceipt(unsigned)));
                if (structuredClaim || tokenDerivedClaim) {
                    lastClaimRequest.set(request);
                    lastClaimReceipt.set(signed);
                    lastClaimLegalName.set(structuredClaim
                            ? request.legalName()
                            : "Token Source Cooperative");
                    approvedClaimStatus = false;
                    rejectedClaimStatus = false;
                    withdrawnClaimStatus = false;
                } else if (Set.of(
                                RegistryProtocol
                                        .OPERATOR_ACTION_WITHDRAW_CLAIM,
                                RegistryProtocol
                                        .OPERATOR_ACTION_DEACTIVATE_DEPLOYMENT)
                        .contains(request.action())) {
                    withdrawnClaimStatus = true;
                }
                boolean loseResponse = loseFirstClaimResponse && structuredClaim
                        || request.action().equals(loseFirstResponseForAction);
                if (loseFirstClaimResponse && structuredClaim) {
                    loseFirstClaimResponse = false;
                }
                if (request.action().equals(loseFirstResponseForAction)) {
                    loseFirstResponseForAction = null;
                }
                acceptedActions.put(
                        request.idempotencyKey(),
                        new AcceptedAction(
                                request.action(),
                                request.payloadHash(),
                                signed,
                                loseResponse));
                if (loseResponse) {
                    firstLostActionIdempotency.set(request.idempotencyKey());
                    exchange.close();
                    return;
                }
                sendJson(exchange, 201, new OperatorActionResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        SCOPE,
                        false,
                        signed));
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private void handleClaimStatus(HttpExchange exchange) throws IOException {
            try {
                claimStatusRequests.incrementAndGet();
                require(
                        "GET".equals(exchange.getRequestMethod()),
                        "Claim status method was not GET.");
                require(
                        exchange.getRequestURI().getPath().equals(
                                RegistryProtocol.OPERATOR_CLAIM_STATUS_PATH_PREFIX
                                        + DEPLOYMENT_ID),
                        "Claim status deployment path was invalid.");
                if (unsupportedClaimStatusEndpoint) {
                    sendJson(exchange, 404, Map.of(
                            "error",
                            Map.of(
                                    "code", "not_found",
                                    "message", "endpoint not found")));
                    return;
                }
                if (failClaimStatusOnce) {
                    failClaimStatusOnce = false;
                    sendJson(exchange, 503, Map.of(
                            "error",
                            Map.of(
                                    "code", "registry_unavailable",
                                    "message", "Simulated post-apply status failure.")));
                    return;
                }
                OperatorActionRequest request = lastClaimRequest.get();
                OperatorActionReceipt claimReceipt = lastClaimReceipt.get();
                String claimLegalName = lastClaimLegalName.get();
                if (request == null
                        || claimReceipt == null
                        || claimLegalName == null) {
                    sendJson(exchange, 404, Map.of(
                            "error",
                            Map.of(
                                    "code", "operator_claim_not_found",
                                    "message", "No structured claim.")));
                    return;
                }
                String verificationStatus = withdrawnClaimStatus
                        ? RegistryProtocol.OPERATOR_VERIFICATION_STATUS_WITHDRAWN
                        : approvedClaimStatus
                                ? RegistryProtocol.OPERATOR_VERIFICATION_STATUS_APPROVED
                                : rejectedClaimStatus
                                        ? RegistryProtocol
                                                .OPERATOR_VERIFICATION_STATUS_REJECTED
                                        : RegistryProtocol
                                                .OPERATOR_VERIFICATION_STATUS_PENDING_REVIEW;
                boolean hasReview =
                        approvedClaimStatus || rejectedClaimStatus;
                OperatorClaimStatusReceipt unsigned = new OperatorClaimStatusReceipt(
                        DEPLOYMENT_ID,
                        claimReceipt.actionId(),
                        claimReceipt.auditIndex(),
                        claimReceipt.auditHash(),
                        claimReceipt.groupId(),
                        claimLegalName,
                        verificationStatus,
                        claimReceipt.acceptedAt(),
                        hasReview
                                ? "opr_0123456789abcdef0123456789abcdef"
                                : null,
                        hasReview ? 1L : null,
                        hasReview
                                ? "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
                                : RegistryProtocol.ZERO_HASH,
                        approvedClaimStatus
                                ? "2026-07-28T00:00:04Z"
                                : null,
                        SCOPE,
                        registryKeyId,
                        null);
                String signature = RegistryTestIdentity.sign(
                        registryKeyPair.getPrivate(),
                        RegistryProtocol.operatorClaimStatusReceipt(unsigned));
                if (tamperClaimStatus) {
                    byte[] decoded = Base64.getDecoder().decode(signature);
                    decoded[0] ^= 0x01;
                    signature = Base64.getEncoder().encodeToString(decoded);
                }
                OperatorClaimStatusReceipt signed = new OperatorClaimStatusReceipt(
                        unsigned.deploymentId(),
                        unsigned.claimActionId(),
                        unsigned.claimAuditIndex(),
                        unsigned.claimAuditHash(),
                        unsigned.groupId(),
                        unsigned.legalName(),
                        unsigned.verificationStatus(),
                        unsigned.submittedAt(),
                        unsigned.reviewId(),
                        unsigned.reviewIndex(),
                        unsigned.reviewHash(),
                        unsigned.approvedAt(),
                        unsigned.registryScope(),
                        unsigned.registryKeyId(),
                        signature);
                sendJson(exchange, 200, new OperatorClaimStatusResponse(
                        RegistryProtocol.PROTOCOL_VERSION,
                        SCOPE,
                        signed));
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private void handleLeaderboard(HttpExchange exchange) throws IOException {
            try {
                leaderboardRequests.incrementAndGet();
                require("GET".equals(exchange.getRequestMethod()), "Leaderboard method was not GET.");
                if (failLeaderboard) {
                    sendJson(exchange, 503, Map.of(
                            "error",
                            Map.of(
                                    "code", "registry_unavailable",
                                    "message", "Simulated leaderboard outage.")));
                    return;
                }
                LeaderboardPage page = new LeaderboardPage(
                        snapshot,
                        "claimed",
                        List.of(new LeaderboardRow(
                                GROUP_ID,
                                "claimed",
                                GROUP_ID,
                                "Operator",
                                null,
                                rejectedClaimStatus
                                        ? RegistryProtocol
                                                .OPERATOR_CLAIM_STATE_REJECTED
                                        : "claimed",
                                2L,
                                "12345",
                                "2",
                                rejectedClaimStatus ? "0" : "7",
                                rejectedClaimStatus ? "1" : "20")),
                        cursor);
                sendJson(exchange, 200, page);
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private void handleAnnouncements(HttpExchange exchange) throws IOException {
            try {
                announcementRequests.incrementAndGet();
                require(
                        "GET".equals(exchange.getRequestMethod()),
                        "Announcement method was not GET.");
                String query = exchange.getRequestURI().getRawQuery();
                require(query != null && query.contains("kind=UPDATE"),
                        "Announcement kind was not forwarded.");
                require(query.contains("severity=NOTICE"),
                        "Announcement severity was not forwarded.");
                require(query.contains("channel=stable"),
                        "Announcement channel was not forwarded.");
                require(!query.contains("include_expired="),
                        "False announcement expiry filter must use the registry default.");
                sendJson(exchange, 200, new AnnouncementPage(
                        announcementSnapshot,
                        List.of(announcement),
                        null));
            } catch (Throwable failure) {
                failExchange(exchange, failure);
            }
        }

        private AnnouncementEntry signedUpdateAnnouncement() {
            List<AnnouncementLocalization> localizations = List.of(
                    new AnnouncementLocalization(
                            "en",
                            "MyScoutee 1.2.3 is available",
                            "Review the release notes and start the verified update when ready."));
            List<AnnouncementLink> links = List.of(
                    new AnnouncementLink(
                            "release-notes",
                            "https://downloads.example.test/releases/1.2.3"));
            String artifactHash =
                    "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
            UpdateManifest unsignedManifest = new UpdateManifest(
                    RegistryProtocol.UPDATE_MANIFEST_VERSION,
                    "1.2.3",
                    "stable",
                    "2026-07-28T00:00:04Z",
                    "1.0.0",
                    "2.0.0",
                    "https://downloads.example.test/myscoutee_1.2.3_amd64.deb",
                    123L,
                    artifactHash,
                    RegistryProtocol.packageSigningKeyId(
                            packageSigningKeyPair.getPublic().getEncoded()),
                    "",
                    "https://downloads.example.test/releases/1.2.3",
                    true,
                    90L,
                    "AVAILABLE",
                    null,
                    null,
                    null);
            UpdateManifest manifest = new UpdateManifest(
                    unsignedManifest.manifestVersion(),
                    unsignedManifest.releaseVersion(),
                    unsignedManifest.channel(),
                    unsignedManifest.publishedAt(),
                    unsignedManifest.minimumCompatibleVersion(),
                    unsignedManifest.maximumCompatibleVersion(),
                    unsignedManifest.artifactUrl(),
                    unsignedManifest.artifactSizeBytes(),
                    unsignedManifest.artifactSha256(),
                    unsignedManifest.packageSigningKeyId(),
                    RegistryTestIdentity.sign(
                            packageSigningKeyPair.getPrivate(),
                            RegistryProtocol.releasePackage(unsignedManifest)),
                    unsignedManifest.releaseNotesUrl(),
                    unsignedManifest.backupRequired(),
                    unsignedManifest.expectedDowntimeSeconds(),
                    unsignedManifest.status(),
                    unsignedManifest.supersedesVersion(),
                    unsignedManifest.supersededByVersion(),
                    unsignedManifest.revocationReason());
            String contentHash = RegistryProtocol.sha256(
                    RegistryProtocol.announcementContent("", "", localizations));
            String linksHash = RegistryProtocol.sha256(
                    RegistryProtocol.announcementLinks(links));
            String manifestHash = RegistryProtocol.sha256(
                    RegistryProtocol.updateManifest(manifest));
            AnnouncementEntry unsigned = new AnnouncementEntry(
                    RegistryProtocol.PROTOCOL_VERSION,
                    SCOPE,
                    1L,
                    "ann_0123456789abcdef0123456789abcdef",
                    "publish_update_12345678",
                    "UPDATE",
                    "NOTICE",
                    manifest.publishedAt(),
                    null,
                    null,
                    null,
                    localizations,
                    links,
                    manifest,
                    contentHash,
                    linksHash,
                    manifestHash,
                    RegistryProtocol.ZERO_HASH,
                    null,
                    "2026-07-28T00:00:05Z",
                    registryKeyId,
                    null);
            String announcementHash = RegistryProtocol.sha256(
                    RegistryProtocol.announcementEntry(unsigned));
            AnnouncementEntry hashed = new AnnouncementEntry(
                    unsigned.protocolVersion(),
                    unsigned.registryScope(),
                    unsigned.sequence(),
                    unsigned.announcementId(),
                    unsigned.publicationId(),
                    unsigned.kind(),
                    unsigned.severity(),
                    unsigned.publishedAt(),
                    unsigned.expiresAt(),
                    unsigned.titleKey(),
                    unsigned.bodyKey(),
                    unsigned.localizations(),
                    unsigned.links(),
                    unsigned.updateManifest(),
                    unsigned.contentHash(),
                    unsigned.linksHash(),
                    unsigned.updateManifestHash(),
                    unsigned.previousAnnouncementHash(),
                    announcementHash,
                    unsigned.acceptedAt(),
                    unsigned.registryKeyId(),
                    null);
            return new AnnouncementEntry(
                    hashed.protocolVersion(),
                    hashed.registryScope(),
                    hashed.sequence(),
                    hashed.announcementId(),
                    hashed.publicationId(),
                    hashed.kind(),
                    hashed.severity(),
                    hashed.publishedAt(),
                    hashed.expiresAt(),
                    hashed.titleKey(),
                    hashed.bodyKey(),
                    hashed.localizations(),
                    hashed.links(),
                    hashed.updateManifest(),
                    hashed.contentHash(),
                    hashed.linksHash(),
                    hashed.updateManifestHash(),
                    hashed.previousAnnouncementHash(),
                    hashed.announcementHash(),
                    hashed.acceptedAt(),
                    hashed.registryKeyId(),
                    RegistryTestIdentity.sign(
                            registryKeyPair.getPrivate(),
                            RegistryProtocol.announcementReceipt(hashed)));
        }

        private AnnouncementSnapshot signedAnnouncementSnapshot(
                AnnouncementEntry entry) {
            AnnouncementSnapshot unsigned = new AnnouncementSnapshot(
                    "annsnap_0123456789abcdef0123456789abcdef",
                    "2026-07-28T00:00:06Z",
                    entry.sequence(),
                    entry.announcementHash(),
                    "UPDATE",
                    "NOTICE",
                    "stable",
                    false,
                    "2026-07-28T00:00:06Z",
                    null,
                    SCOPE,
                    registryKeyId,
                    null);
            String snapshotHash = RegistryProtocol.sha256(
                    RegistryProtocol.announcementSnapshotHash(unsigned));
            AnnouncementSnapshot hashed = new AnnouncementSnapshot(
                    unsigned.snapshotId(),
                    unsigned.asOf(),
                    unsigned.throughSequence(),
                    unsigned.announcementHeadHash(),
                    unsigned.kind(),
                    unsigned.severity(),
                    unsigned.channel(),
                    unsigned.includeExpired(),
                    unsigned.createdAt(),
                    snapshotHash,
                    unsigned.registryScope(),
                    unsigned.registryKeyId(),
                    null);
            return new AnnouncementSnapshot(
                    hashed.snapshotId(),
                    hashed.asOf(),
                    hashed.throughSequence(),
                    hashed.announcementHeadHash(),
                    hashed.kind(),
                    hashed.severity(),
                    hashed.channel(),
                    hashed.includeExpired(),
                    hashed.createdAt(),
                    hashed.snapshotHash(),
                    hashed.registryScope(),
                    hashed.registryKeyId(),
                    RegistryTestIdentity.sign(
                            registryKeyPair.getPrivate(),
                            RegistryProtocol.announcementSnapshotReceipt(hashed)));
        }

        private String signedCursor() {
            Map<String, Object> fields = new LinkedHashMap<>();
            fields.put("version", 1);
            fields.put("kind", "rows");
            fields.put("view", "claimed");
            fields.put("snapshot_id", snapshot.snapshotId());
            fields.put("from_period", "2026-01");
            fields.put("through_period", snapshot.throughPeriod());
            fields.put("through_ledger_index", snapshot.throughLedgerIndex());
            fields.put("through_audit_index", snapshot.throughAuditIndex());
            fields.put("ledger_head_hash", snapshot.ledgerHeadHash());
            fields.put("audit_head_hash", snapshot.auditHeadHash());
            fields.put("created_at", snapshot.createdAt());
            fields.put("after_weight", 12345);
            fields.put("after_id", GROUP_ID);
            byte[] payload = objectMapper.writeValueAsBytes(fields);
            byte[] signature = Base64.getDecoder().decode(RegistryTestIdentity.sign(
                    registryKeyPair.getPrivate(),
                    RegistryProtocol.leaderboardCursor(payload)));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(payload)
                    + "."
                    + Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        }

        private void sendJson(HttpExchange exchange, int status, Object body) throws IOException {
            byte[] response = objectMapper.writeValueAsBytes(body);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        }

        private void failExchange(HttpExchange exchange, Throwable failure) throws IOException {
            handlerFailure.compareAndSet(null, failure);
            byte[] response = ("{\"error\":{\"code\":\"test_failure\",\"message\":\""
                    + failure.getClass().getSimpleName()
                    + "\"}}").getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(500, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        }

        private void assertHealthy() {
            assertThat(handlerFailure.get()).isNull();
        }

        private record AcceptedAction(
                String action,
                String payloadHash,
                OperatorActionReceipt receipt,
                boolean responseLost) {
        }

        private static void require(boolean condition, String message) {
            if (!condition) {
                throw new AssertionError(message);
            }
        }

        @Override
        public void close() {
            server.stop(0);
        }
    }
}
