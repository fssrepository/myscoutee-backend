package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.CampaignGraphs;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCampaignGraphs extends RemoteReadTransport implements CampaignGraphs {
    private final ObjectMapper mapper;
    public RemoteCampaignGraphs(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Map<String, Snapshot> campaignGraphs(java.util.Collection<String> ids) {
        var command = new CampaignGraphsProtocol.Query(CampaignGraphsProtocol.Scope.current(), ids);
        if (!CampaignGraphsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaign-graphs request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignGraphsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaign-graphs request exceeds byte limit");
        var result = ownerExchange(CampaignGraphsProtocol.GRAPHS, bytes, new TypeReference<java.util.Map<String, com.raxim.myscoutee.domain.affinity.dto.CampaignGraphDto>>() {},
                "campaign-graphs.graphs", CampaignGraphsProtocol.MAX_RESPONSE_BYTES, v -> ids.containsAll(v.keySet()) && v.values().stream().allMatch(java.util.Objects::nonNull));
        return snapshots(result);
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

    private java.util.Map<String, Snapshot> snapshots(java.util.Map<String, com.raxim.myscoutee.domain.affinity.dto.CampaignGraphDto> graphs) {
        var result = new java.util.LinkedHashMap<String, Snapshot>();
        graphs.forEach((id, graph) -> result.put(id, graph.snapshot()));
        return result;
    }
}
