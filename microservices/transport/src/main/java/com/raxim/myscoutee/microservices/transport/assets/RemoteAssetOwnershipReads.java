package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetOwnershipReads extends RemoteReadTransport implements AssetOwnershipReads {
    private final ObjectMapper mapper;
    public RemoteAssetOwnershipReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Optional<AssetOwnershipDto> findById(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.BY_ID, bytes, new TypeReference<AssetOwnershipReadsProtocol.SingleResult>() {},
                "asset-ownership.by-id", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public Optional<AssetOwnershipDto> findByAssetId(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.BY_ASSET_ID, bytes, new TypeReference<AssetOwnershipReadsProtocol.SingleResult>() {},
                "asset-ownership.by-asset-id", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public List<AssetOwnershipDto> findByOwnerUserId(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.BY_OWNER, bytes, new TypeReference<List<AssetOwnershipDto>>() {},
                "asset-ownership.by-owner", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<AssetOwnershipDto> findAll() {
        var query = new AssetOwnershipReadsProtocol.EmptyQuery();
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.ALL, bytes, new TypeReference<List<AssetOwnershipDto>>() {},
                "asset-ownership.all", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<AssetOwnershipDto> findByAssetIdIn(Collection<String> ids) {
        var query = new AssetOwnershipReadsProtocol.IdsQuery(ids);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.BY_ASSET_IDS, bytes, new TypeReference<List<AssetOwnershipDto>>() {},
                "asset-ownership.by-asset-ids", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public Optional<AssetOwnershipDto> findByOwnerUserIdAndAssetId(String owner, String id) {
        var query = new AssetOwnershipReadsProtocol.OwnedQuery(owner, id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.OWNED, bytes, new TypeReference<AssetOwnershipReadsProtocol.SingleResult>() {},
                "asset-ownership.owned", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public List<AssetOwnershipDto> findByOwnerUserIdOrderByUpdatedDateDesc(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.OWNER_UPDATED, bytes, new TypeReference<List<AssetOwnershipDto>>() {},
                "asset-ownership.owner-updated", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public AssetOwnershipDto findByIdOrAssetId(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.ID_OR_ASSET_ID, bytes, new TypeReference<AssetOwnershipReadsProtocol.SingleResult>() {},
                "asset-ownership.id-or-asset-id", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public AssetOwnershipDto findFirstByAssetId(String id) {
        var query = new AssetOwnershipReadsProtocol.IdQuery(id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.FIRST_ASSET_ID, bytes, new TypeReference<AssetOwnershipReadsProtocol.SingleResult>() {},
                "asset-ownership.first-asset-id", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public List<AssetOwnershipDto> findByOwnersAndIds(Collection<String> owners, Collection<String> ids) {
        var query = new AssetOwnershipReadsProtocol.OwnersIdsQuery(owners, ids);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.OWNERS_AND_IDS, bytes, new TypeReference<List<AssetOwnershipDto>>() {},
                "asset-ownership.owners-and-ids", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public boolean ownedExists(String owner, String id) {
        var query = new AssetOwnershipReadsProtocol.OwnedQuery(owner, id);
        if (!AssetOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid asset read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset read exceeds byte limit");
        var result = exchange(AssetOwnershipReadsProtocol.OWNED_EXISTS, bytes, new TypeReference<AssetOwnershipReadsProtocol.Decision>() {},
                "asset-ownership.owned-exists", AssetOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> value.value() != null);
        return result.value();
    }
}
