package com.raxim.myscoutee.domain.affinity.api;
import java.time.Instant;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
public interface RatingMeasurement {
    EvidenceCursor rates(Instant startInclusive, Instant endExclusive);
}
