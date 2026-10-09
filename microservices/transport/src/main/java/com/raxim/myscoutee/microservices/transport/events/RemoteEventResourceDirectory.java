package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventResourceDirectory extends RemoteReadTransport implements EventResourceDirectory {
    private final ObjectMapper mapper;
    public RemoteEventResourceDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.EventResourceDto> findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(java.util.Collection<String> owners, java.util.Collection<String> assetOwners, String status) {
        var command = new EventResourceDirectoryProtocol.Resources(EventResourceDirectoryProtocol.Scope.current(), owners, assetOwners, status);
        if (!EventResourceDirectoryProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-resource-directory request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventResourceDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-resource-directory request exceeds byte limit");
        var result = exchange(EventResourceDirectoryProtocol.RESOURCES, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.EventResourceDto>>() {},
                "event-resource-directory.resources", EventResourceDirectoryProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(item -> item != null && owners.contains(item.ownerId()) && assetOwners.contains(item.assetOwnerUserId())));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.EventResourceDto.StageRuntimeDto> findByOwnerIdInAndStatusNot(java.util.Collection<String> owners, String status) {
        var command = new EventResourceDirectoryProtocol.Stages(EventResourceDirectoryProtocol.Scope.current(), owners, status);
        if (!EventResourceDirectoryProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-resource-directory request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventResourceDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-resource-directory request exceeds byte limit");
        var result = exchange(EventResourceDirectoryProtocol.STAGES, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.EventResourceDto.StageRuntimeDto>>() {},
                "event-resource-directory.stages", EventResourceDirectoryProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(item -> item != null && owners.contains(item.ownerId())));
        return result;
    }
}
