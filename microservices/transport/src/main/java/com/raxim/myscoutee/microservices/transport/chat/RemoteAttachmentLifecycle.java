package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAttachmentLifecycle extends RemoteReadTransport implements AttachmentLifecycle {
    private final ObjectMapper mapper;
    public RemoteAttachmentLifecycle(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void project(Projection projection) {
        var command = new AttachmentLifecycleProtocol.Project(AttachmentLifecycleProtocol.Scope.current(), projection);
        if (!AttachmentLifecycleProtocol.valid(command)) throw new IllegalArgumentException("Invalid attachment lifecycle projection");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AttachmentLifecycleProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Attachment projection exceeds byte limit");
        exchange(AttachmentLifecycleProtocol.PROJECT, bytes, new TypeReference<AttachmentLifecycleProtocol.Receipt>() {},
                "attachment-lifecycle.project", AttachmentLifecycleProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void markEventUnavailable(String eventId, String reason) {
        var command = new AttachmentLifecycleProtocol.Change(AttachmentLifecycleProtocol.Scope.current(), eventId, reason);
        if (!AttachmentLifecycleProtocol.valid(command)) throw new IllegalArgumentException("Invalid attachment-lifecycle request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AttachmentLifecycleProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("attachment-lifecycle request exceeds byte limit");
        var result = exchange(AttachmentLifecycleProtocol.EVENT_UNAVAILABLE, bytes, new TypeReference<AttachmentLifecycleProtocol.Receipt>() {},
                "attachment-lifecycle.event-unavailable", AttachmentLifecycleProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void markEventAvailable(String eventId) {
        var command = new AttachmentLifecycleProtocol.Change(AttachmentLifecycleProtocol.Scope.current(), eventId, null);
        if (!AttachmentLifecycleProtocol.valid(command)) throw new IllegalArgumentException("Invalid attachment-lifecycle request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AttachmentLifecycleProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("attachment-lifecycle request exceeds byte limit");
        var result = exchange(AttachmentLifecycleProtocol.EVENT_AVAILABLE, bytes, new TypeReference<AttachmentLifecycleProtocol.Receipt>() {},
                "attachment-lifecycle.event-available", AttachmentLifecycleProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void markAssetUnavailable(String assetId, String reason) {
        var command = new AttachmentLifecycleProtocol.Change(AttachmentLifecycleProtocol.Scope.current(), assetId, reason);
        if (!AttachmentLifecycleProtocol.valid(command)) throw new IllegalArgumentException("Invalid attachment-lifecycle request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AttachmentLifecycleProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("attachment-lifecycle request exceeds byte limit");
        var result = exchange(AttachmentLifecycleProtocol.ASSET_UNAVAILABLE, bytes, new TypeReference<AttachmentLifecycleProtocol.Receipt>() {},
                "attachment-lifecycle.asset-unavailable", AttachmentLifecycleProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void markAssetAvailable(String assetId) {
        var command = new AttachmentLifecycleProtocol.Change(AttachmentLifecycleProtocol.Scope.current(), assetId, null);
        if (!AttachmentLifecycleProtocol.valid(command)) throw new IllegalArgumentException("Invalid attachment-lifecycle request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AttachmentLifecycleProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("attachment-lifecycle request exceeds byte limit");
        var result = exchange(AttachmentLifecycleProtocol.ASSET_AVAILABLE, bytes, new TypeReference<AttachmentLifecycleProtocol.Receipt>() {},
                "attachment-lifecycle.asset-available", AttachmentLifecycleProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
