package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityScores;
import com.raxim.myscoutee.domain.affinity.dto.UserAffinityInputDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityScoresProtocol.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteUserAffinityScores extends RemoteReadTransport implements UserAffinityScores {
    private final ObjectMapper mapper;
    public RemoteUserAffinityScores(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public double calculateUserAffinity(UserAffinityInputDto user, String workspaceGroupId) {
        if (workspaceGroupId != null && workspaceGroupId.length() > 512
                || user != null && user.id() != null && user.id().length() > 512)
            throw new IllegalArgumentException("Affinity identifier exceeds size limit");
        byte[] body = mapper.writeValueAsBytes(new Query(user, workspaceGroupId));
        if (body.length > UserAffinityScoresProtocol.MAX_REQUEST_BYTES)
            throw new IllegalArgumentException("Affinity input exceeds size limit");
        return exchange(UserAffinityScoresProtocol.PATH, body, new TypeReference<Score>() {},
                "user-affinity", 4096, value -> value.affinity() != null && Double.isFinite(value.affinity()) && value.affinity() >= 0).affinity();
    }
}
