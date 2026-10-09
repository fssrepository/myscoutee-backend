package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.AssetMemberships;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssetMemberships extends RemoteReadTransport implements AssetMemberships {
    private final ObjectMapper mapper;
    public RemoteAssetMemberships(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto promote(com.raxim.myscoutee.domain.events.api.MemberDirectory.Member current, String assetId, String targetUserId, String actorUserId, String nowIso) {
        var command = new AssetMembershipsProtocol.Promote(AssetMembershipsProtocol.Scope.current(), current == null ? null : com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto.from(current), assetId, targetUserId, actorUserId, nowIso);
        if (!AssetMembershipsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-memberships request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetMembershipsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-memberships request exceeds byte limit");
        var result = exchange(AssetMembershipsProtocol.PROMOTE, bytes, new TypeReference<AssetMembershipsProtocol.Result>() {},
                "asset-memberships.promote", AssetMembershipsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public void delete(com.raxim.myscoutee.domain.events.api.MemberDirectory.Member member) {
        var command = new AssetMembershipsProtocol.Delete(AssetMembershipsProtocol.Scope.current(), member == null ? null : com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto.from(member));
        if (!AssetMembershipsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-memberships request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetMembershipsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-memberships request exceeds byte limit");
        var result = exchange(AssetMembershipsProtocol.DELETE, bytes, new TypeReference<AssetMembershipsProtocol.Receipt>() {},
                "asset-memberships.delete", AssetMembershipsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
