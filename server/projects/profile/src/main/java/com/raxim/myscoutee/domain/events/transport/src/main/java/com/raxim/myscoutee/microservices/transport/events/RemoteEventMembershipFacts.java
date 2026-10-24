package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.events.api.EventMembershipFacts;
import com.raxim.myscoutee.domain.events.dto.EventMembershipFactsDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventMembershipFacts extends RemoteReadTransport implements EventMembershipFacts {
    public RemoteEventMembershipFacts(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public List<EventMembershipFactsDto> findBySourceId(String id) {
        return exchange(queryPath(EventMembershipFactsProtocol.PATH, "id", id), new TypeReference<List<EventMembershipFactsDto>>() {}, "event-membership-facts", EventMembershipFactsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}
