package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.MemberAttention;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteMemberAttention extends RemoteReadTransport implements MemberAttention {
    private final ObjectMapper mapper;
    public RemoteMemberAttention(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void incrementCommunityUpdates(String communityId, String userId, int delta) {
        var command = new MemberAttentionProtocol.Command(MemberAttentionProtocol.Scope.current(), communityId, userId, delta);
        if (!MemberAttentionProtocol.valid(command)) throw new IllegalArgumentException("Invalid member-attention request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MemberAttentionProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("member-attention request exceeds byte limit");
        var result = exchange(MemberAttentionProtocol.INCREMENT, bytes, new TypeReference<MemberAttentionProtocol.Receipt>() {},
                "member-attention.increment", MemberAttentionProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
