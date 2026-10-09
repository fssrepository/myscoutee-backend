package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.assets.api.AssetDerivedUpdates;
import com.raxim.myscoutee.domain.assets.dto.AssetVersionDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Owner-side version matching; a lost response is unknown, never implicitly retried. */
public final class RemoteAssetDerivedUpdates extends RemoteReadTransport implements AssetDerivedUpdates {
    private final ObjectMapper mapper;
    public RemoteAssetDerivedUpdates(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public boolean updateAffinityVersion(AssetVersionDto version, double affinity, double boost) {
        var command = new AssetDerivedUpdatesProtocol.AffinityCommand(version, affinity, boost);
        return send(AssetDerivedUpdatesProtocol.AFFINITY, command, AssetDerivedUpdatesProtocol.valid(command));
    }
    @Override public boolean updateStatusVersionIfCurrent(AssetVersionDto version, String status, String previousStatus) {
        var command = new AssetDerivedUpdatesProtocol.StatusCommand(version, status, previousStatus);
        return send(AssetDerivedUpdatesProtocol.STATUS, command, AssetDerivedUpdatesProtocol.valid(command));
    }
    private boolean send(String path, Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid asset projection");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetDerivedUpdatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset projection exceeds byte limit");
        return exchange(path, bytes, new TypeReference<AssetDerivedUpdatesProtocol.Result>() {},
                "asset-projection.update", AssetDerivedUpdatesProtocol.MAX_RESPONSE_BYTES, value -> value.matched() != null).matched();
    }
}
