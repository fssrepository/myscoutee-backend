package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetMeasurement;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
import com.raxim.myscoutee.microservices.transport.common.RemoteMeasurementTransport;
import java.net.URI;
import java.time.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetMeasurement extends RemoteMeasurementTransport implements AssetMeasurement {
    public RemoteAssetMeasurement(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EvidenceCursor bookings(Instant startInclusive, Instant endExclusive) {
        return evidence(AssetMeasurementProtocol.BOOKINGS, "asset-measurement.bookings", startInclusive, endExclusive);
    }
}
