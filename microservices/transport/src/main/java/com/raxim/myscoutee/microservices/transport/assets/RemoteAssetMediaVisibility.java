package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.assets.api.AssetMediaVisibility;
import com.raxim.myscoutee.domain.assets.dto.AssetMediaVisibilityDto;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetMediaVisibility extends RemoteReadTransport implements AssetMediaVisibility {
    private final ObjectMapper mapper;
    public RemoteAssetMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public AssetMediaVisibilityDto asset(List<String> urls) {
        byte[] body = MediaReferenceQueries.encode(urls, mapper);
        try {
            return exchange(AssetMediaVisibilityProtocol.PATH, body, new TypeReference<AssetMediaVisibilityDto>() {},
                    "assets.media-visibility", AssetMediaVisibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
