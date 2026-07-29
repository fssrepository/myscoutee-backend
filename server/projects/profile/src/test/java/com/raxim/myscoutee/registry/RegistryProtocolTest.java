package com.raxim.myscoutee.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import org.junit.jupiter.api.Test;

class RegistryProtocolTest {
    @Test
    void revenuePayloadMatchesTheGoProtocolExactly() {
        List<RegistryProtocol.RevenueCurrencyRow> currencies = List.of(
                new RegistryProtocol.RevenueCurrencyRow(
                        "EUR",
                        2,
                        12_345L,
                        345L,
                        12_000L,
                        12_000L,
                        600L,
                        3L),
                new RegistryProtocol.RevenueCurrencyRow(
                        "JPY",
                        0,
                        20_000L,
                        0L,
                        20_000L,
                        20_000L,
                        1_000L,
                        2L));

        assertThat(new String(
                        RegistryProtocol.revenueBatchPayload(
                                RegistryProtocol.REVENUE_KIND,
                                "2026-07-27",
                                1L,
                                "",
                                RegistryProtocol.REVENUE_RULESET_VERSION,
                                RegistryProtocol
                                        .REVENUE_COMMISSION_RATE_BASIS_POINTS,
                                currencies),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-revenue-batch-payload-v1
                        daily-revenue
                        2026-07-27
                        1

                        net-captured-revenue-v1
                        500
                        2
                        EUR
                        2
                        12345
                        345
                        12000
                        12000
                        600
                        3
                        JPY
                        0
                        20000
                        0
                        20000
                        20000
                        1000
                        2
                        """);
    }

    @Test
    void revenueReceiptMatchesTheGoProtocolExactly() {
        String hash =
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        RegistryProtocol.RevenueReceipt receipt =
                new RegistryProtocol.RevenueReceipt(
                        "test-program:parent-a",
                        9L,
                        hash,
                        RegistryProtocol.ZERO_HASH,
                        hash,
                        RegistryProtocol.REVENUE_KIND,
                        "2026-07-27",
                        1L,
                        "",
                        RegistryProtocol.REVENUE_RULESET_VERSION,
                        500,
                        0,
                        "2026-07-28T00:00:01Z",
                        "2026-07-28",
                        "rkey_0123456789abcdef0123456789abcdef",
                        "registry-public-key",
                        "signature");
        RegistryProtocol.RevenueBatchResponse response =
                new RegistryProtocol.RevenueBatchResponse(
                        "1",
                        "test-program:parent-a",
                        "revbatch_0123456789abcdef0123456789abcdef",
                        "dep_0123456789abcdef0123456789abcdef",
                        "revenue_0123456789abcdef",
                        false,
                        receipt);

        assertThat(new String(
                        RegistryProtocol.revenueReceipt(response),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-revenue-receipt-v1
                        1
                        test-program:parent-a
                        revbatch_0123456789abcdef0123456789abcdef
                        dep_0123456789abcdef0123456789abcdef
                        9
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        daily-revenue
                        2026-07-27
                        1

                        net-captured-revenue-v1
                        500
                        0
                        2026-07-28T00:00:01Z
                        2026-07-28
                        rkey_0123456789abcdef0123456789abcdef
                        """);
    }

    @Test
    void revenueV1UsesPinnedCurrencyExponentsAndAggregateLimits() {
        assertThat(RegistryProtocol.revenueCurrencyFractionDigits("JPY"))
                .isZero();
        assertThat(RegistryProtocol.revenueCurrencyFractionDigits("HUF"))
                .isEqualTo(2);
        assertThat(RegistryProtocol.revenueCurrencyFractionDigits("BHD"))
                .isEqualTo(3);
        assertThat(RegistryProtocol.revenueCurrencyFractionDigits("CLF"))
                .isEqualTo(4);
        assertThatThrownBy(() ->
                        RegistryProtocol.requireRevenueCurrencyCode("XXX"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() ->
                        RegistryProtocol.revenueBatchPayload(
                                RegistryProtocol.REVENUE_KIND,
                                "2026-07-27",
                                1L,
                                "",
                                RegistryProtocol.REVENUE_RULESET_VERSION,
                                500,
                                List.of(new RegistryProtocol.RevenueCurrencyRow(
                                        "JPY",
                                        2,
                                        1L,
                                        0L,
                                        1L,
                                        1L,
                                        0L,
                                        1L))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("pinned");
        assertThatThrownBy(() ->
                        RegistryProtocol.revenueBatchPayload(
                                RegistryProtocol.REVENUE_KIND,
                                "2026-07-27",
                                1L,
                                "",
                                RegistryProtocol.REVENUE_RULESET_VERSION,
                                500,
                                List.of(new RegistryProtocol.RevenueCurrencyRow(
                                        "EUR",
                                        2,
                                        RegistryProtocol.REVENUE_MAX_MINOR + 1L,
                                        0L,
                                        RegistryProtocol.REVENUE_MAX_MINOR + 1L,
                                        RegistryProtocol.REVENUE_MAX_MINOR + 1L,
                                        0L,
                                        1L))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("limit");
        assertThat(new String(
                        RegistryProtocol.revenueBatchPayload(
                                RegistryProtocol.REVENUE_KIND,
                                "2026-07-27",
                                1L,
                                "",
                                RegistryProtocol.REVENUE_RULESET_VERSION,
                                500,
                                List.of()),
                        StandardCharsets.UTF_8))
                .endsWith("500\n0\n");
    }

    @Test
    void canonicalRegistryIdentityMatchesTheGoProtocol() {
        RegistryProtocol.RegistryIdentityResponse identity =
                new RegistryProtocol.RegistryIdentityResponse(
                        "1",
                        "test-program:parent-a",
                        "rkey_0123456789abcdef0123456789abcdef",
                        "MCowBQYDK2VwAyEA//////////////////////////////////////////8=",
                        "signature");

        assertThat(new String(
                        RegistryProtocol.registryIdentity(identity),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-identity-v1
                        1
                        test-program:parent-a
                        rkey_0123456789abcdef0123456789abcdef
                        MCowBQYDK2VwAyEA//////////////////////////////////////////8=
                        """);
    }

    @Test
    void canonicalRequestUsesTheProtocolFieldOrderLfSeparatorsAndFinalLf() {
        byte[] canonical = RegistryProtocol.signedRequest(
                "post",
                "/v1/mau/batches",
                "1",
                "test-program:parent-a",
                "dep_0123456789abcdef",
                "2026-07-28T00:00:02Z",
                "nonce_0123456789",
                "installation_0123456789",
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        assertThat(new String(canonical, StandardCharsets.UTF_8)).isEqualTo("""
                myscoutee-registry-request-v1
                POST
                /v1/mau/batches
                1
                test-program:parent-a
                dep_0123456789abcdef
                2026-07-28T00:00:02Z
                nonce_0123456789
                installation_0123456789
                sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                """);
    }

    @Test
    void canonicalCodecRejectsLineInjectionAndNonCanonicalBase64() {
        assertThatThrownBy(() -> RegistryProtocol.canonical("safe", "line\ninjection"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CR or LF");

        byte[] bytes = "ed25519".getBytes(StandardCharsets.US_ASCII);
        String padded = Base64.getEncoder().encodeToString(bytes);
        assertThat(RegistryProtocol.decodeStandardBase64(padded, "value")).isEqualTo(bytes);
        assertThatThrownBy(() -> RegistryProtocol.decodeStandardBase64(
                Base64.getUrlEncoder().withoutPadding().encodeToString(bytes),
                "value"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void installationPayloadDoesNotEncodeAnyProposedRealMauRule() {
        String commitment = RegistryProtocol.sha256(RegistryProtocol.installationCommitment(
                "dep_0123456789abcdef",
                "installation_0123456789"));
        String payload = new String(RegistryProtocol.mauBatchPayload(
                RegistryProtocol.INSTALLATION_KIND,
                "2026-07",
                RegistryProtocol.INSTALLATION_RULESET,
                RegistryProtocol.INSTALLATION_MAU_COUNT,
                commitment), StandardCharsets.UTF_8);

        assertThat(payload).isEqualTo("""
                myscoutee-registry-mau-batch-payload-v1
                installation-test
                2026-07
                installation-test-v1
                0
                %s
                """.formatted(commitment));
    }

    @Test
    void qualifiedMauRevisionPayloadMatchesTheGoProtocolExactly() {
        String commitment =
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

        assertThat(new String(
                        RegistryProtocol.qmauBatchPayload(
                                RegistryProtocol.QMAU_KIND,
                                "2026-06",
                                RegistryProtocol.QMAU_RULESET_VERSION,
                                42L,
                                commitment,
                                2L,
                                "batch_0123456789abcdef0123456789abcdef"),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-qmau-batch-payload-v1
                        monthly-qmau
                        2026-06
                        qmau-v1
                        42
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        2
                        batch_0123456789abcdef0123456789abcdef
                        """);
    }

    @Test
    void qualifiedMauReceiptMatchesTheGoProtocolExactly() {
        RegistryProtocol.MauReceipt receipt =
                new RegistryProtocol.MauReceipt(
                        9L,
                        "sha256:" + "b".repeat(64),
                        RegistryProtocol.ZERO_HASH,
                        "sha256:" + "c".repeat(64),
                        RegistryProtocol.QMAU_KIND,
                        "2026-06",
                        RegistryProtocol.QMAU_RULESET_VERSION,
                        42L,
                        "sha256:" + "a".repeat(64),
                        2L,
                        "batch_0123456789abcdef0123456789abcdef",
                        "2026-07-01T00:00:03Z",
                        "2026-07-01",
                        "test-program:parent-a",
                        "rkey_0123456789abcdef0123456789abcdef",
                        "registry-public-key",
                        "receipt-signature");
        RegistryProtocol.BatchResponse response =
                new RegistryProtocol.BatchResponse(
                        "1",
                        "test-program:parent-a",
                        "batch_fedcba9876543210fedcba9876543210",
                        "dep_0123456789abcdef0123456789abcdef",
                        "qmau_0123456789",
                        false,
                        receipt);

        assertThat(new String(
                        RegistryProtocol.qmauReceipt(response),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-qmau-receipt-v1
                        1
                        test-program:parent-a
                        batch_fedcba9876543210fedcba9876543210
                        dep_0123456789abcdef0123456789abcdef
                        9
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
                        monthly-qmau
                        2026-06
                        qmau-v1
                        42
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        2
                        batch_0123456789abcdef0123456789abcdef
                        2026-07-01T00:00:03Z
                        2026-07-01
                        rkey_0123456789abcdef0123456789abcdef
                        """);
    }

    @Test
    void structuredOperatorClaimPayloadMatchesTheGoProtocolExactly() {
        assertThat(new String(
                        RegistryProtocol.operatorClaimPayload(
                                "Example Cooperative",
                                "REG-42",
                                "Slovakia",
                                "Main Street 1",
                                "https://example.test",
                                "Alex Reviewer",
                                "Director",
                                "alex@example.test",
                                true,
                                "https://example.test/avatar.png"),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-claim-payload-v2
                        claim
                        Example Cooperative
                        REG-42
                        Slovakia
                        Main Street 1
                        https://example.test
                        Alex Reviewer
                        Director
                        alex@example.test
                        true
                        https://example.test/avatar.png
                        """);
    }

    @Test
    void legacyOperatorActionMessagesRemainExactlyV1WithoutSourceAnchors() {
        RegistryProtocol.OperatorActionReceipt receipt =
                operatorReceipt(null, null);
        String payloadHash =
                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";

        assertThat(new String(
                        RegistryProtocol.operatorActionReceipt(receipt),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-action-receipt-v1
                        7
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        opa_11111111111111111111111111111111
                        dep_0123456789abcdef0123456789abcdef
                        dep_0123456789abcdef0123456789abcdef
                        dep_fedcba9876543210fedcba9876543210
                        redeem-client-token
                        2026-07-28T00:00:03Z
                        pending-review
                        opg_0123456789abcdef0123456789abcdef

                        opt_0123456789abcdef0123456789abcdef
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

                        test-program:parent-b
                        rkey_0123456789abcdef0123456789abcdef
                        """);
        assertThat(new String(
                        RegistryProtocol.operatorAudit(receipt, payloadHash),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-audit-v1
                        7
                        opa_11111111111111111111111111111111
                        dep_0123456789abcdef0123456789abcdef
                        dep_0123456789abcdef0123456789abcdef
                        dep_fedcba9876543210fedcba9876543210
                        redeem-client-token
                        sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        2026-07-28T00:00:03Z
                        pending-review
                        opg_0123456789abcdef0123456789abcdef

                        opt_0123456789abcdef0123456789abcdef
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        """);
    }

    @Test
    void tokenDerivedClaimMessagesMatchTheGoV2SourceAnchorOrder() {
        RegistryProtocol.OperatorActionReceipt receipt =
                operatorReceipt(
                        "opa_22222222222222222222222222222222",
                        "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
        String payloadHash =
                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";

        assertThat(new String(
                        RegistryProtocol.operatorActionReceipt(receipt),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-action-receipt-v2
                        7
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        opa_11111111111111111111111111111111
                        dep_0123456789abcdef0123456789abcdef
                        dep_0123456789abcdef0123456789abcdef
                        dep_fedcba9876543210fedcba9876543210
                        redeem-client-token
                        2026-07-28T00:00:03Z
                        pending-review
                        opg_0123456789abcdef0123456789abcdef

                        opt_0123456789abcdef0123456789abcdef
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        opa_22222222222222222222222222222222
                        sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

                        test-program:parent-b
                        rkey_0123456789abcdef0123456789abcdef
                        """);
        assertThat(new String(
                        RegistryProtocol.operatorAudit(receipt, payloadHash),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-audit-v2
                        7
                        opa_11111111111111111111111111111111
                        dep_0123456789abcdef0123456789abcdef
                        dep_0123456789abcdef0123456789abcdef
                        dep_fedcba9876543210fedcba9876543210
                        redeem-client-token
                        sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        2026-07-28T00:00:03Z
                        pending-review
                        opg_0123456789abcdef0123456789abcdef

                        opt_0123456789abcdef0123456789abcdef
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        opa_22222222222222222222222222222222
                        sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        """);
    }

    @Test
    void partialSourceAnchorSelectsV2ForDeterministicRejectionByVerifier() {
        RegistryProtocol.OperatorActionReceipt receipt =
                operatorReceipt(
                        "opa_22222222222222222222222222222222",
                        null);

        assertThat(new String(
                        RegistryProtocol.operatorActionReceipt(receipt),
                        StandardCharsets.UTF_8))
                .startsWith(
                        "myscoutee-registry-operator-action-receipt-v2\n");
        assertThat(new String(
                        RegistryProtocol.operatorAudit(
                                receipt,
                                "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"),
                        StandardCharsets.UTF_8))
                .startsWith("myscoutee-registry-operator-audit-v2\n");
    }

    @Test
    void operatorClaimStatusReceiptMatchesTheGoProtocolExactly() {
        RegistryProtocol.OperatorClaimStatusReceipt status =
                new RegistryProtocol.OperatorClaimStatusReceipt(
                        "dep_0123456789abcdef0123456789abcdef",
                        "opa_0123456789abcdef0123456789abcdef",
                        7L,
                        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "opg_0123456789abcdef0123456789abcdef",
                        "Example Cooperative",
                        "PENDING_REVIEW",
                        "2026-07-28T00:00:03Z",
                        null,
                        null,
                        RegistryProtocol.ZERO_HASH,
                        null,
                        "test-program:parent-b",
                        "rkey_0123456789abcdef0123456789abcdef",
                        null);

        assertThat(new String(
                        RegistryProtocol.operatorClaimStatusReceipt(status),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-operator-claim-status-receipt-v1
                        dep_0123456789abcdef0123456789abcdef
                        opa_0123456789abcdef0123456789abcdef
                        7
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        opg_0123456789abcdef0123456789abcdef
                        Example Cooperative
                        PENDING_REVIEW
                        2026-07-28T00:00:03Z

                        0
                        sha256:0000000000000000000000000000000000000000000000000000000000000000

                        test-program:parent-b
                        rkey_0123456789abcdef0123456789abcdef
                        """);
    }

    @Test
    void centralMessagesBindTheScopeInTheGoProtocolFieldOrder() {
        String scope = "test-program:parent-b";
        String deploymentId = "dep_0123456789abcdef";
        String batchId = "batch_0123456789abcdef";
        String firstHash = "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        String secondHash = "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
        String registryKeyId = "rkey_0123456789abcdef0123456789abcdef";

        RegistryProtocol.RegistrationResponse registration = new RegistryProtocol.RegistrationResponse(
                "1",
                scope,
                deploymentId,
                "2026-07-28T00:00:01Z",
                firstHash,
                registryKeyId,
                "registry-public-key",
                "receipt-signature",
                false);
        assertThat(new String(
                        RegistryProtocol.registrationReceipt(registration),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-registration-receipt-v1
                        1
                        test-program:parent-b
                        dep_0123456789abcdef
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        2026-07-28T00:00:01Z
                        rkey_0123456789abcdef0123456789abcdef
                        """);

        assertThat(new String(
                        RegistryProtocol.ledgerEntry(
                                "1",
                                scope,
                                7L,
                                RegistryProtocol.INSTALLATION_ENTRY_TYPE,
                                deploymentId,
                                batchId,
                                RegistryProtocol.INSTALLATION_KIND,
                                "2026-07",
                                RegistryProtocol.INSTALLATION_RULESET,
                                0L,
                                firstHash,
                                RegistryProtocol.ZERO_HASH,
                                "2026-07-28T00:00:03Z"),
                        StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-ledger-entry-v1
                        1
                        test-program:parent-b
                        7
                        INSTALLATION_TEST_BATCH_ACCEPTED
                        dep_0123456789abcdef
                        batch_0123456789abcdef
                        installation-test
                        2026-07
                        installation-test-v1
                        0
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        2026-07-28T00:00:03Z
                        """);

        RegistryProtocol.MauReceipt receipt = new RegistryProtocol.MauReceipt(
                7L,
                secondHash,
                RegistryProtocol.ZERO_HASH,
                firstHash,
                RegistryProtocol.INSTALLATION_KIND,
                "2026-07",
                RegistryProtocol.INSTALLATION_RULESET,
                0L,
                "2026-07-28T00:00:03Z",
                "2026-07-28",
                scope,
                registryKeyId,
                "registry-public-key",
                "receipt-signature");
        RegistryProtocol.BatchResponse batch = new RegistryProtocol.BatchResponse(
                "1",
                scope,
                batchId,
                deploymentId,
                "installation_0123456789",
                false,
                receipt);
        assertThat(new String(RegistryProtocol.mauReceipt(batch), StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-mau-receipt-v1
                        1
                        test-program:parent-b
                        batch_0123456789abcdef
                        dep_0123456789abcdef
                        7
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        installation-test
                        2026-07
                        installation-test-v1
                        0
                        2026-07-28T00:00:03Z
                        2026-07-28
                        rkey_0123456789abcdef0123456789abcdef
                        """);

        RegistryProtocol.CheckpointResponse checkpoint = new RegistryProtocol.CheckpointResponse(
                scope,
                "2026-07-28",
                7L,
                7L,
                secondHash,
                RegistryProtocol.ZERO_HASH,
                firstHash,
                "2026-07-29T00:00:05Z",
                registryKeyId,
                "registry-public-key",
                "checkpoint-signature");
        assertThat(new String(RegistryProtocol.checkpoint(checkpoint), StandardCharsets.UTF_8))
                .isEqualTo("""
                        myscoutee-registry-checkpoint-v1
                        test-program:parent-b
                        2026-07-28
                        7
                        7
                        sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        sha256:0000000000000000000000000000000000000000000000000000000000000000
                        2026-07-29T00:00:05Z
                        rkey_0123456789abcdef0123456789abcdef
                        """);
    }

    @Test
    void registryScopeUsesTheSamePortableSyntaxAsTheGoRegistry() {
        assertThat(RegistryProtocol.requireRegistryScope("product:global")).isEqualTo("product:global");
        assertThatThrownBy(() -> RegistryProtocol.requireRegistryScope("MyScoutee:global"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("registry_scope");
        assertThatThrownBy(() -> RegistryProtocol.requireRegistryScope(":cn"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("registry_scope");
    }

    @Test
    void generatedIdsUseTheExactLowercaseHexShapeAcceptedByTheGoRegistry() {
        assertThat(RegistryProtocol.requireDeploymentId(
                        "dep_0123456789abcdef0123456789abcdef"))
                .isEqualTo("dep_0123456789abcdef0123456789abcdef");
        assertThat(RegistryProtocol.requireBatchId(
                        "batch_0123456789abcdef0123456789abcdef"))
                .isEqualTo("batch_0123456789abcdef0123456789abcdef");
        assertThatThrownBy(() -> RegistryProtocol.requireDeploymentId(
                        "dep_01234567_ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("malformed");
        assertThatThrownBy(() -> RegistryProtocol.requireBatchId(
                        "batch_0123456789ABCDEF0123456789ABCDEF"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("malformed");
    }

    private static RegistryProtocol.OperatorActionReceipt operatorReceipt(
            String sourceClaimActionId,
            String sourcePrivateRecordHash) {
        return new RegistryProtocol.OperatorActionReceipt(
                7L,
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                RegistryProtocol.ZERO_HASH,
                "opa_11111111111111111111111111111111",
                "dep_0123456789abcdef0123456789abcdef",
                "dep_0123456789abcdef0123456789abcdef",
                "dep_fedcba9876543210fedcba9876543210",
                RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                "2026-07-28T00:00:03Z",
                RegistryProtocol.OPERATOR_CLAIM_STATE_PENDING_REVIEW,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                "opt_0123456789abcdef0123456789abcdef",
                null,
                "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                sourceClaimActionId,
                sourcePrivateRecordHash,
                null,
                "test-program:parent-b",
                "rkey_0123456789abcdef0123456789abcdef",
                null);
    }
}
