package com.raxim.myscoutee.domain.feedback.api;
import java.time.Instant;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
public interface FeedbackMeasurement {
    EvidenceCursor attendance(Instant startInclusive, Instant endExclusive);
}
