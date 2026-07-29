package com.raxim.myscoutee.profile.repository;

import java.time.Instant;
import java.util.function.Consumer;

/**
 * Streams eligible, authoritative QMAU actions in deterministic user/date
 * order. Implementations must never expose this local evidence to a registry.
 */
public interface QualifiedMauEvidenceRepository {
    void read(
            Instant startInclusive,
            Instant endExclusive,
            Consumer<QualifiedMauActionEvidence> consumer);

    record QualifiedMauActionEvidence(
            String userId,
            String actionType,
            Instant occurredAt,
            String sourceId) {
    }
}
