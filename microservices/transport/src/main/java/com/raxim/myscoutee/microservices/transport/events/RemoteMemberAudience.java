package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.MemberAudience;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteMemberAudience extends RemoteReadTransport implements MemberAudience {
    private final ObjectMapper mapper;
    public RemoteMemberAudience(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Audience queryNotificationAudience(String ownerType, String ownerId) {
        var command = new MemberAudienceProtocol.Query(MemberAudienceProtocol.Scope.current(), ownerType, ownerId);
        if (!MemberAudienceProtocol.valid(command)) throw new IllegalArgumentException("Invalid member-audience request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MemberAudienceProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("member-audience request exceeds byte limit");
        var result = exchange(MemberAudienceProtocol.QUERY, bytes, new TypeReference<MemberAudienceProtocol.Result>() {},
                "member-audience.query", MemberAudienceProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
}
