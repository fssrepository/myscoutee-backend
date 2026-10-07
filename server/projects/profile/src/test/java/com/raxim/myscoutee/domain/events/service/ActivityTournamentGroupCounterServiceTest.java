package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventStageRuntimeRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class ActivityTournamentGroupCounterServiceTest {
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;

    @Test
    void writesStagePendingAndAggregateActivityToParentEvent() {
        ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
        runtime.setGroupResourceMetricsByAssetOwnerId(Map.of(
                "group-a", Map.of(
                        "asset-owner", Map.of(
                                "Transport", new GroupResourceMetricRecord(1, 3, 0, 4)))));
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setSubEvents(List.of(
                subEvent("stage-1", 0),
                subEvent("stage-2", 4)));

        when(activityMembersRepository.countByOwnerPatternAndStatus(
                "group",
                "^\\Qevent-1\\E:(?:\\Qstage-1\\E:|slot:.*:\\Qstage-1\\E:)",
                "pending")).thenReturn(2L);
        when(activitySubEventStageRuntimeRepository.findByOwnerPatternAndSubEventIdAndStatusNot(
                "^\\Qevent-1\\E(?:$|:slot:)",
                "stage-1",
                "D")).thenReturn(List.of(runtime));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        new ActivityTournamentGroupCounterService(
                activityMembersRepository,
                activitySubEventStageRuntimeRepository,
                activityEventsRepository)
                .syncParent("event-1", "stage-1");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> saved = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(saved.capture());
        ActivityEvent result = saved.getValue().getFirst();
        assertThat(result.getSubEvents().get(0).groupsPending()).isEqualTo(5);
        assertThat(result.getSubEvents().get(1).groupsPending()).isEqualTo(4);
        assertThat(result.getActivity()).isEqualTo(9);
    }

    @Test
    void writesMingleTablePendingToParentEventWithoutPersistedSubEvents() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setMode("Mingle");
        event.setSubEvents(List.of());

        when(activityMembersRepository.countByOwnerPatternAndStatus(
                "group",
                "^\\Qevent-1\\E:(?:\\Qmingle-round-2\\E:|slot:.*:\\Qmingle-round-2\\E:)",
                "pending")).thenReturn(1L);
        when(activitySubEventStageRuntimeRepository.findByOwnerPatternAndSubEventIdAndStatusNot(
                "^\\Qevent-1\\E(?:$|:slot:)",
                "mingle-round-2",
                "D")).thenReturn(List.of());
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityMembersRepository.countByOwnerPatternAndStatus(
                "group",
                "^\\Qevent-1\\E:mingle-round-[^:]+:table:",
                "pending")).thenReturn(3L);
        when(activitySubEventStageRuntimeRepository.findByOwnerPatternAndStatusNot(
                "^\\Qevent-1\\E(?:$|:slot:)",
                "D")).thenReturn(List.of());

        new ActivityTournamentGroupCounterService(
                activityMembersRepository,
                activitySubEventStageRuntimeRepository,
                activityEventsRepository)
                .syncParent("event-1", "mingle-round-2");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> saved = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(saved.capture());
        assertThat(saved.getValue().getFirst().getActivity()).isEqualTo(3);
    }

    private SubEventItem subEvent(String id, int groupsPending) {
        return new SubEventItem(
                id,
                id,
                "",
                null,
                null,
                "",
                "admin",
                null,
                null,
                null,
                null,
                false,
                null,
                0,
                10,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null)
                .withGroupsPending(groupsPending);
    }
}
