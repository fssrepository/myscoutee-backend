package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.events.api.EventWatchDirectory;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One bounded batch; canonical selection stays with the owner. */
public final class RemoteEventWatchDirectory extends RemoteReadTransport implements EventWatchDirectory {
    private final ObjectMapper mapper;
    public RemoteEventWatchDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<String> watchedEventIds(String userId) {
        var query = new EventWatchDirectoryProtocol.Query(userId);
        if (!EventWatchDirectoryProtocol.valid(query)) throw new IllegalArgumentException("Invalid event-watch-directory request");
        byte[] body = mapper.writeValueAsBytes(query);
        if (body.length > EventWatchDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return exchange(EventWatchDirectoryProtocol.PATH, body, new TypeReference<java.util.List<String>>() {},
                "event-watch-directory.read", 1048576, result -> result.stream().allMatch(item -> item == null || item.length() <= 512));
    }
}
