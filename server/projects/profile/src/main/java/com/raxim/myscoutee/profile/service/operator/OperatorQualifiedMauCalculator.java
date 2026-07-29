package com.raxim.myscoutee.profile.service.operator;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.repository.MongoQualifiedMauEvidenceRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauEvidenceRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauEvidenceRepository.QualifiedMauActionEvidence;
import com.raxim.myscoutee.registry.RegistryProtocol;

/**
 * Implements qmau-v1 locally. No user identifier or action evidence is
 * returned by this service; only a count, audit diagnostics, and an opaque
 * commitment leave the calculator.
 */
@Service
class OperatorQualifiedMauCalculator {
    static final int ROLLING_WINDOW_DAYS = 30;
    static final int REQUIRED_ACTIONS = 2;
    static final int REQUIRED_DAYS = 2;

    private final QualifiedMauEvidenceRepository evidenceRepository;

    OperatorQualifiedMauCalculator(
            QualifiedMauEvidenceRepository evidenceRepository) {
        this.evidenceRepository = Objects.requireNonNull(
                evidenceRepository);
    }

    QualifiedMauSnapshot calculate(YearMonth completedPeriod) {
        Objects.requireNonNull(
                completedPeriod,
                "Completed QMAU period must not be null.");
        Instant endExclusive = completedPeriod
                .plusMonths(1)
                .atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        Instant startInclusive = endExclusive.minusSeconds(
                ROLLING_WINDOW_DAYS * 86_400L);

        MessageDigest aggregateDigest = digest();
        updateFramed(aggregateDigest, "myscoutee-qmau-private-evidence-v1");
        updateFramed(aggregateDigest, RegistryProtocol.QMAU_RULESET_VERSION);
        updateFramed(aggregateDigest, completedPeriod.toString());
        updateFramed(aggregateDigest, startInclusive.toString());
        updateFramed(aggregateDigest, endExclusive.toString());

        Map<String, Long> qualifiedActionCounts = new LinkedHashMap<>();
        AtomicReference<UserAccumulator> current = new AtomicReference<>();
        long[] qualifiedUsers = {0L};
        long[] qualifiedActions = {0L};

        evidenceRepository.read(startInclusive, endExclusive, evidence -> {
            validateEvidence(evidence, startInclusive, endExclusive);
            UserAccumulator accumulator = current.get();
            if (accumulator == null
                    || !accumulator.userId.equals(evidence.userId())) {
                if (accumulator != null) {
                    finishUser(
                            accumulator,
                            aggregateDigest,
                            qualifiedActionCounts,
                            qualifiedUsers,
                            qualifiedActions);
                }
                accumulator = new UserAccumulator(evidence.userId());
                current.set(accumulator);
            }
            accumulator.add(evidence);
        });
        if (current.get() != null) {
            finishUser(
                    current.get(),
                    aggregateDigest,
                    qualifiedActionCounts,
                    qualifiedUsers,
                    qualifiedActions);
        }
        updateFramed(aggregateDigest, Long.toString(qualifiedUsers[0]));
        updateFramed(aggregateDigest, Long.toString(qualifiedActions[0]));

        return new QualifiedMauSnapshot(
                completedPeriod.toString(),
                startInclusive.toString(),
                endExclusive.toString(),
                qualifiedUsers[0],
                qualifiedActions[0],
                Map.copyOf(qualifiedActionCounts),
                "sha256:" + java.util.HexFormat.of().formatHex(
                        aggregateDigest.digest()));
    }

    private static void finishUser(
            UserAccumulator accumulator,
            MessageDigest aggregateDigest,
            Map<String, Long> actionCounts,
            long[] qualifiedUsers,
            long[] qualifiedActions) {
        if (accumulator.actionCount < REQUIRED_ACTIONS
                || accumulator.days.size() < REQUIRED_DAYS) {
            return;
        }
        qualifiedUsers[0]++;
        qualifiedActions[0] += accumulator.actionCount;
        accumulator.actionCounts.forEach((action, count) ->
                actionCounts.merge(action, count, Long::sum));
        updateFramed(aggregateDigest, accumulator.userId);
        updateFramed(
                aggregateDigest,
                java.util.HexFormat.of().formatHex(
                        accumulator.evidenceDigest.digest()));
        updateFramed(
                aggregateDigest,
                Long.toString(accumulator.actionCount));
        updateFramed(
                aggregateDigest,
                Integer.toString(accumulator.days.size()));
    }

    private static void validateEvidence(
            QualifiedMauActionEvidence evidence,
            Instant startInclusive,
            Instant endExclusive) {
        if (evidence == null
                || !StringUtils.hasText(evidence.userId())
                || !StringUtils.hasText(evidence.actionType())
                || evidence.occurredAt() == null
                || !StringUtils.hasText(evidence.sourceId())) {
            throw new IllegalStateException(
                    "QMAU evidence contains a blank field.");
        }
        if (evidence.occurredAt().isBefore(startInclusive)
                || !evidence.occurredAt().isBefore(endExclusive)) {
            throw new IllegalStateException(
                    "QMAU evidence is outside the completed-period window.");
        }
        Set<String> supportedActions = Set.of(
                MongoQualifiedMauEvidenceRepository.ACTION_RATE,
                MongoQualifiedMauEvidenceRepository.ACTION_JOIN,
                MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                MongoQualifiedMauEvidenceRepository.ACTION_HOST,
                MongoQualifiedMauEvidenceRepository.ACTION_BOOK,
                MongoQualifiedMauEvidenceRepository
                        .ACTION_VERIFIED_ATTENDANCE);
        if (!supportedActions.contains(evidence.actionType())) {
            throw new IllegalStateException(
                    "QMAU evidence action type is not part of qmau-v1.");
        }
    }

    private static MessageDigest digest() {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable.",
                    exception);
        }
    }

    private static void updateFramed(MessageDigest digest, String value) {
        byte[] bytes = Objects.requireNonNull(value).getBytes(
                StandardCharsets.UTF_8);
        digest.update(ByteBuffer.allocate(Integer.BYTES)
                .putInt(bytes.length)
                .array());
        digest.update(bytes);
    }

    private static final class UserAccumulator {
        private final String userId;
        private final MessageDigest evidenceDigest = digest();
        private final Set<LocalDate> days = new TreeSet<>();
        private final Map<String, Long> actionCounts =
                new LinkedHashMap<>();
        private long actionCount;

        private UserAccumulator(String userId) {
            this.userId = userId;
            updateFramed(
                    evidenceDigest,
                    "myscoutee-qmau-private-user-evidence-v1");
            updateFramed(evidenceDigest, userId);
        }

        private void add(QualifiedMauActionEvidence evidence) {
            actionCount++;
            days.add(evidence.occurredAt()
                    .atZone(ZoneOffset.UTC)
                    .toLocalDate());
            actionCounts.merge(evidence.actionType(), 1L, Long::sum);
            updateFramed(evidenceDigest, evidence.actionType());
            updateFramed(evidenceDigest, evidence.occurredAt().toString());
            updateFramed(evidenceDigest, evidence.sourceId());
        }
    }

    record QualifiedMauSnapshot(
            String period,
            String windowStart,
            String windowEnd,
            long qualifiedMauCount,
            long actionCount,
            Map<String, Long> actionCounts,
            String evidenceCommitmentHash) {
    }
}
