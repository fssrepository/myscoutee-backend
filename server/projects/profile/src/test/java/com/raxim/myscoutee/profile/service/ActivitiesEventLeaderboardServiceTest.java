package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.mockito.ArgumentCaptor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.EventLeaderboardEntry;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupsStateDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventGroupsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.EventLeaderboardEntriesRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
class ActivitiesEventLeaderboardServiceTest {
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivitySubEventGroupsRepository activitySubEventGroupsRepository;
    @Mock
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    @Mock
    private EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private AccessControlService accessControlService;

    @Test
    void materializeGeneratedGroupsReturnsGeneratedSubEventGroupsWithoutPersistingThem() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);

        ActivityEvent firstRecord = eventRecord("event-1", "first");
        ActivityEvent secondRecord = eventRecord("event-1", "second");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(firstRecord, secondRecord));

        List<SubEventGroupItemDto> groups = service.materializeGeneratedGroups("event-1", "sub-1");

        assertThat(groups).extracting(SubEventGroupItemDto::id)
                .containsExactly("sub-1:group:1", "sub-1:group:2");

        verify(activityEventsRepository, never()).saveAll(any());
    }

    @Test
    void tournamentGroupsDeriveStagesAndGroupsFromEditorDefinitions() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        ActivityEvent record = eventRecord("event-1", "canonical");
        record.setSubEvents(List.of());
        record.setSubEventDefinitions(List.of(new SubEventDefinitionDto(
                "stage-1", "Opening round", "Saved definition", "After previous",
                0, 30, "Arena", 2, 4, "Score", 1, false, null, 2, 8, null)));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(record));

        EventTournamentGroupsStateDto state = service.queryTournamentGroups("host", "event-1");

        assertThat(state.stages()).singleElement().satisfies(stage -> {
            assertThat(stage.subEventId()).isEqualTo("stage-1");
            assertThat(stage.groups()).hasSize(2);
        });
    }

    @Test
    void tournamentStageGroupsUseGroupChannelOwnerForAcceptedAndPendingMembers() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        ActivityEvent record = eventRecord("event-1", "canonical");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(record));
        String groupOwnerId = "event-1:sub-1:sub-1:group:1";
        when(activitiesMembersService.queryMembers("group", groupOwnerId)).thenReturn(List.of(
                activityMember("accepted-member", "accepted"),
                activityMember("pending-member", "pending")));

        var groups = service.queryTournamentStageGroups("event-1", null, "sub-1");

        assertThat(groups).hasSize(2);
        assertThat(groups.getFirst()).satisfies(group -> {
            assertThat(group.membersAccepted()).isEqualTo(1);
            assertThat(group.membersPending()).isEqualTo(1);
        });
        verify(activitiesMembersService).queryMembers("group", groupOwnerId);
    }

    @Test
    void tournamentStageGroupsReturnPersistedRuntimeResourceMetrics() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        ActivityEvent record = eventRecord("event-1", "canonical");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(record));
        ActivitySubEventStageRuntime runtime = new ActivitySubEventStageRuntime();
        runtime.setOwnerId("event-1");
        runtime.setSubEventId("sub-1");
        runtime.setGroupResourceMetricsByAssetOwnerId(Map.of(
                "sub-1:group:1",
                Map.of(
                        "owner-1", Map.of("Transport", new GroupResourceMetricRecord(1, 2, 0, 4)),
                        "owner-2", Map.of("Transport", new GroupResourceMetricRecord(2, 1, 1, 3)))));
        when(activitySubEventStageRuntimeRepository.findByOwnerIdAndSubEventId("event-1", "sub-1"))
                .thenReturn(java.util.Optional.of(runtime));

        var groups = service.queryTournamentStageGroups("event-1", null, "sub-1");

        assertThat(groups.getFirst().resourceMetricsByType().get("Transport")).satisfies(metric -> {
            assertThat(metric.accepted()).isEqualTo(3);
            assertThat(metric.pending()).isEqualTo(3);
            assertThat(metric.capacityMin()).isEqualTo(1);
            assertThat(metric.capacityMax()).isEqualTo(7);
        });
        assertThat(groups.get(1).resourceMetricsByType()).isEmpty();
    }

    @Test
    void upsertEntryRejectsDeniedActorBeforeSavingEntry() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        when(accessControlService.canCurrentActorSubmitLeaderboardEntry("member-1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.upsertEntry(new EventLeaderboardEntryUpsertRequestDto(
                "member-1",
                "event-1",
                "sub-1",
                "group-1",
                "Score",
                "member-1",
                10,
                "note",
                null,
                null,
                null,
                null)))
                .hasMessageContaining("leaderboard entry");

        verify(eventLeaderboardEntriesRepository, never()).save(any(EventLeaderboardEntry.class));
    }

    @Test
    void virtualSlotLeaderboardUsesParentDefinitionAndKeepsEntriesScopedToSlot() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        String slotId = "event-1:slot:slot-1:2026-06-15T13:30:00Z";
        ActivityEvent parent = eventRecord("event-1", "canonical");
        EventLeaderboardEntry existingEntry = new EventLeaderboardEntry();
        existingEntry.setId("entry-1");
        existingEntry.setEventId(slotId);
        existingEntry.setSubEventId("sub-1");
        existingEntry.setGroupId("sub-1:group:1");
        existingEntry.setEntryType("score");
        existingEntry.setMemberId("sub-1:group:1-member-1");
        existingEntry.setScoreValue(7);
        existingEntry.setCreatedAtIso("2026-07-22T17:24:59Z");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(eventLeaderboardEntriesRepository.findByEventIdAndSubEventId(slotId, "sub-1"))
                .thenReturn(List.of(existingEntry));
        when(activitiesMembersService.queryMembers(anyString(), anyString())).thenReturn(List.of());

        var state = service.queryState(slotId, "sub-1");

        assertThat(state.eventId()).isEqualTo(slotId);
        assertThat(state.groups()).hasSize(2);
        assertThat(state.groups().getFirst().scoreRows()).hasSize(4);
        assertThat(state.groups().getFirst().scoreRows().getFirst()).satisfies(row -> {
            assertThat(row.memberId()).isEqualTo("sub-1:group:1-member-1");
            assertThat(row.memberName()).isEqualTo("-----");
            assertThat(row.total()).isEqualTo(7);
            assertThat(row.updates()).isEqualTo(1);
        });
        verify(activityEventsRepository).findBySourceId("event-1");
        verify(activityEventsRepository, never()).findBySourceId(slotId);
    }

    @Test
    void leaderboardKeepsAcceptedMembersBeforeCapacityPlaceholders() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        ActivityEvent event = eventRecord("event-1", "canonical");
        String groupOwnerId = "event-1:sub-1:sub-1:group:1";
        EventLeaderboardEntry placeholderScore = new EventLeaderboardEntry();
        placeholderScore.setId("placeholder-score");
        placeholderScore.setEventId("event-1");
        placeholderScore.setSubEventId("sub-1");
        placeholderScore.setGroupId("sub-1:group:1");
        placeholderScore.setEntryType("score");
        placeholderScore.setMemberId("sub-1:group:1-member-1");
        placeholderScore.setScoreValue(41);
        placeholderScore.setCreatedAtIso("2026-07-22T17:24:59Z");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(eventLeaderboardEntriesRepository.findByEventIdAndSubEventId("event-1", "sub-1"))
                .thenReturn(List.of(placeholderScore));
        when(activitiesMembersService.queryMembers("group", groupOwnerId))
                .thenReturn(List.of(activityMember("accepted-user", "accepted")));

        var state = service.queryState("event-1", "sub-1");

        assertThat(state.groups().getFirst().members())
                .extracting(member -> member.memberName())
                .containsExactly("accepted-user", "-----", "-----", "-----");
        assertThat(state.groups().getFirst().scoreRows())
                .extracting(row -> row.memberName())
                .containsExactly("accepted-user", "-----", "-----", "-----");
    }

    @Test
    void virtualSlotScoreAuthorizesAgainstParentAndPersistsAgainstSlot() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                activitySubEventGroupsRepository,
                activitySubEventStageRuntimeRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);
        String slotId = "event-1:slot:slot-1:2026-06-15T13:30:00Z";
        ActivityEvent parent = eventRecord("event-1", "canonical");
        when(accessControlService.canCurrentActorSubmitLeaderboardEntry("member-1", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));
        when(eventLeaderboardEntriesRepository.findByEventIdAndSubEventId(slotId, "sub-1")).thenReturn(List.of());
        when(activitiesMembersService.queryMembers(anyString(), anyString())).thenReturn(List.of());

        service.upsertEntry(new EventLeaderboardEntryUpsertRequestDto(
                "member-1",
                slotId,
                "sub-1",
                "sub-1:group:1",
                "Score",
                "member-1",
                4,
                "note",
                null,
                null,
                null,
                null));

        verify(accessControlService).canCurrentActorSubmitLeaderboardEntry("member-1", "event-1");
        ArgumentCaptor<EventLeaderboardEntry> entryCaptor = ArgumentCaptor.forClass(EventLeaderboardEntry.class);
        verify(eventLeaderboardEntriesRepository).save(entryCaptor.capture());
        assertThat(entryCaptor.getValue().getEventId()).isEqualTo(slotId);
        assertThat(entryCaptor.getValue().getScoreValue()).isEqualTo(4);
    }

    private ActivityEvent eventRecord(String sourceId, String suffix) {
        ActivityEvent record = new ActivityEvent();
        record.setId(sourceId + ":" + suffix);
        record.setSourceId(sourceId);
        record.setStatus(ActivityEvent.STATUS_ACTIVE);
        record.setSubEvents(List.of(subEvent("sub-1", 2, 3, 4)));
        return record;
    }

    private SubEventItem subEvent(String id, Integer groupCount, Integer groupCapacityMin, Integer groupCapacityMax) {
        return new SubEventItem(
                id,
                "Tournament",
                null,
                null,
                null,
                null,
                null,
                groupCapacityMin,
                groupCapacityMax,
                "Score",
                1,
                false,
                null,
                null,
                groupCount == null || groupCapacityMax == null ? null : groupCount * groupCapacityMax,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    private ActivityMemberEntryDto activityMember(String userId, String status) {
        return new ActivityMemberEntryDto(
                "member-" + userId,
                userId,
                userId,
                "U",
                "male",
                "",
                status,
                "Member",
                status,
                null,
                null,
                null,
                false,
                null,
                null,
                "",
                null,
                null,
                List.of());
    }
}
