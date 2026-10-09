package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.RecomputeQueue;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteRecomputeQueue extends RemoteReadTransport implements RecomputeQueue {
    public RemoteRecomputeQueue(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public long count(String baseGroupId, String status) {
        return exchange(queryPath(RecomputeQueueProtocol.PATH, "baseGroupId", baseGroupId, "status", status),
                new TypeReference<Long>() {}, "affinity.recompute-count", 4096, value -> value >= 0);
    }
}
