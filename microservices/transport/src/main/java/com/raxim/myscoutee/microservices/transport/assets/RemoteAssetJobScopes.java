package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.assets.api.AssetJobScopes;
import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetJobScopes extends RemoteReadTransport implements AssetJobScopes {
    public RemoteAssetJobScopes(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public AssetJobScopeDto findJobScope(String id) {
        try {
            return exchange(queryPath(AssetJobScopesProtocol.PATH, "id", id), new TypeReference<AssetJobScopeDto>() {},
                    "assets.job-scope", AssetJobScopesProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
