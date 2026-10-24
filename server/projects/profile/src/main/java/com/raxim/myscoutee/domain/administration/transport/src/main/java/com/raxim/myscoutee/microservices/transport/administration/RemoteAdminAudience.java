package com.raxim.myscoutee.microservices.transport.administration;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.administration.api.AdminAudience;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One bounded batch; canonical selection stays with the owner. */
public final class RemoteAdminAudience extends RemoteReadTransport implements AdminAudience {
    private final ObjectMapper mapper;
    public RemoteAdminAudience(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<String> adminNotificationRecipientUserIds(String actorUserId) {
        var query = new AdminAudienceProtocol.Query(actorUserId);
        if (!AdminAudienceProtocol.valid(query)) throw new IllegalArgumentException("Invalid admin-audience request");
        byte[] body = mapper.writeValueAsBytes(query);
        if (body.length > AdminAudienceProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return exchange(AdminAudienceProtocol.PATH, body, new TypeReference<java.util.List<String>>() {},
                "admin-audience.read", 1048576, result -> result.stream().allMatch(item -> item != null && item.length() <= 512));
    }
}
