package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventLeaderboardEntry;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventLeaderboardEntriesRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
class ActivitiesEventLeaderboardServiceTest {
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private AccessControlService accessControlService;

    @Test
    void materializeGeneratedGroupsPersistsGeneratedSubEventGroups() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
                eventLeaderboardEntriesRepository,
                activitiesMembersService,
                accessControlService);

        ActivityEvent hostingRecord = eventRecord("event-1", true);
        ActivityEvent eventsRecord = eventRecord("event-1", false);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(hostingRecord, eventsRecord));

        List<SubEventGroupItemDto> groups = service.materializeGeneratedGroups("event-1", "sub-1");

        assertThat(groups).extracting(SubEventGroupItemDto::id)
                .containsExactly("sub-1:group:1", "sub-1:group:2");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Iterable<ActivityEvent>> captor = ArgumentCaptor.forClass(Iterable.class);
        verify(activityEventsRepository).saveAll(captor.capture());
        List<ActivityEvent> saved = StreamSupport.stream(captor.getValue().spliterator(), false).toList();
        assertThat(saved).hasSize(2);
        assertThat(saved)
                .allSatisfy(record -> assertThat(record.getSubEvents().get(0).groups())
                        .extracting(SubEventGroupItemDto::id)
                        .containsExactly("sub-1:group:1", "sub-1:group:2"));
    }

    @Test
    void upsertEntryRejectsDeniedActorBeforeSavingEntry() {
        ActivitiesEventLeaderboardService service = new ActivitiesEventLeaderboardService(
                activityEventsRepository,
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

    private ActivityEvent eventRecord(String sourceId, boolean hosting) {
        ActivityEvent record = new ActivityEvent();
        record.setSourceId(sourceId);
        record.setPublished(true);
        record.setIsHosting(hosting);
        record.setSubEvents(List.of(subEvent("sub-1", 2, 3, 4)));
        return record;
    }

    private SubEventFormItemDto subEvent(String id, Integer groupCount, Integer groupCapacityMin, Integer groupCapacityMax) {
        return new SubEventFormItemDto(
                id,
                "Tournament",
                null,
                null,
                null,
                null,
                null,
                List.of(),
                groupCount,
                groupCapacityMin,
                groupCapacityMax,
                "Score",
                1,
                false,
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
                null,
                null,
                null,
                null);
    }
}
