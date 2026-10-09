package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;
import com.raxim.myscoutee.domain.affinity.dto.RecomputeTaskDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityChangesProtocol.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteUserAffinityChanges extends RemoteCommandTransport implements AffinityStatusChanges {
    private final ObjectMapper mapper;
    public RemoteUserAffinityChanges(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public RecomputeTaskDto enqueueUserChanged(String userId) {
        return signal(UserAffinityChangesProtocol.PROFILE, userId, "affinity.user-changed");
    }
    @Override public RecomputeTaskDto enqueueAdminStatusChanged(String userId) {
        return signal(UserAffinityChangesProtocol.STATUS, userId, "affinity.user-status-changed");
    }
    @Override public RecomputeTaskDto enqueueEventChanged(String targetId, String actorUserId) {
        return change(UserAffinityChangesProtocol.EVENT, targetId, actorUserId);
    }
    @Override public RecomputeTaskDto enqueueEventMembersChanged(String targetId, String actorUserId) {
        return change(UserAffinityChangesProtocol.EVENT_MEMBERS, targetId, actorUserId);
    }
    @Override public RecomputeTaskDto enqueueAssetChanged(String targetId, String actorUserId) {
        return change(UserAffinityChangesProtocol.ASSET, targetId, actorUserId);
    }
    @Override public RecomputeTaskDto enqueueAssetRequestsChanged(String targetId, String actorUserId) {
        return change(UserAffinityChangesProtocol.ASSET_REQUESTS, targetId, actorUserId);
    }
    @Override public RecomputeTaskDto enqueueConfigChanged(String targetId, String actorUserId) {
        return change(UserAffinityChangesProtocol.CONFIG, targetId, actorUserId);
    }
    private RecomputeTaskDto change(String path, String targetId, String actorUserId) {
        var value = Change.current(targetId, actorUserId);
        if (!UserAffinityChangesProtocol.valid(value)) throw new IllegalArgumentException("Invalid affinity signal");
        var body = mapper.writeValueAsBytes(value);
        if (body.length > UserAffinityChangesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Affinity signal exceeds limit");
        return producerCommand(path, body, new TypeReference<Receipt>() {}, "affinity.owner-change", 4096,
                receipt -> Boolean.TRUE.equals(receipt.completed()), UUID.randomUUID().toString()).task();
    }
    private RecomputeTaskDto signal(String path, String userId, String operation) {
        if (userId != null && userId.length() > 512) throw new IllegalArgumentException("Signal identifier exceeds size limit");
        var body = mapper.writeValueAsBytes(new Signal(userId));
        return producerCommand(path, body, new TypeReference<Receipt>() {}, operation, 4096,
                value -> Boolean.TRUE.equals(value.completed()), UUID.randomUUID().toString()).task();
    }
}
