package com.raxim.myscoutee.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.junit.jupiter.api.Test;

class RegistryProtocolTest {
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
}
