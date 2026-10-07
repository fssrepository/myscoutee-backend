package com.raxim.myscoutee.domain.chat.api;
import java.time.Instant;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
public interface ChatMeasurement {
    EvidenceCursor messages(Instant startInclusive, Instant endExclusive);
}
