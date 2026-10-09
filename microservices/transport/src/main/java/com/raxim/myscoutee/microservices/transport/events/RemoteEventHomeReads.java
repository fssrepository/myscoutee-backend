package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.dto.EventHomeDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventHomeReads extends RemoteReadTransport implements EventHomeReads {
    public RemoteEventHomeReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public List<EventHomeDto> findBySourceId(String id) {
        return exchange(queryPath(EventHomeReadsProtocol.SOURCE, "sourceId", id), new TypeReference<List<EventHomeDto>>() {}, "events.home-source", EventHomeReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
    @Override public List<EventHomeDto> findHomeGameMemberProjections() {
        return exchange(EventHomeReadsProtocol.HOME, new TypeReference<List<EventHomeDto>>() {}, "events.home-projections", EventHomeReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

