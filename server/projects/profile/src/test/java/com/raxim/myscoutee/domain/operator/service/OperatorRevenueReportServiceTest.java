package com.raxim.myscoutee.domain.operator.service;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.security.PublicKey;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.operator.document.RevenueReportOutboxItem;
import com.raxim.myscoutee.domain.operator.repository.RevenueReportOutboxRepository;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.registry.RegistryCrypto;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.LocalState;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.RevenueCurrencyRow;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class OperatorRevenueReportServiceTest {
    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void unregisteredDeploymentReturnsBeforePaymentOrOutboxAccess() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        when(resolver.resolveRevenue(MongoSessionMode.REAL)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.dormant(
                        "REGISTRY_NOT_CONFIGURED",
                        "Register this deployment before sending revenue reports."));
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        OperatorRevenueReportService service = service(
                resolver,
                revenueService,
                outbox);

        var result = service.synchronizeNow();

        assertThat(result.state()).isEqualTo("DORMANT");
        assertThat(result.code()).isEqualTo("REGISTRY_NOT_CONFIGURED");
        verifyNoInteractions(revenueService, outbox);
    }

    @Test
    void exploreModeUsesOnlyItsModeScopedRegistryRuntime() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        when(resolver.resolveRevenue(MongoSessionMode.DEMO)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.dormant(
                        "REGISTRY_NOT_CONFIGURED",
                        "Register this Explore deployment before sending revenue reports."));
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        OperatorRevenueReportService service = service(
                resolver,
                revenueService,
                outbox);

        var result = service.synchronizeNow();

        assertThat(result.state()).isEqualTo("DORMANT");
        assertThat(result.code()).isEqualTo("REGISTRY_NOT_CONFIGURED");
        verify(resolver).resolveRevenue(MongoSessionMode.DEMO);
        verifyNoInteractions(revenueService, outbox);
    }

    @Test
    void firstRunBackfillsHistoricalCompletedDaysInBoundedChunks() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        List<RevenueReportOutboxItem> stored = new ArrayList<>();
        RevenueReportOutboxRepository outbox =
                inMemoryOutbox(stored, true);
        RegisteredRuntime runtime = runtime();
        when(resolver.resolveRevenue(MongoSessionMode.REAL)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.ready(
                        runtime));
        when(revenueService.finalizedRevenuePeriodsBefore(
                LocalDate.of(2026, 7, 28)))
                .thenReturn(Set.of(LocalDate.of(2026, 5, 1)));
        when(revenueService.dailyRevenueHistory(anySet()))
                .thenAnswer(invocation -> {
                    Set<LocalDate> periods = invocation.getArgument(0);
                    return periods.stream()
                            .sorted()
                            .map(OperatorRevenueReportServiceTest::emptyDay)
                            .toList();
                });
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        OperatorRevenueReportService service = service(
                resolver,
                revenueService,
                outbox);

        var result = service.synchronizeNow();

        assertThat(result.materialized()).isEqualTo(32);
        assertThat(stored)
                .extracting(RevenueReportOutboxItem::getPeriod)
                .contains(
                        "2026-05-01",
                        "2026-05-31",
                        "2026-07-27")
                .doesNotContain("2026-06-01");
        assertThat(stored)
                .allSatisfy(item -> {
                    assertThat(item.getStatus())
                            .isEqualTo(
                                    RevenueReportOutboxItem.STATUS_BLOCKED);
                    assertThat(item.getRevision()).isEqualTo(1L);
                    assertThat(item.getPayloadHash())
                            .startsWith("sha256:");
                });
    }

    @Test
    void blockedReportCanBeInspectedAndTargetedForRequeueWithoutNetworkIo() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        RegisteredRuntime runtime = runtime();
        RevenueReportOutboxItem blocked = validBlockedReport(runtime);
        when(resolver.resolveRevenue(MongoSessionMode.REAL)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.ready(
                        runtime));
        when(outbox.findByDeploymentIdAndStatus(
                eq("dep_test"),
                eq(RevenueReportOutboxItem.STATUS_BLOCKED),
                any()))
                .thenReturn(new PageImpl<>(List.of(blocked)));
        when(outbox.findByIdAndDeploymentId(
                blocked.getId(),
                "dep_test"))
                .thenReturn(Optional.of(blocked));
        when(outbox.save(blocked)).thenReturn(blocked);
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        OperatorRevenueReportService service = service(
                resolver,
                revenueService,
                outbox);

        var page = service.reports("blocked", 0, 25);
        var requeued = service.requeue(blocked.getId());

        assertThat(page.items()).singleElement()
                .satisfies(item -> {
                    assertThat(item.status()).isEqualTo("BLOCKED");
                    assertThat(item.failureCode())
                            .isEqualTo("REGISTRY_REJECTED");
                    assertThat(item.currencies()).singleElement()
                            .satisfies(currency -> assertThat(
                                    currency.estimatedCommissionMinor())
                                    .isEqualTo(4L));
                });
        assertThat(requeued.status()).isEqualTo("PENDING");
        assertThat(requeued.nextRetryAt()).isNull();
        assertThat(requeued.failureCode())
                .as("operator drill-down remains visible after requeue")
                .isEqualTo("REGISTRY_REJECTED");
        verifyNoInteractions(revenueService);
    }

    @Test
    void requeueRejectsForeignMalformedOrNonBlockedReports() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                RegistryRuntimeTestSupport.resolver();
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        RegisteredRuntime runtime = runtime();
        when(resolver.resolveRevenue(MongoSessionMode.REAL)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.ready(
                        runtime));
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        OperatorRevenueReportService service = service(
                resolver,
                mock(OperatorRevenueService.class),
                outbox);

        assertStatus(
                () -> service.requeue("../foreign"),
                HttpStatus.BAD_REQUEST);
        assertStatus(
                () -> service.requeue("f".repeat(24)),
                HttpStatus.NOT_FOUND);

        RevenueReportOutboxItem accepted = validBlockedReport(runtime);
        accepted.setStatus(RevenueReportOutboxItem.STATUS_ACCEPTED);
        when(outbox.findByIdAndDeploymentId(
                accepted.getId(),
                "dep_test"))
                .thenReturn(Optional.of(accepted));
        assertStatus(
                () -> service.requeue(accepted.getId()),
                HttpStatus.CONFLICT);
    }

    private OperatorRevenueReportService service(
            OperatorRevenueRegistryRuntimeResolver resolver,
            OperatorRevenueService revenueService,
            RevenueReportOutboxRepository outbox) {
        return new OperatorRevenueReportService(
                resolver,
                revenueService,
                outbox,
                mock(ObjectMapper.class),
                Clock.fixed(
                        Instant.parse("2026-07-28T12:00:00Z"),
                        ZoneOffset.UTC),
                new SecureRandom());
    }

    private static RegisteredRuntime runtime() {
        RegistryConfiguration properties = new RegistryConfiguration();
        properties.setBaseUrl("http://127.0.0.1:1");
        properties.setAllowInsecureHttp(true);
        properties.setInsecureHttpAllowedHosts("127.0.0.1");
        properties.setConnectTimeout(Duration.ofMillis(100));
        properties.setRequestTimeout(Duration.ofMillis(100));
        properties.setRetryDelay(Duration.ofSeconds(1));
        LocalState state = mock(LocalState.class);
        when(state.registryScope()).thenReturn("test:registry");
        when(state.deploymentId()).thenReturn("dep_test");
        RegistryCrypto deploymentCrypto = mock(RegistryCrypto.class);
        when(deploymentCrypto.signBase64(any()))
                .thenReturn(Base64Values.SIGNATURE);
        return new RegisteredRuntime(
                properties,
                state,
                deploymentCrypto,
                mock(PublicKey.class),
                Base64Values.PUBLIC_KEY,
                "sha256:" + "a".repeat(64),
                "registry_" + "a".repeat(32));
    }

    private static RevenueReportOutboxRepository inMemoryOutbox(
            List<RevenueReportOutboxItem> stored,
            boolean blockNewItems) {
        RevenueReportOutboxRepository repository =
                mock(RevenueReportOutboxRepository.class);
        AtomicInteger ids = new AtomicInteger();
        when(repository.findByDeploymentIdOrderByPeriodAscRevisionAsc(
                any()))
                .thenAnswer(invocation -> new ArrayList<>(stored));
        when(repository.save(any(RevenueReportOutboxItem.class)))
                .thenAnswer(invocation -> {
                    RevenueReportOutboxItem item =
                            invocation.getArgument(0);
                    if (item.getId() == null) {
                        item.setId(String.format(
                                "%024x",
                                ids.incrementAndGet()));
                        stored.add(item);
                        if (blockNewItems) {
                            item.setStatus(
                                    RevenueReportOutboxItem.STATUS_BLOCKED);
                        }
                    }
                    return item;
                });
        when(repository.countByDeploymentIdAndStatus(any(), any()))
                .thenAnswer(invocation -> {
                    String status = invocation.getArgument(1);
                    return stored.stream()
                            .filter(item -> status.equals(item.getStatus()))
                            .count();
                });
        return repository;
    }

    private static OperatorRevenueService.DailyRevenueSnapshot emptyDay(
            LocalDate period) {
        return new OperatorRevenueService.DailyRevenueSnapshot(
                period,
                List.of(),
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

    private static RevenueReportOutboxItem validBlockedReport(
            RegisteredRuntime runtime) {
        RevenueCurrencyRow row = new RevenueCurrencyRow(
                "USD",
                2,
                100L,
                20L,
                80L,
                80L,
                4L,
                1L);
        String payloadHash = CanonicalValues.sha256(
                RegistryProtocol.revenueBatchPayload(
                        RegistryProtocol.REVENUE_KIND,
                        "2026-07-27",
                        1L,
                        "",
                        RegistryProtocol.REVENUE_RULESET_VERSION,
                        RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS,
                        List.of(row)));
        RevenueReportOutboxItem item = new RevenueReportOutboxItem();
        item.setId("a".repeat(24));
        item.setSchemaVersion(RevenueReportOutboxItem.SCHEMA_VERSION);
        item.setRegistryScope(runtime.state().registryScope());
        item.setDeploymentId(runtime.state().deploymentId());
        item.setPeriod("2026-07-27");
        item.setRevision(1L);
        item.setSupersedesBatchId("");
        item.setKind(RegistryProtocol.REVENUE_KIND);
        item.setRulesetVersion(
                RegistryProtocol.REVENUE_RULESET_VERSION);
        item.setCommissionRateBasisPoints(
                RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS);
        item.setCurrencies(List.of(row));
        item.setAggregateHash(payloadHash);
        item.setPayloadHash(payloadHash);
        item.setIdempotencyKey("revenue_" + "b".repeat(64));
        item.setStatus(RevenueReportOutboxItem.STATUS_BLOCKED);
        item.setAttemptCount(3);
        item.setNextRetryAt("2026-07-29T12:00:00Z");
        RevenueReportOutboxItem.Failure failure =
                new RevenueReportOutboxItem.Failure();
        failure.setCode("REGISTRY_REJECTED");
        failure.setMessage("Registry rejected the immutable report.");
        failure.setRetryable(false);
        failure.setAt("2026-07-28T11:59:00Z");
        item.setLastFailure(failure);
        item.setCreatedAt("2026-07-28T10:00:00Z");
        item.setUpdatedAt("2026-07-28T11:59:00Z");
        return item;
    }

    private static void assertStatus(
            org.assertj.core.api.ThrowableAssert.ThrowingCallable action,
            HttpStatus expectedStatus) {
        assertThatThrownBy(action)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> assertThat(
                                exception.getStatusCode())
                                .isEqualTo(expectedStatus));
    }

    private static final class Base64Values {
        private static final String SIGNATURE =
                "c2lnbmVkLXJldmVudWUtcmVxdWVzdA==";
        private static final String PUBLIC_KEY =
                "cHVibGljLWtleQ==";
    }
}
