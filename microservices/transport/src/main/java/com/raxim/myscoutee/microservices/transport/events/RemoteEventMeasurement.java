package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventMeasurement;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
import com.raxim.myscoutee.microservices.transport.common.RemoteMeasurementTransport;
import java.net.URI;
import java.time.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventMeasurement extends RemoteMeasurementTransport implements EventMeasurement {
    public RemoteEventMeasurement(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EvidenceCursor joins(Instant startInclusive, Instant endExclusive) {
        return evidence(EventMeasurementProtocol.JOINS, "event-measurement.joins", startInclusive, endExclusive);
    }
    @Override public EvidenceCursor hosts(Instant startInclusive, Instant endExclusive) {
        return evidence(EventMeasurementProtocol.HOSTS, "event-measurement.hosts", startInclusive, endExclusive);
    }
    @Override public EvidenceCursor attendance(Instant startInclusive, Instant endExclusive) {
        return evidence(EventMeasurementProtocol.ATTENDANCE, "event-measurement.attendance", startInclusive, endExclusive);
    }
}
