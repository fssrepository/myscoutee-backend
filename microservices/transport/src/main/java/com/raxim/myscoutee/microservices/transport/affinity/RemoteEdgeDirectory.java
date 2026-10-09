package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.affinity.api.EdgeDirectory;
import com.raxim.myscoutee.domain.affinity.dto.AffinityEdgeDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEdgeDirectory extends RemoteReadTransport implements EdgeDirectory {
    private final ObjectMapper mapper;
    public RemoteEdgeDirectory(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;
    }
    @Override public List<AffinityEdgeDto> findAll() {
        return exchange(EdgeDirectoryProtocol.ALL,new TypeReference<List<AffinityEdgeDto>>() {},
                "affinity.edges-all",EdgeDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    @Override public List<AffinityEdgeDto> findRelevantByUserIds(List<String> ids) {
        return exchange(EdgeDirectoryProtocol.RELEVANT,EdgeDirectoryProtocol.encode(ids,mapper),
                new TypeReference<List<AffinityEdgeDto>>() {},"affinity.edges-relevant",EdgeDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
}
