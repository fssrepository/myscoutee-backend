package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.groups.api.GroupMediaVisibility;
import com.raxim.myscoutee.domain.groups.dto.GroupMediaVisibilityDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteGroupMediaVisibility extends RemoteReadTransport implements GroupMediaVisibility {
    public RemoteGroupMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public GroupMediaVisibilityDto group(String id) {
        if (id == null || id.isBlank() || id.length() > 512) throw new IllegalArgumentException("Invalid group id.");
        try {
            return exchange(queryPath(GroupMediaVisibilityProtocol.PATH, "id", id),
                    new TypeReference<GroupMediaVisibilityDto>() {}, "groups.media-visibility", GroupMediaVisibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
