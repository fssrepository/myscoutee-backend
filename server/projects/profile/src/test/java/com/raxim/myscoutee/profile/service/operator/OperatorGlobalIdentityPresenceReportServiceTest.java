package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.security.SecureRandom;
import java.time.Clock;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem.SignedAttempt;
import com.raxim.myscoutee.profile.repository.GlobalIdentityLinkStateRepository;
import com.raxim.myscoutee.profile.repository.GlobalIdentityPresenceOutboxRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauReportOutboxRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.registry.RegistryProtocol;

import tools.jackson.databind.ObjectMapper;

class OperatorGlobalIdentityPresenceReportServiceTest {

    @Test
    void missingRegistryLeavesGlobalIdentityFlowDormant() {
        OperatorRevenueRegistryRuntimeResolver runtimeResolver = mock(
                OperatorRevenueRegistryRuntimeResolver.class);
        OperatorGlobalIdentityService globalIdentityService = mock(
                OperatorGlobalIdentityService.class);
        OperatorQualifiedMauCalculator calculator = mock(
                OperatorQualifiedMauCalculator.class);
        OperatorQualifiedMauReportService qmauReportService = mock(
                OperatorQualifiedMauReportService.class);
        QualifiedMauReportOutboxRepository qmauRepository = mock(
                QualifiedMauReportOutboxRepository.class);
        GlobalIdentityLinkStateRepository linkRepository = mock(
                GlobalIdentityLinkStateRepository.class);
        GlobalIdentityPresenceOutboxRepository outboxRepository = mock(
                GlobalIdentityPresenceOutboxRepository.class);
        when(runtimeResolver.resolveGlobalIdentity(MongoSessionMode.REAL))
                .thenReturn(Resolution.dormant(
                        "REGISTRY_NOT_CONFIGURED",
                        "Registry is not configured."));

        OperatorGlobalIdentityPresenceReportService service =
                new OperatorGlobalIdentityPresenceReportService(
                        runtimeResolver,
                        globalIdentityService,
                        calculator,
                        qmauReportService,
                        qmauRepository,
                        linkRepository,
                        outboxRepository,
                        mock(ObjectMapper.class),
                        Clock.systemUTC(),
                        new SecureRandom());

        service.synchronizeNow();

        verifyNoInteractions(
                globalIdentityService,
                calculator,
                qmauReportService,
                qmauRepository,
                linkRepository,
                outboxRepository);
    }

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
    void registryPresenceCannotSilentlyOmitAQualifiedUser() {
        assertThatThrownBy(() ->
                OperatorGlobalIdentityPresenceReportService
                        .requireEveryQualifiedUserPrepared(
                                List.of("user-1", "user-2"),
                                List.of("commitment-1")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("every qualified user");
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
