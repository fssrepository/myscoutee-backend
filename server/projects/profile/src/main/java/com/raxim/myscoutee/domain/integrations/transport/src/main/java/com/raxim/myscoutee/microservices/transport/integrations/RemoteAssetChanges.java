package com.raxim.myscoutee.microservices.transport.integrations;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.domain.integrations.api.AssetChanges;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssetChanges extends RemoteReadTransport implements AssetChanges {
    private final ObjectMapper mapper;
    public RemoteAssetChanges(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void enqueue(com.raxim.myscoutee.domain.assets.api.AssetChangeView asset) {
        var command = new AssetChangesProtocol.Change(ProtocolFields.JobScope.current(), com.raxim.myscoutee.domain.assets.dto.AssetChangeDto.from(asset));
        if (!AssetChangesProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-changes request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetChangesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-changes request exceeds byte limit");
        var result = exchange(AssetChangesProtocol.ENQUEUE, bytes, new TypeReference<ProtocolFields.Receipt>() {},
                "asset-changes.enqueue", AssetChangesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
