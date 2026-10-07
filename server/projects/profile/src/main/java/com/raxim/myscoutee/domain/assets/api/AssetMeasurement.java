package com.raxim.myscoutee.domain.assets.api;
import java.time.Instant;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
public interface AssetMeasurement {
    EvidenceCursor bookings(Instant startInclusive, Instant endExclusive);
}
