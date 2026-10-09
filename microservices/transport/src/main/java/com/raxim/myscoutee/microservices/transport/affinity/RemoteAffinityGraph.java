package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.AffinityGraph;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAffinityGraph extends RemoteReadTransport implements AffinityGraph {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteAffinityGraph(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto meta(String adminUserId, Double minWeight, Double maxWeight) {
        var command = new AffinityGraphProtocol.Meta1(AffinityGraphProtocol.Scope.current(), adminUserId, minWeight, maxWeight);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.META_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto>() {},
                "affinity-graph.meta_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphDto full(String adminUserId, Double minWeight, Double maxWeight) {
        var command = new AffinityGraphProtocol.Full1(AffinityGraphProtocol.Scope.current(), adminUserId, minWeight, maxWeight);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.FULL_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphDto>() {},
                "affinity-graph.full_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphNeighborhoodDto neighborhood(String adminUserId, String userId, Integer depth, Double minWeight, Double maxWeight) {
        var command = new AffinityGraphProtocol.Neighborhood1(AffinityGraphProtocol.Scope.current(), adminUserId, userId, depth, minWeight, maxWeight);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.NEIGHBORHOOD_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphNeighborhoodDto>() {},
                "affinity-graph.neighborhood_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphForestsDto forests(String adminUserId, Double minWeight, Double maxWeight, Integer forestLevel, Integer limit, Integer offset) {
        var command = new AffinityGraphProtocol.Forests1(AffinityGraphProtocol.Scope.current(), adminUserId, minWeight, maxWeight, forestLevel, limit, offset);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.FORESTS_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphForestsDto>() {},
                "affinity-graph.forests_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphTileDto tile(String adminUserId, String layoutVersion, Integer z, Integer x, Integer y, Double minWeight, Double maxWeight, String componentId) {
        var command = new AffinityGraphProtocol.Tile1(AffinityGraphProtocol.Scope.current(), adminUserId, layoutVersion, z, x, y, minWeight, maxWeight, componentId);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.TILE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphTileDto>() {},
                "affinity-graph.tile_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto rebuildLayout(String adminUserId) {
        var command = new AffinityGraphProtocol.RebuildLayout1(AffinityGraphProtocol.Scope.current(), adminUserId);
        if (!AffinityGraphProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-graph request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityGraphProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-graph request exceeds byte limit");
        var result = ownerExchange(AffinityGraphProtocol.REBUILDLAYOUT_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto>() {},
                "affinity-graph.rebuildlayout_1", AffinityGraphProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (AffinityGraphProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(AffinityGraphProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
