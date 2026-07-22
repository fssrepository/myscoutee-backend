package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventLeaderboardEntry;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupsStateDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
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
            assertThat(stage.id()).isEqualTo("stage-1");
            assertThat(stage.groups()).hasSize(2);
        });
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
}
