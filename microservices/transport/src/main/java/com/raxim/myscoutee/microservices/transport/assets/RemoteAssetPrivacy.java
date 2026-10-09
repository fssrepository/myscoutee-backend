package com.raxim.myscoutee.microservices.transport.assets;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.assets.api.AssetPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteAssetPrivacy extends RemoteReadTransport implements AssetPrivacy {
    private final ObjectMapper mapper;
    public RemoteAssetPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void purgeRemainingAssetRequests(String userId) {
        var command = new AssetPrivacyProtocol.UserCommand(AssetPrivacyProtocol.Scope.current(), userId);
        send(AssetPrivacyProtocol.PURGE_REMAINING_ASSET_REQUESTS, command, AssetPrivacyProtocol.valid(command));
    }
    @Override public void purgeOwnedMedia(Collection<String> assetIds) {
        var command = new AssetPrivacyProtocol.IdsCommand(AssetPrivacyProtocol.Scope.current(), (assetIds == null ? List.of() : assetIds));
        send(AssetPrivacyProtocol.PURGE_OWNED_MEDIA, command, AssetPrivacyProtocol.valid(command));
    }
    @Override public void deleteOwnedRecords(Collection<String> assetIds) {
        var command = new AssetPrivacyProtocol.IdsCommand(AssetPrivacyProtocol.Scope.current(), (assetIds == null ? List.of() : assetIds));
        send(AssetPrivacyProtocol.DELETE_OWNED_RECORDS, command, AssetPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<AssetPrivacyProtocol.Receipt>() {},
                "asset-privacy.command", AssetPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
