package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationChannelsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationMessageDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRunStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationScheduleSlotDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationTimingDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamFieldDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamOptionDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.EventScheduler;

class AdminNotificationServiceTest {
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
        EmailTemplatesRepository emailTemplatesRepository = mock(EmailTemplatesRepository.class);
        when(emailTemplatesRepository.findByEnabledTrueOrderByTemplateKeyAsc()).thenReturn(List.of());
        AdminModerationService moderation = mock(AdminModerationService.class);
        when(moderation.resolveAdminActor("admin-1"))
                .thenReturn(new AdminUserDto("admin-1", "Admin", "A", "admin@example.test", "", "", List.of()));
        return new AdminNotificationService(
                registry,
                emailTemplatesRepository,
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
                        "completed",
                        "done",
                        4,
                        "admin-1"),
                List.of(),
                "2026-07-25T00:00:01Z",
                "admin-1");
    }
}
