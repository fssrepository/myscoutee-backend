package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.RecomputeMetrics;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded read of the canonical owner's typed result; no local fallback. */
public final class RemoteRecomputeMetrics extends RemoteReadTransport implements RecomputeMetrics {
    public RemoteRecomputeMetrics(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public RecomputeMetrics.Snapshot snapshot() {
        return exchange(RecomputeMetricsProtocol.PATH, new TypeReference<RecomputeMetricsProtocol.Result>() {},
                "recompute-metrics.read", 16384, value -> Boolean.TRUE.equals(value.resolved()) && value.value() != null).value();
    }
}
