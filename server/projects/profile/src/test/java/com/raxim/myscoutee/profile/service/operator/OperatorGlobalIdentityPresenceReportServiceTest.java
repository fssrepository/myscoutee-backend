package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem.SignedAttempt;
import com.raxim.myscoutee.registry.RegistryProtocol;

class OperatorGlobalIdentityPresenceReportServiceTest {

    @Test
    void exactPresenceCapacityFitsTheMaximumServerChunkCount() {
        assertThat(OperatorGlobalIdentityPresenceReportService
                .requiredChunkCount(
                        OperatorGlobalIdentityPresenceReportService
                                .MAX_COMMITMENTS_PER_SUBMISSION))
                .isEqualTo(OperatorGlobalIdentityPresenceReportService
                        .SERVER_MAX_CHUNKS_PER_SUBMISSION);
    }

    @Test
    void oneCommitmentBeyondPresenceCapacityFailsWithoutMaterializingRows() {
        long commitmentCount =
                OperatorGlobalIdentityPresenceReportService
                        .MAX_COMMITMENTS_PER_SUBMISSION + 1L;

        assertThatThrownBy(() ->
                OperatorGlobalIdentityPresenceReportService
                        .requiredChunkCount(commitmentCount))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(Long.toString(commitmentCount))
                .hasMessageContaining(Long.toString(
                        OperatorGlobalIdentityPresenceReportService
                                .MAX_COMMITMENTS_PER_SUBMISSION))
                .hasMessageContaining(
                        OperatorGlobalIdentityPresenceReportService
                                .SERVER_MAX_CHUNKS_PER_SUBMISSION
                                + " chunks");
    }

    @Test
    void retryHistoryRetainsEverySignedRequestThatMayOwnTheReceipt() {
        GlobalIdentityPresenceOutboxItem item =
                new GlobalIdentityPresenceOutboxItem();
        item.setRegistryScope("registry:test");
        item.setDeploymentId("dep_12345678");
        item.setIdempotencyKey("presence_12345678");
        item.setPayloadHash(RegistryProtocol.sha256(
                "payload".getBytes(java.nio.charset.StandardCharsets.UTF_8)));

        String firstRequestHash = RegistryProtocol.sha256(
                "first".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        item.setSignedRequestHashes(List.of(firstRequestHash));
        item.setLastAttempt(new SignedAttempt(
                "2026-07-29T00:00:00Z",
                "nonce_12345678",
                "signature"));

        String legacyLastAttemptHash = RegistryProtocol.sha256(
                RegistryProtocol.signedRequest(
                        "POST",
                        RegistryProtocol.GLOBAL_IDENTITY_PRESENCE_BATCH_PATH,
                        RegistryProtocol.PROTOCOL_VERSION,
                        item.getRegistryScope(),
                        item.getDeploymentId(),
                        item.getLastAttempt().getTimestamp(),
                        item.getLastAttempt().getNonce(),
                        item.getIdempotencyKey(),
                        item.getPayloadHash()));
        assertThat(OperatorGlobalIdentityPresenceReportService
                .signedRequestHashes(item))
                .containsExactlyInAnyOrder(
                        firstRequestHash,
                        legacyLastAttemptHash);

        String retryRequestHash = RegistryProtocol.sha256(
                "retry".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        OperatorGlobalIdentityPresenceReportService
                .rememberSignedRequestHash(item, retryRequestHash);

        assertThat(Set.copyOf(item.getSignedRequestHashes()))
                .containsExactlyInAnyOrder(
                        firstRequestHash,
                        legacyLastAttemptHash,
                        retryRequestHash);
    }
}
