package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.events.api.OrganizerEventReads;
import com.raxim.myscoutee.domain.events.dto.OrganizerEventDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Following keeps its existing selection/counting rules; only event facts cross the network. */
public final class RemoteOrganizerEventReads extends RemoteReadTransport implements OrganizerEventReads {
    private final ObjectMapper mapper;
    public RemoteOrganizerEventReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public List<OrganizerEventDto> activeOriginalEventsByCreators(Collection<String> creators) {
        return read(OrganizerEventReadsProtocol.CREATORS, creators, "organizer-events.creators");
    }
    @Override public List<OrganizerEventDto> storedEventsBySources(Collection<String> sources) {
        return read(OrganizerEventReadsProtocol.SOURCES, sources, "organizer-events.sources");
    }
    private List<OrganizerEventDto> read(String path, Collection<String> ids, String operation) {
        var query = new OrganizerEventReadsProtocol.Query(ids);
        if (!OrganizerEventReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid organizer-event query");
        byte[] body = mapper.writeValueAsBytes(query);
        if (body.length > OrganizerEventReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return exchange(path, body, new TypeReference<List<OrganizerEventDto>>() {}, operation,
                OrganizerEventReadsProtocol.MAX_RESPONSE_BYTES, result -> true);
    }
}
