package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.GraphScience;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteGraphScience extends RemoteReadTransport implements GraphScience {
    private final ObjectMapper mapper;
    public RemoteGraphScience(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.affinity.api.GraphScience.GraphScienceResult refresh(String statsKey, java.util.Map<String, java.util.Map<String, Long>> existing) {
        var command = new GraphScienceProtocol.Query(GraphScienceProtocol.Scope.current(), statsKey, existing);
        if (!GraphScienceProtocol.valid(command)) throw new IllegalArgumentException("Invalid graph-science request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > GraphScienceProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("graph-science request exceeds byte limit");
        var result = ownerExchange(GraphScienceProtocol.REFRESH, bytes, new TypeReference<com.raxim.myscoutee.domain.affinity.api.GraphScience.GraphScienceResult>() {},
                "graph-science.refresh", GraphScienceProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
