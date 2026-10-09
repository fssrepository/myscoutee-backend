package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteDiscoveryProfiles extends RemoteReadTransport implements DiscoveryProfiles {
    private final ObjectMapper mapper;
    public RemoteDiscoveryProfiles(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto> findByUserId(String id) {
        var command = new DiscoveryProfilesProtocol.Single(DiscoveryProfilesProtocol.Scope.current(), id);
        if (!DiscoveryProfilesProtocol.valid(command)) throw new IllegalArgumentException("Invalid discovery-profiles request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > DiscoveryProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("discovery-profiles request exceeds byte limit");
        var result = exchange(DiscoveryProfilesProtocol.SINGLE, bytes, new TypeReference<DiscoveryProfilesProtocol.Result>() {},
                "discovery-profiles.single", DiscoveryProfilesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(id, value.value().userId())));
        return java.util.Optional.ofNullable(result.value());
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto> findByUserIdIn(java.util.Collection<String> ids) {
        var command = new DiscoveryProfilesProtocol.Batch(DiscoveryProfilesProtocol.Scope.current(), ids);
        if (!DiscoveryProfilesProtocol.valid(command)) throw new IllegalArgumentException("Invalid discovery-profiles request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > DiscoveryProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("discovery-profiles request exceeds byte limit");
        var result = exchange(DiscoveryProfilesProtocol.BATCH, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto>>() {},
                "discovery-profiles.batch", DiscoveryProfilesProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(item -> item != null && ids.contains(item.userId())));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, java.util.Collection<String> accounts) {
        var command = new DiscoveryProfilesProtocol.Workspace(DiscoveryProfilesProtocol.Scope.current(), groupId, accounts);
        if (!DiscoveryProfilesProtocol.valid(command)) throw new IllegalArgumentException("Invalid discovery-profiles request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > DiscoveryProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("discovery-profiles request exceeds byte limit");
        var result = exchange(DiscoveryProfilesProtocol.WORKSPACE, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto>>() {},
                "discovery-profiles.workspace", DiscoveryProfilesProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(item -> item != null && java.util.Objects.equals(groupId, item.workspaceGroupId()) && accounts.contains(item.accountUserId())));
        return result;
    }
}
