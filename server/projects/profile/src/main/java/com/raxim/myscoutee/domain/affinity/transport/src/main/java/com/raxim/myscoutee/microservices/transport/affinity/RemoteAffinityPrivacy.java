package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.AffinityPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteAffinityPrivacy extends RemoteReadTransport implements AffinityPrivacy {
    private final ObjectMapper mapper;
    public RemoteAffinityPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void purgeRatings(String userId) {
        var command = new ProtocolFields.UserCommand(ProtocolFields.JobScope.current(), userId);
        send(AffinityPrivacyProtocol.PURGE_RATINGS, command, AffinityPrivacyProtocol.valid(command));
    }
    @Override public void purgeEdges(String userId) {
        var command = new ProtocolFields.UserCommand(ProtocolFields.JobScope.current(), userId);
        send(AffinityPrivacyProtocol.PURGE_EDGES, command, AffinityPrivacyProtocol.valid(command));
    }
    @Override public void purgeTasks(String userId) {
        var command = new ProtocolFields.UserCommand(ProtocolFields.JobScope.current(), userId);
        send(AffinityPrivacyProtocol.PURGE_TASKS, command, AffinityPrivacyProtocol.valid(command));
    }
    @Override public void anonymizeAuthors(String userId) {
        var command = new ProtocolFields.UserCommand(ProtocolFields.JobScope.current(), userId);
        send(AffinityPrivacyProtocol.ANONYMIZE_AUTHORS, command, AffinityPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<ProtocolFields.Receipt>() {},
                "affinity-privacy.command", AffinityPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
