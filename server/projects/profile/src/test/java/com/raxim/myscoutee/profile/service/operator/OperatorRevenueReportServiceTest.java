package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.repository.RevenueReportOutboxRepository;

import tools.jackson.databind.ObjectMapper;

class OperatorRevenueReportServiceTest {
    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void unregisteredDeploymentReturnsBeforePaymentOrOutboxAccess() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                mock(OperatorRevenueRegistryRuntimeResolver.class);
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        when(resolver.resolveReal()).thenReturn(
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
    void exploreModeDoesNotEvenResolveARegistryRuntime() {
        OperatorRevenueRegistryRuntimeResolver resolver =
                mock(OperatorRevenueRegistryRuntimeResolver.class);
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        RevenueReportOutboxRepository outbox =
                mock(RevenueReportOutboxRepository.class);
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        OperatorRevenueReportService service = service(
                resolver,
                revenueService,
                outbox);

        var result = service.synchronizeNow();

        assertThat(result.state()).isEqualTo("DORMANT");
        assertThat(result.code()).isEqualTo("EXPLORE_MODE");
        verifyNoInteractions(resolver, revenueService, outbox);
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
}
