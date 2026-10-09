package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetModerationDetails;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssetModerationDetails extends RemoteReadTransport implements AssetModerationDetails {
    private final ObjectMapper mapper;
    public RemoteAssetModerationDetails(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto queryModerationAssetDetail(String assetId) {
        var command = new AssetModerationDetailsProtocol.Query(AssetModerationDetailsProtocol.Scope.current(), assetId);
        if (!AssetModerationDetailsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-moderation-details request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetModerationDetailsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-moderation-details request exceeds byte limit");
        var result = ownerExchange(AssetModerationDetailsProtocol.DETAIL, bytes, new TypeReference<AssetModerationDetailsProtocol.Result>() {},
                "asset-moderation-details.detail", AssetModerationDetailsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
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
