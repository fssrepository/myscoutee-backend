package com.raxim.myscoutee.microservices.transport.feedback;

import com.raxim.myscoutee.domain.feedback.api.FeedbackMeasurement;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
import com.raxim.myscoutee.microservices.transport.common.RemoteMeasurementTransport;
import java.net.URI;
import java.time.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;

public final class RemoteFeedbackMeasurement extends RemoteMeasurementTransport implements FeedbackMeasurement {
    public RemoteFeedbackMeasurement(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EvidenceCursor attendance(Instant startInclusive, Instant endExclusive) {
        return evidence(FeedbackMeasurementProtocol.ATTENDANCE, "feedback-measurement.attendance", startInclusive, endExclusive);
    }
}
