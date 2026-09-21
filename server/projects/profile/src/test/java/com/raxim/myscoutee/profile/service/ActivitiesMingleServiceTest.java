package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMingleRound;
import com.raxim.myscoutee.profile.data.document.ActivityMingleRound.TableAssignment;
import com.raxim.myscoutee.profile.data.document.ActivityMingleSession;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.MingleConfigurationDto;
import com.raxim.myscoutee.profile.repository.*;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;

@ExtendWith(MockitoExtension.class)
class ActivitiesMingleServiceTest {
    @Mock ActivityEventsRepository events;
    @Mock ActivityMingleSessionsRepository sessions;
    @Mock ActivityMingleRoundsRepository rounds;
    @Mock UsersRepository users;
    @Mock UserAffinityEdgesRepository affinities;
    @Mock ActivitiesMembersService members;
    @Mock AccessControlService access;
    @Mock NotificationOutboxService notifications;
    ActivitiesMingleService service;

    @BeforeEach void setup() {
        service = new ActivitiesMingleService(events, sessions, rounds, users, affinities, members, access, notifications);
    }

    @Test void acceptedParticipantWithoutATableReceivesWaitingStateWithoutOtherTables() {
        fixture("ROUND", "ACTIVE");
        doReturn(Map.of("event-1:mingle-round-1:table:1", snapshot("peer"))).when(members).buildBatchOwnerSnapshots(eq("group"), anyCollection());
        var state = service.queryState("viewer", "event-1");
        assertThat(state.waitingForTable()).isTrue();
        assertThat(state.tableNumber()).isNull();
        assertThat(state.tables()).isEmpty();
        assertThat(state.roundNumber()).isEqualTo(1);
        verify(members).buildBatchOwnerSnapshots(eq("group"), anyCollection());
    }

    @Test void outsiderCannotReadTablesOrWaitingState() {
        fixture("ROUND", "ACTIVE");
        assertThat(service.queryState("outsider", "event-1")).isNull();
        verify(members, never()).buildBatchOwnerSnapshots(anyString(), anyCollection());
        verifyNoInteractions(users);
    }

    @Test void completedHistoryUsesTheFrozenRoster() {
        fixture("COMPLETED", "COMPLETED");
        var state = service.queryState("viewer", "event-1", 1);
        assertThat(state.tables()).singleElement().satisfies(table ->
                assertThat(table.participants()).extracting(person -> person.userId()).containsExactly("viewer", "old-peer"));
        verify(members, never()).buildBatchOwnerSnapshots(anyString(), anyCollection());
    }

    @Test void completingAPausedRoundFreezesActualMembershipIncludingAnEmptyTable() {
        ActivityMingleSession session = fixture("PAUSED", "ACTIVE");
        session.setPausedFromStatus("ROUND");
        when(access.canManageEvent("event-1", "viewer")).thenReturn(true);
        doReturn(Map.of("event-1:mingle-round-1:table:1", snapshot())).when(members).buildBatchOwnerSnapshots(eq("group"), anyCollection());
        when(sessions.save(any())).thenAnswer(call -> call.getArgument(0));

        var state = service.applyAction(new MingleActionRequestDto("event-1", "viewer", "complete"));

        assertThat(state.status()).isEqualTo("COMPLETED");
        var saved = org.mockito.ArgumentCaptor.forClass(ActivityMingleRound.class);
        verify(rounds).save(saved.capture());
        assertThat(saved.getValue().getStatus()).isEqualTo("COMPLETED");
        assertThat(saved.getValue().getCompletedAtIso()).isNotBlank();
        assertThat(saved.getValue().getTables().getFirst().memberUserIds()).isEmpty();
        assertThat(saved.getValue().getMeetingsProjected()).isNotEqualTo(true);
    }

    @Test void managerAdvanceFreezesChangedTableMembers() {
        fixture("ROUND", "ACTIVE");
        when(access.canManageEvent("event-1", "viewer")).thenReturn(true);
        doReturn(Map.of("event-1:mingle-round-1:table:1", snapshot("viewer", "new-peer"))).when(members).buildBatchOwnerSnapshots(eq("group"), anyCollection());
        when(sessions.save(any())).thenAnswer(call -> call.getArgument(0));
        var state = service.applyAction(new MingleActionRequestDto("event-1", "viewer", "next"));
        assertThat(state.status()).isEqualTo("BREAK");
        assertThat(state.tables().getFirst().participants()).extracting(person -> person.userId())
                .containsExactly("viewer", "new-peer");
        verify(members).buildBatchOwnerSnapshots(eq("group"), anyCollection());
    }

    @Test void nonManagerCannotStartOrAdvanceRounds() {
        ActivityEvent event = event();
        when(events.findBySourceId("event-1")).thenReturn(List.of(event));
        assertThatThrownBy(() -> service.applyAction(new MingleActionRequestDto("event-1", "viewer", "start")))
                .isInstanceOf(MingleActionException.class);
        verifyNoInteractions(rounds, sessions, notifications);
    }

    @Test void staleBreakConfirmationCannotEndTheAutomaticallyStartedRound() {
        when(events.findBySourceId("event-1")).thenReturn(List.of(event()));
        when(access.canManageEvent("event-1", "viewer")).thenReturn(true);
        var session = new ActivityMingleSession();
        session.setEventId("event-1");
        session.setStatus("ROUND");
        session.setCurrentRoundNumber(2);
        session.setRevision(5);
        when(sessions.findByEventId("event-1")).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> service.applyAction(new MingleActionRequestDto("event-1", "viewer", "next", 4)))
                .isInstanceOf(MingleActionException.class)
                .satisfies(error -> assertThat(((MingleActionException) error).getCode()).isEqualTo("MINGLE_STATE_CHANGED"));
        assertThat(session.getStatus()).isEqualTo("ROUND");
        assertThat(session.getRevision()).isEqualTo(5);
        verify(sessions, never()).save(any());
        verifyNoInteractions(rounds, notifications);
    }

    private ActivityMingleSession fixture(String status, String roundStatus) {
        when(events.findBySourceId("event-1")).thenReturn(List.of(event()));
        var session = new ActivityMingleSession();
        session.setEventId("event-1");
        session.setStatus(status);
        session.setCurrentRoundNumber(1);
        session.setPhaseEndsAtIso(Instant.now().plusSeconds(180).toString());
        when(sessions.findByEventId("event-1")).thenReturn(Optional.of(session));
        var round = new ActivityMingleRound();
        round.setEventId("event-1");
        round.setRoundNumber(1);
        round.setStatus(roundStatus);
        round.setTables(List.of(new TableAssignment(1, List.of("viewer", "old-peer"))));
        when(rounds.findByEventIdAndRoundNumber("event-1", 1)).thenReturn(Optional.of(round));
        return session;
    }

    private ActivityEvent event() {
        var event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setMode("Mingle");
        event.setAcceptedMemberUserIds(List.of("viewer", "peer"));
        event.setMingleConfiguration(new MingleConfigurationDto(2, 3, 15, 5, false));
        return event;
    }

    private ActivitiesMembersService.OwnerMembersSnapshot snapshot(String... ids) {
        var result = mock(ActivitiesMembersService.OwnerMembersSnapshot.class);
        when(result.acceptedMemberUserIds()).thenReturn(List.of(ids));
        return result;
    }
}
