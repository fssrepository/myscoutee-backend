package com.raxim.myscoutee.domain.events.api;
import java.time.Instant;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
public interface EventMeasurement {
    EvidenceCursor joins(Instant startInclusive, Instant endExclusive);
    EvidenceCursor hosts(Instant startInclusive, Instant endExclusive);
    EvidenceCursor attendance(Instant startInclusive, Instant endExclusive);
}
