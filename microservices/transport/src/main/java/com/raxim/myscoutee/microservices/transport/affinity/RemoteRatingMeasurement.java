package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RatingMeasurement;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
import com.raxim.myscoutee.microservices.transport.common.RemoteMeasurementTransport;
import java.net.URI;
import java.time.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;

public final class RemoteRatingMeasurement extends RemoteMeasurementTransport implements RatingMeasurement {
    public RemoteRatingMeasurement(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EvidenceCursor rates(Instant startInclusive, Instant endExclusive) {
        return evidence(RatingMeasurementProtocol.RATES, "rating-measurement.rates", startInclusive, endExclusive);
    }
}
