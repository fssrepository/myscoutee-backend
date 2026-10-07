package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.affinity.service.AdminGraphScienceService;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsBreakdownItemDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsDashboardDto;
import com.raxim.myscoutee.domain.administration.repository.AdminStatsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@org.junit.jupiter.api.Tag("standard")
class AdminStatsServiceTest {
    @Test
    void eventParticipationIncludesEveryDisplayedEventInteraction() {
        AdminStatsSnapshot snapshot = AdminStatsSnapshot.createDefault("global");
        snapshot.setCounters(Map.of(
                "event.members.changed", 5L,
                "event.member.joined", 2L,
                "event.member.invited", 3L,
                "event.feedback.submitted", 4L,
                "asset.requests.changed", 7L));
        AdminStatsRepository repository = mock(AdminStatsRepository.class);
        when(repository.globalSnapshotOrDefault()).thenReturn(snapshot);
        AdminStatsService service = new AdminStatsService(
                repository,
                mock(UsersRepository.class),
                mock(AdminModerationService.class),
                mock(AdminGraphScienceService.class));

        AdminStatsDashboardDto dashboard = service.dashboard("admin-user");
        AdminStatsBreakdownItemDto eventParticipation = dashboard.segments().stream()
                .filter(segment -> "activities".equals(segment.key()))
                .flatMap(segment -> segment.items().stream())
                .filter(item -> "event.members.changed".equals(item.key()))
                .findFirst()
                .orElseThrow();

        assertThat(eventParticipation.value()).isEqualTo(14L);
        assertThat(eventParticipation.total()).isEqualTo(21L);
    }
}
