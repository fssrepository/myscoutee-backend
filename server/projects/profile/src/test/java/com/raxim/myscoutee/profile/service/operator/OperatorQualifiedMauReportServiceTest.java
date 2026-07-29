package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.security.PublicKey;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.QualifiedMauReportOutboxItem;
import com.raxim.myscoutee.profile.repository.MongoQualifiedMauEvidenceRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauReportOutboxRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorQualifiedMauCalculator.QualifiedMauSnapshot;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.RegisteredRuntime;
import com.raxim.myscoutee.registry.RegistryCrypto;
import com.raxim.myscoutee.registry.RegistryLocalStore.LocalState;
import com.raxim.myscoutee.registry.RegistryProtocol;

import tools.jackson.databind.ObjectMapper;

class OperatorQualifiedMauReportServiceTest {
    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void unregisteredDeploymentReturnsBeforeEvidenceOrOutboxAccess() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                mock(OperatorRevenueRegistryRuntimeResolver.class);
        OperatorQualifiedMauCalculator calculator =
                mock(OperatorQualifiedMauCalculator.class);
        QualifiedMauReportOutboxRepository outbox =
                mock(QualifiedMauReportOutboxRepository.class);
        when(resolver.resolveMau(MongoSessionMode.REAL)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.dormant(
                        "REGISTRY_NOT_CONFIGURED",
                        "Register this deployment before sending measurements."));
        MongoSessionModeContext.set(MongoSessionMode.REAL);

        var result = service(resolver, calculator, outbox)
                .synchronizeNow();

        assertThat(result.state()).isEqualTo("DORMANT");
        assertThat(result.code()).isEqualTo(
                "REGISTRY_NOT_CONFIGURED");
        verifyNoInteractions(calculator, outbox);
    }

    @Test
    void demoSynchronizationUsesDemoRuntimeAndMaterializesSixCompletedMonths() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                mock(OperatorRevenueRegistryRuntimeResolver.class);
        OperatorQualifiedMauCalculator calculator =
                mock(OperatorQualifiedMauCalculator.class);
        List<QualifiedMauReportOutboxItem> stored =
                new ArrayList<>();
        QualifiedMauReportOutboxRepository outbox =
                inMemoryBlockedOutbox(stored);
        RegisteredRuntime runtime = runtime();
        when(resolver.resolveMau(MongoSessionMode.DEMO)).thenReturn(
                OperatorRevenueRegistryRuntimeResolver.Resolution.ready(
                        runtime));
        when(calculator.calculate(any(YearMonth.class)))
                .thenAnswer(invocation -> snapshot(
                        invocation.getArgument(0)));
        MongoSessionModeContext.set(MongoSessionMode.DEMO);

        var result = service(resolver, calculator, outbox)
                .synchronizeNow();

        assertThat(result.materialized()).isEqualTo(6);
        assertThat(result.blocked()).isEqualTo(6L);
        assertThat(stored)
                .extracting(QualifiedMauReportOutboxItem::getPeriod)
                .containsExactly(
                        "2026-01",
                        "2026-02",
                        "2026-03",
                        "2026-04",
                        "2026-05",
                        "2026-06");
        assertThat(stored).allSatisfy(item -> {
            assertThat(item.getRevision()).isEqualTo(1L);
            assertThat(item.getPayloadHash())
                    .matches("sha256:[0-9a-f]{64}");
            assertThat(item.getStatus()).isEqualTo(
                    QualifiedMauReportOutboxItem.STATUS_BLOCKED);
        });
        verify(resolver).resolveMau(MongoSessionMode.DEMO);
    }

    private static OperatorQualifiedMauReportService service(
            OperatorRevenueRegistryRuntimeResolver resolver,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository outbox) {
        return new OperatorQualifiedMauReportService(
                resolver,
                calculator,
                outbox,
                mock(ObjectMapper.class),
                Clock.fixed(
                        Instant.parse("2026-07-28T12:00:00Z"),
                        ZoneOffset.UTC),
                new SecureRandom());
    }

    private static QualifiedMauReportOutboxRepository
            inMemoryBlockedOutbox(
                    List<QualifiedMauReportOutboxItem> stored) {
        QualifiedMauReportOutboxRepository repository =
                mock(QualifiedMauReportOutboxRepository.class);
        when(repository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(any()))
                .thenAnswer(ignored -> new ArrayList<>(stored));
        when(repository.save(any(QualifiedMauReportOutboxItem.class)))
                .thenAnswer(invocation -> {
                    QualifiedMauReportOutboxItem item =
                            invocation.getArgument(0);
                    if (stored.stream().noneMatch(existing ->
                            existing.getId().equals(item.getId()))) {
                        stored.add(item);
                        item.setStatus(
                                QualifiedMauReportOutboxItem
                                        .STATUS_BLOCKED);
                    }
                    return item;
                });
        when(repository.countByDeploymentIdAndStatus(any(), any()))
                .thenAnswer(invocation -> {
                    String status = invocation.getArgument(1);
                    return stored.stream()
                            .filter(item -> status.equals(
                                    item.getStatus()))
                            .count();
                });
        return repository;
    }

    private static QualifiedMauSnapshot snapshot(
            YearMonth period) {
        Instant end = period.plusMonths(1)
                .atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        return new QualifiedMauSnapshot(
                period.toString(),
                end.minus(Duration.ofDays(30)).toString(),
                end.toString(),
                1L,
                2L,
                Map.of(
                        MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                        2L),
                "sha256:" + "a".repeat(64));
    }

    private static RegisteredRuntime runtime() {
        RegistryProperties properties = new RegistryProperties();
        properties.setBaseUrl("http://127.0.0.1:1");
        properties.setAllowInsecureHttp(true);
        properties.setInsecureHttpAllowedHosts("127.0.0.1");
        properties.setConnectTimeout(Duration.ofMillis(100));
        properties.setRequestTimeout(Duration.ofMillis(100));
        properties.setRetryDelay(Duration.ofSeconds(1));
        LocalState state = mock(LocalState.class);
        when(state.registryScope()).thenReturn("demo:myscoutee");
        when(state.deploymentId()).thenReturn(
                "dep_" + "d".repeat(32));
        return new RegisteredRuntime(
                properties,
                state,
                mock(RegistryCrypto.class),
                mock(PublicKey.class),
                "cHVibGljLWtleQ==",
                "sha256:" + "e".repeat(64),
                "rkey_" + "e".repeat(32));
    }
}
