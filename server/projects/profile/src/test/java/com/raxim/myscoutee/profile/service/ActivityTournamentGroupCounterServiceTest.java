package com.raxim.myscoutee.profile.service;

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

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;

@ExtendWith(MockitoExtension.class)
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

        when(activityMembersRepository.findByOwnerPatternAndStatus(
                "group",
                "^\\Qevent-1\\E:(?:\\Qstage-1\\E:|slot:.*:\\Qstage-1\\E:)",
                "pending")).thenReturn(List.of(
                        pendingMember("member-a"),
                        pendingMember("member-b")));
        when(activityMembersRepository.findByOwnerPatternAndStatus(
                "event",
                "^random-room:\\Qevent-1\\E:\\Qstage-1\\E:",
                "pending")).thenReturn(List.of(pendingMember("member-b")));
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

    private ActivityMember pendingMember(String userId) {
        ActivityMember member = new ActivityMember();
        member.setUserId(userId);
        member.setStatus("pending");
        return member;
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
