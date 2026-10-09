package com.raxim.myscoutee.microservices.transport.integrations;

import com.raxim.myscoutee.domain.integrations.api.EventChanges;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventChanges extends RemoteReadTransport implements EventChanges {
    private final ObjectMapper mapper;
    public RemoteEventChanges(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void enqueue(com.raxim.myscoutee.domain.events.api.EventChangeView event) {
        var command = new EventChangesProtocol.EventChange(EventChangesProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.EventChangeDto.from(event));
        if (!EventChangesProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-changes request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventChangesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-changes request exceeds byte limit");
        var result = exchange(EventChangesProtocol.EVENT, bytes, new TypeReference<EventChangesProtocol.Receipt>() {},
                "event-changes.event", EventChangesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void enqueue(com.raxim.myscoutee.domain.events.api.MemberDirectory.Member member) {
        var command = new EventChangesProtocol.MemberChange(EventChangesProtocol.Scope.current(), member == null ? null : com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto.from(member));
        if (!EventChangesProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-changes request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventChangesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-changes request exceeds byte limit");
        var result = exchange(EventChangesProtocol.MEMBER, bytes, new TypeReference<EventChangesProtocol.Receipt>() {},
                "event-changes.member", EventChangesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
