package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.content.service.AdminModerationService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.administration.document.AdminMonitoringSnapshot;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminMonitoringCategoryDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminMonitoringMetricDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminMonitoringNodeDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminMonitoringStateDto;
import com.raxim.myscoutee.domain.administration.repository.AdminMonitoringRepository;

@org.junit.jupiter.api.Tag("standard")
class AdminMonitoringServiceTest {
    @Test
    void stateContainsEightUniqueCategoriesAndStableFilterCounts() {
        AdminMonitoringSnapshot snapshot = AdminMonitoringSnapshot.createDefault("global");
        AdminMonitoringService service = service(snapshot);

        AdminMonitoringStateDto state = service.state("admin-user");

        assertThat(state.categories())
                .extracting(AdminMonitoringCategoryDto::key)
                .containsExactly("users", "events", "members", "assets", "matching", "chat", "notifications", "jobs")
                .doesNotHaveDuplicates();
        assertThat(state.filterCounts())
                .containsEntry("all", 8L)
                .containsEntry("domains", 5L)
                .containsEntry("delivery", 1L)
                .containsEntry("workers", 2L);
    }

    @Test
    void jobLifecycleAndParameterEventsProjectToExactMetrics() {
        AdminMonitoringSnapshot snapshot = AdminMonitoringSnapshot.createDefault("global");
        AdminMonitoringService service = service(snapshot);
        service.applyTelemetryEvents(List.of(
                event("admin.params.changed", 1L),
                event("jobs.config.saved", 1L),
                event("jobs.run.started", 1L),
                event("jobs.run.completed", 1L),
                event("jobs.run.failed", 1L)), "12-0");

        AdminMonitoringStateDto state = service.state("admin-user");
        AdminMonitoringCategoryDto jobs = state.categories().stream()
                .filter(category -> "jobs".equals(category.key()))
                .findFirst()
                .orElseThrow();

        assertThat(metric(jobs, "jobs.config", "config-changes").value()).isEqualTo(2L);
        assertThat(metric(jobs, "jobs.scheduler", "scheduled-triggers").value()).isEqualTo(1L);
        assertThat(metric(jobs, "jobs.audit", "audit-events").value()).isEqualTo(2L);
        assertThat(jobs.health()).isEqualTo("alert");
        assertThat(state.health()).isEqualTo("alert");
    }

    private AdminMonitoringService service(AdminMonitoringSnapshot snapshot) {
        AdminMonitoringRepository repository = mock(AdminMonitoringRepository.class);
        when(repository.ensureGlobalSnapshot()).thenReturn(snapshot);
        when(repository.globalSnapshotOrDefault()).thenReturn(snapshot);
        var admin = mock(AdminModerationService.class);
        when(admin.baseProfileEvents(org.mockito.ArgumentMatchers.anyList()))
                .thenAnswer(invocation -> Map.of("global", invocation.getArgument(0)));
        return new AdminMonitoringService(repository, admin);
    }

    private AdminTelemetryEvent event(String eventKey, Long amount) {
        return new AdminTelemetryEvent(
                eventKey,
                "jobs",
                "fixture-rule",
                "fixture-runner",
                amount,
                "2026-08-04T03:00:00Z",
                Map.of());
    }

    private AdminMonitoringMetricDto metric(
            AdminMonitoringCategoryDto category,
            String nodeId,
            String metricKey) {
        AdminMonitoringNodeDto node = category.nodes().stream()
                .filter(candidate -> nodeId.equals(candidate.id()))
                .findFirst()
                .orElseThrow();
        return node.metrics().stream()
                .filter(candidate -> metricKey.equals(candidate.key()))
                .findFirst()
                .orElseThrow();
    }
}
