package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetModerationProjection;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssetModerationProjection extends RemoteReadTransport implements AssetModerationProjection {
    private final ObjectMapper mapper;
    public RemoteAssetModerationProjection(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void apply(String sourceId, long version, String status) {
        var command = new AssetModerationProjectionProtocol.Change(AssetModerationProjectionProtocol.Scope.current(), sourceId, version, status);
        if (!AssetModerationProjectionProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-moderation-projection request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetModerationProjectionProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-moderation-projection request exceeds byte limit");
        var result = ownerExchange(AssetModerationProjectionProtocol.APPLY, bytes, new TypeReference<AssetModerationProjectionProtocol.Receipt>() {},
                "asset-moderation-projection.apply", AssetModerationProjectionProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
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
