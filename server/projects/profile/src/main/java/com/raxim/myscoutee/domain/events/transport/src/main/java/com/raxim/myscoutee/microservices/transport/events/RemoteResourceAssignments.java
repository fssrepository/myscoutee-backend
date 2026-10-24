package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.ResourceAssignments;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteResourceAssignments extends RemoteReadTransport implements ResourceAssignments {
    private final ObjectMapper mapper;
    public RemoteResourceAssignments(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public String scopedAssetManagerUserId(String ownerId, String subEventId, String assetId) {
        var command = new ResourceAssignmentsProtocol.Query(ResourceAssignmentsProtocol.Scope.current(), ownerId, subEventId, assetId);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.MANAGER, bytes, new TypeReference<ResourceAssignmentsProtocol.Manager>() {},
                "resource-assignments.manager", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.userId();
    }
    @Override public boolean removeScopedAssetAssignment(String ownerId, String subEventId, String assetId, String expectedManager, String actor) {
        var command = new ResourceAssignmentsProtocol.ScopedChange(ResourceAssignmentsProtocol.Scope.current(), ownerId, subEventId, assetId, expectedManager, actor);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.REMOVE_SCOPED, bytes, new TypeReference<ResourceAssignmentsProtocol.Changed>() {},
                "resource-assignments.remove-scoped", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> v.changed() != null);
        return result.changed();
    }
    @Override public boolean transferScopedAssetManager(String ownerId, String subEventId, String assetId, String expectedManager, String actor) {
        var command = new ResourceAssignmentsProtocol.ScopedChange(ResourceAssignmentsProtocol.Scope.current(), ownerId, subEventId, assetId, expectedManager, actor);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.TRANSFER, bytes, new TypeReference<ResourceAssignmentsProtocol.Changed>() {},
                "resource-assignments.transfer", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> v.changed() != null);
        return result.changed();
    }
    @Override public void removeAssetFromResourceAssignments(String assetId, String actor) {
        var command = new ResourceAssignmentsProtocol.Remove(ResourceAssignmentsProtocol.Scope.current(), assetId, actor);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.REMOVE, bytes, new TypeReference<ResourceAssignmentsProtocol.Receipt>() {},
                "resource-assignments.remove", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void refreshResourceMetricsForScope(String ownerId, String subEventId, String actor) {
        var command = new ResourceAssignmentsProtocol.Refresh(ResourceAssignmentsProtocol.Scope.current(), ownerId, subEventId, actor);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.REFRESH, bytes, new TypeReference<ResourceAssignmentsProtocol.Receipt>() {},
                "resource-assignments.refresh", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void removeCancelledBorrowAssignment(String ownerId, String subEventId, String assetId, String borrowerId, String actor) {
        var command = new ResourceAssignmentsProtocol.ScopedChange(ResourceAssignmentsProtocol.Scope.current(), ownerId, subEventId, assetId, borrowerId, actor);
        if (!ResourceAssignmentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid resource-assignments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ResourceAssignmentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("resource-assignments request exceeds byte limit");
        var result = ownerExchange(ResourceAssignmentsProtocol.CANCEL_BORROW, bytes, new TypeReference<ResourceAssignmentsProtocol.Receipt>() {},
                "resource-assignments.cancel-borrow", ResourceAssignmentsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
