package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.repository.MongoQualifiedMauEvidenceRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauEvidenceRepository.QualifiedMauActionEvidence;

class OperatorQualifiedMauCalculatorTest {
    @Test
    void countsOnlyHumansWithSubstantiveActionsOnTwoUtcDays() {
        OperatorQualifiedMauCalculator calculator = calculator(List.of(
                evidence(
                        "user-a",
                        MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                        "2026-06-01T00:00:00Z",
                        "message-1"),
                evidence(
                        "user-a",
                        MongoQualifiedMauEvidenceRepository.ACTION_HOST,
                        "2026-06-30T23:59:59Z",
                        "event-1"),
                evidence(
                        "user-b",
                        MongoQualifiedMauEvidenceRepository.ACTION_RATE,
                        "2026-06-15T10:00:00Z",
                        "rate-1"),
                evidence(
                        "user-b",
                        MongoQualifiedMauEvidenceRepository.ACTION_JOIN,
                        "2026-06-15T11:00:00Z",
                        "join-1")));

        var snapshot = calculator.calculate(YearMonth.of(2026, 6));

        assertThat(snapshot.period()).isEqualTo("2026-06");
        assertThat(snapshot.windowStart())
                .isEqualTo("2026-06-01T00:00:00Z");
        assertThat(snapshot.windowEnd())
                .isEqualTo("2026-07-01T00:00:00Z");
        assertThat(snapshot.qualifiedMauCount()).isEqualTo(1L);
        assertThat(snapshot.actionCount()).isEqualTo(2L);
        assertThat(snapshot.actionCounts()).containsExactlyInAnyOrderEntriesOf(
                java.util.Map.of(
                        MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                        1L,
                        MongoQualifiedMauEvidenceRepository.ACTION_HOST,
                        1L));
        assertThat(snapshot.evidenceCommitmentHash())
                .matches("sha256:[0-9a-f]{64}");
    }

    @Test
    void commitmentIsDeterministicForTheSameOrderedEvidence() {
        List<QualifiedMauActionEvidence> evidence = List.of(
                evidence(
                        "user-a",
                        MongoQualifiedMauEvidenceRepository.ACTION_BOOK,
                        "2026-06-02T00:00:00Z",
                        "booking-1"),
                evidence(
                        "user-a",
                        MongoQualifiedMauEvidenceRepository
                                .ACTION_VERIFIED_ATTENDANCE,
                        "2026-06-03T00:00:00Z",
                        "attendance-1"));

        var first = calculator(evidence).calculate(
                YearMonth.of(2026, 6));
        var second = calculator(evidence).calculate(
                YearMonth.of(2026, 6));

        assertThat(second).isEqualTo(first);
    }

    @Test
    void rejectsEvidenceOutsideTheFrozenWindowOrVocabulary() {
        assertThatThrownBy(() -> calculator(List.of(evidence(
                        "user-a",
                        MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                        "2026-07-01T00:00:00Z",
                        "message-1")))
                .calculate(YearMonth.of(2026, 6)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("outside");

        assertThatThrownBy(() -> calculator(List.of(evidence(
                        "user-a",
                        "page-view",
                        "2026-06-02T00:00:00Z",
                        "view-1")))
                .calculate(YearMonth.of(2026, 6)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("qmau-v1");
    }

    private static OperatorQualifiedMauCalculator calculator(
            List<QualifiedMauActionEvidence> evidence) {
        return new OperatorQualifiedMauCalculator(
                (startInclusive, endExclusive, consumer) ->
                        evidence.forEach(consumer));
    }

    private static QualifiedMauActionEvidence evidence(
            String userId,
            String actionType,
            String occurredAt,
            String sourceId) {
        return new QualifiedMauActionEvidence(
                userId,
                actionType,
                Instant.parse(occurredAt),
                sourceId);
    }
}
