package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsHistoryDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsRevertRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsStateDto;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

class AdminParamsServiceTest {
    @Test
    void historyReturnsOnlySectionChangesAndInitialSeed() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        AffinityConfig seed = config(1, false, "seed", "Initial parameter seed.");
        AffinityConfig profile = config(2, false, "profile", "Balanced profile, workplace, school, and trait inputs.");
        AffinityConfig matching = config(3, false, "matching", "Raised inside-network confidence after graph review.");
        AffinityConfig events = config(4, false, "events", "Adjusted host confidence and open-capacity boost.");
        AffinityConfig assets = config(5, true, "assets", "Added owner confidence and request pressure to asset ranking.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(assets));
        when(repository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of(assets, events, matching, profile, seed));

        AdminParamsHistoryDto history = service(repository).history("matching");

        assertThat(history.versions())
                .extracting(item -> item.version())
                .containsExactly(3, 1);
        assertThat(history.versions().getFirst().active()).isTrue();
        assertThat(history.versions().getFirst().summaryKey()).isEqualTo("admin.params.summary.matching.raised");
        assertThat(history.versions().getLast().active()).isFalse();
        assertThat(history.versions().getLast().summaryKey()).isEqualTo("admin.params.summary.initial.seed");

        AdminParamsStateDto state = service(repository).state("admin");
        assertThat(state.sections())
                .filteredOn(section -> "assets".equals(section.key()))
                .singleElement()
                .satisfies(section -> {
                    assertThat(section.version()).isEqualTo(5);
                    assertThat(section.summaryKey()).isEqualTo("admin.params.summary.assets.adjusted");
                });
        assertThat(state.sections())
                .filteredOn(section -> "discovery".equals(section.key()))
                .singleElement()
                .satisfies(section -> {
                    assertThat(section.version()).isEqualTo(1);
                    assertThat(section.summaryKey()).isEqualTo("admin.params.summary.initial.seed");
                });
    }

    @Test
    void saveNotifiesOtherConfiguredAdminsForParameterRecompute() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AdminAudienceService adminAudienceService = mock(AdminAudienceService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        AdminTelemetryService adminTelemetryService = mock(AdminTelemetryService.class);
        AffinityConfig current = config(1, true, "seed", "Initial parameter seed.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(current));
        when(repository.findByActiveTrue()).thenReturn(List.of(current));
        when(repository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.of(current));
        when(repository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of(current));
        when(repository.save(any(AffinityConfig.class))).thenAnswer(invocation -> {
            AffinityConfig saved = invocation.getArgument(0);
            if (saved.getId() == null) {
                saved.setId("params-v2");
            }
            return saved;
        });
        when(adminAudienceService.adminNotificationRecipientUserIds("admin-demo-ava"))
                .thenReturn(List.of("admin-demo-ava", "admin-demo-noel"));

        service(repository, notificationOutboxService, adminAudienceService, affinityRecomputeTaskService, adminTelemetryService)
                .save(new AdminParamsSaveRequestDto("admin-demo-ava", "matching", List.of(), null));

        verify(affinityRecomputeTaskService).enqueueConfigChanged(eq("default"), eq("admin-demo-ava"));
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().recipientUserIds())
                .containsExactly("admin-demo-noel");
        assertThat(notification.getValue().recipientScope()).isEqualTo("admins");
        assertThat(notification.getValue().payload())
                .containsEntry("recomputeScope", "config")
                .containsEntry("sectionKey", "matching");
        @SuppressWarnings("unchecked")
        ArgumentCaptor<Map<String, String>> telemetryTags = ArgumentCaptor.forClass(Map.class);
        verify(adminTelemetryService).record(
                eq("admin.params.changed"),
                eq("jobs"),
                eq("default:matching"),
                eq("admin-demo-ava"),
                eq(1L),
                telemetryTags.capture());
        assertThat(telemetryTags.getValue())
                .containsEntry("sectionKey", "matching")
                .containsEntry("version", "2")
                .containsEntry("changeKind", "save");
    }

    @Test
    void revertEmitsTelemetryOnlyAfterPersistingASelectedVersion() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        AdminTelemetryService adminTelemetryService = mock(AdminTelemetryService.class);
        AffinityConfig previous = config(1, false, "seed", "Initial parameter seed.");
        AffinityConfig current = config(2, true, "matching", "Current matching parameters.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(current));
        when(repository.findByActiveTrue()).thenReturn(List.of(current));
        when(repository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.of(current));
        when(repository.findByKeyAndVersion("default", 1)).thenReturn(Optional.of(previous));
        when(repository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of(current, previous));
        when(repository.save(any(AffinityConfig.class))).thenAnswer(invocation -> {
            AffinityConfig saved = invocation.getArgument(0);
            if (saved.getId() == null) {
                saved.setId("params-v3");
            }
            return saved;
        });

        service(
                repository,
                mock(NotificationOutboxService.class),
                mock(AdminAudienceService.class),
                mock(AffinityRecomputeTaskService.class),
                adminTelemetryService)
                .revert("matching", new AdminParamsRevertRequestDto("admin-demo-ava", 1));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Map<String, String>> telemetryTags = ArgumentCaptor.forClass(Map.class);
        verify(adminTelemetryService).record(
                eq("admin.params.changed"),
                eq("jobs"),
                eq("default:matching"),
                eq("admin-demo-ava"),
                eq(1L),
                telemetryTags.capture());
        assertThat(telemetryTags.getValue())
                .containsEntry("sectionKey", "matching")
                .containsEntry("version", "3")
                .containsEntry("changeKind", "revert");

        AdminTelemetryService noOpTelemetry = mock(AdminTelemetryService.class);
        service(
                repository,
                mock(NotificationOutboxService.class),
                mock(AdminAudienceService.class),
                mock(AffinityRecomputeTaskService.class),
                noOpTelemetry)
                .revert("matching", new AdminParamsRevertRequestDto("admin-demo-ava", null));
        verify(noOpTelemetry, never()).record(any(), any(), any(), any(), any(Long.class), any());
    }

    @Test
    void revertingTheActiveSectionVersionHasNoSideEffectsEvenAfterAnotherSectionChanges() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        NotificationOutboxService outbox = mock(NotificationOutboxService.class);
        AffinityRecomputeTaskService tasks = mock(AffinityRecomputeTaskService.class);
        AdminTelemetryService telemetry = mock(AdminTelemetryService.class);
        AffinityConfig jobs = config(2, false, "jobs", "Jobs update.");
        AffinityConfig current = config(3, true, "matching", "Matching update.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(current));
        when(repository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of(current, jobs));

        service(repository, outbox, mock(AdminAudienceService.class), tasks, telemetry)
                .revert("jobs", new AdminParamsRevertRequestDto("admin-demo-ava", 2));

        verify(repository, never()).save(any(AffinityConfig.class));
        org.mockito.Mockito.verifyNoInteractions(outbox, tasks, telemetry);
    }

    @Test
    void persistedVersionStillEmitsTelemetryWhenAQueuedSideEffectFails() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
        AdminTelemetryService adminTelemetryService = mock(AdminTelemetryService.class);
        AffinityConfig current = config(1, true, "seed", "Initial parameter seed.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(current));
        when(repository.findByActiveTrue()).thenReturn(List.of(current));
        when(repository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.of(current));
        when(repository.save(any(AffinityConfig.class))).thenAnswer(invocation -> invocation.getArgument(0));
        org.mockito.Mockito.doThrow(new IllegalStateException("queue unavailable"))
                .when(affinityRecomputeTaskService)
                .enqueueConfigChanged("default", "admin-demo-ava");
        AdminParamsService service = service(
                repository,
                mock(NotificationOutboxService.class),
                mock(AdminAudienceService.class),
                affinityRecomputeTaskService,
                adminTelemetryService);

        assertThatThrownBy(() -> service.save(
                new AdminParamsSaveRequestDto("admin-demo-ava", "matching", List.of(), null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("queue unavailable");

        verify(adminTelemetryService).record(
                eq("admin.params.changed"),
                eq("jobs"),
                eq("default:matching"),
                eq("admin-demo-ava"),
                eq(1L),
                any());
    }

    @Test
    void rejectedVersionDoesNotEmitTelemetry() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        AdminTelemetryService adminTelemetryService = mock(AdminTelemetryService.class);
        AffinityConfig current = config(1, true, "seed", "Initial parameter seed.");
        when(repository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(current));
        when(repository.findByActiveTrue()).thenReturn(List.of(current));
        when(repository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.of(current));
        when(repository.save(any(AffinityConfig.class)))
                .thenAnswer(invocation -> invocation.getArgument(0))
                .thenThrow(new IllegalStateException("persist rejected"));
        AdminParamsService service = service(
                repository,
                mock(NotificationOutboxService.class),
                mock(AdminAudienceService.class),
                mock(AffinityRecomputeTaskService.class),
                adminTelemetryService);

        assertThatThrownBy(() -> service.save(
                new AdminParamsSaveRequestDto("admin-demo-ava", "matching", List.of(), null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("persist rejected");

        verify(adminTelemetryService, never()).record(any(), any(), any(), any(), any(Long.class), any());
    }

    private AdminParamsService service(AffinityConfigsRepository repository) {
        return service(
                repository,
                mock(NotificationOutboxService.class),
                mock(AdminAudienceService.class),
                mock(AffinityRecomputeTaskService.class),
                mock(AdminTelemetryService.class));
    }

    private AdminParamsService service(
            AffinityConfigsRepository repository,
            NotificationOutboxService notificationOutboxService,
            AdminAudienceService adminAudienceService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService) {
        ObjectMapper objectMapper = JsonMapper.builder().build();
        return new AdminParamsService(
                repository,
                objectMapper,
                notificationOutboxService,
                adminAudienceService,
                affinityRecomputeTaskService,
                adminTelemetryService);
    }

    private AffinityConfig config(int version, boolean active, String changedSection, String summary) {
        AffinityConfig config = AffinityConfig.defaults();
        config.setId("params-v" + version);
        config.setKey("default");
        config.setVersion(version);
        config.setActive(active);
        config.setChangedSection(changedSection);
        config.setChangedDate("2026-05-0" + Math.min(version, 9) + "T09:00:00.000Z");
        config.setChangedUser(version == 1 ? "system" : "admin-demo-ava");
        config.setChangeSummary(summary);
        return config;
    }
}
