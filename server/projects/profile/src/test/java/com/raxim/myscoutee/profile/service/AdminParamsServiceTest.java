package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsHistoryDto;
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
    void saveNotifiesConfiguredAdminAudienceForParameterRecompute() {
        AffinityConfigsRepository repository = mock(AffinityConfigsRepository.class);
        NotificationOutboxService notificationOutboxService = mock(NotificationOutboxService.class);
        AdminAudienceService adminAudienceService = mock(AdminAudienceService.class);
        AffinityRecomputeTaskService affinityRecomputeTaskService = mock(AffinityRecomputeTaskService.class);
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

        service(repository, notificationOutboxService, adminAudienceService, affinityRecomputeTaskService)
                .save(new AdminParamsSaveRequestDto("admin-demo-ava", "matching", List.of(), null));

        verify(affinityRecomputeTaskService).enqueueConfigChanged(eq("default"), eq("admin-demo-ava"));
        ArgumentCaptor<NotificationIntent> notification = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(notification.capture());
        assertThat(notification.getValue().recipientUserIds())
                .containsExactly("admin-demo-ava", "admin-demo-noel");
        assertThat(notification.getValue().recipientScope()).isEqualTo("admins");
        assertThat(notification.getValue().payload())
                .containsEntry("recomputeScope", "config")
                .containsEntry("sectionKey", "matching");
    }

    private AdminParamsService service(AffinityConfigsRepository repository) {
        return service(repository, mock(NotificationOutboxService.class), mock(AdminAudienceService.class), mock(AffinityRecomputeTaskService.class));
    }

    private AdminParamsService service(
            AffinityConfigsRepository repository,
            NotificationOutboxService notificationOutboxService,
            AdminAudienceService adminAudienceService,
            AffinityRecomputeTaskService affinityRecomputeTaskService) {
        ObjectMapper objectMapper = JsonMapper.builder().build();
        return new AdminParamsService(
                repository,
                objectMapper,
                notificationOutboxService,
                adminAudienceService,
                affinityRecomputeTaskService);
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
