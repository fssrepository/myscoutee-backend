package com.raxim.myscoutee.domain.affinity.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@org.junit.jupiter.api.Tag("standard")
class AdminAffinityGraphLayoutWorkerServiceTest {
    private AdminAffinityGraphService adminAffinityGraphService;
    private NotificationRuleRegistryService notificationRuleRegistryService;
    private AdminAffinityGraphLayoutWorkerService worker;

    @BeforeEach
    void setUp() {
        adminAffinityGraphService = mock(AdminAffinityGraphService.class);
        notificationRuleRegistryService = mock(NotificationRuleRegistryService.class);
        org.mockito.Mockito.doAnswer(call -> { com.raxim.myscoutee.domain.platform.api.JobGroupContext.run(null, call.getArgument(1, Runnable.class)); return null; }).when(notificationRuleRegistryService).forEachGroup(any(String.class), any(Runnable.class));
        worker = new AdminAffinityGraphLayoutWorkerService(
                adminAffinityGraphService,
                notificationRuleRegistryService);
    }

    @Test
    void scheduledTickSkipsWhenTheRuleIsNotConfigured() {
        when(notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT))
                .thenReturn(Optional.empty());

        worker.rebuildDueLayout();

        verify(adminAffinityGraphService, never()).rebuildMaterializedLayout();
        verify(notificationRuleRegistryService).beginScheduledRun(
                any(String.class),
                any(String.class),
                any(String.class),
                any(Instant.class));
    }

    @Test
    void scheduledTickMaterializesOneLayoutAndRecordsItsLinkCount() {
        NotificationRuleConfig rule = configuredRule();
        when(notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT))
                .thenReturn(Optional.of(rule));
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(Instant.class)))
                .thenReturn(true);
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(String.class),
                eq("affinity-graph-layout"),
                any(Instant.class)))
                .thenReturn(rule);
        when(adminAffinityGraphService.rebuildMaterializedLayout())
                .thenReturn(new AdminAffinityGraphMetaDto(
                        "2026-08-04T10:00:00Z",
                        "materialized",
                        "layout-1",
                        54,
                        313,
                        1,
                        0,
                        6,
                        256,
                        1000,
                        5000,
                        true));

        worker.rebuildDueLayout();

        verify(adminAffinityGraphService).rebuildMaterializedLayout();
        verify(notificationRuleRegistryService, never()).findRule(any(String.class));
        verify(notificationRuleRegistryService, never()).shouldRunScheduledRule(any(String.class), any(Instant.class));
        verify(notificationRuleRegistryService).recordRun(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                eq(313),
                eq("completed"),
                contains("54 members and 313 links"),
                eq("affinity-graph-layout"),
                any(Instant.class));
    }

    @Test
    void scheduledTickDoesNotBuildWhenAnotherInstanceOwnsTheRun() {
        NotificationRuleConfig rule = configuredRule();
        when(notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT))
                .thenReturn(Optional.of(rule));
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(Instant.class)))
                .thenReturn(true);
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(String.class),
                eq("affinity-graph-layout"),
                any(Instant.class)))
                .thenReturn(null);

        worker.rebuildDueLayout();

        verify(adminAffinityGraphService, never()).rebuildMaterializedLayout();
    }

    @Test
    void scheduledTickRecordsAFailedBuild() {
        NotificationRuleConfig rule = configuredRule();
        when(notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT))
                .thenReturn(Optional.of(rule));
        when(notificationRuleRegistryService.shouldRunScheduledRule(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(Instant.class)))
                .thenReturn(true);
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                any(String.class),
                eq("affinity-graph-layout"),
                any(Instant.class)))
                .thenReturn(rule);
        when(adminAffinityGraphService.rebuildMaterializedLayout())
                .thenThrow(new IllegalStateException("layout write failed"));

        worker.rebuildDueLayout();

        verify(notificationRuleRegistryService).recordRun(
                eq(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT),
                eq(0),
                eq("failed"),
                eq("layout write failed"),
                eq("affinity-graph-layout"),
                any(Instant.class));
    }

    private NotificationRuleConfig configuredRule() {
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setRuleKey(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT);
        rule.setEnabled(true);
        return rule;
    }
}
