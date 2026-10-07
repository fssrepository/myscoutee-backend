package com.raxim.myscoutee.domain.operator.repository;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.affinity.api.RatingMeasurement;
import com.raxim.myscoutee.domain.events.api.EventMeasurement;
import com.raxim.myscoutee.domain.chat.api.ChatMeasurement;
import com.raxim.myscoutee.domain.assets.api.AssetMeasurement;
import com.raxim.myscoutee.domain.accounts.api.MeasurementEligibility;

@Tag("standard")
class MongoQualifiedMauEvidenceRepositoryTest {
    private final Instant start = Instant.parse("2026-06-01T00:00:00Z"), end = Instant.parse("2026-07-01T00:00:00Z");
    private final RatingMeasurement ratings = mock(RatingMeasurement.class);
    private final EventMeasurement events = mock(EventMeasurement.class);
    private final ChatMeasurement chats = mock(ChatMeasurement.class);
    private final AssetMeasurement assets = mock(AssetMeasurement.class);
    private final MeasurementEligibility eligibility = mock(MeasurementEligibility.class);
    private final List<EvidenceCursor> cursors = new ArrayList<>();
    private final MongoQualifiedMauEvidenceRepository repository = new MongoQualifiedMauEvidenceRepository(ratings, events, chats, assets, eligibility);

    @Test void mergesAllSourcesBeforeBoundedEligibilityAndClosesEveryCursor() {
        List<MeasurementEvidence> rows = new ArrayList<>();
        for (int i = 0; i < 1005; i++) rows.add(new MeasurementEvidence("a", "rate", start.plusSeconds(i).toString(), "r" + i));
        doReturn(cursor(rows)).when(ratings).rates(start, end);
        doReturn(cursor(List.of(new MeasurementEvidence("a", "join", start.plusSeconds(1).toString(), "j")))).when(events).joins(start, end);
        doReturn(cursor(List.of(new MeasurementEvidence("b", "message", start.toString(), "m")))).when(chats).messages(start, end);
        doReturn(cursor(List.of())).when(events).hosts(start, end);
        doReturn(cursor(List.of())).when(assets).bookings(start, end);
        doReturn(cursor(List.of())).when(events).attendance(start, end);
        when(eligibility.eligible(anyCollection())).thenReturn(Set.of("a"));
        var actual = new ArrayList<QualifiedMauEvidenceRepository.QualifiedMauActionEvidence>();
        repository.read(start, end, actual::add);
        assertThat(actual).hasSize(1006);
        assertThat(actual.subList(0, 3)).extracting(QualifiedMauEvidenceRepository.QualifiedMauActionEvidence::actionType).containsExactly("rate", "join", "rate");
        verify(eligibility, times(2)).eligible(anyCollection());
        for (var cursor : cursors) verify(cursor).close();
    }

    @Test void closesAlreadyOpenedStreamsWhenAnotherOwnerFails() {
        doReturn(cursor(List.of())).when(ratings).rates(start, end);
        when(events.joins(start, end)).thenThrow(new IllegalStateException("owner unavailable"));
        assertThatThrownBy(() -> repository.read(start, end, ignored -> {})).hasMessage("owner unavailable");
        verify(cursors.getFirst()).close();
        verifyNoInteractions(eligibility);
    }
    private EvidenceCursor cursor(List<MeasurementEvidence> rows) {
        var iterator = rows.iterator(); var cursor = mock(EvidenceCursor.class);
        when(cursor.hasNext()).thenAnswer(call -> iterator.hasNext());
        when(cursor.next()).thenAnswer(call -> iterator.next()); cursors.add(cursor); return cursor;
    }
}
