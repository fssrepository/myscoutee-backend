package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.AssetProfiles;
import com.raxim.myscoutee.domain.accounts.dto.AssetProfileDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetProfiles extends RemoteReadTransport implements AssetProfiles {
    private final ObjectMapper mapper;
    public RemoteAssetProfiles(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Optional<AssetProfileDto> findByUserId(String id) {
        var query = new AssetProfilesProtocol.SingleQuery(id);
        var result = exchange(AssetProfilesProtocol.SINGLE, body(query, AssetProfilesProtocol.valid(query)),
                new TypeReference<AssetProfilesProtocol.SingleResult>() {}, "asset-profiles.single", AssetProfilesProtocol.MAX_RESPONSE_BYTES,
                value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(id, value.value().userId())));
        return Optional.ofNullable(result.value());
    }
    @Override public List<AssetProfileDto> findByUserIdIn(Collection<String> ids) {
        var query = new AssetProfilesProtocol.BatchQuery(ids);
        return exchange(AssetProfilesProtocol.BATCH, body(query, AssetProfilesProtocol.valid(query)),
                new TypeReference<List<AssetProfileDto>>() {}, "asset-profiles.batch", AssetProfilesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || ids.contains(value.userId())));
    }
    @Override public List<AssetProfileDto> findByAccountUserId(String accountId) {
        var query = new AssetProfilesProtocol.SingleQuery(accountId);
        return exchange(AssetProfilesProtocol.ACCOUNT, body(query, AssetProfilesProtocol.valid(query)),
                new TypeReference<List<AssetProfileDto>>() {}, "asset-profiles.account", AssetProfilesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || java.util.Objects.equals(accountId, value.accountUserId())));
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid asset profile query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset profile request exceeds limit");
        return bytes;
    }
}
