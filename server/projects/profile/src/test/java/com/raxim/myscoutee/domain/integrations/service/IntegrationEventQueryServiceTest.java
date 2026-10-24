package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleRound;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMingleRoundsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMingleSessionsRepository;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationExternalIdsRepository;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;



@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class IntegrationEventQueryServiceTest {
    @Mock ActivityEventsRepository events;
    @Mock ActivityMingleRoundsRepository rounds;
    @Mock ActivityMingleSessionsRepository sessions;
    @Mock IntegrationExternalIdsRepository mappings;
    IntegrationEventQueryService service;

    @BeforeEach void setup() { service = new IntegrationEventQueryService(new com.raxim.myscoutee.domain.events.service.EventOwnershipService(events, null), new com.raxim.myscoutee.domain.events.service.MingleEncounterService(sessions, rounds, null, null), mappings); }

    @Test void exportsUniqueCompletedTablePairsWithPartnerIdentifiersWithoutReadingRatings() {
        ActivityEvent event = ownedEvent();
        event.setSourceLink("https://organizer.test/my-event");
        var session = new ActivityMingleSession();
        session.setStatus("COMPLETED"); session.setRevision(7);
        when(sessions.findByEventId("event")).thenReturn(Optional.of(session));
        var first = new ActivityMingleRound();
        first.setTables(List.of(new ActivityMingleRound.TableAssignment(1, List.of("private-a", "private-b", "private-a"))));
        var second = new ActivityMingleRound();
        second.setTables(List.of(new ActivityMingleRound.TableAssignment(1, List.of("private-b", "private-a", "private-c"))));
        when(rounds.findByEventIdInAndStatusOrderByRoundNumberAsc(List.of("event"), "COMPLETED")).thenReturn(List.of(first, second));
        var mapping = new IntegrationExternalId(); mapping.setInternalId("private-a"); mapping.setExternalId("partner-42");
        when(mappings.findByOwnerUserIdAndResourceTypeAndInternalIdIn(eq("owner"), eq("participant"), anyCollection())).thenReturn(List.of(mapping));

        var firstPage = service.encounters("owner", "event", 0, 2);
        assertThat(firstPage.total()).isEqualTo(3);
        assertThat(firstPage.nextOffset()).isEqualTo(2);
        assertThat(firstPage.revision()).isEqualTo(7);
        assertThat(firstPage.pairs()).allSatisfy(pair -> {
            assertThat(pair.first().id()).isEqualTo("partner-42");
            assertThat(pair.first().externalId()).doesNotContain("private");
            assertThat(pair.second().externalId()).doesNotContain("private");
        });
        var lastPage = service.encounters("owner", "event", 2, 2);
        assertThat(lastPage.pairs()).hasSize(1);
        assertThat(lastPage.nextOffset()).isNull();
        assertThat(service.event("owner", "event").sourceLink()).isEqualTo(event.getSourceLink());
    }

    @Test void deniesUnmanagedEventsAndIncompleteSessions() {
        assertThatThrownBy(() -> service.encounters("outsider", "event", 0, 10)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(rounds, sessions, mappings);
        ownedEvent();
        var session = new ActivityMingleSession(); session.setStatus("ROUND");
        when(sessions.findByEventId("event")).thenReturn(Optional.of(session));
        assertThatThrownBy(() -> service.encounters("owner", "event", 0, 10)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(rounds);
    }

    private ActivityEvent ownedEvent() {
        var event = new ActivityEvent(); event.setSourceId("event"); event.setOwnerUserId("owner"); event.setCreatorUserId("owner"); event.setMode("Mingle");
        when(events.findByOwnerUserIdAndSourceId("owner", "event")).thenReturn(Optional.of(event));
        return event;
    }
}
