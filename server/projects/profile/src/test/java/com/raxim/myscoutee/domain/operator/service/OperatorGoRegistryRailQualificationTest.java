package com.raxim.myscoutee.domain.operator.service;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assumptions.assumeTrue;
import static org.mockito.AdditionalAnswers.delegatesTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.withSettings;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.operator.document.QualifiedMauReportOutboxItem;
import com.raxim.myscoutee.domain.operator.document.RevenueReportOutboxItem;
import com.raxim.myscoutee.domain.operator.repository.MongoQualifiedMauEvidenceRepository;
import com.raxim.myscoutee.domain.operator.repository.QualifiedMauReportOutboxRepository;
import com.raxim.myscoutee.domain.operator.repository.RevenueReportOutboxRepository;
import com.raxim.myscoutee.domain.operator.service.OperatorQualifiedMauCalculator.QualifiedMauSnapshot;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.registry.RegistryCrypto;
import com.raxim.myscoutee.domain.registry.RegistryEnrollmentService;
import com.raxim.myscoutee.domain.registry.RegistryHttpClient;
import com.raxim.myscoutee.domain.registry.api.RegistryHttpException;
import com.raxim.myscoutee.domain.registry.RegistryLocalStore;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.RegistryNodeIdentityService;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionCommand;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimVerification;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RevenueBatchRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RevenueBatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RevenueCurrencyRow;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * Opt-in release qualification for the real Java-to-Go QMAU, revenue, and
 * private settlement-history rails.
 *
 * <p>The registry runner builds the Go command and supplies
 * {@code REGISTRY_E2E_BINARY}. This test then starts only that standalone
 * binary plus disposable embedded Mongo. It deliberately does not start the
 * application, Docker, Redis, the frontend, or any development stack.</p>
 */
@Tag("qualification")

@org.junit.jupiter.api.Tag("integration")
class OperatorGoRegistryRailQualificationTest {
    private static final String BINARY_VARIABLE = "REGISTRY_E2E_BINARY";
    private static final String SCOPE_VARIABLE = "REGISTRY_E2E_SCOPE";
    private static final String DEFAULT_SCOPE =
            "qualification:java-go-rails";
    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(10);

    @TempDir
    Path temporaryDirectory;

    private Clock qualificationClock;

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    @Timeout(value = 4, unit = TimeUnit.MINUTES)
    void qualifiesSignedQmauRevenueAndSettlementAcrossRestarts()
            throws Exception {
        String binaryValue = environment(BINARY_VARIABLE);
        assumeTrue(
                !binaryValue.isBlank(),
                "Set REGISTRY_E2E_BINARY via scripts/qualify-java-rails.sh.");
        Path binary = Path.of(binaryValue)
                .toAbsolutePath()
                .normalize();
        assertThat(binary)
                .as("REGISTRY_E2E_BINARY")
                .isRegularFile()
                .isExecutable();
        String registryScope = environment(SCOPE_VARIABLE);
        if (registryScope.isBlank()) {
            registryScope = DEFAULT_SCOPE;
        }
        RegistryProtocol.requireRegistryScope(registryScope);

        qualificationClock = Clock.fixed(
                Instant.now(),
                ZoneOffset.UTC);
        ObjectMapper objectMapper = new JsonConfig().objectMapper();
        try (GoRegistryProcess registry = new GoRegistryProcess(
                binary,
                registryScope,
                temporaryDirectory.resolve("go-registry"));
                EmbeddedOutboxStore outboxes =
                        EmbeddedOutboxStore.start()) {
            registry.start();
            RegisteredRuntime runtime = enroll(
                    registry.baseUrl(),
                    registryScope,
                    objectMapper);
            MongoSessionModeContext.set(MongoSessionMode.REAL);

            QmauRail qmau = qualifyQmau(
                    registry,
                    runtime,
                    objectMapper,
                    outboxes);
            RevenueRail revenue = qualifyRevenue(
                    registry,
                    runtime,
                    objectMapper,
                    outboxes);
            qualifySettlementQuery(
                    registry,
                    runtime,
                    objectMapper);

            assertInvalidDeploymentSignaturesRejected(
                    runtimeAt(runtime, registry.baseUrl()),
                    objectMapper);
            assertTamperedRegistryReceiptRejected(
                    registry,
                    runtime,
                    objectMapper,
                    qmau);

            assertThat(qmau.acceptedCorrection().getAcceptedResponse()
                    .receipt().revision()).isEqualTo(2L);
            assertThat(revenue.acceptedCorrection().getAcceptedResponse()
                    .receipt().revision()).isEqualTo(2L);
        }
    }

    private QmauRail qualifyQmau(
            GoRegistryProcess registry,
            RegisteredRuntime enrolledRuntime,
            ObjectMapper objectMapper,
            EmbeddedOutboxStore outboxes) throws Exception {
        Map<YearMonth, Long> adjustments = new ConcurrentHashMap<>();
        OperatorQualifiedMauCalculator calculator =
                mock(OperatorQualifiedMauCalculator.class);
        when(calculator.calculate(any(YearMonth.class)))
                .thenAnswer(invocation -> {
                    YearMonth period = invocation.getArgument(0);
                    return qmauSnapshot(
                            period,
                            adjustments.getOrDefault(period, 0L));
                });

        QualifiedMauReportOutboxRepository durableRepository =
                outboxes.newQmauRepository();
        AtomicReference<String> lostResponseItemId =
                new AtomicReference<>();
        AtomicReference<BatchResponse> lostResponse =
                new AtomicReference<>();
        QualifiedMauReportOutboxRepository failingRepository =
                failAcceptedQmauSaves(
                        durableRepository,
                        lostResponseItemId,
                        lostResponse);
        RegisteredRuntime runtime = runtimeAt(
                enrolledRuntime,
                registry.baseUrl());

        var first = qmauService(
                runtime,
                calculator,
                failingRepository,
                objectMapper).synchronizeNow();

        assertThat(first.state()).isEqualTo("ERROR");
        assertThat(first.code())
                .isEqualTo("MEASUREMENT_DELIVERY_RETRY_SCHEDULED");
        assertThat(first.materialized()).isEqualTo(6);
        assertThat(first.accepted()).isEqualTo(5);
        assertThat(first.pending()).isEqualTo(1L);
        QualifiedMauReportOutboxItem pending = durableRepository
                .findByIdAndDeploymentId(
                        lostResponseItemId.get(),
                        runtime.state().deploymentId())
                .orElseThrow();
        assertThat(pending.getStatus())
                .isEqualTo(QualifiedMauReportOutboxItem.STATUS_PENDING);
        assertThat(pending.getAttemptCount()).isGreaterThanOrEqualTo(2);
        assertThat(pending.getLastAttempt()).isNotNull();
        assertThat(pending.getLastAttempt().getSignature()).isNotBlank();
        assertThat(pending.getAcceptedResponse()).isNull();
        assertThat(lostResponse.get()).isNotNull();
        assertThat(lostResponse.get().duplicate()).isFalse();
        assertThat(lostResponse.get().receipt().signature()).isNotBlank();

        /*
         * Both server-side SQLite and the Java Mongo outbox survive here.
         * A new service/repository instance must recover the already accepted
         * Go batch with the same idempotency key.
         */
        registry.restart();
        runtime = runtimeAt(enrolledRuntime, registry.baseUrl());
        QualifiedMauReportOutboxRepository restartedRepository =
                outboxes.newQmauRepository();
        var recovered = qmauService(
                runtime,
                calculator,
                restartedRepository,
                objectMapper).synchronizeNow();

        assertThat(recovered.state()).isEqualTo("READY");
        assertThat(recovered.accepted()).isEqualTo(1);
        assertThat(recovered.pending()).isZero();
        QualifiedMauReportOutboxItem duplicate =
                restartedRepository.findByIdAndDeploymentId(
                        pending.getId(),
                        runtime.state().deploymentId())
                        .orElseThrow();
        assertThat(duplicate.getStatus())
                .isEqualTo(QualifiedMauReportOutboxItem.STATUS_ACCEPTED);
        assertThat(duplicate.getIdempotencyKey())
                .isEqualTo(pending.getIdempotencyKey());
        assertThat(duplicate.getAcceptedResponse().duplicate()).isTrue();
        assertThat(duplicate.getAcceptedResponse().batchId())
                .isEqualTo(lostResponse.get().batchId());
        assertThat(duplicate.getAcceptedResponse().receipt())
                .isEqualTo(lostResponse.get().receipt());
        assertThat(duplicate.getAcceptedResponse().receipt().entryHash())
                .startsWith("sha256:");

        YearMonth correctionPeriod = YearMonth.now(qualificationClock)
                .minusMonths(1L);
        QualifiedMauReportOutboxItem revisionOne =
                latestQmau(restartedRepository, runtime, correctionPeriod);
        adjustments.put(correctionPeriod, 25L);
        var corrected = qmauService(
                runtime,
                calculator,
                restartedRepository,
                objectMapper).synchronizeNow();

        assertThat(corrected.state()).isEqualTo("READY");
        assertThat(corrected.materialized()).isEqualTo(1);
        assertThat(corrected.accepted()).isEqualTo(1);
        QualifiedMauReportOutboxItem revisionTwo =
                latestQmau(restartedRepository, runtime, correctionPeriod);
        assertThat(revisionTwo.getRevision()).isEqualTo(2L);
        assertThat(revisionTwo.getSupersedesBatchId())
                .isEqualTo(revisionOne.getAcceptedResponse().batchId());
        assertThat(revisionTwo.getAcceptedResponse().duplicate()).isFalse();
        assertThat(revisionTwo.getAcceptedResponse().receipt()
                .supersedesBatchId())
                .isEqualTo(revisionOne.getAcceptedResponse().batchId());

        return new QmauRail(
                calculator,
                adjustments,
                restartedRepository,
                correctionPeriod.minusMonths(1L),
                revisionTwo);
    }

    private RevenueRail qualifyRevenue(
            GoRegistryProcess registry,
            RegisteredRuntime enrolledRuntime,
            ObjectMapper objectMapper,
            EmbeddedOutboxStore outboxes) throws Exception {
        LocalDate period = YearMonth.now(qualificationClock)
                .minusMonths(1L)
                .atEndOfMonth();
        int backfillDayCount = Math.toIntExact(ChronoUnit.DAYS.between(
                period,
                LocalDate.now(qualificationClock)));
        AtomicLong capturedMinor = new AtomicLong(10_000L);
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        when(revenueService.finalizedRevenuePeriodsBefore(
                any(LocalDate.class)))
                .thenReturn(Set.of(period));
        when(revenueService.dailyRevenueHistory(anySet()))
                .thenAnswer(invocation -> {
                    @SuppressWarnings("unchecked")
                    Set<LocalDate> periods = invocation.getArgument(0);
                    return periods.stream()
                            .sorted()
                            .map(day -> revenueSnapshot(
                                    day,
                                    day.equals(period)
                                            ? capturedMinor.get()
                                            : 0L))
                            .toList();
                });

        RevenueReportOutboxRepository durableRepository =
                outboxes.newRevenueRepository();
        AtomicReference<String> lostResponseItemId =
                new AtomicReference<>();
        AtomicReference<RevenueBatchResponse> lostResponse =
                new AtomicReference<>();
        RevenueReportOutboxRepository failingRepository =
                failAcceptedRevenueSaves(
                        durableRepository,
                        lostResponseItemId,
                        lostResponse);
        RegisteredRuntime runtime = runtimeAt(
                enrolledRuntime,
                registry.baseUrl());

        var first = revenueService(
                runtime,
                revenueService,
                failingRepository,
                objectMapper).synchronizeNow();

        assertThat(first.state()).isEqualTo("PENDING");
        assertThat(first.code()).isEqualTo("REVENUE_DELIVERY_PENDING");
        assertThat(first.materialized()).isEqualTo(backfillDayCount);
        assertThat(first.accepted()).isEqualTo(backfillDayCount - 1);
        assertThat(first.pending()).isEqualTo(1L);
        RevenueReportOutboxItem pending = durableRepository
                .findByIdAndDeploymentId(
                        lostResponseItemId.get(),
                        runtime.state().deploymentId())
                .orElseThrow();
        assertThat(pending.getStatus())
                .isEqualTo(RevenueReportOutboxItem.STATUS_PENDING);
        assertThat(pending.getLastAttempt()).isNotNull();
        assertThat(pending.getLastAttempt().getSignature()).isNotBlank();
        assertThat(pending.getAcceptedResponse()).isNull();
        assertThat(lostResponse.get()).isNotNull();
        assertThat(lostResponse.get().duplicate()).isFalse();
        assertThat(lostResponse.get().receipt().signature()).isNotBlank();

        registry.restart();
        runtime = runtimeAt(enrolledRuntime, registry.baseUrl());
        RevenueReportOutboxRepository restartedRepository =
                outboxes.newRevenueRepository();
        var recovered = revenueService(
                runtime,
                revenueService,
                restartedRepository,
                objectMapper).synchronizeNow();

        assertThat(recovered.state()).isEqualTo("SYNCHRONIZED");
        assertThat(recovered.accepted()).isEqualTo(1);
        assertThat(recovered.pending()).isZero();
        RevenueReportOutboxItem duplicate =
                restartedRepository.findByIdAndDeploymentId(
                        pending.getId(),
                        runtime.state().deploymentId())
                        .orElseThrow();
        assertThat(duplicate.getStatus())
                .isEqualTo(RevenueReportOutboxItem.STATUS_ACCEPTED);
        assertThat(duplicate.getIdempotencyKey())
                .isEqualTo(pending.getIdempotencyKey());
        assertThat(duplicate.getAcceptedResponse().duplicate()).isTrue();
        assertThat(duplicate.getAcceptedResponse().batchId())
                .isEqualTo(lostResponse.get().batchId());
        assertThat(duplicate.getAcceptedResponse().receipt())
                .isEqualTo(lostResponse.get().receipt());

        RevenueReportOutboxItem revisionOne =
                latestRevenue(restartedRepository, runtime, period);
        capturedMinor.set(12_500L);
        var corrected = revenueService(
                runtime,
                revenueService,
                restartedRepository,
                objectMapper).synchronizeNow();

        assertThat(corrected.state()).isEqualTo("SYNCHRONIZED");
        assertThat(corrected.materialized()).isEqualTo(1);
        assertThat(corrected.accepted()).isEqualTo(1);
        RevenueReportOutboxItem revisionTwo =
                latestRevenue(restartedRepository, runtime, period);
        assertThat(revisionTwo.getRevision()).isEqualTo(2L);
        assertThat(revisionTwo.getSupersedesBatchId())
                .isEqualTo(revisionOne.getAcceptedResponse().batchId());
        assertThat(revisionTwo.getAcceptedResponse().duplicate()).isFalse();
        assertThat(revisionTwo.getAcceptedResponse().receipt()
                .supersedesBatchId())
                .isEqualTo(revisionOne.getAcceptedResponse().batchId());
        assertThat(revisionTwo.getCurrencies()).singleElement()
                .satisfies(row -> {
                    assertThat(row.currencyCode()).isEqualTo("EUR");
                    assertThat(row.capturedMinor()).isEqualTo(12_500L);
                    assertThat(row.estimatedCommissionMinor())
                            .isEqualTo(625L);
                });

        return new RevenueRail(revisionTwo);
    }

    private void qualifySettlementQuery(
            GoRegistryProcess registry,
            RegisteredRuntime enrolledRuntime,
            ObjectMapper objectMapper) throws Exception {
        String settlementPeriod = YearMonth.now(qualificationClock)
                .minusMonths(1L)
                .toString();
        String legalName = "Java Go Qualification Operator";
        var claim = new RegistryOperatorNetworkService(
                enrolledRuntime.properties(),
                objectMapper).apply(new ActionCommand(
                        RegistryProtocol.OPERATOR_ACTION_CLAIM,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        "qualification_claim_0001",
                        new ClaimVerification(
                                legalName,
                                "QUALIFICATION-REG-1",
                                "Slovakia",
                                "Qualification Street 1, Bratislava",
                                "https://qualification.example.test",
                                "Qualification Reviewer",
                                "Director",
                                "reviewer@qualification.example.test",
                                true)));
        var claimReceipt = claim.response().receipt();
        assertThat(claimReceipt.action())
                .isEqualTo(RegistryProtocol.OPERATOR_ACTION_CLAIM);
        assertThat(claimReceipt.groupId()).isNotBlank();

        registry.runAdminCommand(
                "approve-operator-claim",
                "--deployment-id",
                enrolledRuntime.state().deploymentId(),
                "--claim-action-id",
                claimReceipt.actionId(),
                "--group-id",
                claimReceipt.groupId(),
                "--legal-name",
                legalName,
                "--reviewer-id",
                "qualification-reviewer",
                "--review-reference",
                "qualification:settlement-query",
                "--idempotency-key",
                "qualification_approve_0001");
        registry.runAdminCommand(
                "calculate-settlement",
                "--period",
                settlementPeriod,
                "--currency",
                "EUR");

        RegisteredRuntime runtime = runtimeAt(
                enrolledRuntime,
                registry.baseUrl());
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        when(resolver.resolveSettlement(MongoSessionMode.REAL))
                .thenReturn(
                        OperatorRevenueRegistryRuntimeResolver
                                .Resolution.ready(runtime));
        var page = new OperatorSettlementService(
                resolver,
                objectMapper,
                qualificationClock,
                new SecureRandom()).settlements(
                        "EUR",
                        settlementPeriod,
                        settlementPeriod,
                        false,
                        20,
                        "",
                        "");

        assertThat(page.items()).singleElement().satisfies(item -> {
            assertThat(item.period()).isEqualTo(settlementPeriod);
            assertThat(item.currencyCode()).isEqualTo("EUR");
            assertThat(item.beneficiaryId())
                    .isEqualTo(claimReceipt.groupId());
            assertThat(item.ttmCommissionBasisMinor())
                    .isEqualTo(12_500L);
            assertThat(item.ttmNetworkCommissionPoolMinor())
                    .isEqualTo(625L);
            assertThat(item.indicativeNetworkValueMinor())
                    .isPositive();
            assertThat(item.valuationIsNonBinding()).isTrue();
            assertThat(item.accelerationBasisPoints())
                    .isBetween(
                            RegistryProtocol
                                    .SETTLEMENT_MINIMUM_ACCELERATION_BASIS_POINTS,
                            RegistryProtocol
                                    .SETTLEMENT_MAXIMUM_ACCELERATION_BASIS_POINTS);
        });
        assertThat(page.nextAfterPeriod()).isEmpty();
        assertThat(page.nextAfterSettlementId()).isEmpty();
        assertThat(page.generatedAtIso()).isNotBlank();
    }

    private void assertInvalidDeploymentSignaturesRejected(
            RegisteredRuntime runtime,
            ObjectMapper objectMapper) {
        RegistryHttpClient client = new RegistryHttpClient(
                runtime.properties(),
                objectMapper);
        String invalidSignature = Base64.getEncoder()
                .encodeToString(new byte[64]);
        Instant now = qualificationClock.instant();

        String qmauPeriod = YearMonth.now(qualificationClock)
                .minusMonths(8L)
                .toString();
        String commitmentHash = CanonicalValues.sha256(
                CanonicalValues.canonical(
                        "java-go-invalid-signature-qmau",
                        qmauPeriod));
        String qmauPayloadHash = CanonicalValues.sha256(
                RegistryProtocol.qmauBatchPayload(
                        RegistryProtocol.QMAU_KIND,
                        qmauPeriod,
                        RegistryProtocol.QMAU_RULESET_VERSION,
                        1L,
                        commitmentHash,
                        1L,
                        null));
        BatchRequest invalidQmau = new BatchRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                now.toString(),
                "nonce_invalid_qmau_signature_01",
                "qmau_invalid_signature_01",
                RegistryProtocol.QMAU_KIND,
                qmauPeriod,
                RegistryProtocol.QMAU_RULESET_VERSION,
                1L,
                commitmentHash,
                1L,
                null,
                qmauPayloadHash,
                invalidSignature);
        assertInvalidSignature(() -> client.submitMauBatch(invalidQmau));

        String revenuePeriod = LocalDate.now(qualificationClock)
                .minusDays(2L)
                .toString();
        List<RevenueCurrencyRow> currencies = List.of(
                revenueCurrency(1_000L));
        String revenuePayloadHash = CanonicalValues.sha256(
                RegistryProtocol.revenueBatchPayload(
                        RegistryProtocol.REVENUE_KIND,
                        revenuePeriod,
                        1L,
                        "",
                        RegistryProtocol.REVENUE_RULESET_VERSION,
                        RegistryProtocol
                                .REVENUE_COMMISSION_RATE_BASIS_POINTS,
                        currencies));
        RevenueBatchRequest invalidRevenue = new RevenueBatchRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                now.toString(),
                "nonce_invalid_revenue_signature_01",
                "revenue_invalid_signature_01",
                RegistryProtocol.REVENUE_KIND,
                revenuePeriod,
                1L,
                "",
                RegistryProtocol.REVENUE_RULESET_VERSION,
                RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS,
                currencies,
                revenuePayloadHash,
                invalidSignature);
        assertInvalidSignature(
                () -> client.submitRevenueBatch(invalidRevenue));
    }

    private void assertTamperedRegistryReceiptRejected(
            GoRegistryProcess registry,
            RegisteredRuntime enrolledRuntime,
            ObjectMapper objectMapper,
            QmauRail qmau) throws Exception {
        qmau.adjustments().put(qmau.tamperedReceiptPeriod(), 50L);
        try (ReceiptTamperingProxy proxy = new ReceiptTamperingProxy(
                URI.create(registry.baseUrl()),
                objectMapper,
                RegistryProtocol.MAU_BATCH_PATH)) {
            RegisteredRuntime proxyRuntime = runtimeAt(
                    enrolledRuntime,
                    proxy.baseUrl());
            var result = qmauService(
                    proxyRuntime,
                    qmau.calculator(),
                    qmau.repository(),
                    objectMapper).synchronizeNow();

            assertThat(proxy.tampered()).isTrue();
            assertThat(result.state()).isEqualTo("BLOCKED");
            assertThat(result.blocked()).isEqualTo(1L);
            QualifiedMauReportOutboxItem blocked = latestQmau(
                    qmau.repository(),
                    proxyRuntime,
                    qmau.tamperedReceiptPeriod());
            assertThat(blocked.getRevision()).isEqualTo(2L);
            assertThat(blocked.getStatus())
                    .isEqualTo(
                            QualifiedMauReportOutboxItem.STATUS_BLOCKED);
            assertThat(blocked.getLastFailure().getCode())
                    .isEqualTo("INVALID_QMAU_RECEIPT");
            assertThat(blocked.getLastFailure().getRetryable())
                    .isFalse();
            assertThat(blocked.getAcceptedResponse()).isNull();
        }
    }

    private RegisteredRuntime enroll(
            String baseUrl,
            String registryScope,
            ObjectMapper objectMapper) throws IOException {
        RegistryConfiguration properties = clientProperties(baseUrl);
        properties.setEnabled(true);
        properties.setOutboundAllowed(true);
        properties.setOperatorRegistrationConfirmed(true);
        properties.setRegistryScope(registryScope);
        properties.setTrustOnFirstUse(true);
        properties.setSoftwareVersion("java-go-rail-qualification");
        Path keyDirectory = temporaryDirectory.resolve("java-keys");
        Path stateDirectory = temporaryDirectory.resolve("java-state");
        properties.setPrivateKeyPath(
                keyDirectory.resolve("deployment-private-key.pem"));
        properties.setPublicKeyPath(
                keyDirectory.resolve("deployment-public-key.der"));
        properties.setStateDir(stateDirectory);

        new RegistryNodeIdentityService(properties)
                .initializeNodeIdentity();
        Files.createDirectories(stateDirectory);
        RegistryLocalStore localStore = new RegistryLocalStore(
                properties,
                objectMapper);
        RegistryEnrollmentService enrollment =
                new RegistryEnrollmentService(properties, objectMapper);
        var result = enrollment.synchronizeNow();
        assertThat(result.active()).isTrue();
        assertThat(result.completed()).isTrue();

        LocalState state = localStore.load().orElseThrow();
        var registration = state.registration().receipt();
        PublicKey registryPublicKey =
                com.raxim.myscoutee.domain.registry.api.RegistryProtocol.parseRegistryPublicKey(
                        registration.registryPublicKey());
        String fingerprint = CanonicalValues.publicKeyFingerprint(
                registryPublicKey.getEncoded());
        String keyId = RegistryProtocol.registryKeyId(fingerprint);
        properties.setExpectedRegistryKeyFingerprint(fingerprint);
        assertThat(registration.registryKeyId()).isEqualTo(keyId);
        assertThat(state.installationBatch().receipt().signature())
                .isNotBlank();
        return new RegisteredRuntime(
                properties,
                state,
                RegistryCrypto.load(properties),
                registryPublicKey,
                registration.registryPublicKey(),
                fingerprint,
                keyId);
    }

    private RegisteredRuntime runtimeAt(
            RegisteredRuntime enrolled,
            String baseUrl) {
        return new RegisteredRuntime(
                clientProperties(baseUrl),
                enrolled.state(),
                enrolled.deploymentCrypto(),
                enrolled.registryPublicKey(),
                enrolled.registryPublicKeyBase64(),
                enrolled.registryPublicKeyFingerprint(),
                enrolled.registryKeyId());
    }

    private RegistryConfiguration clientProperties(String baseUrl) {
        RegistryConfiguration properties = new RegistryConfiguration();
        properties.setBaseUrl(baseUrl);
        properties.setAllowInsecureHttp(true);
        properties.setInsecureHttpAllowedHosts("127.0.0.1");
        properties.setConnectTimeout(Duration.ofSeconds(5));
        properties.setRequestTimeout(HTTP_TIMEOUT);
        properties.setRetryDelay(Duration.ofMillis(25));
        properties.setMaxResponseBytes(1_048_576);
        return properties;
    }

    private OperatorQualifiedMauReportService qmauService(
            RegisteredRuntime runtime,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository repository,
            ObjectMapper objectMapper) {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        when(resolver.resolveMau(MongoSessionMode.REAL))
                .thenReturn(
                        OperatorRevenueRegistryRuntimeResolver
                                .Resolution.ready(runtime));
        return new OperatorQualifiedMauReportService(
                resolver,
                calculator,
                repository,
                objectMapper,
                qualificationClock,
                new SecureRandom());
    }

    private OperatorRevenueReportService revenueService(
            RegisteredRuntime runtime,
            OperatorRevenueService revenueService,
            RevenueReportOutboxRepository repository,
            ObjectMapper objectMapper) {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        when(resolver.resolveRevenue(MongoSessionMode.REAL))
                .thenReturn(
                        OperatorRevenueRegistryRuntimeResolver
                                .Resolution.ready(runtime));
        return new OperatorRevenueReportService(
                resolver,
                revenueService,
                repository,
                objectMapper,
                qualificationClock,
                new SecureRandom());
    }

    private QualifiedMauReportOutboxRepository failAcceptedQmauSaves(
            QualifiedMauReportOutboxRepository delegate,
            AtomicReference<String> failedItemId,
            AtomicReference<BatchResponse> lostResponse) {
        QualifiedMauReportOutboxRepository repository = mock(
                QualifiedMauReportOutboxRepository.class,
                withSettings().defaultAnswer(delegatesTo(delegate)));
        doAnswer(invocation -> {
            QualifiedMauReportOutboxItem item =
                    invocation.getArgument(0);
            if (QualifiedMauReportOutboxItem.STATUS_ACCEPTED.equals(
                    item.getStatus())) {
                failedItemId.compareAndSet(null, item.getId());
                if (item.getId().equals(failedItemId.get())) {
                    lostResponse.compareAndSet(
                            null,
                            item.getAcceptedResponse());
                    throw new DataAccessResourceFailureException(
                            "simulated lost QMAU response before receipt persistence");
                }
            }
            return delegate.save(item);
        }).when(repository).save(
                any(QualifiedMauReportOutboxItem.class));
        return repository;
    }

    private RevenueReportOutboxRepository failAcceptedRevenueSaves(
            RevenueReportOutboxRepository delegate,
            AtomicReference<String> failedItemId,
            AtomicReference<RevenueBatchResponse> lostResponse) {
        RevenueReportOutboxRepository repository = mock(
                RevenueReportOutboxRepository.class,
                withSettings().defaultAnswer(delegatesTo(delegate)));
        doAnswer(invocation -> {
            RevenueReportOutboxItem item = invocation.getArgument(0);
            if (RevenueReportOutboxItem.STATUS_ACCEPTED.equals(
                    item.getStatus())) {
                failedItemId.compareAndSet(null, item.getId());
                if (item.getId().equals(failedItemId.get())) {
                    lostResponse.compareAndSet(
                            null,
                            item.getAcceptedResponse());
                    throw new DataAccessResourceFailureException(
                            "simulated lost revenue response before receipt persistence");
                }
            }
            return delegate.save(item);
        }).when(repository).save(any(RevenueReportOutboxItem.class));
        return repository;
    }

    private QualifiedMauReportOutboxItem latestQmau(
            QualifiedMauReportOutboxRepository repository,
            RegisteredRuntime runtime,
            YearMonth period) {
        return repository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(item -> period.toString().equals(
                        item.getPeriod()))
                .max(Comparator.comparingLong(
                        QualifiedMauReportOutboxItem::getRevision))
                .orElseThrow();
    }

    private RevenueReportOutboxItem latestRevenue(
            RevenueReportOutboxRepository repository,
            RegisteredRuntime runtime,
            LocalDate period) {
        return repository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(item -> period.toString().equals(
                        item.getPeriod()))
                .max(Comparator.comparingLong(
                        RevenueReportOutboxItem::getRevision))
                .orElseThrow();
    }

    private QualifiedMauSnapshot qmauSnapshot(
            YearMonth period,
            long adjustment) {
        Instant windowStart = period.atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        Instant windowEnd = period.plusMonths(1L)
                .atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        long qualifiedMauCount = 100L + adjustment;
        return new QualifiedMauSnapshot(
                period.toString(),
                windowStart.toString(),
                windowEnd.toString(),
                qualifiedMauCount,
                1L,
                Map.of(
                        MongoQualifiedMauEvidenceRepository
                                .ACTION_MESSAGE,
                        1L),
                CanonicalValues.sha256(
                        CanonicalValues.canonical(
                                "java-go-qmau-evidence-v1",
                                period.toString(),
                                Long.toString(adjustment))));
    }

    private OperatorRevenueService.DailyRevenueSnapshot revenueSnapshot(
            LocalDate period,
            long capturedMinor) {
        return new OperatorRevenueService.DailyRevenueSnapshot(
                period,
                List.of(new OperatorRevenueService.DailyCurrencyRevenue(
                        "EUR",
                        2,
                        capturedMinor,
                        0L,
                        capturedMinor,
                        capturedMinor,
                        OperatorRevenueService.commissionMinor(
                                capturedMinor),
                        1L)),
                new OperatorRevenueSnapshot.RevenueDiagnostics(
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L));
    }

    private RevenueCurrencyRow revenueCurrency(long capturedMinor) {
        return new RevenueCurrencyRow(
                "EUR",
                2,
                capturedMinor,
                0L,
                capturedMinor,
                capturedMinor,
                OperatorRevenueService.commissionMinor(capturedMinor),
                1L);
    }

    private void assertInvalidSignature(ThrowingOperation operation) {
        assertThatThrownBy(operation::run)
                .isInstanceOfSatisfying(
                        RegistryHttpException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(401);
                            assertThat(exception.getErrorCode())
                                    .isEqualTo("invalid_signature");
                        });
    }

    private String environment(String variableName) {
        String value = System.getenv(variableName);
        return value == null ? "" : value.trim();
    }

    @FunctionalInterface
    private interface ThrowingOperation {
        void run();
    }

    private record QmauRail(
            OperatorQualifiedMauCalculator calculator,
            Map<YearMonth, Long> adjustments,
            QualifiedMauReportOutboxRepository repository,
            YearMonth tamperedReceiptPeriod,
            QualifiedMauReportOutboxItem acceptedCorrection) {
    }

    private record RevenueRail(
            RevenueReportOutboxItem acceptedCorrection) {
    }

    private static final class EmbeddedOutboxStore
            implements AutoCloseable {
        private final TransitionWalker.ReachedState<RunningMongodProcess>
                mongod;
        private final MongoClient client;
        private final MongoTemplate template;

        private EmbeddedOutboxStore(
                TransitionWalker.ReachedState<RunningMongodProcess> mongod,
                MongoClient client,
                MongoTemplate template) {
            this.mongod = mongod;
            this.client = client;
            this.template = template;
        }

        static EmbeddedOutboxStore start() {
            TransitionWalker.ReachedState<RunningMongodProcess> mongod =
                    Mongod.instance().start(Version.Main.V6_0);
            ServerAddress address =
                    mongod.current().getServerAddress();
            String mongoUri = "mongodb://"
                    + address.getHost()
                    + ":"
                    + address.getPort();
            MongoClient client = MongoClients.create(mongoUri);
            MongoTemplate template = new MongoTemplate(
                    client,
                    "java_go_registry_rail_qualification");
            return new EmbeddedOutboxStore(
                    mongod,
                    client,
                    template);
        }

        QualifiedMauReportOutboxRepository newQmauRepository() {
            return new MongoRepositoryFactory(template).getRepository(
                    QualifiedMauReportOutboxRepository.class);
        }

        RevenueReportOutboxRepository newRevenueRepository() {
            return new MongoRepositoryFactory(template).getRepository(
                    RevenueReportOutboxRepository.class);
        }

        @Override
        public void close() throws Exception {
            client.close();
            mongod.close();
        }
    }

    private static final class GoRegistryProcess
            implements AutoCloseable {
        private final Path binary;
        private final String registryScope;
        private final Path stateDirectory;
        private final Path logPath;
        private final int port;
        private Process process;

        GoRegistryProcess(
                Path binary,
                String registryScope,
                Path stateDirectory) throws IOException {
            this.binary = binary;
            this.registryScope = registryScope;
            this.stateDirectory = stateDirectory;
            this.logPath = stateDirectory.resolve("registry.log");
            this.port = reservePort();
        }

        void start() throws Exception {
            Files.createDirectories(stateDirectory);
            ProcessBuilder builder = new ProcessBuilder(
                    binary.toString());
            configureEnvironment(builder);
            builder.redirectErrorStream(true);
            builder.redirectOutput(
                    ProcessBuilder.Redirect.appendTo(
                            logPath.toFile()));
            process = builder.start();
            awaitReady();
        }

        String runAdminCommand(String... arguments) throws Exception {
            String[] command = new String[arguments.length + 1];
            command[0] = binary.toString();
            System.arraycopy(
                    arguments,
                    0,
                    command,
                    1,
                    arguments.length);
            ProcessBuilder builder = new ProcessBuilder(command);
            configureEnvironment(builder);
            builder.redirectErrorStream(true);
            Process commandProcess = builder.start();
            if (!commandProcess.waitFor(30L, TimeUnit.SECONDS)) {
                commandProcess.destroyForcibly();
                throw new IllegalStateException(
                        "Go registry admin command timed out.");
            }
            String output = new String(
                    commandProcess.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8);
            if (commandProcess.exitValue() != 0) {
                throw new IllegalStateException(
                        "Go registry admin command failed with exit "
                                + commandProcess.exitValue()
                                + ":\n"
                                + output);
            }
            return output;
        }

        private void configureEnvironment(ProcessBuilder builder) {
            builder.environment().put(
                    "REGISTRY_LISTEN_ADDR",
                    "127.0.0.1:" + port);
            builder.environment().put(
                    "REGISTRY_SCOPE",
                    registryScope);
            builder.environment().put(
                    "REGISTRY_DATABASE_PATH",
                    stateDirectory.resolve("registry.db").toString());
            builder.environment().put(
                    "REGISTRY_SIGNING_KEY_PATH",
                    stateDirectory.resolve(
                            "registry-signing-key.pem").toString());
            builder.environment().put(
                    "REGISTRY_GENERATE_SIGNING_KEY",
                    "true");
            builder.environment().put(
                    "REGISTRY_GLOBAL_IDENTITY_VOPRF_KEYRING_PATH",
                    stateDirectory.resolve(
                            "registry-global-identity-voprf-keyring.json")
                            .toString());
            builder.environment().put(
                    "REGISTRY_GENERATE_GLOBAL_IDENTITY_VOPRF_KEY",
                    "true");
            builder.environment().put(
                    "REGISTRY_CHECKPOINT_INTERVAL",
                    "1h");
            builder.environment().put(
                    "REGISTRY_SHUTDOWN_TIMEOUT",
                    "2s");
        }

        void restart() throws Exception {
            stop();
            start();
        }

        String baseUrl() {
            return "http://127.0.0.1:" + port;
        }

        private void awaitReady() throws Exception {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(1))
                    .build();
            Instant deadline = Instant.now().plusSeconds(15L);
            RuntimeException lastFailure = null;
            while (Instant.now().isBefore(deadline)) {
                if (!process.isAlive()) {
                    throw new IllegalStateException(
                            "Go registry exited before readiness:\n"
                                    + diagnostics());
                }
                try {
                    HttpRequest request = HttpRequest.newBuilder(
                            URI.create(baseUrl() + "/healthz"))
                            .timeout(Duration.ofSeconds(1))
                            .GET()
                            .build();
                    HttpResponse<Void> response = client.send(
                            request,
                            HttpResponse.BodyHandlers.discarding());
                    if (response.statusCode() == 200) {
                        return;
                    }
                } catch (IOException exception) {
                    lastFailure = new IllegalStateException(
                            "registry health request failed",
                            exception);
                }
                Thread.sleep(50L);
            }
            throw new IllegalStateException(
                    "Go registry did not become ready:\n"
                            + diagnostics(),
                    lastFailure);
        }

        private void stop() throws Exception {
            if (process == null) {
                return;
            }
            process.destroy();
            if (!process.waitFor(10L, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                if (!process.waitFor(5L, TimeUnit.SECONDS)) {
                    throw new IllegalStateException(
                            "Go registry process did not stop.");
                }
            }
            process = null;
        }

        private String diagnostics() {
            try {
                return Files.exists(logPath)
                        ? Files.readString(logPath)
                        : "(registry log is missing)";
            } catch (IOException exception) {
                return "(unable to read registry log: "
                        + exception.getMessage()
                        + ")";
            }
        }

        @Override
        public void close() throws Exception {
            stop();
        }

        private static int reservePort() throws IOException {
            try (ServerSocket socket = new ServerSocket()) {
                socket.bind(new InetSocketAddress("127.0.0.1", 0));
                return socket.getLocalPort();
            }
        }
    }

    private static final class ReceiptTamperingProxy
            implements AutoCloseable {
        private final URI upstream;
        private final ObjectMapper objectMapper;
        private final String tamperedPath;
        private final HttpClient client;
        private final HttpServer server;
        private volatile boolean tampered;

        ReceiptTamperingProxy(
                URI upstream,
                ObjectMapper objectMapper,
                String tamperedPath) throws IOException {
            this.upstream = upstream;
            this.objectMapper = objectMapper;
            this.tamperedPath = tamperedPath;
            this.client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();
            this.server = HttpServer.create(
                    new InetSocketAddress("127.0.0.1", 0),
                    0);
            server.createContext("/", this::forward);
            server.start();
        }

        String baseUrl() {
            return "http://127.0.0.1:"
                    + server.getAddress().getPort();
        }

        boolean tampered() {
            return tampered;
        }

        private void forward(HttpExchange exchange) throws IOException {
            byte[] responseBody;
            int status;
            try {
                byte[] requestBody =
                        exchange.getRequestBody().readAllBytes();
                URI endpoint = URI.create(
                        upstream.toString()
                                + exchange.getRequestURI());
                HttpRequest.BodyPublisher publisher =
                        requestBody.length == 0
                                ? HttpRequest.BodyPublishers.noBody()
                                : HttpRequest.BodyPublishers.ofByteArray(
                                        requestBody);
                HttpRequest.Builder request = HttpRequest.newBuilder(
                        endpoint)
                        .timeout(HTTP_TIMEOUT)
                        .method(
                                exchange.getRequestMethod(),
                                publisher);
                String contentType = exchange.getRequestHeaders()
                        .getFirst("Content-Type");
                if (contentType != null) {
                    request.header("Content-Type", contentType);
                }
                HttpResponse<byte[]> response = client.send(
                        request.build(),
                        HttpResponse.BodyHandlers.ofByteArray());
                status = response.statusCode();
                responseBody = response.body();
                if (!tampered
                        && status >= 200
                        && status < 300
                        && tamperedPath.equals(
                                exchange.getRequestURI().getPath())) {
                    responseBody = tamperReceiptSignature(
                            responseBody);
                    tampered = true;
                }
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                status = 503;
                responseBody =
                        "{\"error\":\"proxy_interrupted\"}"
                                .getBytes(
                                        java.nio.charset.StandardCharsets
                                                .UTF_8);
            } catch (RuntimeException exception) {
                status = 502;
                responseBody =
                        ("{\"error\":\"proxy_failure\","
                                + "\"message\":\""
                                + exception.getClass().getSimpleName()
                                + "\"}")
                                .getBytes(
                                        java.nio.charset.StandardCharsets
                                                .UTF_8);
            }
            exchange.getResponseHeaders().set(
                    "Content-Type",
                    "application/json");
            exchange.sendResponseHeaders(status, responseBody.length);
            exchange.getResponseBody().write(responseBody);
            exchange.close();
        }

        private byte[] tamperReceiptSignature(byte[] body) {
            ObjectNode root = (ObjectNode) objectMapper.readTree(body);
            ObjectNode receipt = (ObjectNode) root.get("receipt");
            byte[] signature = Base64.getDecoder().decode(
                    receipt.path("signature").stringValue());
            signature[0] ^= 0x01;
            receipt.put(
                    "signature",
                    Base64.getEncoder().encodeToString(signature));
            return objectMapper.writeValueAsBytes(root);
        }

        @Override
        public void close() {
            server.stop(0);
        }
    }
}
