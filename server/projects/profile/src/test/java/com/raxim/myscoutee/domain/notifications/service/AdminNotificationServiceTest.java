package com.raxim.myscoutee.domain.notifications.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationChannelsDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationMessageDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleSaveRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRunStateDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationScheduleSlotDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationTimingDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamFieldDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamOptionDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.domain.email.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.events.service.EventScheduler;

@org.junit.jupiter.api.Tag("standard")
class AdminNotificationServiceTest {
    @Test
    void scheduledTaskResultsExposeRescheduleDueDateWithoutChangingRunnerHistory() {
        var registry = mock(NotificationRuleRegistryService.class);
        var tasks = mock(ScheduledMessageTasksRepository.class);
        var rule = rule("scheduled-messages", true, "completed", "completed");
        when(registry.findRule("scheduled-messages")).thenReturn(java.util.Optional.of(rule));
        var task = new ScheduledMessageTask();
        task.setTaskKey("user-inactivity-1");
        task.setStatus("scheduled");
        task.setLastRunStatus("scheduled");
        task.setLastRunDetail("User active; rescheduled.");
        task.setLastRunCount(0);
        task.setLastRunAtIso("2026-09-15T12:38:02Z");
        task.setDueAtIso("2026-10-15T12:35:27Z");
        when(tasks.findTop12ByBaseGroupIdAndLastRunAtIsoNotNullOrderByLastRunAtIsoDesc(null)).thenReturn(List.of(task));
        var service = service(registry, tasks);
        try {
            var state = service.ruleState("scheduled-messages", "admin-1");
            assertThat(state.runHistory()).isEmpty();
            assertThat(state.taskResults()).singleElement().satisfies(result -> {
                assertThat(result.detail()).isEqualTo("User active; rescheduled.");
                assertThat(result.status()).isEqualTo("scheduled");
                assertThat(result.affectedCount()).isZero();
                assertThat(result.nextDueAtIso()).isEqualTo("2026-10-15T12:35:27Z");
            });
            task.setStatus("completed");
            task.setLastRunStatus("completed");
            task.setLastRunCount(1);
            assertThat(service.ruleState("scheduled-messages", "admin-1").taskResults())
                    .singleElement().satisfies(result -> assertThat(result.nextDueAtIso()).isEmpty());
        } finally {
            service.shutdown();
        }
    }

    @Test
    void unrelatedJobDoesNotReadScheduledTaskResults() {
        var registry = mock(NotificationRuleRegistryService.class);
        var tasks = mock(ScheduledMessageTasksRepository.class);
        when(registry.findRule("event-random-groups"))
                .thenReturn(java.util.Optional.of(rule("event-random-groups", true, "idle", "")));
        var service = service(registry, tasks);
        try {
            assertThat(service.ruleState("event-random-groups", "admin-1").taskResults()).isEmpty();
            verify(tasks, never()).findTop12ByLastRunAtIsoNotNullOrderByLastRunAtIsoDesc();
        } finally {
            service.shutdown();
        }
    }

    @Test
    void runRejectsNonManualRuleBeforeStartingAnyWorker() {
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        NotificationRuleConfig nonManualRule = rule(
                NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER,
                true,
                "idle",
                "");
        when(registry.findRule(NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER))
                .thenReturn(java.util.Optional.of(nonManualRule));
        AdminNotificationService service = service(registry);

        try {
            var result = service.run(
                    NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER,
                    new AdminNotificationRuleRunRequestDto("admin-1"));

            assertThat(result.status()).isEqualTo("skipped");
            assertThat(result.detail())
                    .isEqualTo("This scheduled process does not support manual execution.");
            verify(registry, never()).beginRun(
                    eq(NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER),
                    org.mockito.ArgumentMatchers.anyString(),
                    org.mockito.ArgumentMatchers.anyString());
        } finally {
            service.shutdown();
        }
    }

    @Test
    void stateFiltersProcessBucketsOnTheServerAndReturnsAllCounts() {
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        when(registry.rules()).thenReturn(List.of(
                rule("ready", true, "idle", ""),
                rule("suspended", false, "suspended", ""),
                rule("running", true, "running", ""),
                rule("failed", true, "completed", "failed"),
                rule("missed", true, "completed", "skipped")));
        AdminNotificationService service = service(registry);

        try {
            AdminNotificationCenterStateDto state = service.state("admin-1", "failed");

            assertThat(state.rules())
                    .extracting(AdminNotificationRuleDto::ruleKey)
                    .containsExactly("failed", "missed");
            assertThat(state.filterCounts()).containsExactly(
                    org.assertj.core.data.MapEntry.entry("all", 5L),
                    org.assertj.core.data.MapEntry.entry("active", 2L),
                    org.assertj.core.data.MapEntry.entry("suspended", 1L),
                    org.assertj.core.data.MapEntry.entry("running", 1L),
                    org.assertj.core.data.MapEntry.entry("failed", 2L));
        } finally {
            service.shutdown();
        }
    }

    @Test
    void saveRoundTripsEveryEditableRuleValue() {
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        when(registry.saveRules(anyList(), eq("admin-1")))
                .thenAnswer(invocation -> invocation.getArgument(0));
        AdminNotificationService service = service(registry);
        AdminNotificationRuleDto completeRule = completeRule();

        try {
            AdminNotificationCenterStateDto state = service.save(
                    new AdminNotificationRuleSaveRequestDto("admin-1", List.of(completeRule)),
                    "all");

            assertThat(state.rules()).singleElement().satisfies(saved -> {
                assertThat(saved.id()).isEqualTo("rule-complete");
                assertThat(saved.ruleKey()).isEqualTo("event-random-groups");
                assertThat(saved.enabled()).isFalse();
                assertThat(saved.channels()).isEqualTo(completeRule.channels());
                assertThat(saved.timing()).isEqualTo(completeRule.timing());
                assertThat(saved.scheduleSlots()).containsExactlyElementsOf(completeRule.scheduleSlots());
                assertThat(saved.parameters()).containsExactlyElementsOf(completeRule.parameters());
                assertThat(saved.message()).isEqualTo(completeRule.message());
            });
        } finally {
            service.shutdown();
        }
    }

    private AdminNotificationService service(NotificationRuleRegistryService registry) {
        return service(registry, mock(ScheduledMessageTasksRepository.class));
    }

    private AdminNotificationService service(NotificationRuleRegistryService registry, ScheduledMessageTasksRepository tasks) {
        EmailTemplatesRepository emailTemplatesRepository = mock(EmailTemplatesRepository.class);
        when(emailTemplatesRepository.findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(null)).thenReturn(List.of());
        AdminModerationService moderation = mock(AdminModerationService.class);
        when(moderation.resolveAdminActor("admin-1"))
                .thenReturn(new AdminUserDto("admin-1", "Admin", "A", "admin@example.test", "", "", List.of()));
        return new AdminNotificationService(
                registry,
                new com.raxim.myscoutee.domain.email.service.EmailProcessCatalogService(emailTemplatesRepository, tasks),
                mock(EventScheduler.class),
                moderation,
                mock(AdminTelemetryService.class));
    }

    private NotificationRuleConfig rule(
            String ruleKey,
            boolean enabled,
            String currentStatus,
            String lastRunStatus) {
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setId("rule-" + ruleKey);
        rule.setRuleKey(ruleKey);
        rule.setLabel(ruleKey);
        rule.setTriggerKind("scheduled_process");
        rule.setEnabled(enabled);
        rule.setManualRunEnabled(false);
        rule.setAdminManageable(true);
        rule.setPriority(100);
        NotificationRuleConfig.RunState runState = new NotificationRuleConfig.RunState();
        runState.setCurrentStatus(currentStatus);
        runState.setLastRunStatus(lastRunStatus);
        rule.setRunState(runState);
        return rule;
    }

    private AdminNotificationRuleDto completeRule() {
        AdminNotificationChannelsDto channels = new AdminNotificationChannelsDto(true, true, true, true);
        AdminNotificationTimingDto timing = new AdminNotificationTimingDto(
                "interval",
                7,
                20160,
                1209600,
                2,
                "weeks",
                11,
                23,
                "14:35",
                "Europe/Bratislava",
                "@every 2 weeks @ 14:35");
        List<AdminNotificationScheduleSlotDto> slots = List.of(new AdminNotificationScheduleSlotDto(
                "slot-complete",
                "bi-weekly",
                "2026-07-20",
                4,
                "14:35",
                "Europe/Bratislava",
                "0 35 14 ? * 5",
                "event.scheduler.random-groups",
                true));
        List<AdminParamFieldDto> parameters = List.of(
                new AdminParamFieldDto(
                        "jobs.process.randomGroups.minRoomSize",
                        "Min room size",
                        "admin.params.field.jobs.process.randomGroups.minRoomSize",
                        "Matched rooms",
                        "admin.params.group.matched.rooms",
                        "number",
                        3.5d,
                        null,
                        "users",
                        List.of(),
                        "balanced",
                        "admin.params.strategy.balanced",
                        false),
                new AdminParamFieldDto(
                        "jobs.process.randomGroups.strategy",
                        "Strategy",
                        "admin.params.field.jobs.process.randomGroups.strategy",
                        "Matched rooms",
                        "admin.params.group.matched.rooms",
                        "text",
                        null,
                        "affinity",
                        "",
                        List.of(new AdminParamOptionDto(
                                "affinity",
                                "Affinity",
                                "admin.params.strategy.affinity")),
                        "affinity",
                        "admin.params.strategy.affinity",
                        false));
        AdminNotificationMessageDto message = new AdminNotificationMessageDto(
                "Push title",
                "Push body",
                "job-complete",
                "Email subject",
                "Email body",
                "/admin/jobs");
        return new AdminNotificationRuleDto(
                "rule-complete",
                "event-random-groups",
                "Matched rooms",
                "Scheduled",
                "Build matched rooms.",
                "event.scheduler.random-groups",
                "scheduled_process",
                false,
                true,
                true,
                200,
                channels,
                timing,
                slots,
                parameters,
                message,
                new AdminNotificationRunStateDto(
                        "completed",
                        100,
                        "done",
                        "2026-07-25T00:00:00Z",
                        "2026-07-25T00:00:01Z",
                        1000L,
                        "2026-07-25T00:00:01Z",
                        "",
                        "completed",
                        "done",
                        4,
                        "admin-1",
                        0,
                        "",
                        ""),
                List.of(),
                List.of(),
                "2026-07-25T00:00:01Z",
                "admin-1");
    }
}
