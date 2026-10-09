package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.events.api.EventDerivedUpdates;
import com.raxim.myscoutee.domain.events.dto.EventVersionDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Owner-side version matching; a lost response is unknown, never implicitly retried. */
public final class RemoteEventDerivedUpdates extends RemoteReadTransport implements EventDerivedUpdates {
    private final ObjectMapper mapper;
    public RemoteEventDerivedUpdates(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public boolean updateAffinityVersion(EventVersionDto version, double affinity, double boost) {
        var command = new EventDerivedUpdatesProtocol.AffinityCommand(version, affinity, boost);
        return send(EventDerivedUpdatesProtocol.AFFINITY, command, EventDerivedUpdatesProtocol.valid(command));
    }
    @Override public boolean updateStatusVersionIfCurrent(EventVersionDto version, String status, String previousStatus) {
        var command = new EventDerivedUpdatesProtocol.StatusCommand(version, status, previousStatus);
        return send(EventDerivedUpdatesProtocol.STATUS, command, EventDerivedUpdatesProtocol.valid(command));
    }
    private boolean send(String path, Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid event projection");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventDerivedUpdatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event projection exceeds byte limit");
        return exchange(path, bytes, new TypeReference<EventDerivedUpdatesProtocol.Result>() {},
                "event-projection.update", EventDerivedUpdatesProtocol.MAX_RESPONSE_BYTES, value -> value.matched() != null).matched();
    }
}
