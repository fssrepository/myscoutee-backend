package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.events.api.EventJobScopes;
import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventJobScopes extends RemoteReadTransport implements EventJobScopes {
    public RemoteEventJobScopes(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EventJobScopeDto findJobScope(String id) {
        try {
            return exchange(queryPath(EventJobScopesProtocol.PATH, "id", id), new TypeReference<EventJobScopeDto>() {},
                    "events.job-scope", EventJobScopesProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
